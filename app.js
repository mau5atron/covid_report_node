/* Node */
  const express = require("express");
  const app = express();
  const bodyParser = require("body-parser");
  const tos = require("./utilities/tos");
  const cors = require("cors");
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(cors());
  app.use(bodyParser.json());

/* Source */
  const tokenGenerator = require("./utilities/generators");
  // const tosTerms = require("./testing_api/agree_to_terms");

/* Middleware - transfer to appropriate controllers */
  app.use( ( req, res, next ) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.get("/accept_tos", ( req, res, next) => {
    res.send({ "terms_of_service": tos.getTos() });
  });

  app.post("/agree_to_terms", ( req, res, next ) => {
    console.log("Request body:", req.body["accepted_tos"]);
    // make api accept as {accepted_tos: passed in body } then pass this object to function
    var requestAcceptedTos = req.body["accepted_tos"];
    if ( ( requestAcceptedTos !== undefined || requestAcceptedTos !== "" ) && requestAcceptedTos == "true" ){
      var success = JSON.stringify({ 
        status: 200,
        api_access_token: tokenGenerator.generateKey()
      });
      res.send(success);
    } else {
      var err = JSON.stringify({
        status: 400,
        error: "You need to accept the terms of service"
      });
      res.send(err);
    }
  });

/* Start server */
  app.listen({
    port: 8090
  });