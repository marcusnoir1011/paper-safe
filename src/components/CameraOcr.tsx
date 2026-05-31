"use client";

import { useEffect, useRef, useState } from "react";

import { Camera, RefreshCw, X } from "lucide-react";

import { worker } from "@/lib/tesseract";
import { parseJpBill } from "@/utility/parseJpBill";
import toast from "react-hot-toast/headless";

interface CameraOcrProps {
  onSuccess: (extractedAmount: string, extractedDate: string) => void;
}

export default function CameraOcr({ onSuccess }: CameraOcrProps) {
  const myVideo = useRef<HTMLVideoElement | null>(null);
  const myStream = useRef<MediaStream | null>(null);

  const [scanActive, setScanActive] = useState(false);
  const [processing, setProcessing] = useState(false);

  // video config
  // layout
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 360;
  const vidWidth = screenWidth - 48;
  const vidHeight = 380;

  // target indicator config
  const targetWidth = vidWidth - 100;
  const targetHeight = 260;

  useEffect(() => {
    if (!scanActive) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
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
    setProcessing(false);
  };

  // manual trigger of capture
  const captureAndScan = async () => {
    if (!myVideo.current || processing) return;
    setProcessing(true);

    const video = myVideo.current;
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // dynamic map
      const scaleX = video.videoWidth / video.offsetWidth;
      const scaleY = video.videoHeight / video.offsetHeight;

      // target frame set
      const sx = ((video.offsetWidth - targetWidth) / 2) * scaleX;
      const sy = ((video.offsetHeight - targetHeight) / 2) * scaleY;
      const sWidth = targetWidth * scaleX;
      const sHeight = targetHeight * scaleY;

      try {
        ctx.drawImage(
          video,
          sx,
          sy,
          sWidth,
          sHeight,
          0,
          0,
          targetWidth,
          targetHeight,
        );

        const {
          data: { text },
        } = await worker.recognize(canvas);

        console.log("Extracted OCR Text: \n", text);

        const { extractedAmount, extractedDate } = parseJpBill(text);
        onSuccess(extractedAmount || "", extractedDate || "");
        stopCamera();
      } catch (err) {
        console.error("OCR recognition error: ", err);
        toast.error("Could not extract clean text. Please try aligning again.");
      } finally {
        setProcessing(false);
      }
    }
  };

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
          <span className="font-sans text-sm font-semibold text-slate-900">
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
              style={{
                width: `${targetWidth}px`,
                height: `${targetHeight}px`,
              }}
              className={`
                  absolute border-2 border-dashed rounded-xl transition-colors duration-300 pointer-events-none ${
                    processing
                      ? "border-amber-400 bg-amber-500/10"
                      : "border-ink bg-transparent shadow[0_0_0_9999px_rbga(0,0,0,0.5)]"
                  }
                `}
            />
          </div>

          <div className="flex flex-col sm:flex-row w-full max-w-sm sm:max-w-none gap-3 items-stretch">
            <button
              onClick={captureAndScan}
              disabled={processing}
              className="flex flex-1 items-center justify-center font-sans text-sm font-bold bg-slate-900 text-white shadow-sm py-4 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-70"
            >
              {processing ? (
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
              disabled={processing}
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
