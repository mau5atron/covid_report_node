const { Worker } = require("worker_threads");

function runStateService( workerData ){
  return new Promise( (resolve, reject ) => {
    const importServiceWorker = new Worker("./background_jobs/create_states/createStatesService.js", { workerData });
    importServiceWorker.on("message", resolve);
    importServiceWorker.on("error", reject);
    importServiceWorker.on("exit", ( code ) => {
      if ( code !== 0 ){
        var errStr = new String("Import state data worker stopped with exit code: ");
        var errCodeStr = code.toString();
        reject( new Error( errStr.concat( errCodeStr ) ) );
      }
    });
  });
}

// call promise asynchronously
async function runStateWorker(){
  const result = await runStateService("Extracting states from hash and csv..");
  console.log("result from runStateWorker: ", result);
}

runStateWorker()
  .catch( err => {
    console.log("Err: ", err);
  })