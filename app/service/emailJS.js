const reply_to = {
  emailjs_user: "user_I1HWuX9oE076hNrKEuHTK",
  emailjs_service: "service_3otfxmn",
  emailjs_template: "template_y6oarwo",
  sendMail(data) {
    emailjs.send(reply_to.emailjs_service, reply_to.emailjs_template, data);
  },
};

module.exports = emailJS;
