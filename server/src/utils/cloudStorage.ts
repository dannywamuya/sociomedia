// Imports the Google Cloud client library
import { Storage } from "@google-cloud/storage";
import path from "path";

// const keyFile = require("../../sociomediaKeyFile.json");

// For more information on ways to initialize Storage, please see
// https://googleapis.dev/nodejs/storage/latest/Storage.html

// Cloud Storage Project ID
// const projectId = "sociomedia";

// Creates a client using Application Default Credentials
export const storage = new Storage({
  keyFilename: path.join(__dirname, "../../sociomediaKeyFile.json"),
});

/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
// The ID of your GCS bucket
const bucketName = "sociomedia-image-bucket";

export const bucket = storage.bucket(bucketName);

// Creates a client from a Google service account key
// const storage = new Storage({keyFilename: 'key.json'});

// async function createBucket() {
//   // Creates the new bucket
//   await storage.createBucket(bucketName);
//   console.log(`Bucket ${bucketName} created.`);
// }

// createBucket().catch(console.error);

// async function authenticateImplicitWithAdc() {
//   // This snippet demonstrates how to list buckets.
//   // NOTE: Replace the client created below with the client required for your application.
//   // Note that the credentials are not specified when constructing the client.
//   // The client library finds your credentials using ADC.
//   // const storage = new Storage({
//   //   projectId,
//   // });
//   const [buckets] = await storage.getBuckets();
//   console.log("Buckets:");

//   for (const bucket of buckets) {
//     console.log(`- ${bucket.name}`);
//   }

//   console.log("Listed all storage buckets.");
// }

// authenticateImplicitWithAdc();
