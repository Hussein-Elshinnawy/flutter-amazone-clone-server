const express = require("express"); //import libray
const User = require("../models/user");
const bcrypt = require("bcryptjs"); // for encryption
const authRouter = express.Router(); // we use express.router not express() to have access instead using app=express()
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth.js");

authRouter.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });// check if user with same email already exists
    if (existingUser) {
      //existingUser is not boolen it just check if existing is not null
      //and we use return to stop the application
      return res
        .status(400)
        .json({ msg: "user with same email already exist!" });
    }

    const hashedPassword = await bcrypt.hash(password, 8); //8 is the salt which protect against rainbow table attacks

    //create a new user model with an object
    //and making type let because we gona change it let = var but few diff
    let user = new User({
      //all of these are required
      email,
      password: hashedPassword,
      name,
    });
    user = await user.save();// this to save into the database
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
  //divid the json object
});


authRouter.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ msg: "User with this email does not exits!" });
    }
    const ismatch = await bcrypt.compare(password, user.password);//since the password got hashed we use bcrypt.compare betweeen tha enterd paasword with the hashed password
    if (!ismatch) {
      res.status(400).json({ msg: "incorrect password" });
    }
    const token = jwt.sign({ id: user._id }, "passwordKey"); // id is for unqiness and 2nd param is key (can be public or private) to vefiy request
    res.json({ token, ...user._doc }); //to send user data to home page for later use ... is what called object destructioning so it can make it like {name: '', age: ''} and doc it simfiled object of user not the big object of user to be able to user it later   
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}); 

authRouter.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
  
    if (!token) return res.json(false);
    const verified = jwt.verify(token, "passwordKey");
    if (!verified) return res.json(false);
    const user = await User.findById(verified.id);
    if (!user) return res.json(false);
    res.json(true);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//get user data
authRouter.get('/', auth, async (req, res) => {//auth is middleware to make user you are authorized   

  const user= await User.findById(req.user);
  res.json({ ...user._doc, token: req.token });
}); 


 module.exports = authRouter;//this make authRouter visible to others and to be used

