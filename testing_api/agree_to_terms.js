// testing agree_to_terms
const fetch = require("isomorphic-fetch");
const apiHelpers = require("../api/helpers.js");

// accepted_tos : bool
exports.agreeTerms = async ( accepted_tos ) => {
  var url = apiHelpers.apiBaseUri + "/agree_to_terms";
  var response;
  // var convertedBoolToString = ( typeof accepted_tos == "boolean" ) ? accepted_tos.toString() : "";

  // need to figure out boolean issue here
  // if ( ( typeof convertedBoolToString !== "string" && convertedBoolToString !== "true" ) || convertedBoolToString == undefined || convertedBoolToString == "" ){
  if ( typeof accepted_tos == "string" && accepted_tos == "true" ){
    response = await fetch( url, {
        method: "POST",
        headers: apiHelpers.headers,
        body: JSON.stringify({ accepted_tos: accepted_tos })
      }
    );
    return await response.json();
  } else {
    var err = '{ "error": "You need to accept the terms of service" }';
    return await err;
  } 
}