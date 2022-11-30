const debug = require("debug")("controller");
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const emailHandler = require("../service/emailHandler");

const userController = {
  userVerification(req, res) {
    if (!req.user) return res.sendStatus(500);

    const { id, name, email, password, role } = req.user;

    res.status(200).json({ data: { id, name, email, password, role } });
  },
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

    // Check if user exists in database thanks to its email address
    if (!user) {
      return res.status(401).json({ message: "user is not registered" });
    }

    const { SECRET } = process.env;
    const secret = SECRET + user.password; // user password is use in the secret to prevent reset link reusability
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
    const { password } = req.body;
    const user = await User.getUserById(id);
    // Check if the user exists in database thanks to its ID
    if (!user) {
      return res.sendStatus(401);
    }

    const { SECRET } = process.env;
    const secret = SECRET + user.password; // user password is use in the secret to prevent reset link reusability

    jwt.verify(token, secret, (err) => {
      if (err) {
        return res.sendStatus(401);
      }
    });

    const hashedPassword = await User.hashPassword(password);
    const isPasswordUpdated = await User.updatePassword(id, hashedPassword);

    if (isPasswordUpdated) {
      res.sendStatus(200);
    } else next();
  },
  async editUser(req, res, next) {
    if (!req.user) return res.sendStatus(500);

    const { id } = req.user;
    const { name, email, actualPassword, newPassword } = req.body;
    const user = await User.getUserByEmail(email);

    // Check if user exists in database thanks to its email address
    if (!user) {
      return res.sendStatus(401);
    }

    const isPasswordMatch = await bcrypt.compare(actualPassword, user.password);

    // Check if password in database thanks to its email address
    if (!isPasswordMatch) {
      return res.sendStatus(401);
    }

    const hashedPassword = await User.hashPassword(newPassword);

    const updatedUser = await User.updateUser(id, name, email, hashedPassword);

    if (updatedUser) {
      res.status(200).json({ data: updatedUser });
    } else next();
  },
  async deleteAccount(req, res, next) {
    if (!req.user) return res.sendStatus(500);

    const { id } = req.user;
    const isDeleted = await User.deleteUser(id);

    if (isDeleted) {
      req.logout((err) => {
        if (err) return next(err);
        res.sendStatus(200);
      });
    } else next();
  },
};

module.exports = userController;
