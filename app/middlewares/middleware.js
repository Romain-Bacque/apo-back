module.exports = async function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { // 'isAuthenticated()' est une méthode de Passport.js qui retourne 'true' si l'utilisateur est authentifié
      return next(); 
    }
    res.status(401).json({ message: "User not authentificated" });
  }