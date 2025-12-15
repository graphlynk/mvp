import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  radius: number;
}

interface Star {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  path: { x: number; y: number }[];
}

export function NodesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Create static nodes
    const nodes: Node[] = [];
    const numNodes = 15;
    
    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 2,
      });
    }

    // Create shooting stars
    const stars: Star[] = [];
    
    const createStar = () => {
      if (prefersReducedMotion) return;
      
      const fromIdx = Math.floor(Math.random() * nodes.length);
      let toIdx = Math.floor(Math.random() * nodes.length);
      while (toIdx === fromIdx) {
        toIdx = Math.floor(Math.random() * nodes.length);
      }

      const from = nodes[fromIdx];
      const to = nodes[toIdx];
      
      // Create curved path between nodes
      const midX = (from.x + to.x) / 2 + (Math.random() - 0.5) * 100;
      const midY = (from.y + to.y) / 2 + (Math.random() - 0.5) * 100;
      
      stars.push({
        fromNode: fromIdx,
        toNode: toIdx,
        progress: 0,
        speed: 0.0005 + Math.random() * 0.0005, // 12-16s average
        path: [
          { x: from.x, y: from.y },
          { x: midX, y: midY },
          { x: to.x, y: to.y },
        ],
      });
    };

    // Initialize some stars
    if (!prefersReducedMotion) {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => createStar(), i * 4000);
      }
    }

    const getPointOnPath = (path: { x: number; y: number }[], t: number) => {
      // Quadratic bezier curve
      const t2 = t * t;
      const mt = 1 - t;
      const mt2 = mt * mt;
      
      return {
        x: mt2 * path[0].x + 2 * mt * t * path[1].x + t2 * path[2].x,
        y: mt2 * path[0].y + 2 * mt * t * path[1].y + t2 * path[2].y,
      };
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections between nearby nodes
      ctx.strokeStyle = 'rgba(147, 197, 253, 0.2)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 200) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((node) => {
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius);
        gradient.addColorStop(0, 'rgba(147, 197, 253, 0.6)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.2)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(147, 197, 253, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Update and draw shooting stars
      if (!prefersReducedMotion) {
        for (let i = stars.length - 1; i >= 0; i--) {
          const star = stars[i];
          star.progress += star.speed;

          if (star.progress >= 1) {
            stars.splice(i, 1);
            if (Math.random() < 0.3) {
              setTimeout(() => createStar(), Math.random() * 3000);
            }
            continue;
          }

          const pos = getPointOnPath(star.path, star.progress);
          
          // Draw trail
          const trailLength = 0.1;
          for (let j = 0; j < 5; j++) {
            const trailT = Math.max(0, star.progress - (j * trailLength / 5));
            const trailPos = getPointOnPath(star.path, trailT);
            const alpha = (1 - j / 5) * 0.6;
            
            ctx.fillStyle = `rgba(59, 130, 246, ${alpha})`;
            ctx.beginPath();
            ctx.arc(trailPos.x, trailPos.y, 2 - j * 0.3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
