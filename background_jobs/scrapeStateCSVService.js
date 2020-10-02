"use strict";
const https = require("https");
const fs = require("fs");
const { workerData, parentPort, isMainThread } = require("worker_threads");

/*
  workerData is the data that the main app sent us
  - we then need a way to return information to the

  This is done with parentPort that has a postMessage method
  where we can pass back a message to the main app
*/

if ( isMainThread ){
  // executes on main thread and not in the worker
  const worker = new Worker(__filename);
  worker.on("message", ( msg ) => {
    console.log("Message from main thread: ", msg);
  });
} else {
  // all-states-history.csv
  // https://covidtracking.com/data/download/all-states-history.csv

  // save the file
  var destination = "./crawler_downloads/";
  const file = fs.createWriteStream( destination + "all_states.csv");
  var url = "https://covidtracking.com/data/download/all-states-history.csv";

  const request = https.get(url, ( response ) => {
    response.pipe(file);
    file.on("finish", () => {
      file.close(() => {
        console.log("closed file");
      });
    })
  }).on("error", () => {
    fs.unlink(destination);
  });

  // process data from latest date in the csv and save to database
  // process and save to database
  parentPort.postMessage({ status: "Writing csv file..." });
}
