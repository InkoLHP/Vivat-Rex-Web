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
  opacity = 0.08,
}: BoardProps) {
  return (
    <div className="relative w-full rounded-2xl border-2 border-[#702D28]/80 bg-[#120406]/70 backdrop-blur-xs shadow-[0_10px_35px_rgba(0,0,0,0.8)] overflow-hidden">
      <BackgroundImageTexture variant={variant} opacity={opacity} className="p-6 md:p-10 min-h-[720px] relative">

        {/* Moldura interna */}
        <div className="absolute inset-3 border border-[#702D28]/40 rounded-xl pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.6)] z-10" />

        {/* Cantoneiras ornadas em tom vermelho vivo */}
        <div className="absolute top-5 left-5 w-4 h-4 border-t-2 border-l-2 border-[#D86252] pointer-events-none z-10" />
        <div className="absolute top-5 right-5 w-4 h-4 border-t-2 border-r-2 border-[#D86252] pointer-events-none z-10" />
        <div className="absolute bottom-5 left-5 w-4 h-4 border-b-2 border-l-2 border-[#D86252] pointer-events-none z-10" />
        <div className="absolute bottom-5 right-5 w-4 h-4 border-b-2 border-r-2 border-[#D86252] pointer-events-none z-10" />

        {/* 🔴 Cordas da teia de investigação */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="string-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0.6" dy="1.2" stdDeviation="0.8" floodColor="#000000" floodOpacity="0.8" />
            </filter>
          </defs>

          <g filter="url(#string-shadow)">
            <path d="M 21 21 Q 50 27 79 21" fill="none" stroke="#3A080C" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            <path d="M 21 21 Q 50 27 79 21" fill="none" stroke="#E63946" strokeWidth="2" strokeDasharray="6 3" vectorEffect="non-scaling-stroke" strokeLinecap="round" />

            <path d="M 21 25 Q 32 37 45 44" fill="none" stroke="#3A080C" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            <path d="M 21 25 Q 32 37 45 44" fill="none" stroke="#E63946" strokeWidth="2" strokeDasharray="5 2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" />

            <path d="M 21 72 Q 32 60 45 52" fill="none" stroke="#3A080C" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            <path d="M 21 72 Q 32 60 45 52" fill="none" stroke="#E63946" strokeWidth="2" strokeDasharray="5 2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" />

            <path d="M 21 75 Q 50 92 79 25" fill="none" stroke="#3A080C" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            <path d="M 21 75 Q 50 92 79 25" fill="none" stroke="#E63946" strokeWidth="2" strokeDasharray="7 3" vectorEffect="non-scaling-stroke" strokeLinecap="round" />

            <path d="M 55 44 Q 68 37 79 25" fill="none" stroke="#3A080C" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            <path d="M 55 44 Q 68 37 79 25" fill="none" stroke="#E63946" strokeWidth="2" strokeDasharray="5 2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" />

            <path d="M 55 52 Q 68 61 79 72" fill="none" stroke="#3A080C" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            <path d="M 55 52 Q 68 61 79 72" fill="none" stroke="#E63946" strokeWidth="2" strokeDasharray="6 3" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
          </g>
        </svg>

        {/* 📸 Cartões dos Personagens */}
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
              <div className="mt-2 text-center bg-[#18080a] px-3 py-1.5 rounded border border-[#702D28] shadow-md">
                <span className="text-[11px] font-serif tracking-widest text-[#FAF4ED] uppercase block font-bold">
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