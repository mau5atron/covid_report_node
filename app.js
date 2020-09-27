/* Dependencies */
  const express = require("express");
  const app = express();
  const bodyParser = require("body-parser");
  // const tos = require("./utilities/tos");
  const cors = require("cors");
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(cors());
  app.use(bodyParser.json());

/* Source */
  const api = require("./controllers/api");
  const apiRouter = require("./routes/api");

/* Middleware - transfer to appropriate controllers */
  app.use(api.accessHeaders);

  // app.get("/terms_of_service", api.getTermsOfService);
  // app.post("/agree_to_terms", api.agreeToTerms);
  app.use(apiRouter.apiRequests);

/* Start server */
  app.listen({
    port: 8090
  });