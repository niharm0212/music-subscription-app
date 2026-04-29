# 🎵 Music Subscription App (Cloud Backend)

## 📌 Overview

This project implements a cloud-based backend for a music subscription service using AWS.

The backend is built using Node.js and Express, and deployed using AWS Lambda (serverless architecture). DynamoDB is used as the database.

---

## 🏗 Architecture

Frontend → API Gateway → Lambda → DynamoDB

---

## ⚙️ Technologies Used

- Node.js
- Express.js
- AWS Lambda
- API Gateway
- DynamoDB
- Serverless HTTP

---

## 🚀 Setup Instructions

### 1. Clone Repository

```bash
git clone <your-repo-link>
cd music-subscription-app
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Configure Environment Variables

Create a `.env` file:

```
AWS_REGION=us-east-1
USERS_TABLE=login
SONGS_TABLE=music
SUBSCRIPTIONS_TABLE=subscriptions
JWT_SECRET=your_secret
S3_BUCKET_NAME=your_bucket
```

---

### 4. Run Locally (Optional)

```bash
npm start
```

Then open:

```
http://localhost:3000/songs?artist=Taylor%20Swift
```

---

## ☁️ AWS Setup

### DynamoDB Tables

Create 3 tables:

1. **music**
   - Partition key: `artist`
   - Sort key: `title`
   - LSI: `year-index`
   - GSI: `AlbumIndex`

2. **login**
   - Partition key: `email`

3. **subscriptions**
   - Partition key: `email`
   - Sort key: `title`

---

### Lambda Deployment

1. Zip project (include node_modules)
2. Upload to AWS Lambda
3. Set handler:

```
handler.handler
```

---

### API Gateway Setup

1. Create HTTP API
2. Add route:

```
ANY /{proxy+}
```

3. Connect to Lambda
4. Enable auto-deploy

---

## 🔗 Example API

```
GET /songs?artist=Taylor Swift
```

---

## ⚠️ Notes

- Scan operation is restricted in AWS Lab environment
- Only query-based access is used for DynamoDB
- All services must be in the same region (us-east-1)

---
