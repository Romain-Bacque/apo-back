module.exports.checkAuthenticated = async (req, res, next) => {
    if (req.isAuthenticated()) { // isAuthenticated() is a Passport.js method that returns 'true' if the user is authenticated
      return next(); 
    }
    res.status(401).json({ message: "User not authenticated" });
  }