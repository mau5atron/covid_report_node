const { Worker } = require("worker_threads");

function runService( workerData ){
  return new Promise( (resolve, reject) => {
    const worker = new Worker("./background_jobs/scrapeStateCSVService.js", { workerData });
    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", ( code ) => {
      if ( code !== 0 ){
        var errStr = new String("Worker stopped with exit code ");
        var codeStr = code.toString();
        reject( new Error(errStr.concat(codeStr)) );
      }
    });
  });
}

async function runWorker(){
  const result = await runService("Scrape data csv");
  console.log("result from runWorker(): ", result);
}

runWorker()
  .catch( err => {
    console.log(err);
  });