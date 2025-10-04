import OpenAI from 'openai'
import Tesseract from 'tesseract.js'

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

export interface OCRResult {
  vendor: string
  total: number
  date: string
  text: string
}

export async function extractTextFromImage(imageBuffer: Buffer): Promise<OCRResult> {
  const provider = process.env.OCR_PROVIDER || 'tesseract'
  
  if (provider === 'openai' && openai) {
    return await extractWithOpenAI(imageBuffer)
  } else {
    return await extractWithTesseract(imageBuffer)
  }
}

async function extractWithOpenAI(imageBuffer: Buffer): Promise<OCRResult> {
  if (!openai) {
    throw new Error('OpenAI API key not configured')
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract the vendor name, total amount, and date from this receipt. Return the data in JSON format with keys: vendor, total (as number), date (YYYY-MM-DD), and text (full extracted text)."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBuffer.toString('base64')}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content returned from OpenAI')
    }

    // Try to parse JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in OpenAI response')
    }

    const result = JSON.parse(jsonMatch[0])
    return {
      vendor: result.vendor || '',
      total: parseFloat(result.total) || 0,
      date: result.date || '',
      text: result.text || content
    }
  } catch (error) {
    console.error('OpenAI OCR error:', error)
    throw error
  }
}

async function extractWithTesseract(imageBuffer: Buffer): Promise<OCRResult> {
  try {
    const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng', {
      logger: m => console.log(m)
    })

    // Basic parsing logic for Tesseract output
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    
    let vendor = ''
    let total = 0
    let date = ''

    // Try to find vendor (usually first line or contains common business words)
    for (const line of lines.slice(0, 3)) {
      if (line.length > 2 && !line.match(/^\d+$/) && !line.match(/^\$?\d+\.?\d*$/)) {
        vendor = line
        break
      }
    }

    // Try to find total (look for $XX.XX pattern)
    for (const line of lines) {
      const totalMatch = line.match(/\$?(\d+\.?\d*)/)
      if (totalMatch) {
        const amount = parseFloat(totalMatch[1])
        if (amount > total && amount < 10000) { // Reasonable receipt total
          total = amount
        }
      }
    }

    // Try to find date (look for MM/DD/YYYY or similar patterns)
    for (const line of lines) {
      const dateMatch = line.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/)
      if (dateMatch) {
        date = dateMatch[1]
        break
      }
    }

    return {
      vendor: vendor || 'Unknown',
      total,
      date: date || new Date().toISOString().split('T')[0],
      text
    }
  } catch (error) {
    console.error('Tesseract OCR error:', error)
    throw error
  }
}

export function normalizeVendorName(vendor: string): string {
  return vendor
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim()
}
