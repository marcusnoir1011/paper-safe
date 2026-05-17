"use client";

import { useEffect, useRef, useState } from "react";

import { Camera, VideoOff } from "lucide-react";

import { worker } from "@/lib/tesseract";
import { parseJpBill } from "@/utility/parseJpBill";

interface CameraOcrProps {
  onSuccess: (extractedAmount: string, extractedDate: string) => void;
}

export default function CameraOcr({ onSuccess }: CameraOcrProps) {
  const myVideo = useRef<HTMLVideoElement | null>(null);
  const myStream = useRef<MediaStream | null>(null);

  const [scanActive, setScanActive] = useState(false);

  // video config
  // const vidWidth = window.innerWidth - 60;
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 360;
  const vidWidth = screenWidth - 60;
  const vidHeight = 260;
  // const vidOffSetTop = 240;
  // const vidOffSetLeft = screenWidth / 2 - vidWidth / 2;

  // indicator config
  const marginX = 40;
  const indWidth = vidWidth - marginX;
  const indHeight = 80;
  // const indOffSetTop = vidOffSetTop + vidHeight / 2 - indHeight / 2;
  // const indOffSetLeft = screenWidth / 2 - indWidth / 2;

  const activeRef = useRef(scanActive);

  useEffect(() => {
    activeRef.current = scanActive;
  }, [scanActive]);

  useEffect(() => {
    if (!scanActive) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
          },
          audio: false,
        });

        myStream.current = stream;

        if (myVideo.current) {
          myVideo.current.srcObject = stream;
          await myVideo.current.play();
        }

        setTimeout(tick, 1000);
      } catch (err) {
        console.error(err);
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

  const tick = async () => {
    if (!scanActive) return;

    if (
      myVideo.current &&
      myVideo.current.readyState === myVideo.current.HAVE_ENOUGH_DATA
    ) {
      const canvas = document.createElement("canvas");
      canvas.width = indWidth;
      canvas.height = indHeight;

      const image = myVideo.current;

      // sourcwe
      const sx = marginX / 2 / 2;
      const sy = vidHeight - indHeight;
      const sWidth = indWidth * 2;
      const sHeight = indHeight * 2;

      // destination
      const dx = 0;
      const dy = 0;
      const dWidth = indWidth;
      const dHeight = indHeight;

      canvas
        .getContext("2d")
        ?.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

      // OCR
      try {
        const {
          data: { text },
        } = await worker.recognize(canvas);
        console.log("Live Capture: ", text);

        const { extractedAmount, extractedDate } = parseJpBill(text);
        if (extractedAmount || extractedDate) {
          onSuccess(extractedAmount, extractedAmount);
          stopCamera();
          return;
        }
      } catch (err) {
        console.error(err);
      }

      setTimeout(tick, 1000);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center w-full h-full group cursor-pointer">
      {!scanActive ? (
        <button
          onClick={() => setScanActive(true)}
          className="flex flex-col items-center gap-5 w-full h-full"
        >
          <div className="p-4 bg-bg-surface text-ink rounded-full group-hover:scale-110 transition-transform duration-200">
            <Camera size={32} />
          </div>
          <div>
            <p className="font-sans text-sm font-semibold text-slate-900">
              Scan Document Live
            </p>
          </div>
        </button>
      ) : (
        <div className="flex flex-col items-center text-center gap-3">
          <div className="relative w-45 h-25 rounded-2xl overflow-hidden border border-border-light bg-slate-900 flex items-center justify-center	">
            <video
              ref={myVideo}
              autoPlay
              muted
              playsInline
              width={vidWidth}
              height={vidHeight}
              className="object-cover w-full h-full"
            />
            <div
              className="absolute border bodrer-ink/80 rounded-md pointer-events-none bg-transparent"
              style={{
                width: indWidth,
                height: indHeight,
              }}
            />
          </div>

          <div className="spacy-y-1">
            <p className="font-sans text-xs font-semibold text-slate-900">
              Scanning Live Feed
            </p>
            <button
              onClick={() => setScanActive(false)}
              className="font-mono text-[10px] rounded-md p-1 border border-border-light bg-rose-200 text-rose-600 hover:text-rose-700 uppercase tracking-widest font-bold transition-colors block mx-auto"
            >
              Cancel Scan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
