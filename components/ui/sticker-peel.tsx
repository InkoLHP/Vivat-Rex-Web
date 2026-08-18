"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useMotionValue, animate, useMotionValueEvent } from "framer-motion";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  SkinnedMesh,
  MeshStandardMaterial,
  Texture,
  Vector3,
  Quaternion,
  Bone,
  Skeleton,
  Float32BufferAttribute,
  Uint16BufferAttribute,
  FrontSide,
  RepeatWrapping,
  LinearFilter,
  SRGBColorSpace,
  Color,
  DirectionalLight,
  AmbientLight,
  PlaneGeometry,
  Mesh,
  Group,
  ShadowMaterial,
  PCFSoftShadowMap,
} from "three";

// ============================================================================
// CONSTANTS & UTILS
// ============================================================================

const DEFAULT_IMAGE =
  "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/cbf541e7-a558-45e7-11e8-7e63e9d1a800/w=800";

const CAMERA_DISTANCE = 1200;
const CAMERA_NEAR = 100;
const CAMERA_FAR = 2000;
const STICKER_DEPTH = 0.003;
const CANVAS_SCALE = 2;

const BONE_GRID_X = 30;
const BONE_GRID_Y = 30;
const SEGMENTS_W = 60;
const SEGMENTS_H = 60;

const FIXED_CURL_RADIUS = 0.15;

const _scratchQuat = new Quaternion();
const _scratchRotAxis = new Vector3();

const COMPONENT_DEFAULTS = {
  imageWidth: 200,
  imageHeight: 200,
  curlRotation: 240,
  hoverPeel: 35,
  pressPeel: 65,
  backColor: "#111111",
  shadowEnabled: true,
};

function calculateCameraFov(width: number, height: number, distance: number): number {
  const aspect = width / height;
  return 2 * Math.atan(width / aspect / (2 * distance)) * (180 / Math.PI);
}

function resolveImageSource(input: unknown): string | undefined {
  if (!input) return undefined;
  if (typeof input === "string") return input.trim() || undefined;
  if (typeof input === "object" && "src" in input && typeof input.src === "string") {
    return input.src || undefined;
  }
  return undefined;
}

function makeBackTextureViewConsistent(tex: Texture | null, frontTex: Texture | null): Texture | null {
  if (!tex) return null;
  const out = tex === frontTex && typeof tex.clone === "function" ? tex.clone() : tex;
  out.wrapS = RepeatWrapping;
  out.repeat.x = -1;
  out.offset.x = 1;
  out.needsUpdate = true;
  return out;
}

export interface StickerPeelProps {
  image?: unknown;
  imageWidth?: number;
  imageHeight?: number;
  curlRotation?: number;
  hoverPeel?: number;
  pressPeel?: number;
  transition?: object;
  backColor?: string;
  shadowEnabled?: boolean;
  shadow?: { opacity?: number; color?: string; x?: number; y?: number };
  style?: React.CSSProperties;
  className?: string;
}

