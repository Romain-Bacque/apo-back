const debug = require("debug")("controller");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const path = require("path");
const emailHandler = require("../service/emailHandler");

const userController = {
  login(req, res) {
    if (!req.user) return res.sendStatus(500);

    const { id, name, email, password, role } = req.user;

    res.status(200).json({ data: { id, name, email, password, role } });
  },
  async register(req, res) {
    const { name, email, password, role } = req.body;

    if (await User.getUserByEmail(email)) {
      return res.status(403).json({ message: "user already exists" });
    }

    const hashedPassword = await User.hashPassword(password);
    const user = new User({ name, email, password: hashedPassword, role });

    const registeredUser = await user.register();

    if (registeredUser) {
      res.sendStatus(200);
    } else res.sendStatus(500);
  },
  logout(req, res, next) {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  },
  async handleForgetPassword(req, res, next) {
    const { email } = req.body;
    // Check if user exists in database thanks to its email address
    const user = await User.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "user is not registered" });
    }

    const { SECRET } = process.env;
    const secret = SECRET + user.password;
    const payload = {
      id: user.id,
      email: user.email,
    };
    const token = jwt.sign(payload, secret, { expiresIn: "24h" });
    const link = `http://localhost:3000/reset-password/${user.id}/${token}`;

    emailHandler.init({
      service: "gmail",
      emailFrom: "biere.de.ta.region@gmail.com",
      subject: "Réinitialisation du mot de passe",
      template: path.join(
        __dirname,
        "../service/emailTemplate/resetPassword.ejs"
      ),
    });

    await emailHandler.sendEmail({
      name: user.name,
      email: "bacqueromain@orange.fr",
      link,
    });

    res.sendStatus(200);
  },
  async resetPassword(req, res) {
    const { id, token } = req.params;
    // Check if user exists in database thanks to its ID
    const user = await User.getUserById(id);

    if (!user) {
      return res.status(401).json({ message: "invalid user id" });
    }

    const { SECRET } = process.env;
    const secret = SECRET + user.password;
    const isValid = jwt.verify(token, secret);

    if (isValid) {
      res.status(200).json({ data: user.email });
    } else res.sendStatus(401);
  },
  async editUser(req, res) {},
  async deleteAccount(req, res) {},
};

module.exports = userController;
