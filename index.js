const { PollyClient, SynthesizeSpeechCommand } = require("@aws-sdk/client-polly");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const pollyClient = new PollyClient({});
const s3Client = new S3Client({});

exports.handler = async (event) => {
    try {
        // Extract and validate text input
        const text = event.text;
        if (!text) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "No text provided" }),
            };
        }

        // Generate speech using Amazon Polly
        const pollyParams = {
            Text: text,
            OutputFormat: "mp3",
            VoiceId: "Joanna",
        };

        const synthesizeCommand = new SynthesizeSpeechCommand(pollyParams);
        const pollyResponse = await pollyClient.send(synthesizeCommand);

        // Validate Polly response
        if (!pollyResponse.AudioStream) {
            throw new Error("Polly did not return audio data.");
        }

        // Convert AudioStream to a buffer
        const audioBuffer = await streamToBuffer(pollyResponse.AudioStream);

        // Specify S3 parameters with ContentLength
        const key = `audio-${Date.now()}.mp3`;
        const s3Params = {
            Bucket: "poly-audio-file-storage-2026",
            Key: key,
            Body: audioBuffer,
            ContentType: "audio/mpeg",
            ContentLength: audioBuffer.length,
        };

        const putCommand = new PutObjectCommand(s3Params);
        await s3Client.send(putCommand);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: `Audio stored as ${key}` }),
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Internal server error",
                error: error.message,
            }),
        };
    }
};

// Helper function: Convert a readable stream to a buffer
async function streamToBuffer(stream) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
}