export function StickerPeel(__props: StickerPeelProps) {
  const props = { ...COMPONENT_DEFAULTS, ...__props };
  const {
    image,
    imageWidth,
    imageHeight,
    curlRotation,
    hoverPeel,
    pressPeel,
    transition = { type: "tween", duration: 0.4, ease: "easeOut" },
    backColor,
    shadowEnabled,
    shadow,
    style,
    className = "",
  } = props;

  const shadowCfg = {
    opacity: 30,
    color: "#000000",
    x: -150,
    y: 100,
    ...shadow,
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const cameraRef = useRef<PerspectiveCamera | null>(null);
  const meshRef = useRef<SkinnedMesh | null>(null);
  const groupRef = useRef<Group | null>(null);
  const bonesRef = useRef<Bone[]>([]);
  const bonesInitialPositionsRef = useRef<Vector3[]>([]);
  const isHoveringRef = useRef(false);
  const isPressedRef = useRef(false);

  const resolvedImageUrl = resolveImageSource(image) || DEFAULT_IMAGE;
  const curlAmountMotion = useMotionValue(0);

  // ================================================================
  // GEOMETRY & SKINNING
  // ================================================================
  const createStickerGeometry = useCallback((w: number, h: number, gridX: number, gridY: number) => {
    const geometry = new BoxGeometry(w, h, STICKER_DEPTH, SEGMENTS_W, SEGMENTS_H, 1);
    const position = geometry.attributes.position;
    const vertex = new Vector3();
    const skinIndexes: number[] = [];
    const skinWeights: number[] = [];

    for (let i = 0; i < position.count; i++) {
      vertex.fromBufferAttribute(position, i);
      const normalizedX = (vertex.x + w / 2) / w;
      const normalizedY = (vertex.y + h / 2) / h;
      const gridXPos = normalizedX * (gridX - 1);
      const gridYPos = normalizedY * (gridY - 1);
      const x0 = Math.floor(gridXPos);
      const y0 = Math.floor(gridYPos);
      const x1 = Math.min(x0 + 1, gridX - 1);
      const y1 = Math.min(y0 + 1, gridY - 1);
      const tx = gridXPos - x0;
      const ty = gridYPos - y0;

      const idx00 = y0 * gridX + x0;
      const idx10 = y0 * gridX + x1;
      const idx01 = y1 * gridX + x0;
      const idx11 = y1 * gridX + x1;

      skinIndexes.push(idx00, idx10, idx01, idx11);
      skinWeights.push((1 - tx) * (1 - ty), tx * (1 - ty), (1 - tx) * ty, tx * ty);
    }

    geometry.setAttribute("skinIndex", new Uint16BufferAttribute(skinIndexes, 4));
    geometry.setAttribute("skinWeight", new Float32BufferAttribute(skinWeights, 4));
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  // ================================================================
  // BONE DEFORMATION (CURL MATH)
  // ================================================================
  const updateBones = useCallback((peelPercent: number, angleDeg: number) => {
    if (!bonesRef.current || bonesRef.current.length === 0) return;

    const angleRad = (angleDeg * Math.PI) / 180;
    const dirX = Math.cos(angleRad);
    const dirY = Math.sin(angleRad);

    const corners = [
      [-imageWidth / 2, -imageHeight / 2],
      [imageWidth / 2, -imageHeight / 2],
      [-imageWidth / 2, imageHeight / 2],
      [imageWidth / 2, imageHeight / 2],
    ];

    let minProj = Infinity;
    let maxProj = -Infinity;
    corners.forEach(([cx, cy]) => {
      const proj = cx * dirX + cy * dirY;
      minProj = Math.min(minProj, proj);
      maxProj = Math.max(maxProj, proj);
    });

    const totalSpan = maxProj - minProj;
    const peelNorm = peelPercent / 100;
    const foldLine = maxProj - peelNorm * (totalSpan + 20);
    const R = FIXED_CURL_RADIUS * Math.min(imageWidth, imageHeight);
    const rotAxis = _scratchRotAxis.set(-dirY, dirX, 0).normalize();

    bonesRef.current.forEach((bone, i) => {
      const initPos = bonesInitialPositionsRef.current[i];
      if (!initPos) return;

      const proj = initPos.x * dirX + initPos.y * dirY;
      const dist = proj - foldLine;

      if (dist <= 0) {
        bone.position.copy(initPos);
        bone.quaternion.identity();
      } else {
        const theta = dist / R;
        const curlX = dirX * (R * Math.sin(theta) - dist);
        const curlY = dirY * (R * Math.sin(theta) - dist);
        const curlZ = R * (1 - Math.cos(theta));

        bone.position.set(initPos.x + curlX, initPos.y + curlY, initPos.z + curlZ);
        _scratchQuat.setFromAxisAngle(rotAxis, theta);
        bone.quaternion.copy(_scratchQuat);
      }
    });

    if (meshRef.current?.skeleton) {
      meshRef.current.skeleton.update();
    }
  }, [imageWidth, imageHeight]);

  const renderFrame = useCallback(() => {
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, []);

  useMotionValueEvent(curlAmountMotion, "change", (latest: number) => {
    updateBones(latest, curlRotation);
    renderFrame();
  });

  // ================================================================
  // THREE.JS INITIALIZATION
  // ================================================================
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvasWidth = imageWidth * CANVAS_SCALE;
    const canvasHeight = imageHeight * CANVAS_SCALE;

    const scene = new Scene();
    sceneRef.current = scene;

    const camera = new PerspectiveCamera(
      calculateCameraFov(canvasWidth, canvasHeight, CAMERA_DISTANCE),
      canvasWidth / canvasHeight,
      CAMERA_NEAR,
      CAMERA_FAR
    );
    camera.position.set(0, 0, CAMERA_DISTANCE);
    cameraRef.current = camera;

    const renderer = new WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(canvasWidth, canvasHeight, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    rendererRef.current = renderer;

    const geometry = createStickerGeometry(imageWidth, imageHeight, BONE_GRID_X, BONE_GRID_Y);

    const bones: Bone[] = [];
    const boneSpacingX = imageWidth / (BONE_GRID_X - 1);
    const boneSpacingY = imageHeight / (BONE_GRID_Y - 1);

    for (let y = 0; y < BONE_GRID_Y; y++) {
      for (let x = 0; x < BONE_GRID_X; x++) {
        const bone = new Bone();
        bone.position.x = -imageWidth / 2 + x * boneSpacingX;
        bone.position.y = -imageHeight / 2 + y * boneSpacingY;
        bone.position.z = 0;
        bones.push(bone);
      }
    }
    bonesRef.current = bones;
    bonesInitialPositionsRef.current = bones.map((b) => b.position.clone());

    const skeleton = new Skeleton(bones);

    const frontMaterial = new MeshStandardMaterial({
      color: 0xffffff,
      side: FrontSide,
      transparent: true,
      roughness: 0.3,
      metalness: 0.1,
    });

    const backMaterial = new MeshStandardMaterial({
      color: new Color(backColor),
      side: FrontSide,
      transparent: true,
      roughness: 0.4,
    });

    const sideMaterial = new MeshStandardMaterial({
      color: new Color(backColor),
      transparent: true,
    });

    const materials = [sideMaterial, sideMaterial, sideMaterial, sideMaterial, frontMaterial, backMaterial];
    const mesh = new SkinnedMesh(geometry, materials);
    mesh.frustumCulled = false;

    bones.forEach((bone) => {
      mesh.add(bone);
    });
    mesh.bind(skeleton);
    mesh.castShadow = shadowEnabled;

    const group = new Group();
    groupRef.current = group;
    group.add(mesh);
    meshRef.current = mesh;
    scene.add(group);

    // Iluminação
    const ambientLight = new AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(shadowCfg.x, shadowCfg.y, 400);
    directionalLight.castShadow = shadowEnabled;
    scene.add(directionalLight);

    if (shadowEnabled) {
      const shadowMat = new ShadowMaterial({
        opacity: shadowCfg.opacity / 100,
        color: new Color(shadowCfg.color),
      });
      const shadowPlane = new Mesh(new PlaneGeometry(canvasWidth, canvasHeight), shadowMat);
      shadowPlane.receiveShadow = true;
      shadowPlane.position.set(0, 0, -1);
      scene.add(shadowPlane);
    }

    // Carregar Imagem como Textura
    const imgElement = new Image();
    imgElement.crossOrigin = "anonymous";
    imgElement.src = resolvedImageUrl;
    imgElement.onload = () => {
      const tex = new Texture(imgElement);
      tex.needsUpdate = true;
      tex.colorSpace = SRGBColorSpace;
      tex.minFilter = LinearFilter;

      const backTex = makeBackTextureViewConsistent(tex, tex);

      (mesh.material as MeshStandardMaterial[])[4].map = tex;
      (mesh.material as MeshStandardMaterial[])[4].needsUpdate = true;

      (mesh.material as MeshStandardMaterial[])[5].map = backTex;
      (mesh.material as MeshStandardMaterial[])[5].needsUpdate = true;

      renderFrame();
    };

    renderFrame();

    return () => {
      renderer.dispose();
      geometry.dispose();
    };
  }, [imageWidth, imageHeight, resolvedImageUrl, backColor, shadowEnabled, shadowCfg.x, shadowCfg.y, shadowCfg.opacity, shadowCfg.color, createStickerGeometry, renderFrame]);

  // ================================================================
  // HANDLERS
  // ================================================================
  const handleMouseEnter = () => {
    isHoveringRef.current = true;
    const target = isPressedRef.current ? pressPeel : hoverPeel;
    animate(curlAmountMotion, target, transition);
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    isPressedRef.current = false;
    animate(curlAmountMotion, 0, transition);
  };

  const handleMouseDown = () => {
    isPressedRef.current = true;
    animate(curlAmountMotion, pressPeel, transition);
  };

  const handleMouseUp = () => {
    isPressedRef.current = false;
    const target = isHoveringRef.current ? hoverPeel : 0;
    animate(curlAmountMotion, target, transition);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      className={`relative inline-block cursor-pointer select-none ${className}`}
      style={{
        width: imageWidth,
        height: imageHeight,
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
}

export default StickerPeel;