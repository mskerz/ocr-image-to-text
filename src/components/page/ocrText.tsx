"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  FileImage,
  Copy,
  Download,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface OCRResult {
  text: string;
  confidence: number;
  processingTime: number;
}

export default function OCRPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.warning("Invalid file type. Please select an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.warning("File size is too large. Please select a smaller file.");
      return;
    }

    setSelectedFile(file);
    setOcrResult(null);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Error reading file.");
    }
  }, []);

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

  const processOCR = async () => {
    if (!selectedFile) return;

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
        confidence: 85 + Math.random() * 10,
        processingTime,
      });

      toast.success("OCR completed");
    } catch (error) {
      toast.error([
        "OCR failed",
        error instanceof Error ? error.message : "Something went wrong",
      ]);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

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
    setSelectedFile(null);
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

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold  ">OCR Text Extractor</h1>
          <p className="">
            Image-to-text conversion powered by OCR, with smart customization
            using Gemini AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Image
              </CardTitle>
              <CardDescription>
                Drag and drop an image or click to select. Supports PNG, JPG,
                JPEG, GIF, BMP, WEBP
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedFile ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-2 border-dashed   rounded-lg p-8 text-center   transition-colors cursor-pointer"
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  <FileImage className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">
                    Drop your image here or click to browse
                  </p>
                  <p className="text-sm ">Maximum file size: 10MB</p>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files?.[0] && handleFileSelect(e.target.files[0])
                    }
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileImage className="w-5 h-5 text-green-600" />
                      <span className="font-medium">{selectedFile.name}</span>
                      <Badge variant="secondary">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPreview(!showPreview)}
                      >
                        {showPreview ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button variant="outline" size="sm" onClick={clearAll}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {showPreview && imagePreview && (
                    <div className="border rounded-lg overflow-hidden">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt={selectedFile?.name || "Image preview"}
                        className="w-full h-48 object-contain bg-gray-50"
                        width={500}
                        height={500}
                        priority

                      />
                    </div>
                  )}

                  <Button
                 
                    onClick={processOCR}
                    disabled={isProcessing}
                    className="w-full bg-muted hover:bg-muted/80 transition-all duration-300"
                  >
                    {isProcessing ? "Processing..." : "Extract Text"}
                  </Button>

                  {isProcessing && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Processing image...</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress  value={progress} />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle>Extracted Text</CardTitle>
              <CardDescription>
                {ocrResult
                  ? `Confidence: ${ocrResult.confidence.toFixed(
                      1
                    )}% • Processing time: ${(
                      ocrResult.processingTime / 1000
                    ).toFixed(1)}s`
                  : "Text will appear here after processing"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {ocrResult ? (
                <>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadText}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <Separator />
                  <Textarea
                    value={ocrResult.text}
                    onChange={(e) =>
                      setOcrResult((prev) =>
                        prev ? { ...prev, text: e.target.value } : null
                      )
                    }
                    className="min-h-[300px] font-mono text-sm"
                    placeholder="Extracted text will appear here..."
                  />
                  {textStats && (
                    <div className="text-xs text-gray-500">
                      {textStats.characters} characters • {textStats.lines}{" "}
                      lines
                    </div>
                  )}
                </>
              ) : (
                <div className="h-[300px] border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <FileImage className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Upload an image to extract text</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <p className="font-medium text-md">Supported Formats</p>
                <p className="text-gray-600">PNG, JPG, JPEG, GIF, BMP, WEBP</p>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-md">Multiple Languages</p>
                <p className="text-gray-600">
                  English and other languages supported
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-md">High Accuracy</p>
                <p className="text-gray-600">
                  Advanced OCR engine with confidence scoring
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
