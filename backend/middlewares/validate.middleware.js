import Joi from "joi";

export const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true });
  if (error) {
    return res.status(400).json({
      error: error.details.map((d) => d.message).join(", "),
    });
  }
  next();
};