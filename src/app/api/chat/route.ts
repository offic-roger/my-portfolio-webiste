import { NextResponse } from "next/server";
import { OFFICIAL_ROGER_KNOWLEDGE } from "@/lib/knowledge";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request payload. 'messages' array is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          response:
            "Habari! Mimi ni AI msaidizi wa Official Roger. \n\n⚠️ **Angalizo la Kimfumo:** Inaonekana `GEMINI_API_KEY` haijawekwa kwenye faili la `.env.local` kwenye seva. Tafadhali ongeza Gemini API Key yako ili niweze kujibu maswali yako kwa kutumia akili mnemba (AI) ya Gemini!",
        },
        { status: 200 }
      );
    }

    // Map conversation history to Gemini content structure
    // Gemini API roles: 'user' and 'model'
    const contents = messages.map((msg: any) => {
      const role = msg.sender === "user" ? "user" : "model";
      return {
        role,
        parts: [{ text: msg.text }],
      };
    });

    const systemInstructionText = `You are the friendly, professional 24/7 AI Customer Care assistant for Official Roger. Your name is "Roger's AI Assistant". 
Official Roger is a creative multimedia technologist, AI specialist, and content creator based in Tanzania.

Your goal is to answer client questions about Roger's services, skills, tools, portfolio, pricing, process, and contact info based ONLY on the provided knowledge base. 
Do not make up facts or hallucinate details. If a user asks about anything not mentioned in the knowledge base, politely say that you can only answer questions related to Roger's services, portfolio, and pricing, and suggest they fill out the contact form or click the WhatsApp button to contact him directly.

Answer in the same language the user uses (Swahili or English). If they ask in Swahili, respond in Swahili. If they ask in English, respond in English.

=== KNOWLEDGE BASE ===
${OFFICIAL_ROGER_KNOWLEDGE}
======================`;

    const systemInstruction = {
      parts: [
        {
          text: systemInstructionText,
        },
      ],
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    let response;
    try {
      response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          systemInstruction,
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });
    } catch (fetchErr) {
      console.warn("Direct Node.js fetch to Gemini failed. Activating browser-side fallback...", fetchErr);
      return NextResponse.json(
        {
          fallback: true,
          apiKey,
          contents,
          systemInstruction: systemInstructionText,
        },
        { status: 200 }
      );
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API Error Response:", errText);
      // If it is a network or gateway error from proxy, trigger fallback
      if (response.status >= 500) {
        return NextResponse.json(
          {
            fallback: true,
            apiKey,
            contents,
            systemInstruction: systemInstructionText,
          },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { response: "Samahani, kuna tatizo limejitokeza wakati wa kuwasiliana na seva za Gemini AI. Tafadhali jaribu tena baada ya muda mfupi." },
        { status: 200 }
      );
    }

    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      "Samahani, nilishindwa kupata majibu kwa sasa. Tafadhali jaribu kuniuliza tena au wasiliana na Roger moja kwa moja.";

    return NextResponse.json({ response: aiText }, { status: 200 });
  } catch (error) {
    console.error("Error in AI Chat Route:", error);
    return NextResponse.json(
      { response: "Hitilafu imetokea kwenye seva yetu ya AI. Tafadhali jaribu tena baadaye." },
      { status: 500 }
    );
  }
}
