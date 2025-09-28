// server/api/generate.post.ts
import OpenAI from 'openai'
import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  if (event.node.req.method !== 'POST') {
    event.node.res.statusCode = 405
    return { error: true, message: 'Method Not Allowed. Use POST.' }
  }

  const body = await readBody<{ prompt?: string }>(event)
  const prompt = body?.prompt?.trim()

  if (!prompt) {
    return { error: true, message: 'Prompt is required.' }
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
    })

    // Use request() for correct endpoint
    const response = await openai.request({
      method: 'POST',
      url: '/images/generations',
      data: {
        model: 'openai/gpt-image-1', // or "openai/dall-e-3"
        prompt,
        size: '1024x1024',
        n: 1,
      },
    })

    if (!response?.data) {
      return { error: true, message: 'No data returned from API.' }
    }

    return { error: false, images: response.data.data || [] }
  } catch (err: any) {
    console.error('OpenRouter API error:', err)
    return { error: true, message: err?.message || 'API request failed' }
  }
})
