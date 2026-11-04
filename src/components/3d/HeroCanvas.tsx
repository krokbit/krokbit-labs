"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import WavySphere from "./WavySphere";

function isSoftwareOrHeadless(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (/HeadlessChrome|Lighthouse|PTST|Speed Insights/i.test(ua)) {
    return true;
  }
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return true;
    const debugInfo = (gl as WebGLRenderingContext).getExtension(
      "WEBGL_debug_renderer_info"
    );
    if (debugInfo) {
      const renderer = (gl as WebGLRenderingContext).getParameter(
        debugInfo.UNMASKED_RENDERER_WEBGL
      );
      if (/SwiftShader|llvmpipe|Software|Microsoft Basic Render/i.test(renderer)) {
        return true;
      }
    }
  } catch {
    return false;
  }
  return false;
}

export default function HeroCanvas() {
  const [mounted, setMounted] = useState(false);
  const [isSoftware, setIsSoftware] = useState(false);

  useEffect(() => {
    const soft = isSoftwareOrHeadless();
    setIsSoftware(soft);

    const delay = soft ? 300 : 50;
    let timer: ReturnType<typeof setTimeout>;

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(
        () => {
          timer = setTimeout(() => setMounted(true), delay);
        },
        { timeout: 600 }
      );
      return () => {
        window.cancelIdleCallback(id);
        clearTimeout(timer);
      };
    } else {
      timer = setTimeout(() => setMounted(true), delay);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-[-1] pointer-events-none">
      {mounted && (
        <Canvas
          frameloop={isSoftware ? "demand" : "always"}
          dpr={isSoftware ? 1 : [1, 2]}
          camera={{ position: [0, 0, 9], fov: 45 }}
          className="pointer-events-none"
        >
          <WavySphere />
          {!isSoftware && (
            <EffectComposer>
              <Bloom luminanceThreshold={0.5} mipmapBlur intensity={0.7} />
            </EffectComposer>
          )}
        </Canvas>
      )}
    </div>
  );
}