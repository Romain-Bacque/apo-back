const joi = require("joi");
const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = joi.extend(joiPasswordExtendCore);
const joiPhoneNumber = joi.extend(require("joi-phone-number"));

/**
 * registerSchema monitor the register request body, and return an error if any of requirements doesn't match with it
 */
module.exports.registerSchema = joi
  .object({
    name: joi.string().required(),
    email: joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "fr", "net"] } })
      .required(),
    password: joiPassword
      .string()
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .min(8)
      .required(),
    role: joi.string().valid("user", "brewer").required(),
  })
  .required();

/**
 * loginSchema monitor the login request body, and return an error if any of requirements doesn't match with it
 */
module.exports.loginSchema = joi
  .object({
    email: joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "fr", "net"] } }),
    password: joiPassword
      .string()
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .min(8)
      .required(),
  })
  .required();

/**
 * postBrewerySchema monitor the brewery request body, and return an error if any of requirements doesn't match with it
 */
module.exports.postBrewerySchema = joi
  .object({
    title: joi.string().required(),
    image: joi.binary(),
    phone: joiPhoneNumber
      .string({ defaultCountry: "FR", format: "national" })
      .phoneNumber(),
    description: joi.string().required(),
    address: joi.string().required(),
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
    title: joi.string().required(),
    image: joi.binary(),
    phone: joiPhoneNumber
      .string({ defaultCountry: "FR", format: "national" })
      .phoneNumber(),
    description: joi.string().required(),
    address: joi.string().required(),
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
    title: joi.string().required(),
    description: joi.string().required(),
    event_start: joi.date().required(),
    image: joi.string().required(),
    brewery_id: joi.number().required(),
  })
  .required();

/**
 * emailSchema monitor the forget password request body, and return an error if any of requirements doesn't match with it
 */
module.exports.emailSchema = joi
  .object({
    email: joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "fr", "net"] } }),
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
      .min(8)
      .required(),
  })
  .required();
