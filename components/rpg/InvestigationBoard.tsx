"use client";

import React from "react";
import { BackgroundImageTexture, TextureVariant } from "@/components/ui/bg-image-texture";
import StickerPeel from "@/components/ui/sticker-peel";

interface BoardProps {
  variant?: TextureVariant;
  opacity?: number;
}

interface CardData {
  id: string;
  name: string;
  image: string;
  positionClass: string;
}

// 📌 5 Personagens bem espaçados
const CARDS: CardData[] = [
  {
    id: "card-1",
    name: "Naomi Takeda",
    image: "/personagens/Naomi.jpg",
    positionClass: "top-[8%] left-[8%] -rotate-3",
  },
  {
    id: "card-2",
    name: "Jotham",
    image: "/personagens/Jothan.jpg",
    positionClass: "bottom-[8%] left-[8%] rotate-6",
  },
  {
    id: "card-3",
    name: "Sayo Kuroda",
    image: "/personagens/Sayo.jpg",
    positionClass: "top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2 rotate-2",
  },
  {
    id: "card-4",
    name: "Astrid",
    image: "/personagens/Astrid.jpg",
    positionClass: "top-[8%] right-[8%] -rotate-6",
  },
  {
    id: "card-5",
    name: "Voltaire Pryope",
    image: "/personagens/Voltaire.jpg",
    positionClass: "bottom-[8%] right-[8%] rotate-12",
  },
];

export function InvestigationBoard({
  variant = "groovepaper",
  opacity = 0.5,
}: BoardProps) {
  return (
    <div className="relative w-full rounded-2xl border-4 border-zinc-900 bg-zinc-950 shadow-[0_0_50px_rgba(0,0,0,0.95)] overflow-hidden">
      <BackgroundImageTexture variant={variant} opacity={opacity} className="p-6 md:p-10 min-h-[720px] relative">
        {/* Glow carmesim central + vinheta escurecida nas bordas */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(185,28,28,0.22)_0%,rgba(9,9,11,0.95)_85%)]" />

        {/* Moldura interna com brilho sutil */}
        <div className="absolute inset-3 border border-red-900/40 rounded-xl pointer-events-none shadow-[inset_0_0_35px_rgba(153,27,27,0.3)] z-10" />

        {/* Cantoneiras metálicas */}
        <div className="absolute top-5 left-5 w-4 h-4 border-t-2 border-l-2 border-red-800/80 pointer-events-none z-10" />
        <div className="absolute top-5 right-5 w-4 h-4 border-t-2 border-r-2 border-red-800/80 pointer-events-none z-10" />
        <div className="absolute bottom-5 left-5 w-4 h-4 border-b-2 border-l-2 border-red-800/80 pointer-events-none z-10" />
        <div className="absolute bottom-5 right-5 w-4 h-4 border-b-2 border-r-2 border-red-800/80 pointer-events-none z-10" />

        {/* 🔴 CORDAS DE LÃ VERMELHA */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="string-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0.6" dy="1.2" stdDeviation="0.8" floodColor="#000000" floodOpacity="0.9" />
            </filter>
          </defs>

          <g filter="url(#string-shadow)">
            {/* 🧵 1. Naomi Takeda -> Astrid */}
            <path d="M 21 21 Q 50 27 79 21" fill="none" stroke="#881337" strokeWidth="4" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            <path d="M 21 21 Q 50 27 79 21" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="6 3" vectorEffect="non-scaling-stroke" strokeLinecap="round" opacity="0.9" />

            {/* 🧵 2. Naomi Takeda -> Sayo Kuroda */}
            <path d="M 21 25 Q 32 37 45 44" fill="none" stroke="#881337" strokeWidth="4" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            <path d="M 21 25 Q 32 37 45 44" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5 2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" opacity="0.9" />

            {/* 🧵 3. Jothan -> Sayo Kuroda */}
            <path d="M 21 72 Q 32 60 45 52" fill="none" stroke="#881337" strokeWidth="4" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            <path d="M 21 72 Q 32 60 45 52" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5 2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" opacity="0.9" />

            {/* 🧵 4. Jothan -> Astrid (Curvando bem lá embaixo para ficar 100% visível) */}
            <path d="M 21 75 Q 50 92 79 25" fill="none" stroke="#881337" strokeWidth="4" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            <path d="M 21 75 Q 50 92 79 25" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="7 3" vectorEffect="non-scaling-stroke" strokeLinecap="round" opacity="0.9" />

            {/* 🧵 5. Sayo Kuroda -> Astrid */}
            <path d="M 55 44 Q 68 37 79 25" fill="none" stroke="#881337" strokeWidth="4" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            <path d="M 55 44 Q 68 37 79 25" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5 2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" opacity="0.9" />

            {/* 🧵 6. Sayo Kuroda -> Voltaire Pryope */}
            <path d="M 55 52 Q 68 61 79 72" fill="none" stroke="#881337" strokeWidth="4" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            <path d="M 55 52 Q 68 61 79 72" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="6 3" vectorEffect="non-scaling-stroke" strokeLinecap="round" opacity="0.9" />
          </g>
        </svg>

        {/* 📸 Fotos dos Personagens */}
        <div className="relative z-30 min-h-[640px] w-full">
          {CARDS.map((card) => (
            <div
              key={card.id}
              className={`absolute transition-transform duration-300 hover:scale-105 hover:z-40 ${card.positionClass}`}
            >
              <StickerPeel
                image={card.image}
                imageWidth={165}
                imageHeight={210}
              />
              <div className="mt-1.5 text-center bg-zinc-950/90 px-2.5 py-0.5 rounded border border-zinc-800 shadow-md">
                <span className="text-[11px] font-mono text-zinc-300 uppercase tracking-wider block font-semibold">
                  {card.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </BackgroundImageTexture>
    </div>
  );
}

export default InvestigationBoard;