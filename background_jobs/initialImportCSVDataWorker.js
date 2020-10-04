const { Worker } = require("worker_threads");

function runImportDataService( workerData ){
  return new Promise( ( resolve, reject ) => {
    const importServiceWorker = new Worker("./background_jobs/initialImportCSVDataService.js", { workerData });
    importServiceWorker.on("message", resolve);
    importServiceWorker.on("error", reject);
    importServiceWorker.on("exit", ( code ) => {
      if ( code !== 0 ){
        var errStr = new String("Import data worker stopped with exit code ");
        var codeStr = code.toString();
        reject( new Error(errStr.concat(code)) );
      }
    });
  });
}

async function runImportDataWorker(){
  const result = await runImportDataService("Import data from csv");
  console.log("result from runImportDataService: ", result);
}

runImportDataWorker()
  .catch( err => {
    console.log(err);
  });