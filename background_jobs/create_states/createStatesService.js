"use strict";

const { workerData, parentPort, isMainThread } = require("worker_threads");
const fs = require("fs");
const csvParser = require("csv-parser");
const Process = require("process");
const dbPool = require("../../db/database");
const stateJSON = require("../../data/states_hash.json");

if ( isMainThread ){
  console.log("Main thread, skipping queue");
} else {
  const fileLocation = "./crawler_downloads/all_states.csv";
  var stateArray = new Array;
  fs.createReadStream(fileLocation)
    .on("error", (err) => {
      console.log("Err: ", err);
    })
    .pipe(csvParser())
    .on("data", ( csvRow ) => {
      // checking latest date to get all states
      if ( csvRow["date"] == "2020-09-27" ){
        stateArray.push([
          csvRow["state"],
          stateJSON[csvRow["state"]]
        ]);
      }
    })
    .on("end", () => {
      console.log("States array: ", stateArray);
      console.log("States array len: ", stateArray.length);

      // bulk insert into state table
    
      dbPool.query(
        'INSERT INTO state(state_abbrev, state_name) VALUES ?',
        [stateArray],
        function( err, results, fields ){
          console.log("Results: ", results);
          console.log("Fields: ", fields);
        }
      ).catch( err => {
        console.log("Err performing bulk state insert: ", err);
      });
      
      console.log("ending stream...");
    });
  // handle importing all states from hash
  // similar structure to csv data service
  parentPort.postMessage({ status: "Successfully imported states."});
}