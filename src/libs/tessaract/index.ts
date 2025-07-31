import Tesseract from "tesseract.js";

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

  private async recognize(image: string | File | Blob) {
    try {
      const result = await Tesseract.recognize(image, "eng+tha", {
        logger: (m) => console.log(m),
      });
      return result.data.text;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Something went wrong");
    }
  }

  public async getFromFile(file: File): Promise<string> {
    try {
      const imageBuffer = await file.arrayBuffer();
      const imageBlob = new Blob([imageBuffer]);

      return this.recognize(imageBlob);
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
