const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);

// Joi schema to check if req.body datas are correct while user is signing up
module.exports.registerSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'fr', 'net'] } }).required(),
    password: joiPassword
    .string()
    .minOfSpecialCharacters(2)
    .minOfLowercase(2)
    .minOfUppercase(2)
    .minOfNumeric(2)
    .noWhiteSpaces()
    .required(),
    role: joi.string().valid('user','brewer').required(),
}).required();

// Joi schema to check if req.body datas are correct while user is signing in
module.exports.loginSchema = joi.object({
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'fr', 'net'] } }),
    password: joiPassword
    .string()
    .minOfSpecialCharacters(2)
    .minOfLowercase(2)
    .minOfUppercase(2)
    .minOfNumeric(2)
    .noWhiteSpaces()
    .required(),
}).required();
