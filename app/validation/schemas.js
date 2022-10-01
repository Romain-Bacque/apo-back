const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);
const joiPhoneNumber = joi.extend(require('joi-phone-number'));

module.exports.registerSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'fr', 'net'] } }).required(),
    password: joiPassword
    .string()
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .min(8)
    .required(),
    role: joi.string().valid('user','brewer').required(),
}).required();

module.exports.loginSchema = joi.object({
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'fr', 'net'] } }),
    password: joiPassword
    .string()
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .min(8)
    .required(),
}).required();

module.exports.brewerySchema = joi.object({    
    title: joi.string().required(),
    phone: joiPhoneNumber.string({ defaultCountry: 'FR', format: 'national' }).phoneNumber(),
    description: joi.string().required(),
    address: joi.string().required(),
    image: joi.string().required(),
    user_id: joi.number().required(),
    categories: joi.array().items({id: joi.number()}).required(),
}).required();
