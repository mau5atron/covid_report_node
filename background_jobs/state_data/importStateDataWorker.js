const { Worker } = require("worker_threads");
const { execute } = require("../../db/database");

function importStateDataService( workerData ){
  return new Promise( ( resolve, reject ) => {
    const importStateDataServiceWorker = new Worker("./background_jobs/state_data/importStateDataService.js", { workerData });
    importStateDataServiceWorker.on("message", resolve);
    importStateDataServiceWorker.on("errro", reject);
    importStateDataServiceWorker.on("exit", ( code ) => {
      if ( code !== 0 ){
        var errStr = new String("Import state data worker stopped with exit code ");
        var codeStr = code.toString();
        reject( new Error( errStr.concat(codeStr)) );
      }
    });
  });
}

// asynchrounous function to run service
async function executeStateDataWorker(){
  const result = await importStateDataService("Import state data from CSV.");
  console.log("Result from import state data service: ", result);
}

executeStateDataWorker()
  .catch( err => {
    console.log("Error from executing state data worker: ", err);
  })