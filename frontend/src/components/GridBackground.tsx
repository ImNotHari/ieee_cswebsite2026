import { useEffect, useRef } from 'react';

const GridBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const CONFIG = {
      cellSize: 31,
      spawnCount: 1,
      spawnInterval: 8,
      fadeDuration: { min: 150, max: 300 },
      holdDuration: { min: 20, max: 60 },
      cellAlpha: 0.35,
      gridColor: 'rgba(114, 114, 114, 0.18)',
      cellColor: '114, 114, 114',
    };

    let W = 0;
    let H = 0;
    let cells: any[] = [];
    let frame = 0;
    let animationFrameId: number;

    const buildCells = () => {
      const cols = Math.ceil(W / CONFIG.cellSize) + 1;
      const rows = Math.ceil(H / CONFIG.cellSize) + 1;
      cells = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          cells.push({
            x: c * CONFIG.cellSize,
            y: r * CONFIG.cellSize,
            alpha: 0,
            phase: 'idle',
            t: 0,
            duration: 0,
          });
        }
      }
    };

    let lastW = 0;
    let lastH = 0;

    const resize = () => {
      // Use screen.height to ensure it covers the whole screen even when the address bar hides
      const newW = window.innerWidth;
      const newH = Math.max(window.innerHeight, window.screen?.height || 0);
      
      // Only rebuild if dimensions change significantly (e.g., orientation change)
      if (Math.abs(newW - lastW) < 50 && Math.abs(newH - lastH) < 50) return;
      
      lastW = newW;
      lastH = newH;
      
      W = canvas.width = newW;
      H = canvas.height = newH;
      buildCells();
    };

    const rand = (min: number, max: number) => {
      return min + Math.random() * (max - min);
    };

    const spawn = () => {
      const idle = cells.filter((c) => c.phase === 'idle');
      const count = Math.min(CONFIG.spawnCount, idle.length);
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * idle.length);
        const cell = idle.splice(idx, 1)[0];
        if (!cell) continue;
        cell.phase = 'in';
        cell.t = 0;
        cell.duration = rand(CONFIG.fadeDuration.min, CONFIG.fadeDuration.max);
      }
    };

    const drawGrid = () => {
      ctx.strokeStyle = CONFIG.gridColor;
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= W; x += CONFIG.cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y <= H; y += CONFIG.cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
    };

    const updateCells = () => {
      for (const cell of cells) {
        cell.t++;

        if (cell.phase === 'in') {
          cell.alpha = CONFIG.cellAlpha * Math.min(1, cell.t / cell.duration);
          if (cell.t >= cell.duration) {
            cell.phase = 'hold';
            cell.t = 0;
            cell.duration = rand(CONFIG.holdDuration.min, CONFIG.holdDuration.max);
          }
        } else if (cell.phase === 'hold') {
          cell.alpha = CONFIG.cellAlpha;
          if (cell.t >= cell.duration) {
            cell.phase = 'out';
            cell.t = 0;
            cell.duration = rand(CONFIG.fadeDuration.min, CONFIG.fadeDuration.max);
          }
        } else if (cell.phase === 'out') {
          cell.alpha = CONFIG.cellAlpha * Math.max(0, 1 - cell.t / cell.duration);
          if (cell.t >= cell.duration) {
            cell.phase = 'idle';
            cell.alpha = 0;
          }
        }

        if (cell.alpha > 0.005) {
          ctx.fillStyle = `rgba(${CONFIG.cellColor}, ${cell.alpha.toFixed(3)})`;
          ctx.fillRect(
            cell.x + 0.5,
            cell.y + 0.5,
            CONFIG.cellSize - 1,
            CONFIG.cellSize - 1
          );
        }
      }
    };

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      drawGrid();

      frame++;
      if (frame % CONFIG.spawnInterval === 0) spawn();

      updateCells();
      animationFrameId = requestAnimationFrame(loop);
    };

    window.addEventListener('resize', resize);
    resize();
    loop();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        backgroundColor: '#191a1a',
      }}
    />
  );
};

export default GridBackground;
