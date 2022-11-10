const debug = require("debug")("controller");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const emailJS = require("../service/emailJS");

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
  async handleForgotPassword(req, res, next) {
    const { email } = req.body;

    const user = await User.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "user is not registered" });
    }

    const { SECRET, PORT, DOMAIN } = process.env;
    const secret = SECRET + user.password;
    const payload = {
      email: user.email,
      id: user.id,
    };
    const token = jwt.sign(payload, secret, { expiresIn: "15min" });
    const link = `http://${DOMAIN}:${PORT}/reset-password/${user.id}/${token}`;
    const isEmailSent = await emailJS.sendMail({ email: user.email, link });

    if (isEmailSent) {
      res.sendStatus(200);
    } else next();
  },
  async handleResetPassword(req, res) {
    const { id, token } = req.params;

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
