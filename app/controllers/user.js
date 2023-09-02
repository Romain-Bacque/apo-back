const debug = require("debug")("controller");
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const emailHandler = require("../service/emailHandler");
const express = require("express");

const userController = {
  /**
   * Method to verify if user is logged in session
   * @param {express.Request} req Express request object
   * @param {express.Response} res Express response object
   */
  userVerification(req, res) {
    if (!req.user) return res.sendStatus(500);

    const { id, name, email, password, role } = req.user;

    res.status(200).json({ data: { id, name, email, password, role } });
  },
  /**
   * Method to sign in
   * @param {express.Request} req Express request object
   * @param {express.Response} res Express response object
   */
  login(req, res) {
    if (!req.user) return res.sendStatus(500);

    const { id, name, email, password, role } = req.user;

    res.status(200).json({ data: { id, name, email, password, role } });
  },
  /**
   * Method to sign up
   * @param {express.Request} req Express request object
   * @param {express.Response} res Express response object
   */
  async register(req, res) {
    const { name, email, password, role } = req.body;

    if (await User.getUserByEmail(email)) {
      return res.status(403).json({ message: "user already exists" });
    }

    const hashedPassword = await User.hashPassword(password);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      isValid: false,
    });

    const registeredUser = await user.register();

    // Generate a JWT token
    const secret = process.env.SECRET;
    const payload = {
      id: registeredUser.id,
    };
    const token = jwt.sign(payload, secret, { expiresIn: "24h" });

    // Construct the confirmation link
    const link = `${process.env.CLIENT_DOMAIN}/signup/email-confirm?id=${registeredUser.id}&t=${token}`;

    // Initialize email handler
    emailHandler.init({
      service: "gmail",
      emailFrom: process.env.ADMIN_EMAIL,
      subject: "Email de confirmation",
      template: path.join(
        __dirname,
        "../service/emailTemplate/confirmEmail.ejs"
      ),
    });

    // Send confirmation email
    await emailHandler.sendEmail({
      name: registeredUser.name,
      email: registeredUser.email,
      content: { link },
    });

    if (registeredUser) {
      res.sendStatus(200);
    } else res.sendStatus(500);
  },
  /**
   * Method to confirm email
   * @param {express.Request} req Express request object
   * @param {express.Response} res Express response object
   */
  async emailConfirm(req, res) {
    const { id, token } = req.query;

    // Find user by ID
    const user = await User.getUserById(id);

    // Check if user exists
    if (!user) {
      return res.sendStatus(401);
    }
    // Check if user's email is already confirmed
    if (user.isValid) {
      return res.sendStatus(200);
    }

    // Secret for JWT verification
    const secret = process.env.SECRET;

    // Verify the provided token
    jwt.verify(token, secret, (err) => {
      if (err) {
        return res.sendStatus(401);
      }
    });

    // Update the user's email confirmation status
    const result = await User.updaterUserValidity(id, true);

    if (!result) throw new Error();

    res.sendStatus(200);
  },
  /**
   * Method to sign out
   * @param {express.Request} req Express request object
   * @param {express.Response} res Express response object
   * @param {express.NextFunction} next Express response function
   */
  logout(req, res, next) {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  },
  /**
   * Method to handle user forgotten password
   * @param {express.Request} req Express request object
   * @param {express.Response} res Express response object
   */
  async handleForgotPassword(req, res) {
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
    const link = `${process.env.CLIENT_DOMAIN}/reset-password/${user.id}/${token}`;

    emailHandler.init({
      service: "gmail",
      emailFrom: process.env.ADMIN_EMAIL,
      subject: "Réinitialisation du mot de passe",
      template: path.join(
        __dirname,
        "../service/emailTemplate/resetPassword.ejs"
      ),
    });

    await emailHandler.sendEmail({
      name: user.name,
      email: user.email,
      content: { link },
    });

    res.sendStatus(200);
  },
  /**
   * Method to reset user password
   * @param {express.Request} req Express request object
   * @param {express.Response} res Express response object
   */
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
  /**
   * Method to edit user profile
   * @param {express.Request} req Express request object
   * @param {express.Response} res Express response object
   * @param {express.NextFunction} next Express response function
   */
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
  /**
   * Method to delete user account
   * @param {express.Request} req Express request object
   * @param {express.Response} res Express response object
   * @param {express.NextFunction} next Express response function
   */
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
