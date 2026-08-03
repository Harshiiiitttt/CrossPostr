import React, { useEffect, useRef } from "react";

interface Paw {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  color: string;
  opacity: number;
}

export default function PawTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pawsRef = useRef<Paw[]>([]);
  const lastPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const colors = [
      "rgba(104, 183, 122, 0.25)", // subtle brand green
      "rgba(215, 197, 154, 0.25)", // subtle warm gold
      "rgba(126, 155, 98, 0.2)",   // subtle olive green
    ];

    const addPaw = (x: number, y: number, isClick = false) => {
      const dist = Math.hypot(x - lastPosRef.current.x, y - lastPosRef.current.y);
      if (!isClick && dist < 54) return; // higher threshold for subtle spacing

      lastPosRef.current = { x, y };

      const size = isClick ? 12 : 8;
      const angle = isClick
        ? Math.random() * 360
        : Math.atan2(y - lastPosRef.current.y, x - lastPosRef.current.x) * (180 / Math.PI) + 90;

      const newPaw: Paw = {
        id: Date.now() + Math.random(),
        x,
        y,
        size,
        rotation: angle,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.4, // lower starting opacity
      };

      pawsRef.current.push(newPaw);
      if (pawsRef.current.length > 12) {
        pawsRef.current.shift();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      addPaw(e.clientX, e.clientY, false);
    };

    const handleClick = (e: MouseEvent) => {
      addPaw(e.clientX, e.clientY, true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    const drawPawShape = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      color: string,
      opacity: number
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate((rotation * Math.PI) / 180);
      context.fillStyle = color;
      context.globalAlpha = opacity;

      const scale = size / 16;

      // Main pad
      context.beginPath();
      context.ellipse(0, 4 * scale, 5 * scale, 4 * scale, 0, 0, 2 * Math.PI);
      context.fill();

      // 4 toe pads
      const toes = [
        { cx: -5 * scale, cy: -3 * scale, rx: 1.8 * scale, ry: 2.4 * scale, rot: -0.2 },
        { cx: -2 * scale, cy: -6 * scale, rx: 1.8 * scale, ry: 2.5 * scale, rot: -0.05 },
        { cx: 2 * scale, cy: -6 * scale, rx: 1.8 * scale, ry: 2.5 * scale, rot: 0.05 },
        { cx: 5 * scale, cy: -3 * scale, rx: 1.8 * scale, ry: 2.4 * scale, rot: 0.2 },
      ];

      toes.forEach((toe) => {
        context.beginPath();
        context.ellipse(toe.cx, toe.cy, toe.rx, toe.ry, toe.rot, 0, 2 * Math.PI);
        context.fill();
      });

      context.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pawsRef.current.forEach((paw) => {
        drawPawShape(ctx, paw.x, paw.y, paw.size, paw.rotation, paw.color, paw.opacity);
        paw.opacity -= 0.015; // smooth fade out
      });

      // Filter out faded paws
      pawsRef.current = pawsRef.current.filter((p) => p.opacity > 0.01);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}
