import { useEffect, useRef } from "react";
import { initGame } from "./game/game";

export function Game(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const { current: canvas } = canvasRef;
    if (!canvas) {
      return;
    }
    canvas.focus();
    initGame({ canvas });
  }, [canvasRef])
  return (
    <div className="fixed top-0 left-0 w-screen h-screen">
      <canvas ref={canvasRef} id="gameCanvas" className="w-full h-full" />
    </div>
  );
}
