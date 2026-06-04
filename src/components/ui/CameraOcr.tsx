"use client";

import { useEffect, useRef, useState } from "react";

import { Camera, RefreshCw, X } from "lucide-react";

import { worker } from "@/lib/tesseract";
import { parseJpBill } from "@/lib/utility/parseJpBill";
import toast from "react-hot-toast/headless";
import { blob } from "node:stream/consumers";

interface CameraOcrProps {
  onCapture: (imageBlob: Blob, fileName: string) => void;
  processingFromParent: boolean;
}

export default function CameraOcr({
  onCapture,
  processingFromParent,
}: CameraOcrProps) {
  const myVideo = useRef<HTMLVideoElement | null>(null);
  const myStream = useRef<MediaStream | null>(null);

  const [scanActive, setScanActive] = useState(false);

  // video config
  // layout
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 360;
  const vidWidth = screenWidth - 48;
  const vidHeight = 380;

  useEffect(() => {
    if (!scanActive) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 720 },
            height: { ideal: 1280 },
          },
          audio: false,
        });

        myStream.current = stream;

        if (myVideo.current) {
          myVideo.current.srcObject = stream;
          await myVideo.current.play();
        }
      } catch (err) {
        console.error("Camera access failed: ", err);
        toast.error("Could not access camera device.");
      }
    };

    startCamera();

    return () => {
      stopCamera();
    };
  }, [scanActive]);

  const stopCamera = () => {
    if (myStream.current) {
      myStream.current.getTracks().forEach((track) => track.stop());
      myStream.current = null;
    }
    setScanActive(false);
  };

  const captureAndScan = async () => {
    if (!myVideo.current || processingFromParent) return;

    const video = myVideo.current;

    const width = video.videoWidth || video.clientWidth || 720;
    const height = video.videoHeight || video.clientHeight || 1280;

    if (width === 0 || height === 0) {
      console.error("Video Dimensions are 0. Stream might not be ready.");
      toast.error("Camera is still warming up. Please try again.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error("Could not get 2D context from canvas.");
      toast.error("Failed to process image frame.");
      return;
    }

    try {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const generatedName = `camera-capture-${Date.now()}.jpg`;
            onCapture(blob, generatedName);
            stopCamera();
          }
        },
        "image/jpeg",
        0.95,
      );
    } catch (err) {
      console.error("OCR recognition error: ", err);
      toast.error(
        "Could not extract clean text. Please try holding the document closer.",
      );
    }
  };

  const isWorking = processingFromParent;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {!scanActive ? (
        <button
          onClick={() => setScanActive(true)}
          className="flex flex-col items-center gap-5 w-full group py-6"
        >
          <div className="p-4 bg-slate-100 text-ink rounded-full group-hover:scale-110 transition-transform duration-200">
            <Camera size={32} />
          </div>
          <span className="font-sans text-md font-semibold text-slate-900">
            Scan via Camera
          </span>
        </button>
      ) : (
        <div className="w-full flex flex-col items-center gap-4">
          <div
            style={{
              width: "100%",
              maxWidth: `${vidWidth}px`,
              height: `${vidHeight}px`,
            }}
            className="relative flex items-center justify-center rounded-2xl overflow-hidden border border-border-light bg-slate-950 shadow-inner"
          >
            <video
              ref={myVideo}
              autoPlay
              muted
              playsInline
              className="object-cover w-full h-full"
            />
            <div
              className={`
                  absolute inset-6 border-2 border-dashed rounded-xl transition-colors duration-300 pointer-events-none ${
                    isWorking
                      ? "border-amber-400 bg-amber-500/10"
                      : "border-slate-400/40 bg-transparent"
                  }
                `}
            />
          </div>

          <div className="flex flex-col sm:flex-row w-full max-w-sm sm:max-w-none gap-3 items-stretch">
            <button
              onClick={captureAndScan}
              disabled={isWorking}
              className="flex flex-1 items-center justify-center font-sans text-sm font-bold bg-slate-900 text-white shadow-sm py-4 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-70"
            >
              {isWorking ? (
                <div className="gap-2 flex items-center justify-center">
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Reading document...</span>
                </div>
              ) : (
                <div className="gap-2 flex items-center justify-center">
                  <Camera size={16} />
                  <span>Capture & Scan</span>
                </div>
              )}
            </button>
            <button
              onClick={stopCamera}
              disabled={isWorking}
              className="flex justify-center items-center py-4 px-5 rounded-xl border border-border-light bg-surface text-slate-500 hover:ink transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
