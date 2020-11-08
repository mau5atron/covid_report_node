const express = require("express");
const router = express.Router();

/* Source */
const apiController = require("../controllers/api");

// append api to these, do this for final testing
router.get("/terms_of_service", apiController.getTermsOfService);
router.post("/agree_to_terms", apiController.agreeToTerms);
router.post("/validate_token", apiController.validateToken);
router.post("/us_data", apiController.getUSData);

module.exports = {
  apiRequests: router
};