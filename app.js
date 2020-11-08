/* Dependencies */
  const express = require("express");
  const app = express();
  const bodyParser = require("body-parser");
  const cors = require("cors");
  const cron = require("node-cron");
  const helmet = require("helmet");

  app.use(bodyParser.urlencoded({extended: false}));
  app.use(cors());
  app.use(bodyParser.json());

/* Source */
  const api = require("./src/controllers/api");
  const apiRouter = require("./src/routes/api");

/* Middleware - transfer to appropriate controllers */
  app.use(api.accessHeaders);
  app.use( helmet() );

  /*
    # ┌────────────── second (optional)
    # │ ┌──────────── minute
    # │ │ ┌────────── hour
    # │ │ │ ┌──────── day of month
    # │ │ │ │ ┌────── month
    # │ │ │ │ │ ┌──── day of week
    # │ │ │ │ │ │
    # │ │ │ │ │ │
    # * * * * * *
  */
 
  /* cron.schedule("1 * * * * *", () => {
    // 1/* runs every second
    console.log("cron!!");
  }); */

  // app.get("/terms_of_service", api.getTermsOfService);
  // app.post("/agree_to_terms", api.agreeToTerms);
  app.use(apiRouter.apiRequests);

/* Start server */
  app.listen({
    port: 8090
  });