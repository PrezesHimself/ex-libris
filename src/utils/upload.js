/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// The ID of your GCS bucket
const bucketName = 'ex-libris';

// Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();

const uploadFile = async (filePath) => {
  const result = await storage.bucket(bucketName).upload(filePath, {
    destination: filePath.split('/').at(-1),
  });

  console.log(`${filePath} uploaded to ${bucketName}`);
  return {
    filePath,
    bucketName,
    storage: result[1],
  };
};

const createBucket = async () => {
  // Creates the new bucket
  await storage.createBucket(bucketName);
  console.log(`Bucket ${bucketName} created.`);
};

module.exports = {
  uploadFile,
  createBucket,
};
