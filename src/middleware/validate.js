import { check, body, param, query } from "express-validator";

export const validateRegister = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be of string type")
    .isLength({ min: 3 })
    .withMessage("Name must contain atleast 3 chars"),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter valid email")
    .normalizeEmail(),

  check("role")
    .isMongoId()
    .withMessage("Invalid role")
    .notEmpty()
    .withMessage("Role is required"),

  check("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isNumeric()
    .withMessage("Phone number must be numeric")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be 10 digit"),

  check("birthDate")
    .notEmpty()
    .withMessage("Date of birth is required")
    // .isDate()
    // .withMessage('Invalid date format')
    .custom((value) => {
      const dob = new Date(value);
      const currentDate = new Date();

      if (dob >= currentDate) {
        throw new Error("Date of birth must be in the past");
      }

      return true;
    }),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be of length greater than 5"),
];

export const validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email field should not be empty")
    .isEmail()
    .withMessage("Please enter valid email"),

  body("password")
    .notEmpty()
    .withMessage("Password Field should not be empty")
    .isLength({ min: 6 })
    .withMessage("Password must contain more than 6 chars"),
];

export const validateProfile = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage("Name must not be empty")
    .isString()
    .withMessage("Please enter valid name of type String")
    .isLength({ min: 3 })
    .withMessage("Name must contain atleast 3 chars"),

  body("phone")
    .optional()
    .notEmpty()
    .withMessage("Phone number must not be empty")
    .isNumeric()
    .withMessage("Phone number must be numeric")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be 10 digit"),

  check("birthDate")
    .optional()
    .notEmpty()
    .withMessage("Date of birth is required")
    // .isDate()
    // .withMessage('Invalid date format')
    .custom((value) => {
      const dob = new Date(value);
      const currentDate = new Date();

      if (dob >= currentDate) {
        throw new Error("Date of birth must be in the past");
      }

      return true;
    }),
];

export const validateDestination = [
  check("city")
    .notEmpty()
    .withMessage("City is required")
    .isString()
    .withMessage("City must be of string type")
    .isLength({ min: 3 })
    .withMessage("City must contain atleast 3 chars"),

  check("destinationDate")
    .notEmpty()
    .withMessage("Destination date is required")
    .custom((value) => {
      const dob = new Date(value);
      const currentDate = new Date();

      if (dob <= currentDate) {
        throw new Error("Destination date must be in the future");
      }

      return true;
    }),
  // .isDate()
  // .withMessage("Invalid date"),

  check("duration")
    .notEmpty()
    .withMessage("Duration is required field")
    .isString()
    .withMessage("Duration must be of string type"),

  check("agenda")
    .notEmpty()
    .withMessage("Agenda is required field")
    .isString()
    .withMessage(),

  check("destinationImage")
  .custom((value, { req }) => {
    if (!req.files) {
      throw new Error("Please choose destination Image");
    }

    return true;
  }),
];

export const validateUpdateDestination = [
  check("city")
    .optional()
    .isString()
    .withMessage("City must be of string type")
    .isLength({ min: 3 })
    .withMessage("City must contain atleast 3 chars"),

  check("destinationDate")
    .optional()
    .custom((value) => {
      const dob = new Date(value);
      const currentDate = new Date();

      if (dob <= currentDate) {
        throw new Error("Destination date must be in the future");
      }

      return true;
    }),
  // .isDate()
  // .withMessage("Invalid date"),

  check("duration")
  .optional()
  .isString()
  .withMessage("Duration must be of string type"),

  check("agenda")
    .optional()
    .isString()
    .withMessage("Agenda must be of string type"),
    

  check("destinationImage")
  .optional()

  .custom((value, { req }) => {
    if (!req.files) {
      throw new Error("Please choose destination Image");
    }

    return true;
  }),
];


