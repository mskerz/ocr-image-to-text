import ai from "@/libs/gemini";
import tesseract, { Methods } from "@/libs/tessaract";

// POST /api/ocr-image
export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    const text = await tesseract.getTextFromImage({
      method: Methods.FROM_FILE,
      image: image as File,
    });

    const result = await ai.customizeRawText({ rawText: text });

    const TextResponse = result.text;

    return new Response(JSON.stringify({ text: TextResponse }));
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }));
    }
    return new Response(JSON.stringify({ error: "Something went wrong" }));
  }
}
