import { NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function POST(req: Request) {
    try {
        const { message, threadId } = await req.json();

        // Call OpenAI or your target Agent API here
        const { text } = await generateText({
            model: openai("gpt-4o"),
            prompt: message,
        });

        return NextResponse.json({ reply: text });
    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: "Failed to process chat request" },
            { status: 500 }
        );
    }
}
