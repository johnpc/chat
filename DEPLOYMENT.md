# Deployment Guide

## Environment Setup

Before deploying, ensure you have the following environment variables configured:

```bash
# Required AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key

# Optional: If using a specific AWS profile
AWS_PROFILE=your_profile_name
```

## Prerequisites

1. **AWS Account**: Active AWS account with Bedrock access
2. **Claude 4 Sonnet Access**: Model must be enabled in your AWS region
3. **IAM Permissions**: Proper permissions for Bedrock Runtime API

### Required IAM Permissions

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-sonnet-4-20250514-v1:0"
    }
  ]
}
```

## Deployment Options

### 1. Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### 2. AWS (EC2/ECS/Lambda)

When deploying to AWS infrastructure:

- Use IAM roles instead of access keys when possible
- Ensure your deployment environment has access to Bedrock
- Configure VPC settings if using private subnets

### 3. Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## Production Considerations

1. **Security**: Never commit AWS credentials to version control
2. **Monitoring**: Implement proper logging and monitoring
3. **Rate Limiting**: Consider implementing rate limiting for API calls
4. **Error Handling**: Ensure graceful error handling for AWS service failures
5. **Cost Management**: Monitor Bedrock usage and costs

## Testing Deployment

1. Verify the application loads correctly
2. Test sending a message to Claude 4 Sonnet
3. Confirm conversation history persists in localStorage
4. Check that new conversations can be created
5. Verify responsive design on different screen sizes
