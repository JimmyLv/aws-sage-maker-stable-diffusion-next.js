import React, { useState } from 'react'

function Index() {
  const [prompt, setPrompt] = useState('')
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!prompt) {
      return
    }

    setLoading(true)
    const response = await fetch('/api/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: [prompt],
        num_images_per_prompt: 1,
        height: 512,
        width: 512,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      setImage(`data:image/png;base64,${data.base64images[0]}`)
    } else {
      console.error('An error occurred while sending the request.')
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mx-auto my-4 w-full rounded-xl bg-white p-6 shadow-md">
        <div className="flex justify-between">
          <h1 className="mb-4 text-xl font-bold">Image Generation</h1>
          <a className="underline" href="https://github.com/JimmyLv/aws-sage-maker-stable-diffusion-next.js" target="_blank" rel="noreferrer">
            open-source tutorial
          </a>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Prompt:</span>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </label>
          <button className="p-3 block text-center bg-black text-white rounded-md mt-10" type="submit" disabled={loading}>{loading ? 'Generating...' : 'Generate Image'}</button>
        </form>
        {image && <img src={image} alt="Generated" className="mt-4 rounded-md" />}
      </div>
    </div>
  )
}

export default Index
