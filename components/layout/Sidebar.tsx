"use client";

import React, { useState } from "react";
import { BookOpen, Users, Map, FolderGit2, Play, Pause, Volume2, VolumeX } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const menuItems = [
    { id: "historiamundo", label: "História", icon: BookOpen },
    { id: "personagens", label: "Personagens", icon: Users },
    { id: "mapa", label: "Mapa", icon: Map },
    { id: "arquivos", label: "Arquivos", icon: FolderGit2 },
  ];

  return (
    <aside className="w-full md:w-72 bg-[#18080a] border-b md:border-b-0 md:border-r border-[#702D28]/50 p-6 flex flex-col justify-between min-h-screen text-[#FAF4ED] select-none shadow-[5px_0_25px_rgba(0,0,0,0.5)] z-40 relative">
      {/* Marca */}
      <div className="space-y-8">
        <div className="relative">
          <h1 className="text-3xl font-serif font-black tracking-widest text-[#FAF4ED]">
            Vivat <span className="text-[#D86252] drop-shadow-[0_2px_10px_rgba(216,98,82,0.4)]">Rex</span>
          </h1>
          <p className="text-[10px] font-mono text-[#D86252] uppercase tracking-[0.25em] mt-1.5 border-l-2 border-[#702D28] pl-2.5 font-bold">
            Crônicas da Noite
          </p>
          <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-[#D86252] via-[#702D28] to-transparent" />
        </div>

        {/* Navegação */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-all duration-300 font-serif text-sm tracking-wide ${
                  isActive
                    ? "bg-[#702D28]/80 text-[#FAF4ED] border-l-4 border-[#D86252] font-bold shadow-[inset_0_0_12px_rgba(216,98,82,0.2)]"
                    : "text-[#FAF4ED]/80 hover:text-[#FAF4ED] hover:bg-[#280F0D] hover:border-l-2 hover:border-[#D86252]"
                }`}
              >
                <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-[#FAF4ED]" : "text-[#D86252]"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Player */}
      <div className="mt-8 bg-[#280F0D] border border-[#702D28]/60 p-4 rounded shadow-lg space-y-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D86252]/60 to-transparent" />

        <div className="flex items-center justify-between text-xs font-mono text-[#FAF4ED] border-b border-[#702D28]/50 pb-2">
          <span className="truncate max-w-[130px] font-serif tracking-wide text-[#FAF4ED]">Tema da Campanha</span>
          <span className="text-[9px] text-[#D86252] font-bold uppercase tracking-widest">Áudio</span>
        </div>

        <div className="w-full bg-[#18080a] h-1.5 rounded-full overflow-hidden border border-[#702D28]/50">
          <div className="bg-gradient-to-r from-[#702D28] to-[#D86252] h-full w-1/3 transition-all duration-300" />
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-[#FAF4ED]/80 hover:text-[#D86252] transition-colors"
            title="Mudar Volume"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#D86252]" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-9 h-9 rounded-full bg-[#702D28] hover:bg-[#943C36] border border-[#D86252]/50 flex items-center justify-center text-[#FAF4ED] transition-all shadow-[0_0_12px_rgba(216,98,82,0.3)]"
          >
            {isPlaying ? <Pause className="w-4 h-4 text-[#FAF4ED]" /> : <Play className="w-4 h-4 ml-0.5 text-[#FAF4ED]" />}
          </button>

          <span className="text-[10px] font-mono text-[#FAF4ED]/70">01:24</span>
        </div>
      </div>
    </aside>
  );
}