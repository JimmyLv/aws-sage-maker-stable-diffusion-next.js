import { InvokeEndpointCommand, SageMakerRuntimeClient } from '@aws-sdk/client-sagemaker-runtime'

// Create a SageMaker runtime client
const client = new SageMakerRuntimeClient({ region: 'ap-northeast-1' })

export default async (req, res) => {
  if (req.method === 'POST') {
    const endpointName = 'stable-diffusion-v1-5-endpoint'
    const payload = req.body

    console.log('payload:', payload)

    const command = new InvokeEndpointCommand({
      EndpointName: endpointName,
      Body: Buffer.from(JSON.stringify(payload)),
      ContentType: 'application/json',
    })

    try {
      const data = await client.send(command)
      const bodyStr = new TextDecoder().decode(data.Body)

      console.log('decode', bodyStr)
      const responseDict = JSON.parse(bodyStr)
      const generatedImages = responseDict['generated_images']

      res.status(200).json({ base64images: generatedImages })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'An error occurred while invoking the SageMaker endpoint' })
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
