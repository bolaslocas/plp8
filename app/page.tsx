"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Download, FileCode, Info } from "lucide-react"
import pako from "pako"

interface DecompressionResult {
  fileName: string
  originalSize: number
  decompressedSize: number
  compressionRatio: string
  method: string
  success: boolean
  data?: Uint8Array
  error?: string
}

export default function DecompressionApp() {
  const [results, setResults] = useState<DecompressionResult[]>([])
  const [loading, setLoading] = useState(false)

  const detectCompressionMethod = (data: Uint8Array): string => {
    // Check for gzip magic number (1f 8b)
    if (data[0] === 0x1f && data[1] === 0x8b) {
      return "GZIP"
    }
    // Check for zlib magic number (78 01, 78 9c, 78 da)
    if (data[0] === 0x78 && (data[1] === 0x01 || data[1] === 0x9c || data[1] === 0xda)) {
      return "ZLIB"
    }
    // Default to raw deflate
    return "DEFLATE"
  }

  const decompressFile = async (file: File): Promise<DecompressionResult> => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const compressedData = new Uint8Array(arrayBuffer)
      let method = detectCompressionMethod(compressedData)

      let decompressedData: Uint8Array

      // Try different decompression methods
      try {
        if (method === "GZIP") {
          decompressedData = pako.ungzip(compressedData)
        } else if (method === "ZLIB") {
          decompressedData = pako.inflate(compressedData)
        } else {
          decompressedData = pako.inflateRaw(compressedData)
        }
      } catch (e) {
        // If detection failed, try all methods
        try {
          decompressedData = pako.ungzip(compressedData)
          method = "GZIP"
        } catch {
          try {
            decompressedData = pako.inflate(compressedData)
            method = "ZLIB"
          } catch {
            decompressedData = pako.inflateRaw(compressedData)
            method = "DEFLATE"
          }
        }
      }

      const compressionRatio = ((1 - compressedData.length / decompressedData.length) * 100).toFixed(2)

      return {
        fileName: file.name,
        originalSize: compressedData.length,
        decompressedSize: decompressedData.length,
        compressionRatio: `${compressionRatio}%`,
        method,
        success: true,
        data: decompressedData,
      }
    } catch (error) {
      return {
        fileName: file.name,
        originalSize: 0,
        decompressedSize: 0,
        compressionRatio: "0%",
        method: "UNKNOWN",
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setLoading(true)
    const newResults: DecompressionResult[] = []

    for (const file of Array.from(files)) {
      const result = await decompressFile(file)
      newResults.push(result)
    }

    setResults(newResults)
    setLoading(false)
  }

  const downloadDecompressed = (result: DecompressionResult) => {
    if (!result.data) return

    const blob = new Blob([result.data], { type: "application/octet-stream" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = result.fileName.replace(".bin", "_decompressed.bin")
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getJavaCode = (method: string) => {
    const codes = {
      GZIP: `import java.io.*;
import java.util.zip.GZIPInputStream;

public class GzipDecompressor {
    public static byte[] decompress(byte[] compressed) throws IOException {
        ByteArrayInputStream bis = new ByteArrayInputStream(compressed);
        GZIPInputStream gis = new GZIPInputStream(bis);
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        
        byte[] buffer = new byte[1024];
        int len;
        while ((len = gis.read(buffer)) != -1) {
            bos.write(buffer, 0, len);
        }
        
        gis.close();
        bos.close();
        return bos.toByteArray();
    }
    
    public static void decompressFile(String inputPath, String outputPath) 
            throws IOException {
        FileInputStream fis = new FileInputStream(inputPath);
        GZIPInputStream gis = new GZIPInputStream(fis);
        FileOutputStream fos = new FileOutputStream(outputPath);
        
        byte[] buffer = new byte[1024];
        int len;
        while ((len = gis.read(buffer)) != -1) {
            fos.write(buffer, 0, len);
        }
        
        gis.close();
        fos.close();
    }
}`,
      ZLIB: `import java.io.*;
import java.util.zip.InflaterInputStream;

public class ZlibDecompressor {
    public static byte[] decompress(byte[] compressed) throws IOException {
        ByteArrayInputStream bis = new ByteArrayInputStream(compressed);
        InflaterInputStream iis = new InflaterInputStream(bis);
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        
        byte[] buffer = new byte[1024];
        int len;
        while ((len = iis.read(buffer)) != -1) {
            bos.write(buffer, 0, len);
        }
        
        iis.close();
        bos.close();
        return bos.toByteArray();
    }
    
    public static void decompressFile(String inputPath, String outputPath) 
            throws IOException {
        FileInputStream fis = new FileInputStream(inputPath);
        InflaterInputStream iis = new InflaterInputStream(fis);
        FileOutputStream fos = new FileOutputStream(outputPath);
        
        byte[] buffer = new byte[1024];
        int len;
        while ((len = iis.read(buffer)) != -1) {
            fos.write(buffer, 0, len);
        }
        
        iis.close();
        fos.close();
    }
}`,
      DEFLATE: `import java.io.*;
import java.util.zip.Inflater;
import java.util.zip.DataFormatException;

public class DeflateDecompressor {
    public static byte[] decompress(byte[] compressed) 
            throws DataFormatException {
        Inflater inflater = new Inflater(true); // true for raw deflate
        inflater.setInput(compressed);
        
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        
        while (!inflater.finished()) {
            int count = inflater.inflate(buffer);
            bos.write(buffer, 0, count);
        }
        
        inflater.end();
        return bos.toByteArray();
    }
    
    public static void decompressFile(String inputPath, String outputPath) 
            throws IOException, DataFormatException {
        byte[] compressed = java.nio.file.Files.readAllBytes(
            java.nio.file.Paths.get(inputPath)
        );
        byte[] decompressed = decompress(compressed);
        java.nio.file.Files.write(
            java.nio.file.Paths.get(outputPath), 
            decompressed
        );
    }
}`,
    }
    return codes[method as keyof typeof codes] || "No code available"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-balance">Phaser Game Binary Decompressor</h1>
          <p className="text-muted-foreground text-lg">
            Decompress game.bin and assets.bin files from your Phaser project
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Binary Files
            </CardTitle>
            <CardDescription>Select one or more .bin files to decompress and analyze</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <Label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">.bin files (game.bin, assets.bin)</p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".bin"
                    multiple
                    onChange={handleFileUpload}
                    disabled={loading}
                  />
                </Label>
              </div>

              {loading && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>Processing files... Please wait.</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((result, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{result.fileName}</span>
                    {result.success && (
                      <Button onClick={() => downloadDecompressed(result)} size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result.success ? (
                    <Tabs defaultValue="info" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="info">
                          <Info className="h-4 w-4 mr-2" />
                          Information
                        </TabsTrigger>
                        <TabsTrigger value="java">
                          <FileCode className="h-4 w-4 mr-2" />
                          Java Code
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="info" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-muted-foreground">Compression Method</Label>
                            <p className="text-2xl font-bold">{result.method}</p>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-muted-foreground">Compression Ratio</Label>
                            <p className="text-2xl font-bold">{result.compressionRatio}</p>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-muted-foreground">Original Size</Label>
                            <p className="text-lg">{(result.originalSize / 1024).toFixed(2)} KB</p>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-muted-foreground">Decompressed Size</Label>
                            <p className="text-lg">{(result.decompressedSize / 1024).toFixed(2)} KB</p>
                          </div>
                        </div>

                        <div className="space-y-2 pt-4 border-t">
                          <Label className="text-lg font-semibold">Compression Details</Label>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            {result.method === "GZIP" && (
                              <>
                                <p>
                                  <strong>Format:</strong> GZIP (RFC 1952)
                                </p>
                                <p>
                                  <strong>Magic Number:</strong> 0x1f 0x8b
                                </p>
                                <p>
                                  <strong>Algorithm:</strong> DEFLATE compression
                                </p>
                                <p>
                                  <strong>Features:</strong> Includes CRC32 checksum and file metadata
                                </p>
                              </>
                            )}
                            {result.method === "ZLIB" && (
                              <>
                                <p>
                                  <strong>Format:</strong> ZLIB (RFC 1950)
                                </p>
                                <p>
                                  <strong>Magic Number:</strong> 0x78 0x01/0x9c/0xda
                                </p>
                                <p>
                                  <strong>Algorithm:</strong> DEFLATE compression with wrapper
                                </p>
                                <p>
                                  <strong>Features:</strong> Includes Adler-32 checksum
                                </p>
                              </>
                            )}
                            {result.method === "DEFLATE" && (
                              <>
                                <p>
                                  <strong>Format:</strong> Raw DEFLATE (RFC 1951)
                                </p>
                                <p>
                                  <strong>Magic Number:</strong> None (raw stream)
                                </p>
                                <p>
                                  <strong>Algorithm:</strong> LZ77 + Huffman coding
                                </p>
                                <p>
                                  <strong>Features:</strong> No wrapper, pure compression stream
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="java" className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-lg font-semibold">Java Implementation for {result.method}</Label>
                          <p className="text-sm text-muted-foreground">
                            Use this code to decompress {result.method} files in Java
                          </p>
                        </div>
                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs">
                          <code>{getJavaCode(result.method)}</code>
                        </pre>
                        <div className="space-y-2 text-sm">
                          <Label className="font-semibold">Usage Example:</Label>
                          <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                            {`// Decompress from byte array
byte[] compressed = Files.readAllBytes(Paths.get("game.bin"));
byte[] decompressed = ${result.method === "GZIP" ? "GzipDecompressor" : result.method === "ZLIB" ? "ZlibDecompressor" : "DeflateDecompressor"}.decompress(compressed);

// Or decompress file directly
${result.method === "GZIP" ? "GzipDecompressor" : result.method === "ZLIB" ? "ZlibDecompressor" : "DeflateDecompressor"}.decompressFile("game.bin", "game_decompressed.bin");`}
                          </pre>
                        </div>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <Alert variant="destructive">
                      <AlertDescription>Failed to decompress: {result.error}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>About This Tool</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              This decompression tool is specifically designed for Phaser game binary files. It automatically detects
              and decompresses GZIP, ZLIB, and raw DEFLATE formats.
            </p>
            <p>
              The tool provides detailed information about the compression method used and includes Java implementation
              examples for integrating the same decompression logic into your Java applications.
            </p>
            <p className="font-semibold text-foreground">
              Supported formats: GZIP (RFC 1952), ZLIB (RFC 1950), DEFLATE (RFC 1951)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
