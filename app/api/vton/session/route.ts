import { NextResponse } from "next/server";
import { createDecartClient } from "@decartai/sdk";

export async function POST() {
  try {
    if (process.env.MOCK_MODE === "true") {
      return NextResponse.json({
        success: true,
        mode: "mock",
        message: "Mock VTON session created.",
      });
    }

    const apiKey = process.env.DECART_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "DECART_API_KEY is missing." },
        { status: 500 }
      );
    }

    const client = createDecartClient({ apiKey });

    const token = await client.tokens.create();

    return NextResponse.json({
      success: true,
      mode: "decart",
      apiKey: token.apiKey,
    });
  } catch (error) {
    console.error("Decart token error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to create Decart token." },
      { status: 500 }
    );
  }
}