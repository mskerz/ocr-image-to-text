import { createWorker, recognize } from "tesseract.js";

export enum Methods {
  FROM_FILE = "FILE",
  FROM_URL = "URL",
}

type Options = {
  method: Methods;
  image?: string | File;
};

class TesseractService {
  async getTextFromImage({ method, image }: Options) {
    switch (method) {
      case Methods.FROM_FILE:
        return this.getFromFile(image as File);
      case Methods.FROM_URL:
        return this.getFromUrl(image as string);
      default:
        throw new Error("Invalid method");
    }
  }

  private async recognize(image: string | File | Blob| Buffer) {
    try {
      const result = await recognize(image);
      return {
        text: result.data.text,
        confidence: result.data.confidence,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Something went wrong");
    }
  }

  public async getFromFile(file: File) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return this.recognize( buffer);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Something went wrong");
    }
  }

  public async getFromUrl(url: string) {
    try {
      return this.recognize(url);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Something went wrong");
    }
  }
}

const tesseract = new TesseractService();

export default tesseract;
