const nodemailer = require("nodemailer");
const ejs = require("ejs");

const emailHandler = {
  service: null,
  emailFrom: null,
  subject: null,
  template: null,
  /**
   * Method to create and return the html template of the email body
   * @param {String} name - contains the receiver name
   * @param {String} content - contains the email content
   */
  createTemplate: async function (name, content) {
    try {
      const result = await ejs.renderFile(emailHandler.template, {
        name,
        ...content,
      });

      return result;
    } catch (err) {
      console.error(err);
      return null;
    }
  },
  /**
   * Method to send an email
   *  @param {Object} data - contains the receiver name, its email address and a content to put in the email body
   */
  sendEmail: async function ({ name, emailTo, content }) {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: emailHandler.service,
      auth: {
        user: emailHandler.emailFrom,
        pass: process.env.AUTH_PASSWORD,
      },
    });
    const template = await emailHandler.createTemplate(name, content);
    const response = await transporter.sendMail({
      from: emailHandler.emailFrom,
      bcc: emailTo,
      subject: emailHandler.subject,
      html: template,
    });

    return response;
  },
  /**
   * Method to init email handler, must be call before all other email handler methods
   *  @param {Object} data - contains the mail service, the sender email address and the subject of the email
   */
  init: function ({ service, emailFrom, subject, template }) {
    emailHandler.service = service;
    emailHandler.emailFrom = emailFrom;
    emailHandler.subject = subject;
    emailHandler.template = template;
  },
};

module.exports = emailHandler;
