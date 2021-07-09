module.exports = (req, res, next) => {
  // At this stage the user is already authenticated AND
  // we have access to the jwt payload which contains the role
   console.log("\nat auth Admin:\n" );
  // We are checking to make sure the jwt payload exists
  if (req.jwtPayLoad) {
    // Check to see if the role is admin
    if (req.jwtPayLoad.role == "admin") {
      next(); // pass the request to our main handler
    } else {
      res.status(401).send("Unauthorized access");
    }
  } else {
    res.status(401).send("User is not authenticated");
  }

}