// Enables hashing of passwords
const bcryptjs = require("bcryptjs");

const express = require("express");

const router = express.Router();

// Sanitization middleware
const { sanitizeBody, body } = require("express-validator");

// Database access
const { sequelize, models } = require("../db");

const { User } = models;

// Sequelize operators
const { Op } = sequelize;

// ========================================
//  HELPER FUNCTION
// ========================================

const authenticateUser = require("../helpers/authenticateUser");

// ========================================
// ROUTES
// ========================================

// Modifying user input
// (".escape()" will mutate data: <, >, &, ', " and /.)
// API https://express-validator.github.io/docs/sanitization.html
// and https://flaviocopes.com/express-sanitize-input/

// The client side must assume that all data is unsafe.

router.use([
  body("emailAddress")
    // Removes leading and trailing whitespace
    .trim()
    // Sanitizes
    .escape()
    // Converts email to lowercase
    .normalizeEmail(),

  // Removes leading and trailing whitespace
  body(["firstName", "lastName", "password"]).trim()
]);

router
  .route("/")
  // Get current authenticated user
  .get(authenticateUser, async (req, res, next) => {
    const user = await req.currentUser;
    res.json({ user });
  })
  // Create user
  .post(async (req, res, next) => {
    try {
      // Builds new user
      const newUser = await User.build(req.body);

      // Validation needs to be called manually,
      // because it is not automatically run on 'build.'
      // And the password field MUST be validated before
      // bcryptjs is run.
      await newUser.validate();

      // Hashes password
      newUser.password = await bcryptjs.hashSync(newUser.password);

      // Save
      await newUser.save(req.body);

      res.writeHead(201, {
        // Note: '/' is the project requirement, but '/api' might be more useful.
        // https://app.slack.com/client/TBPQFGEAH/CBPRYGLSZ/thread/CBPRYGLSZ-1563967481.032400
        Location: "/"
      });
      res.end();
    } catch (error) {
      // Catches validation errors sent from Sequelize
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        // Bad Request
        // msg assigned by Sequelize
        error.status = 400;
      }
      next(error);
    }
  });

module.exports = router;
