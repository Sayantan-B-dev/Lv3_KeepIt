import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
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
    password:Joi.string().min(6).max(128).required(),
});

export const noteSchema = Joi.object({
    title:Joi.string().min(3).max(100).required(),
    content:Joi.string().min(10).required(),
    category:Joi.string().required(),
    tags:Joi.array().items(Joi.string()),
    isPublic:Joi.boolean(),
    isPinned:Joi.boolean(),
    isArchived:Joi.boolean(),
});