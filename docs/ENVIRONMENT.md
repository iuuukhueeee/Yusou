## ENVIRONMENT.md

This document outlines the step-by-step process for setting up environment variables and external services required for the project.

---

### Table of Contents

1. [Prerequisites](#prerequisites)
2. [Directory Structure](#directory-structure)
3. [Environment Variables Overview](#environment-variables-overview)
4. [Setting Up Supabase](#setting-up-supabase)
5. [Setting Up AWS Services](#setting-up-aws-services)
6. [Configuring Turnstile (Cloudflare)](#configuring-turnstile-cloudflare)
7. [Creating the `.env` File](#creating-the-env-file)
8. [Running the Application](#running-the-application)
9. [Security Best Practices](#security-best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (>= 20.x)
- [Yarn](https://classic.yarnpkg.com/)
- [Docker](https://docs.docker.com/get-docker/) (optional, for local Supabase)
- AWS CLI v2 (`awscli`) and configured [IAM permissions](#aws-iam-permissions)
- A Cloudflare account (for Turnstile)

## Directory Structure

```bash
project-root/
├── .env                # Local environment variables (not committed)
├── ENVIRONMENT.md      # This setup guide
├── src/                # Source code
└── package.json
└── ...
```

## Environment Variables Overview

| Variable                | Description                                         |
| ----------------------- | --------------------------------------------------- |
| `SUPABASE_URL`          | URL of your Supabase project                        |
| `SUPABASE_ANON_KEY`     | Public (anon) API key from Supabase                 |
| `AWS_ACCESS_KEY_ID`     | Access Key ID for AWS IAM user                      |
| `AWS_SECRET_ACCESS_KEY` | Secret Access Key for AWS IAM user                  |
| `AWS_REGION`            | AWS region (e.g., `us-east-1`)                      |
| `S3_BUCKET`             | Name of the S3 bucket for file storage              |
| `TURNSTILE_SECRET_KEY`  | Secret key for Cloudflare Turnstile CAPTCHA service |

## Setting Up Supabase

1. **Create a Supabase Project**

   - Go to [app.supabase.com](https://app.supabase.com/) and sign in.
   - Click **New Project** and follow prompts to create your database.

2. **Retrieve Credentials**

   - In the project dashboard, navigate to **Settings > API**.
   - Copy the **URL** and **anon public** key.
   - Assign these values to `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

## Setting Up AWS Services

### AWS IAM Permissions

1. Create a new IAM user (e.g., `project-user`) with programmatic access.
2. Attach the following policy or equivalent:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": ["s3:PutObject", "s3:GetObject", "s3:ListBucket"],
         "Resource": ["arn:aws:s3:::YOUR_BUCKET_NAME", "arn:aws:s3:::YOUR_BUCKET_NAME/*"]
       }
     ]
   }
   ```

3. Save the **Access Key ID** and **Secret Access Key**.

### AWS CLI Configuration

```bash
aws configure
# Enter AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION when prompted
```

### Create an S3 Bucket

```bash
aws s3 mb s3://$S3_BUCKET --region $AWS_REGION
```

## Configuring Turnstile (Cloudflare)

1. Log in to your Cloudflare dashboard.
2. Navigate to **Firewall > Turnstile**.
3. Click **Create site key**, enter your domain, and note the **Secret Key**.
4. Assign this value to `TURNSTILE_SECRET_KEY`.

## Creating the `.env` File

1. At the project root, create a file named `.env`, take example env from `.env.example` (ensure it is in `.gitignore`).
2. Populate it with:

   ```dotenv
   SUPABASE_URL=<your-supabase-url>
   SUPABASE_ANON_KEY=<your-supabase-anon-key>
   AWS_ACCESS_KEY_ID=<your-aws-access-key-id>
   AWS_SECRET_ACCESS_KEY=<your-aws-secret-access-key>
   AWS_REGION=<your-aws-region>
   S3_BUCKET=<your-s3-bucket-name>
   TURNSTILE_SECRET_KEY=<your-turnstile-secret-key>
   ```

## Running the Application

Install dependencies and start:

```bash
yarn install    # or npm install
yarn dev        # or npm run dev
```

The application will read the variables from your `.env` file automatically.

## Security Best Practices

- **Never commit** your `.env` file to version control.
- Use a secrets manager (e.g., AWS Secrets Manager, GitHub Secrets) for production.
- Rotate keys periodically.
- Limit IAM permissions to the minimum required.

## Troubleshooting

- **Missing Environment Variables**: Ensure `.env` is named correctly and variables are set.
- **Access Denied (AWS)**: Check IAM policy and bucket names.
- **Incorrect Supabase URL/Key**: Verify values in the Supabase dashboard.
- **Turnstile Errors**: Ensure correct site secret and domain match.

---

_Last updated: May 26, 2025_
