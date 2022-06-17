/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// The ID of your GCS bucket
const bucketName = 'ex-libris';

// The path to your file to upload
const filePath = 'src/img/image.jpg';

// The new ID for your GCS file
const destFileName = 'image.jpg';

// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();

const uploadFile = async () => {
    await storage.bucket(bucketName).upload(filePath, {
        destination: destFileName,
    });

    console.log(`${filePath} uploaded to ${bucketName}`);
}


const createBucket = async () => {
    // Creates the new bucket
    await storage.createBucket(bucketName);
    console.log(`Bucket ${bucketName} created.`);
};


module.exports = {
    uploadFile,
    createBucket
};