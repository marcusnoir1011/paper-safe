"use client";

import { useState } from "react";
import { X, Maximize, Maximize2 } from "lucide-react";

export function ImagePreview({ src, title }: { src: string; title: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div
        className="relative group cursor-zoom-in overflowoverflow-hidden h-48 w-full bg-slate-100"
        onClick={() => setIsExpanded(true)}
      >
        <img
          src={src}
          alt={title}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-balck/20 transition-colors felx items-center justify-center">
          <Maximize2
            className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
            size={24}
          />
        </div>
      </div>

      {isExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-10 duration-200"
          onClick={() => setIsExpanded(false)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2"
            onClick={() => setIsExpanded(false)}
          >
            <X size={32} />
          </button>

          <img
            src={src}
            alt={title}
            className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
          />

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 font-medium">
            {title}
          </div>
        </div>
      )}
    </>
  );
}
