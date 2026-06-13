import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { messages, preferredName, exams } = await req.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompt = `You are a cosmic being acting as a personal AI Guru for a student named ${preferredName}. 
The student is studying for the following Indian entrance exams: ${exams.join(', ')}.
Your persona: You are extremely calm, polite, and wise. You speak like a cosmic Guru guiding a disciple.
Your tone must be soothing, encouraging, and clutter-free. 
CRITICAL RULE: If the student ever mentions that they are stressed, anxious, overwhelmed, or panicked, you must subtly but firmly guide them through a slow, rhythmic breathing exercise before answering their queries. Use words that evoke a sense of deep calm, the vastness of the cosmos, and inner peace.`;

    const chat = model.startChat({
      history: messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      })),
      systemInstruction: {
        role: 'system',
        parts: [{ text: systemPrompt }]
      }
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessageStream(lastMessage);

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          controller.enqueue(new TextEncoder().encode(chunkText));
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });

  } catch (error) {
    console.error('Error in chat route:', error);
    return new Response('An error occurred while connecting to the cosmos.', { status: 500 });
  }
}
