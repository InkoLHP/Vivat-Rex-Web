"use client";

import * as React from "react";

export type TextureVariant =
  | "fabric-of-squares"
  | "groovepaper"
  | "none";

export interface BackgroundImageTextureProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: TextureVariant;
  opacity?: number;
  children?: React.ReactNode;
}

// Aponta diretamente para os arquivos que estão dentro de public/textures/
const textureMap: Record<Exclude<TextureVariant, "none">, string> = {
  "fabric-of-squares": "/textures/fabric-of-squares.png",
  "groovepaper": "/textures/groovepaper.png",
};

export function BackgroundImageTexture({
  variant = "groovepaper",
  opacity = 0.5,
  children,
  className = "",
  ...props
}: BackgroundImageTextureProps) {
  if (variant === "none") {
    return (
      <div className={`relative ${className}`} {...props}>
        {children}
      </div>
    );
  }

  const bgUrl = textureMap[variant];

  return (
    <div className={`relative overflow-hidden bg-zinc-900 ${className}`} {...props}>
      {/* Camada da imagem de textura */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none rounded-[inherit]"
        style={{
          backgroundImage: `url("${bgUrl}")`,
          backgroundRepeat: "repeat",
          opacity: opacity,
        }}
      />
      {/* Conteúdo por cima da textura */}
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}