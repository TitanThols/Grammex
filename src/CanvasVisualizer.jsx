import { useRef, useEffect } from "react";
import { applyRules, drawLSystem } from "./LSystemEngine";

export default function CanvasVisualizer({ axiom, rules, angle, iterations }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const lstring = applyRules(axiom, rules, iterations);
    drawLSystem(ctx, lstring, angle, canvas.width, canvas.height);
  }, [axiom, rules, angle, iterations]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      const ctx = canvas.getContext("2d");
      const lstring = applyRules(axiom, rules, iterations);
      drawLSystem(ctx, lstring, angle, canvas.width, canvas.height);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas.parentElement);
    return () => observer.disconnect();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
