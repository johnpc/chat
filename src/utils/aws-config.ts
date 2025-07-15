/**
 * AWS Configuration Utility
 * Provides helper functions for AWS credential management
 */

export interface AWSCredentialInfo {
  hasCredentials: boolean
  credentialSource: 'jpc-prefixed' | 'standard' | 'default-chain'
  region: string
}

/**
 * Get information about the current AWS credential configuration
 * without exposing actual credential values
 */
export function getAWSCredentialInfo(): AWSCredentialInfo {
  const hasJPCCredentials = !!(process.env.JPC_AWS_ACCESS_KEY_ID && process.env.JPC_AWS_SECRET_ACCESS_KEY)
  const hasStandardCredentials = !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)
  
  let credentialSource: AWSCredentialInfo['credentialSource']
  let hasCredentials: boolean

  if (hasJPCCredentials) {
    credentialSource = 'jpc-prefixed'
    hasCredentials = true
  } else if (hasStandardCredentials) {
    credentialSource = 'standard'
    hasCredentials = true
  } else {
    credentialSource = 'default-chain'
    hasCredentials = false // We don't know if default chain has credentials
  }

  return {
    hasCredentials,
    credentialSource,
    region: process.env.BEDROCK_REGION || process.env.AWS_REGION || 'us-west-2'
  }
}

/**
 * Get AWS credentials with JPC prefix preference
 */
export function getAWSCredentials() {
  return {
    accessKeyId: process.env.JPC_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.JPC_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.BEDROCK_REGION || process.env.AWS_REGION || 'us-west-2'
  }
}
