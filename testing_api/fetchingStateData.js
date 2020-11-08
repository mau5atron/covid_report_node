"use strict";

const { json } = require("body-parser");
const fetch = require("isomorphic-fetch");
const apiHelpers = require("../src/api/apiHeader");
const StateData = require("../src/models/stateData");

function fetchStateData(){
  var jsonObjects = new Object;
  return StateData.getLatestStateData()
  .then((rows, FieldData) => {
    return rows[0];
  })
  .then( res => {
    // console.log("Result: ", res);
    for ( var i = 0 ; i < res.length ; i++ ){
      // console.log("Obj: ", res[i].state_abbrev);
      jsonObjects[res[i].state_abbrev] = res[i];
    }

    console.log("Json obj: ", jsonObjects);
  })
  .catch(err => {
    console.log("Error: ", err);
  });
}

fetchStateData();