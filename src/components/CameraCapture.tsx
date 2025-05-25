
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, Square, RotateCcw } from 'lucide-react';
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

const CameraCapture = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
      }
      
      setStream(mediaStream);
      setIsStreaming(true);
      toast.success('Camera started successfully');
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Failed to access camera. Please check permissions.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsStreaming(false);
    setIsDetecting(false);
    setDetections([]);
    toast.info('Camera stopped');
  }, [stream]);

  const handleDetectionResults = useCallback((results: Detection[]) => {
    setDetections(results);
    
    // Draw detection boxes on canvas
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        results.forEach((detection) => {
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 3;
          ctx.strokeRect(detection.x, detection.y, detection.width, detection.height);
          
          // Draw confidence score
          ctx.fillStyle = '#3b82f6';
          ctx.font = '16px Arial';
          ctx.fillText(
            `${Math.round(detection.confidence * 100)}%`,
            detection.x,
            detection.y - 5
          );
        });
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="p-6">
          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              {!isStreaming ? (
                <Button
                  onClick={startCamera}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Start Camera
                </Button>
              ) : (
                <Button
                  onClick={stopCamera}
                  variant="destructive"
                  className="bg-red-500 hover:bg-red-600"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop Camera
                </Button>
              )}
              
              {isStreaming && (
                <Button
                  onClick={() => setIsDetecting(!isDetecting)}
                  className={`${
                    isDetecting 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  } text-white`}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {isDetecting ? 'Stop Detection' : 'Start Detection'}
                </Button>
              )}
            </div>
            
            {detections.length > 0 && (
              <div className="text-white">
                <span className="text-sm text-gray-300">Faces detected: </span>
                <span className="text-lg font-bold text-blue-300">{detections.length}</span>
              </div>
            )}
          </div>

          {/* Video Container */}
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-auto max-h-96 object-cover"
              autoPlay
              muted
              playsInline
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
              style={{ pointerEvents: 'none' }}
            />
            
            {!isStreaming && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Click "Start Camera" to begin</p>
                </div>
              </div>
            )}
          </div>

          {/* Face Detector Component */}
          {isStreaming && isDetecting && (
            <FaceDetector
              videoElement={videoRef.current}
              onDetection={handleDetectionResults}
              isActive={isDetecting}
            />
          )}
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

export default CameraCapture;
