
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Upload, Play, Square, User, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import FaceDetector from '@/components/FaceDetector';
import ImageUploader from '@/components/ImageUploader';
import CameraCapture from '@/components/CameraCapture';

const Index = () => {
  const [activeMode, setActiveMode] = useState<'camera' | 'upload' | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-8 shadow-2xl">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Face Recognition
            <span className="block text-3xl md:text-4xl font-light text-blue-300 mt-2">
              Powered by AI
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Advanced face detection and recognition system using cutting-edge machine learning technology
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        {/* Mode Selection */}
        {!activeMode && (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card 
              className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group"
              onClick={() => setActiveMode('camera')}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">Live Camera</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-300 mb-6">
                  Use your webcam for real-time face detection and recognition
                </p>
                <div className="flex items-center justify-center text-blue-300">
                  <Play className="w-4 h-4 mr-2" />
                  Start Detection
                </div>
              </CardContent>
            </Card>

            <Card 
              className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group"
              onClick={() => setActiveMode('upload')}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">Upload Image</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-300 mb-6">
                  Upload photos to detect and analyze faces in images
                </p>
                <div className="flex items-center justify-center text-purple-300">
                  <Zap className="w-4 h-4 mr-2" />
                  Analyze Image
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Active Components */}
        {activeMode && (
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white flex items-center">
                {activeMode === 'camera' ? (
                  <>
                    <Camera className="w-6 h-6 mr-3" />
                    Live Camera Detection
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6 mr-3" />
                    Image Analysis
                  </>
                )}
              </h2>
              <Button
                onClick={() => setActiveMode(null)}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Back to Menu
              </Button>
            </div>

            {activeMode === 'camera' && (
              <CameraCapture />
            )}

            {activeMode === 'upload' && (
              <ImageUploader />
            )}
          </div>
        )}

        {/* Features Section */}
        {!activeMode && (
          <div className="mt-20 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Advanced Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Real-time Processing</h3>
                <p className="text-gray-400">
                  Instant face detection with live camera feed processing
                </p>
              </div>
              <div className="text-center group">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Multiple Faces</h3>
                <p className="text-gray-400">
                  Detect and analyze multiple faces in a single image
                </p>
              </div>
              <div className="text-center group">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Square className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">High Accuracy</h3>
                <p className="text-gray-400">
                  State-of-the-art ML models for precise face recognition
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
