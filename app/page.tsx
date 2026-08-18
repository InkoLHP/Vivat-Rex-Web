"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import InvestigationBoard from "@/components/rpg/InvestigationBoard";
import { BackgroundImageTexture } from "@/components/ui/bg-image-texture";

export default function Home() {
  const [activeTab, setActiveTab] = useState("personagens");

  return (
    <BackgroundImageTexture
      variant="groovepaper"
      opacity={0.20}
      className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-red-900 selection:text-white relative"
    >
      <div className="fixed inset-0 pointer-events-none z-50 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_50%,rgba(0,0,0,0.45)_100%)]" />

      <div className="flex flex-col md:flex-row min-h-screen relative z-10">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="border-b border-zinc-800 pb-4 mb-8 flex justify-between items-end">
              <div>
                <span className="text-xs font-mono text-red-500 uppercase tracking-widest">
                  1943 • VAMPIRE THE MASQUERADE
                </span>
                <h2 className="text-3xl font-serif font-bold capitalize text-zinc-100">
                  {activeTab}
                </h2>
              </div>
              <span className="text-xs font-mono text-zinc-500">VIDA LONGA AO REI</span>
            </div>

            {activeTab === "personagens" ? (
              <InvestigationBoard />
            ) : (
              <div className="min-h-[500px] border border-dashed border-zinc-800 rounded-lg p-8 flex items-center justify-center text-zinc-500 font-mono text-sm bg-zinc-900/40 backdrop-blur-sm">
                [ Arquivo secreto da aba "{activeTab}" ]
              </div>
            )}
          </div>
        </main>
      </div>
    </BackgroundImageTexture>
  );
}