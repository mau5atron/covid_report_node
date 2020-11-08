"use strict";

/* Dependencies */

/* Source */
const tos = require("../helpers/tos");
const tokenGenerator = require("../../lib/utilities/generators");
const Token = require("../models/tokens");
const StateData = require("../models/stateData");

exports.accessHeaders = ( req, res, next ) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}

exports.getTermsOfService = ( req, res, next ) => {
  console.log("getting terms of service");
  res.send({ "terms_of_service": tos.getTos() });
}

exports.agreeToTerms = ( req, res, next ) => {
  console.log("accepting terms log");
  console.log("Request body:", req.body);
    // make api accept as {accepted_tos: passed in body } then pass this object to function
  var requestAcceptedTos = req.body["accepted_tos"];

  if ( ( requestAcceptedTos !== undefined || requestAcceptedTos !== "" ) && requestAcceptedTos == "true" ){
    var generatedToken = tokenGenerator.generateKey();
    var newToken = new Token(generatedToken);
    newToken.saveToken()
      .then( () => {
        var success = JSON.stringify({ 
          status: 200,
          api_access_token: generatedToken
        });
        res.send(success);
      })
      .catch( err => {
        console.log(err);
      }); // save the token
  } else {
    var err = JSON.stringify({
      status: 400,
      error: "You need to accept the terms of service"
    });
    res.send(err);
  }
}

exports.validateToken = ( req, res, next ) => {
  /*
    valid token request example:
    {
      api_token: "ouwnfouwenfoweybgewiybgewb"
    }
  */
  var apiToken = req.body["token"];
  console.log("trying to validate token: ", apiToken);
  if ( apiToken.length == 32 ){
    // only validate if length is 32
    // var validatedTokenResponse = Token.validateToken(apiToken);
    Token.validateToken(apiToken)
      .then( ( [row, fieldData] ) => {
        // console.log("Row data: ", row[0].valid_token.toString("utf8"));
        if ( row.length == 0 ){
          throw "Token not found.";
        }

        var isTokenValid = row[0].valid_token[0];
        res.send( JSON.stringify( { token_valid: isTokenValid } ) );
      })
      .catch( err => {
        console.log("Error checking token validaton: ", err);
      });
  } else {
    res.send( JSON.stringify( { error: "Could not validate token."} ) );
  }
}

exports.getUSData = ( req, res, next ) => {
  var receivedApiToken = req.body["token"];
  console.log("trying to verify token: ", receivedApiToken);
  if ( typeof receivedApiToken == "string" && receivedApiToken.length == 32 ){
    Token.validateToken(receivedApiToken)
      .then(([row, fieldData]) => {
        if ( row.length == 0 ){
          throw "Token not found.";
        }

        var isTokenValid = row[0].valid_token[0];
        
        StateData.getLatestStateData()
          .then( ( rows, fieldData ) => {
            var payload = new Object;
            payload["state_data"] = new Object;
            for ( var i = 0 ; i < rows[0].length ; i++ ){
              payload["state_data"][rows[0][i].state_abbrev] = rows[0][i];
            }

            payload["token_valid"] = isTokenValid;
            res.send( JSON.stringify({ payload }) );
          })
          .catch( err => {
            console.log("Error fetching state data: ", err);
          })

        // will also be sending the state data
      })
      .catch( err => {
        console.log("Error checking validation: ", err);
      })
  } else {
    res.send( JSON.stringify({ error: "Could not validate token."}) );
  }
} 