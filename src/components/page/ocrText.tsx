"use client";

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
import Image from "next/image";
import { useOCR } from "@/hooks/use-ocr";

export default function OCRPage() {
  const { state, action, method } = useOCR();

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold">OCR Text Extractor</h1>
          <p>
            Image-to-text conversion powered by OCR (Tesseract) 
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
              {!state?.selectedFile ? (
                <div
                  onDrop={method?.handleDrop}
                  onDragOver={method?.handleDragOver}
                  className="border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer"
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  <FileImage className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">
                    Drop your image here or click to browse
                  </p>
                  <p className="text-sm">Maximum file size: 10MB</p>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      const handler = method?.handleFileSelect;

                      if (file && typeof handler === "function") {
                        handler(file);
                      }
                    }}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileImage className="w-5 h-5 text-green-600" />
                      <span className="font-medium">
                        {state?.selectedFile.name}
                      </span>
                      <Badge variant="secondary">
                       {state?.selectedFile?.size != null
  ? (state.selectedFile.size / 1024 / 1024).toFixed(2) + " MB"
  : "N/A"}

                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          action?.setShowPreview(!state?.showPreview)
                        }
                      >
                        {state?.showPreview ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={method?.clearAll}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {state?.showPreview && state?.imagePreview && (
                    <div className="border rounded-lg overflow-hidden">
                      <Image
                        src={state.imagePreview}
                        alt={state?.selectedFile.name}
                        className="w-full h-48 object-contain bg-gray-50"
                        width={500}
                        height={500}
                        priority
                      />
                    </div>
                  )}

                  <Button
                    onClick={method?.processOCR}
                    disabled={state?.isProcessing}
                    className="w-full bg-muted hover:bg-muted/80 transition-all duration-300"
                  >
                    {state?.isProcessing ? "Processing..." : "Extract Text"}
                  </Button>

                  {state?.isProcessing && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Processing image...</span>
                        <span>{Math.round(state?.progress)}%</span>
                      </div>
                      <Progress value={state?.progress} />
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
                {state?.ocrResult
                  ? `Confidence: ${
                      state.ocrResult.confidence?.toFixed(1) ?? "N/A"
                    }% • Processing time: ${
                      state.ocrResult.processingTime !== undefined
                        ? (state.ocrResult.processingTime / 1000).toFixed(1)
                        : "N/A"
                    }s`
                  : "Text will appear here after processing"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {state?.ocrResult ? (
                <>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={method?.copyToClipboard}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={method?.downloadText}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <Separator />
                  <Textarea
                    value={state?.ocrResult.text}
                    onChange={(e) =>
                      state?.ocrResult &&
                      action?.setOcrResult({
                        ...state.ocrResult,
                        text: e.target.value,
                      })
                    }
                    className="min-h-[300px] font-mono text-sm"
                    placeholder="Extracted text will appear here..."
                  />
                  {method?.textStats && (
                    <div className="text-xs text-gray-500">
                      {method.textStats.characters} characters •{" "}
                      {method.textStats.lines} lines
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
