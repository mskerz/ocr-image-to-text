import { FileValidForm, FileValidFormType } from "@/form/file-valid-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { OCRHookExport, OCRResult } from "@/type/ocr";

export function useOCR(): OCRHookExport {
  const form = useForm<FileValidFormType>({
    resolver: zodResolver(FileValidForm),
    mode: "onChange",
  });
  const file = form.watch("file");

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  const handleFileSelect = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.warning("Invalid file type. Please select an image file.");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.warning("File size is too large. Please select a smaller file.");
        return;
      }
      form.setValue("file", file, { shouldValidate: true });
      setOcrResult(null);

      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        toast.error("Error reading file.");
      }
    },
    [form]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const processOCR = useCallback(async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    const startTime = Date.now();

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      await new Promise((resolve) => setTimeout(resolve, 3000));

      clearInterval(progressInterval);
      setProgress(100);

      const mockText = ` 
        This mock shows how the extracted text would appear here.
        Multiple lines and paragraphs are preserved.
        Special characters and numbers: 123, @#$%
        `;

      const processingTime = Date.now() - startTime;

      setOcrResult({
        text: mockText,
        processingTime,
        confidence: 85 + Math.random() * 10,
      });
      toast.success("Text extracted successfully.");
    } catch (error) {
      toast.error([
        "OCR failed",
        error instanceof Error ? error.message : "Something went wrong",
      ]);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [file]);

  const copyToClipboard = async () => {
    if (!ocrResult?.text) return;

    try {
      await navigator.clipboard.writeText(ocrResult.text);
      toast.success("Text copied to clipboard");
    } catch {
      toast.error("Failed to copy text to clipboard");
    }
  };

  const downloadText = () => {
    if (!ocrResult?.text) return;

    const blob = new Blob([ocrResult.text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ocr-result-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const clearAll = () => {
    form.reset();
    setImagePreview(null);
    setOcrResult(null);
    setProgress(0);
    setShowPreview(true);
  };

  const textStats = useMemo(() => {
    if (!ocrResult?.text) return null;
    return {
      characters: ocrResult.text.length,
      lines: ocrResult.text.split("\n").length,
    };
  }, [ocrResult]);
  return {
    file,
    state: {
      imagePreview,
      isProcessing,
      progress,
      ocrResult,
      showPreview,
    },
    action: {
      setImagePreview,
      setIsProcessing,
      setProgress,
      setOcrResult,
      setShowPreview,
    },
    method: {
      handleFileSelect,
      handleDrop,
      handleDragOver,
      processOCR,
      copyToClipboard,
      downloadText,
      clearAll,
      textStats: textStats!,
    },
  };
}
