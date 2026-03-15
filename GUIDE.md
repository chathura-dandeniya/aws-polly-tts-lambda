# 📖 Step-by-Step Guide — Text-to-Speech with Amazon Polly

This guide walks you through setting up a serverless text-to-speech pipeline using Amazon Polly, AWS Lambda, and Amazon S3.

---

## What is Amazon Polly?

Amazon Polly is an AWS service that converts written text into natural-sounding speech. Key features include:

- **Text-to-Speech Conversion** — Turns written text into spoken words
- **Realistic Speech** — Produces human-like, natural-sounding audio
- **Customisation Options** — Adjust speed, pitch, accent, and language
- **Multiple Languages & Voices** — Supports dozens of languages and voice profiles
- **SSML Support** — Fine-grained control over speech using Speech Synthesis Markup Language

---

## Step 1 — Try out Amazon Polly

1. Log in to the **AWS Management Console** and search for **Amazon Polly**
2. Navigate to the **Text-to-Speech** console
3. Select an **Engine**:
   - **Neural** — Lifelike, expressive speech for natural interactions
   - **Standard** — Good quality speech for most applications
   - **Long-Form** — Optimised for longer content like articles or books
4. Choose a **Language** and **Voice**
5. Enter your text and click **Listen** to preview the output

---

## Step 2 — Create an IAM Role

1. In the AWS Management Console, search for **IAM**
2. Navigate to **Access Management → Roles → Create Role**
3. Select **AWS Service** as the trusted entity type
4. Choose **Lambda** as the use case and click **Next**
5. Attach the following permission policies:
   - `AmazonPollyFullAccess`
   - `AmazonS3FullAccess`
   - `AWSLambdaBasicExecutionRole`
6. Click **Next**
7. Name the role `PollyTranslationRole` and click **Create role**

---

## Step 3 — Create an S3 Bucket

1. In the AWS Management Console, search for **S3**
2. Click **Create bucket**
3. Configure the bucket:
   - **Region:** US East (N. Virginia) us-east-1
   - **Bucket type:** General purpose
   - **Bucket name:** `poly-audio-file-storage-2026`
4. Leave all other settings as default and click **Create bucket**

> The generated audio files from Amazon Polly will be stored in this bucket via the Lambda function.

---

## Step 4 — Create a Lambda Function

1. In the AWS Management Console, search for **Lambda**
2. Click **Create function**
3. Configure the function:
   - **Function name:** `TTSTranslator-function`
   - **Runtime:** Node.js 20.x
   - **Architecture:** x86_64
4. Under **Change default execution role**, select **Use an existing role**
5. Choose `PollyTranslationRole` from the dropdown
6. Click **Create function**
7. In the code editor, rename `index.mjs` to `index.js`
8. Replace the default code with the contents of `index.js` from this repository
9. Click **Deploy**

---

## Step 5 — Test the Function

1. Click **Test** in the Lambda console
2. Create a new test event with the following Event JSON:

```json
{
  "text": "The text to be converted to Audio"
}
```

3. Click **Save**, then click **Test** again to invoke the function
4. Verify the output shows **Status: Succeeded** with a `statusCode: 200`
5. Navigate to your S3 bucket `poly-audio-file-storage-2026` to find the generated `.mp3` file
6. Download and listen to the audio file to confirm it works correctly

---

## How It Works

| Stage | Description |
|---|---|
| **Input** | Lambda receives text via the event payload |
| **Speech Generation** | Amazon Polly converts the text to MP3 using the Joanna voice |
| **Buffering** | The audio stream is converted to a binary buffer |
| **Storage** | The MP3 file is uploaded to S3 with a timestamp-based filename |
| **Response** | Lambda returns a 200 success response with the file location |

---

## Notes

- The default Lambda timeout is 3 seconds — consider increasing it to **15 seconds** for longer texts
- S3 bucket names must be globally unique — adjust the name if needed
- For production use, scope IAM policies to specific resources rather than using `FullAccess` managed policies
