
import React, { useState, useRef, useCallback } from 'react';
import { Upload, Image as ImageIcon, Trash2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import FaceDetector from './FaceDetector';

interface Detection {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

const ImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage(e.target?.result as string);
          setImageFile(file);
          setDetections([]);
        };
        reader.readAsDataURL(file);
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Please select a valid image file');
      }
    }
  }, []);

  const handleDetectionResults = useCallback((results: Detection[]) => {
    setDetections(results);
    setIsAnalyzing(false);
    
    // Draw detection boxes on canvas
    if (canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current;
      const image = imageRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        results.forEach((detection) => {
          ctx.strokeStyle = '#8b5cf6';
          ctx.lineWidth = 4;
          ctx.strokeRect(detection.x, detection.y, detection.width, detection.height);
          
          // Draw confidence score
          ctx.fillStyle = '#8b5cf6';
          ctx.font = '20px Arial';
          ctx.fillText(
            `${Math.round(detection.confidence * 100)}%`,
            detection.x,
            detection.y - 8
          );
        });
      }
    }
    
    toast.success(`Detected ${results.length} face${results.length !== 1 ? 's' : ''}`);
  }, []);

  const analyzeImage = useCallback(() => {
    if (!selectedImage || !imageRef.current) return;
    
    setIsAnalyzing(true);
    toast.info('Analyzing image for faces...');
  }, [selectedImage]);

  const clearImage = useCallback(() => {
    setSelectedImage(null);
    setImageFile(null);
    setDetections([]);
    setIsAnalyzing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="p-6">
          {/* Upload Area */}
          {!selectedImage ? (
            <div 
              className="border-2 border-dashed border-white/30 rounded-lg p-12 text-center cursor-pointer hover:border-white/50 transition-colors duration-300"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-white mb-2">Upload an Image</h3>
              <p className="text-gray-400 mb-4">
                Click here or drag and drop an image to analyze faces
              </p>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                <ImageIcon className="w-4 h-4 mr-2" />
                Choose Image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Faces'}
                  </Button>
                  <Button
                    onClick={clearImage}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>
                
                {detections.length > 0 && (
                  <div className="text-white">
                    <span className="text-sm text-gray-300">Faces detected: </span>
                    <span className="text-lg font-bold text-purple-300">{detections.length}</span>
                  </div>
                )}
              </div>

              {/* Image Display */}
              <div className="relative bg-black rounded-lg overflow-hidden">
                <img
                  ref={imageRef}
                  src={selectedImage}
                  alt="Uploaded image"
                  className="w-full h-auto max-h-96 object-contain"
                  onLoad={() => {
                    if (canvasRef.current && imageRef.current) {
                      const canvas = canvasRef.current;
                      canvas.width = imageRef.current.naturalWidth;
                      canvas.height = imageRef.current.naturalHeight;
                    }
                  }}
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ pointerEvents: 'none' }}
                />
              </div>

              {/* Face Detector Component */}
              {isAnalyzing && (
                <FaceDetector
                  imageElement={imageRef.current}
                  onDetection={handleDetectionResults}
                  isActive={isAnalyzing}
                />
              )}
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Detection Results */}
      {detections.length > 0 && (
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Detection Results</h3>
            <div className="grid gap-3">
              {detections.map((detection, index) => (
                <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <div className="text-white">
                    <span className="font-medium">Face {index + 1}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-300">
                    <span>Confidence: {Math.round(detection.confidence * 100)}%</span>
                    <span>
                      Position: {Math.round(detection.x)}, {Math.round(detection.y)}
                    </span>
                    <span>
                      Size: {Math.round(detection.width)}x{Math.round(detection.height)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageUploader;
