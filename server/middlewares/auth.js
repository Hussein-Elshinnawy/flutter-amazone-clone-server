const jwt = require("jsonwebtoken");
// const authRouter = require("../routes/auth");

const auth = async (req, res, next) => {
  // next is to continue to next round
  try {
    const token = req.header("x-auth-token");
    if (!token)
      return res.Status(401).json({ msg: "no auth token ,accesss denied " });

    const verified = jwt.verify(token, "passwordKey");
    if (!verified)
      return res
        .Status(401)
        .json({ msg: "Token verfication failed , authorization denied " });
    
    req.user= verified.id;
    req.token = token;
  
    next();
  } catch (e) {
    res.Status(500).json({ error: e.message });
  }
};
module.exports = auth;