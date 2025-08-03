import { FileValidFormType } from "@/form/file-valid-form";
import { UseFormReturn } from "react-hook-form";

interface OCRResult {
  text: string;
  confidence: number;
  processingTime: number;
}
interface OCRMethod {
  handleFileSelect?: (file: File) => void;
  handleDrop?: (e: React.DragEvent) => void;
  handleDragOver?: (e: React.DragEvent) => void;
  processOCR?: () => Promise<void>;
  copyToClipboard?: () => Promise<void>;
  downloadText?: () => void;
  clearAll: () => void;
  textStats?: {
    characters?: number;
    lines?: number;
  };
}

type OCRState = {
  imagePreview: string | null;
  isProcessing: boolean;
  progress: number;
  ocrResult: OCRResult | null;
  showPreview: boolean;
};

type OCRAction = {
  setImagePreview: (imagePreview: string | null) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setProgress: (progress: number) => void;
  setOcrResult: (ocrResult: OCRResult | null) => void;
  setShowPreview: (showPreview: boolean) => void;
};

interface OCRHookExport {
  file?: File;
  state?: OCRState;
  action?: OCRAction;
  method?: OCRMethod;
}
export type { OCRResult, OCRMethod, OCRState, OCRAction, OCRHookExport };
