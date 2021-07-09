const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.header("x-authtoken");
 
      console.log("\nat auth:\n" + token);
    if (token) {    
      try 
      {
        req.jwtPayLoad = jwt.verify(token, "d0nat3");
        next(); // this will pass the request to the next handler
      } catch(ex) {
        res.status(401).send("Access denied. Invalid token");
      }
    } else {
      res.status(401).send("Access denied. No token provided");
    }
  }