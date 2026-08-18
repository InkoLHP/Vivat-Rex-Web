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
    <aside className="w-full md:w-72 bg-zinc-950 border-b md:border-b-0 md:border-r border-red-950/60 p-6 flex flex-col justify-between min-h-screen text-zinc-200 select-none">
      {/* Topo: Marca / Título da Campanha */}
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-extrabold tracking-wider text-zinc-100">
            Vivat <span className="text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">Rex</span>
          </h1>
          <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest mt-1 border-l-2 border-red-700 pl-2">
            Crônicas da Noite
          </p>
        </div>

        {/* Menu de Navegação */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md font-serif text-sm transition-all duration-300 ${
                  isActive
                    ? "bg-red-950/40 text-red-500 border-l-4 border-red-600 font-bold shadow-[inset_0_0_12px_rgba(153,27,27,0.2)]"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-red-500" : "text-zinc-500"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Widget do Player de Música (Inferior) */}
      <div className="mt-8 bg-zinc-900/80 border border-red-950/40 p-4 rounded-lg shadow-lg space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-zinc-800 pb-2">
          <span className="truncate max-w-[130px] text-zinc-300">Tema da Campanha</span>
          <span className="text-[10px] text-red-500 font-bold uppercase">Áudio</span>
        </div>

        {/* Barra de Progresso Fictícia */}
        <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
          <div className="bg-red-600 h-full w-1/3 transition-all duration-300" />
        </div>

        {/* Controles de Áudio */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-zinc-400 hover:text-zinc-100 transition-colors"
            title="Mudar Volume"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-9 h-9 rounded-full bg-red-950 hover:bg-red-900 border border-red-700/50 flex items-center justify-center text-zinc-100 transition-all shadow-[0_0_10px_rgba(220,38,38,0.3)]"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <span className="text-[10px] font-mono text-zinc-500">01:24</span>
        </div>
      </div>
    </aside>
  );
}