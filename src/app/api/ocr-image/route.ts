import ai from "@/libs/gemini";
import tesseract, { Methods } from "@/libs/tessaract";
import { NextRequest } from "next/server";

// POST /api/ocr-image
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData(); // Get the FormData object
    const imageFile = formData.get("file") as File;
    const { text, confidence } = await tesseract.getTextFromImage({
      method: Methods.FROM_FILE,
      image: imageFile,
    });

    // const result = await ai.customizeRawText({ rawText: text });

    return new Response(JSON.stringify({ text:  text, confidence }));
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }));
    }
    return new Response(JSON.stringify({ error: "Something went wrong" }));
  }
}
