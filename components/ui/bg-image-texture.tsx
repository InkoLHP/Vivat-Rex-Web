"use client";

import * as React from "react";

export type TextureVariant =
  | "fabric-of-squares"
  | "groovepaper"
  | "grid-noise"
  | "inflicted"
  | "debut-light"
  | "none";

export interface BackgroundImageTextureProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: TextureVariant;
  opacity?: number;
  children?: React.ReactNode;
}

// Mapeamento dos arquivos dentro de public/textures/
const textureMap: Record<Exclude<TextureVariant, "none">, string> = {
  "fabric-of-squares": "/textures/fabric-of-squares.png",
  "groovepaper": "/textures/groovepaper.png",
  "grid-noise": "/textures/grid-noise.png",
  "inflicted": "/textures/inflicted.png",
  "debut-light": "/textures/debut-light.png",
};

export function BackgroundImageTexture({
  variant = "groovepaper",
  opacity = 0.08,
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
    <div className={`relative overflow-hidden ${className}`} {...props}>
      {/* Camada da imagem de textura com blend mode para não escurecer a cor base */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none rounded-[inherit] mix-blend-overlay"
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