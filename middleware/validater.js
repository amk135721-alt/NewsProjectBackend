import { body, validationResult } from "express-validator";

export const validateUserRegister = [
  body("name")
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Email should be valid"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password should be a minimum of 6 characters"),

  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
       res.json({ success: false, message: error.array() });
    }
    else{
        next()
    }
   
  }
   
];