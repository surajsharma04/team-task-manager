import { useEffect, useRef } from "react";

export function BackgroundCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let W, H;
    let stars = [];
    let mouse = { x: -9999, y: -9999 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createStars = () => {
      const count = window.innerWidth < 768 ? 36 : 64;
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.4,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        alpha: Math.random() * 0.24 + 0.08,
        twinkle: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      stars.forEach(s => {
        s.x += s.vx;
        s.y += s.vy;
        s.twinkle += 0.02;
        const a = s.alpha * (0.7 + 0.3 * Math.sin(s.twinkle));

        if (s.x < 0) s.x = W;
        if (s.x > W) s.x = 0;
        if (s.y < 0) s.y = H;
        if (s.y > H) s.y = 0;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(25,126,164,${a})`;
        ctx.fill();
      });

      stars.forEach((s, i) => {
        for (let j = i + 1; j < Math.min(stars.length, i + 8); j += 1) {
          const s2 = stars[j];
          const dx = s.x - s2.x, dy = s.y - s2.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 8100) {
            const mdx = s.x - mouse.x, mdy = s.y - mouse.y;
            const mdistSq = mdx * mdx + mdy * mdy;
            if (mdistSq < 22500) {
              ctx.beginPath();
              ctx.moveTo(s.x, s.y);
              ctx.lineTo(s2.x, s2.y);
              const alpha = (1 - Math.sqrt(distSq) / 90) * 0.045 * (1 - Math.sqrt(mdistSq) / 150);
              ctx.strokeStyle = `rgba(25,126,164,${alpha})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      });

      raf = requestAnimationFrame(draw);
    };

    const onMouse = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };

    resize();
    createStars();
    draw();
    const onResize = () => { resize(); createStars(); };
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouse);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="bg-canvas">
      <canvas ref={canvasRef} />
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
    </div>
  );
}
