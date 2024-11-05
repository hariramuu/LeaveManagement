import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { Loader2 } from 'lucide-react';

interface Props {
  onVerified: () => void;
}

export function FaceRecognition({ onVerified }: Props) {
  const webcamRef = useRef<Webcam>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      ]);
      setIsLoading(false);
    };
    loadModels();
  }, []);

  const handleVerification = async () => {
    if (isVerifying || !webcamRef.current) return;
    setIsVerifying(true);
    
    try {
      const image = webcamRef.current.getScreenshot();
      if (image) {
        // In a real app, you'd compare this with stored face data
        // For demo, we'll just simulate verification
        await new Promise((resolve) => setTimeout(resolve, 2000));
        onVerified();
      }
    } catch (error) {
      console.error('Face verification failed:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading face recognition...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          className="w-[400px] h-[300px] object-cover"
        />
      </div>
      <button
        onClick={handleVerification}
        disabled={isVerifying}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {isVerifying ? (
          <span className="flex items-center">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Verifying...
          </span>
        ) : (
          'Verify Face'
        )}
      </button>
    </div>
  );
}