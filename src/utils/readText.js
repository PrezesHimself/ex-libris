const vision = require('@google-cloud/vision');

const readText = async (fileName) => {

// Creates a client
    const client = new vision.ImageAnnotatorClient();

// Performs text detection on the local file
    const [result] = await client.textDetection(fileName);
    const detections = result.textAnnotations;
    return result.textAnnotations;
}

module.exports = {
    readText
}