# 🎙️ Text-to-Speech with Amazon Polly & AWS Lambda

A serverless AWS project that converts text into natural-sounding speech using **Amazon Polly**, processes it via **AWS Lambda**, and stores the generated audio files in **Amazon S3**.

---

## 📐 Architecture Overview

[![View Architecture Animation](https://img.shields.io/badge/View-Architecture%20Animation-blue)](https://chathura-dandeniya.github.io/aws-polly-tts-lambda/aws-tts-pipeline.html)

```
User Input (Text)
      │
      ▼
 AWS Lambda (TTSTranslator-function)
      │
      ├──► Amazon Polly (Text-to-Speech)
      │         │
      │         ▼
      │    Audio Stream (MP3)
      │         │
      └──► Amazon S3 (poly-audio-file-storage-2026)
                │
                ▼
         Stored Audio File
```

---

## 🛠️ AWS Services Used

| Service | Purpose |
|---|---|
| **Amazon Polly** | Converts text to natural-sounding MP3 speech |
| **AWS Lambda** | Serverless function to orchestrate the workflow |
| **Amazon S3** | Stores the generated audio output files |
| **AWS IAM** | Manages permissions and roles securely |

---

## 🚀 Setup & Deployment

### Prerequisites
- An active AWS account
- Basic familiarity with the AWS Management Console

### Step 1 — Create an IAM Role
- Navigate to **IAM → Roles → Create Role**
- Trusted entity: **AWS Service → Lambda**
- Attach the following policies:
  - `AmazonPollyFullAccess`
  - `AmazonS3FullAccess`
  - `AWSLambdaBasicExecutionRole`
- Name the role: `PollyTranslationRole`

### Step 2 — Create an S3 Bucket
- Navigate to **S3 → Create Bucket**
- Bucket name: `poly-audio-file-storage-2026`
- Region: `us-east-1`
- Keep all other settings as default

### Step 3 — Create a Lambda Function
- Navigate to **Lambda → Create Function**
- Function name: `TTSTranslator-function`
- Runtime: **Node.js 20.x**
- Execution role: Use existing role → `PollyTranslationRole`
- Replace the default code with `index.js` from this repository
- Click **Deploy**

### Step 4 — Test the Function
- Click **Test** in the Lambda console
- Use the following Event JSON:
```json
{
  "text": "The text to be converted to Audio"
}
```
- Click **Test** to invoke and check the output
- Verify the generated `.mp3` file appears in your S3 bucket

---

## 📁 Project Structure

```
├── index.js          # Lambda function source code
├── GUIDE.md          # Detailed step-by-step guide
└── README.md         # Project overview (this file)
```

---

## 📝 Lambda Function Overview

The Lambda function performs the following steps:
1. Receives text input from the event payload
2. Sends the text to **Amazon Polly** using the Joanna (Neural) voice
3. Converts the audio stream response to a buffer
4. Uploads the MP3 file to **S3** with a timestamp-based filename
5. Returns a `200` success response with the stored file name

---

## ⚙️ Configuration

| Parameter | Value |
|---|---|
| Voice | Joanna (English, US) |
| Output Format | MP3 |
| S3 Bucket | poly-audio-file-storage-2026 |
| Runtime | Node.js 20.x |
| Architecture | x86_64 |

---

## 🔒 Security Notes

- The IAM role follows the minimum permissions required for this project
- The S3 bucket is private by default — audio files are not publicly accessible
- For production use, consider scoping IAM policies to specific resources

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙋 Author

**Chathura Dandeniya**  
AWS Solutions Architect Associate | CKA | Terraform Associate | AZ-104  
📍 Melbourne, VIC, Australia  
🔗 [LinkedIn](https://www.linkedin.com/in/chathura-dandeniya-7913b022b/) | [GitHub](https://github.com/chathura-dandeniya)

---

> ⭐ If you found this project useful, consider giving it a star!