export const validateTrip = [
  check("country")
    .notEmpty()
    .withMessage("Country is required")
    .isString()
    .withMessage("Country must be of string type")
    .isLength({ min: 3 })
    .withMessage("Country must contain atleast 3 chars"),

    check("tripDate")
    .notEmpty()
    .withMessage("Trip date is required")
    .custom((value) => {
      const dob = new Date(value);
      const currentDate = new Date();

      if (dob <= currentDate) {
        throw new Error("Trip date must be in the future");
      }

      return true;
    }),

    check("tripDuration")
    .notEmpty()
    .withMessage("Trip Duration is required field")
    .isString()
    .withMessage("Trip Duration must be of string type")
    .isIn(["One week", "Two weeks", "Month", "More than a month"])
    .withMessage('Invalid trip duration value'),
    
    check("tripIncludes")
    .notEmpty()
    .withMessage("Trip Includes is required field")
    .isString()
    .withMessage("Trip includes must be of string type"),
    
    check("mainTripImage")
    .custom((value, { req }) => {
      if (!req.file) {
        throw new Error("Please choose Trip Image");
      }
  
      return true;
    }),

    
    check("tripPrice")
    .notEmpty()
    .withMessage("Price must not be empty")
    .isNumeric()
    .withMessage("Price must be numeric"),
   
    
    check("groupType")
    .notEmpty()
    .withMessage("Group Type is required field")
    .isString()
    .withMessage("Group Type must be of string type")
    .isIn(["Male", "Female", "Families"])
    .withMessage('Invalid group type value'),

    check("tripType")
    .notEmpty()
    .withMessage("Trip Type is required field")
    .isString()
    .withMessage("Trip Type must be of string type")
    .isIn(["Adventure", "Hunt", "Historical", "Nature"])
    .withMessage('Invalid trip type value'),

    check("tripName")
    .notEmpty()
    .withMessage("Trip Name is required field")
    .isString()
    .withMessage("Trip Name must be of string type"),

    check("contactName")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be of string type")
    .isLength({ min: 3 })
    .withMessage("Name must contain atleast 3 chars"),

    check("contactPhone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isNumeric()
    .withMessage("Phone number must be numeric")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be 10 digit"),

    check("contactEmail")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter valid email")
    .normalizeEmail(),

    
    check("destination")
    .isMongoId()
    .withMessage("Invalid destination id")
    .notEmpty()
    .withMessage("Destination is required field"),

    check("document")
    .isMongoId()
    .withMessage("Invalid document id")
    .notEmpty()
    .withMessage("Document is required field"),

    
];

export const validateUpdateTrip = [
  check("country")
    .optional()
    .notEmpty()
    .withMessage("Country is required")
    .isString()
    .withMessage("Country must be of string type")
    .isLength({ min: 3 })
    .withMessage("Country must contain atleast 3 chars"),

    check("tripDate")
    .optional()
    .notEmpty()
    .withMessage("Trip date is required")
    .custom((value) => {
      const dob = new Date(value);
      const currentDate = new Date();

      if (dob <= currentDate) {
        throw new Error("Trip date must be in the future");
      }

      return true;
    }),

    check("tripDuration")
    .optional()
    .isIn(["One week", "Two weeks", "Month", "More than a month"])
    .withMessage('Invalid trip duration value'),

    
    check("tripIncludes")
    .optional()
    .notEmpty()
    .withMessage("Trip Includes is required field")
    .isString()
    .withMessage("Trip includes must be of string type"),
    
    // check("mainTripImage")
    // .custom((value, { req }) => {
    //   if (!req.file) {
    //     throw new Error("Please choose Trip Image");
    //   }
  
    //   return true;
    // }),

    
    check("tripPrice")
    .optional()
    .notEmpty()
    .withMessage("Price must not be empty")
    .isNumeric()
    .withMessage("Price must be numeric"),
   
    
    check("groupType")
    .optional()
    .isIn(["Male", "Female", "Families"])
    .withMessage('Invalid group type value'),

    check("tripType")
    .optional()
    .notEmpty()
    .withMessage("Trip Type is required field")
    .isIn(["Adventure", "Hunt", "Historical", "Nature"])
    .withMessage('Invalid trip type value'),

    
    check("tripName")
    .optional()
    .notEmpty()
    .withMessage("Trip Name is required field")
    .isString()
    .withMessage("Trip Name must be of string type"),

    check("contactName")
    .optional()
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be of string type")
    .isLength({ min: 3 })
    .withMessage("Name must contain atleast 3 chars"),

    check("contactPhone")
    .optional()
    .notEmpty()
    .withMessage("Phone number is required")
    .isNumeric()
    .withMessage("Phone number must be numeric")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be 10 digit"),

    check("contactEmail")
    .optional()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter valid email")
    .normalizeEmail(),

    
    check("destination")
    .optional()
    .isMongoId()
    .withMessage("Invalid destination id")
    .notEmpty()
    .withMessage("Destination is required field"),

    check("document")
    .optional()
    .isMongoId()
    .withMessage("Invalid document id")
    .notEmpty()
    .withMessage("Document is required field"),

    
];

export const validateDocument = [
  body("firstName")
  .optional()
  .isBoolean()
  .withMessage('Invalid boolean value'),

  body("lastName")
  .optional()
  .isBoolean()
  .withMessage('Invalid boolean value'),

  body("passport")
  .optional()
  .isBoolean()
  .withMessage('Invalid boolean value'),

  body("age")
  .optional()
  .isBoolean()
  .withMessage('Invalid boolean value'),


  body("gender")
  .optional()
  .isBoolean()
  .withMessage('Invalid boolean value'),


  body("birthDate")
  .optional()
  .isBoolean()
  .withMessage('Invalid boolean value'),


  body("id")
  .optional()
  .isBoolean()
  .withMessage('Invalid boolean value'),
  
  body("healthIssues")
  .optional()
  .isBoolean()
  .withMessage('Invalid boolean value')
]

export const validateUpdateDocument = [
  body("firstName")
  .optional()
  .isBoolean()
  .withMessage('Invalid boolean value'),

  body("lastName")
  .optional()
  .isBoolean()
  .withMessage('Invalid boolean value'),

  body("passport")
  .optional()
  .isBoolean()
  .withMessage('Invalid boolean value'),

  body("age")
  .optional()
  .isBoolean()
  .withMessage('Invalid boolean value'),


  body("gender")
  .optional()
  .isBoolean()
  .withMessage('Invalid boolean value'),


  body("birthDate")
  .optional()
  .isBoolean()
  .withMessage('Invalid boolean value'),


  body("id")
  .optional()
  .isBoolean()
  .withMessage('Invalid boolean value'),
  
  body("healthIssues")
  .optional()
  .isBoolean()
  .withMessage('Invalid boolean value')
]



export const validateForgotPassword = [
  body('email')
  .notEmpty()
  .withMessage('email must not be empty')
  
  .isEmail()
  .withMessage('Please enter valid email')    
]


export const validateResetPassword = [
  body('email')
    .isEmail()
    .withMessage('Please provide valid email')
    .notEmpty()
    .withMessage('email must not be empty'),

  body('otp')
    .notEmpty()
    .withMessage('otp must not be empty')
    .isLength({ min: 6, max: 6 })
    .withMessage('otp must contain 6 characters'),

  body('password')
    .notEmpty()
    .withMessage('password must not be empty')
    .isLength({ min: 6, max: 20 })
    .withMessage('password must be of length between 6 and 20')
    
]