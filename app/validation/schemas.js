const baseJoi = require("joi");
const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = baseJoi.extend(joiPasswordExtendCore);
const joiPhoneNumber = baseJoi.extend(require("joi-phone-number"));
const sanitizeHtml = require("sanitize-html");

// Sanitizing
const extension = (joi) => ({
  type: "string",
  base: joi.string(), // extension is defined on joi.string()
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        // Joi will automatically call this method for whatever value it will receive
        const clean = sanitizeHtml(value, {
          allowedTags: [], // nothing is allowed
          allowedAttributes: {}, // nothing is allowed
        });
        if (clean !== value) return helpers.error("string.escapeHTML");
        return clean;
      },
    },
  },
});

const joi = baseJoi.extend(extension);

// Schemas

/**
 * registerSchema monitor the register request body, and return an error if any of requirements doesn't match with it
 */
module.exports.registerSchema = joi
  .object({
    name: joi.string().escapeHTML().required(),
    email: joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "fr", "net"] } })
      .escapeHTML()
      .required(),
    password: joiPassword
      .string()
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .min(10)
      .required(),
    role: joi.string().escapeHTML().valid("user", "brewer").required(),
  })
  .required();

/**
 * loginSchema monitor the login request body, and return an error if any of requirements doesn't match with it
 */
module.exports.loginSchema = joi
  .object({
    email: joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "fr", "net"] } })
      .escapeHTML()
      .required(),
    password: joiPassword
      .string()
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .min(10)
      .required(),
  })
  .required();

/**
 * editProfileSchema monitor the edit profile request body, and return an error if any of requirements doesn't match with it
 */
module.exports.editProfileSchema = joi
  .object({
    name: joi.string().escapeHTML().required(),
    email: joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "fr", "net"] } })
      .escapeHTML()
      .required(),
    actualPassword: joiPassword
      .string()
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .min(10)
      .required(),
    newPassword: joiPassword
      .string()
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .min(10)
      .required(),
  })
  .required();

/**
 * postBrewerySchema monitor the brewery request body, and return an error if any of requirements doesn't match with it
 */
module.exports.postBrewerySchema = joi
  .object({
    title: joi.string().escapeHTML().required(),
    image: joi.binary(),
    phone: joiPhoneNumber
      .string({ defaultCountry: "FR", format: "national" })
      .phoneNumber(),
    description: joi.string().escapeHTML().required(),
    address: joi.string().escapeHTML().required(),
    lat: joi.number().required(),
    lon: joi.number().required(),
    categories: joi.array().items(joi.number().min(1).required()),
  })
  .required();

/**
 * editBrewerySchema monitor the brewery request body, and return an error if any of requirements doesn't match with it
 */
module.exports.editBrewerySchema = joi
  .object({
    title: joi.string().escapeHTML().required(),
    image: joi.binary(),
    phone: joiPhoneNumber
      .string({ defaultCountry: "FR", format: "national" })
      .phoneNumber(),
    description: joi.string().escapeHTML().required(),
    address: joi.string().escapeHTML().required(),
    lat: joi.number().required(),
    lon: joi.number().required(),
    categories: joi.array().items(joi.number().min(1).required()),
  })
  .required();

/**
 * postEventSchema monitor the event request body, and return an error if any of requirements doesn't match with it
 */
module.exports.postEventSchema = joi
  .object({
    title: joi.string().escapeHTML().required(),
    description: joi.string().escapeHTML().required(),
    eventStart: joi.date().required(),
  })
  .required();

/**
 * emailSchema monitor the forget password request body, and return an error if any of requirements doesn't match with it
 */
module.exports.emailSchema = joi
  .object({
    email: joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "fr", "net"] } })
      .escapeHTML()
      .required(),
  })
  .required();

/**
 * passwordSchema monitor the reset password request body, and return an error if any of requirements doesn't match with it
 */
module.exports.passwordSchema = joi
  .object({
    password: joiPassword
      .string()
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .min(10)
      .required(),
  })
  .required();
