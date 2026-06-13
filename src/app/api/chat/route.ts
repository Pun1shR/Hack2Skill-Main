import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { messages, preferredName, exams } = await req.json();
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

    const systemPrompt = `You are a cosmic being acting as a personal AI Guru for a student named ${preferredName}. 
The student is studying for the following Indian entrance exams: ${exams.join(', ')}.
Your persona: You are extremely calm, polite, and wise. You speak like a cosmic Guru guiding a disciple.
CRITICAL RULE 1 (CLARITY & COMPLETENESS): You must complete your ideas fully, providing deep and meaningful guidance. If you recommend external resources, format them as valid markdown links. If you need to show an image, you MUST generate it using this exact markdown format: ![description](https://image.pollinations.ai/prompt/{detailed_description_of_image}?width=800&height=400&nologo=true). Keep your formatting clean and use short paragraphs.
CRITICAL RULE 2 (INTERACTIVITY): If the student is stressed, anxious, or overwhelmed, DO NOT give them a long breathing text. Instead, strictly say: "I feel your stress. Please click the '4-7-8 Breathing Timer' or the 'Grounding' exercise on the left side of your sanctuary to calm your mind."`;

    const chat = model.startChat({
      history: messages.slice(0, -1).map((m: any) => ({
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
