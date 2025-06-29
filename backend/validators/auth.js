import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\-=[\]{};:\\"|,.<>/?]).+$'))
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
    }),
  profileImage:Joi.object({
    url:Joi.string().required(),
    filename:Joi.string().required(),
  })
});

export const profileImageSchema = Joi.object({
    profileImage:Joi.object({
        url:Joi.string().required(),
        filename:Joi.string().required(),
    })
});

export const loginSchema = Joi.object({
    username:Joi.string().min(3).max(30),
    email:Joi.string().email(),
    password:Joi.string().min(8).max(128).required(),
});

export const noteSchema = Joi.object({
    title:Joi.string().min(3).max(100).required(),
    content:Joi.string().min(10).max(1000).required(),
    category:Joi.string().min(3).max(50).required(),
    tags:Joi.array().items(Joi.string()),
    isPublic:Joi.boolean(),
    isPinned:Joi.boolean(),
    isArchived:Joi.boolean(),
});