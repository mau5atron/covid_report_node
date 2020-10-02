const express = require("express");
const router = express.Router();

/* Source */
const apiController = require("../controllers/api");

router.get("/terms_of_service", apiController.getTermsOfService);
router.post("/agree_to_terms", apiController.agreeToTerms);
router.post("/validate_token", apiController.validateToken);

module.exports = {
  apiRequests: router
};