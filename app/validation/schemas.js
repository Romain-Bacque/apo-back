const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);

module.exports.registerSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'fr', 'net'] } }).required(),
    password: joiPassword
    .string()
    .min(8)
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .required(),
    role: joi.string().valid('user','brewer').required(),
}).required();

module.exports.loginSchema = joi.object({
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'fr', 'net'] } }),
    password: joiPassword
    .string()
    .min(8)
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .required(),
}).required();

module.exports.brewerySchema = joi.object({
    title: joi.string().required(),
    phone: joi.min(10).max(10).number().required(),
    description: joi.string().required(),
    image: joi.string().required(),
    user_id: joi.number().required(),
    categories: joi.array().items(joi.string()).required(),
}).required();
