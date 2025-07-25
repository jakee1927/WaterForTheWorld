// app/api/explain/route.ts (Next.js 13/14 route handler example)
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'edge'; // optional, but faster & cheaper for small calls

// ---- Validate env up front ----
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) throw new Error('GEMINI_API_KEY is missing');

// ---- Init client & model once (module scope cache) ----
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash-lite', // requested model
  systemInstruction:
    'You are an expert SAT tutor. You will be provided with an SAT R&W question, the correct answer, and the users answer. Using no more than 2 short sentences, clearly explain to the user why the correct answer is correct.',
  generationConfig: {
    temperature: 0.3,          // lower for consistency
    maxOutputTokens: 120,       // plenty for 2 sentences
    // topP/topK omitted; let model pick defaults (best practice per docs)
  },
});

// ---- Zod schema for safer body parsing ----
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
        { error: 'Invalid body', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { question, userAnswer, correctAnswer } = parsed.data;

    const prompt = `
Question: ${question}
User's Answer: ${userAnswer}
Correct Answer: ${correctAnswer}

Explain (≤2 short sentences) why the correct answer is correct:
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    return NextResponse.json({ explanation: text });
  } catch (err) {
    console.error('Error generating explanation:', err);
    return NextResponse.json(
      { error: 'Failed to generate explanation' },
      { status: 500 }
    );
  }
}
