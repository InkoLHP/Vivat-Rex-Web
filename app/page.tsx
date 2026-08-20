"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import InvestigationBoard from "@/components/rpg/InvestigationBoard";

export default function Home() {
  const [activeTab, setActiveTab] = useState("personagens");

  return (
    <div className="relative min-h-screen text-[#FAF4ED] font-serif selection:bg-[#943C36] selection:text-[#FAF4ED] overflow-x-hidden bg-[#0a0203]">
      
      {/* 📄 Fundo da imagem rotacionado em 90° (Deitado) e sem repetição */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vh] h-[100vw] rotate-90 bg-cover bg-center bg-no-repeat opacity-90"
          style={{ backgroundImage: `url('/textures/paper-bg.jpg')` }}
        />
        {/* Tonalização leve em vinho para casar com as cores do menu */}
        <div className="absolute inset-0 bg-[#120406]/25 mix-blend-multiply" />
      </div>

      {/* Conteúdo da Página */}
      <div className="flex flex-col md:flex-row min-h-screen relative z-10">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* Cabeçalho */}
            <div className="border-b border-[#702D28]/60 pb-4 mb-8 flex justify-between items-end relative">
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#D86252] via-[#702D28] to-transparent pointer-events-none" />

              <div>
                <span className="text-[11px] font-mono text-[#D86252] uppercase tracking-[0.2em] font-bold block mb-1">
                  1943 • Vampire: The Masquerade
                </span>
                <h2 className="text-3xl font-serif font-black capitalize tracking-wider text-[#FAF4ED] drop-shadow-md">
                  {activeTab}
                </h2>
              </div>
              <span className="text-xs font-serif italic text-[#FAF4ED]/80 tracking-widest hidden sm:inline">
                "Vida Longa ao Rei"
              </span>
            </div>

            {/* Conteúdo Principal */}
            {activeTab === "personagens" ? (
              <InvestigationBoard opacity={0.06} />
            ) : (
              <div className="min-h-[500px] border border-[#702D28]/70 rounded-xl p-8 flex flex-col items-center justify-center text-[#FAF4ED] font-serif text-sm bg-[#160507]/85 backdrop-blur-sm relative overflow-hidden shadow-2xl">
                <div className="absolute inset-2 border border-[#702D28]/40 rounded-lg pointer-events-none" />
                <span className="text-[#D86252] text-base font-bold mb-2 tracking-widest uppercase">📜 Documento Selado</span>
                <p className="font-mono text-xs text-[#FAF4ED]/60 uppercase tracking-widest">
                  [ Arquivo confidencial da aba "{activeTab}" ]
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}