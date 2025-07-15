import { BedrockRuntimeClient, InvokeModelWithResponseStreamCommand } from '@aws-sdk/client-bedrock-runtime'
import { NextRequest } from 'next/server'
import { getAWSCredentials, getAWSCredentialInfo } from '@/utils/aws-config'

// Get AWS credentials with JPC prefix preference
const awsCredentials = getAWSCredentials()
const credentialInfo = getAWSCredentialInfo()

// Log credential source for debugging (without exposing actual values)
console.log(`AWS Bedrock client using ${credentialInfo.credentialSource} credentials in region ${credentialInfo.region}`)

// Configure Bedrock client
const clientConfig: {
  region: string;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
  };
} = {
  region: awsCredentials.region,
}

if (awsCredentials.accessKeyId && awsCredentials.secretAccessKey) {
  clientConfig.credentials = {
    accessKeyId: awsCredentials.accessKeyId,
    secretAccessKey: awsCredentials.secretAccessKey,
  }
}

const client = new BedrockRuntimeClient(clientConfig)

const MODEL_ID = process.env.CLAUDE_MODEL_ID || 'anthropic.claude-3-5-sonnet-20241022-v2:0'

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    // Convert messages to Anthropic format
    const anthropicMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role,
      content: msg.content,
    }))

    // Prepare the request for Claude
    const input = {
      modelId: MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 4000,
        messages: anthropicMessages,
        temperature: 0.7,
        top_p: 0.9,
      }),
    }

    const command = new InvokeModelWithResponseStreamCommand(input)
    const response = await client.send(command)

    // Create a readable stream for the response
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    const stream = new ReadableStream({
      async start(controller) {
        try {
          if (response.body) {
            for await (const chunk of response.body) {
              if (chunk.chunk?.bytes) {
                const chunkStr = decoder.decode(chunk.chunk.bytes)
                
                try {
                  const parsed = JSON.parse(chunkStr)
                  
                  // Handle content block delta (streaming text)
                  if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                    const chunk = `data: ${JSON.stringify({
                      content: parsed.delta.text
                    })}\n\n`
                    
                    controller.enqueue(encoder.encode(chunk))
                    
                    // Force flush for Amplify/CloudFront
                    controller.enqueue(encoder.encode(''))
                    
                    // Small delay to make streaming more visible
                    await new Promise(resolve => setTimeout(resolve, 50))
                  }
                  
                  // Handle message stop (end of stream)
                  if (parsed.type === 'message_stop') {
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                    controller.close()
                    return
                  }
                } catch {
                  // Skip invalid JSON chunks
                  console.log('Skipping invalid JSON chunk:', chunkStr)
                }
              }
            }
          }
          
          // Fallback close if we don't get message_stop
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Streaming error:', error)
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({
              error: 'Failed to process response'
            })}\n\n`)
          )
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no', // Disable nginx buffering
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return Response.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}
