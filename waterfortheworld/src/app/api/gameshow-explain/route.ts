// app/api/gameshow-explain/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'edge';

// Validate environment variable
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) throw new Error('GEMINI_API_KEY is missing');

// Initialize client & model
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash-lite',
  systemInstruction:
    'You are a gameshow host, below is users multiple choice question, the correct answer, and the users response. Using 1-2 short sentences explain a fun fact or commentary on what the user chose and commentary with what the correct answer actually is. Give a relevant fun fact about the users choice. Do not lead with an opening sentence or expression',
  generationConfig: {
    temperature: 0.5,  // Slightly higher for more creative responses
    maxOutputTokens: 150,
  },
});

// Request body validation
const BodySchema = z.object({
  question: z.string().min(1),
  userAnswer: z.string().min(1),
  correctAnswer: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { question, userAnswer, correctAnswer } = parsed.data;

    const prompt = `Question: ${question}
User's Answer: ${userAnswer}
Correct Answer: ${correctAnswer}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    return NextResponse.json({ explanation: text });
  } catch (err) {
    console.error('Error generating gameshow explanation:', err);
    return NextResponse.json(
      { error: 'Failed to generate explanation' },
      { status: 500 }
    );
  }
}
