import { motion } from "motion/react";
import { useState, useEffect } from "react";

interface Node {
  id: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  label: string;
}

interface Link {
  source: number;
  target: number;
}

export function KnowledgeGraph() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);

  useEffect(() => {
    // Generate mock graph data
    const newNodes: Node[] = [
      { id: 1, x: 50, y: 50, radius: 20, color: "#0b3d84", label: "Core" },
      { id: 2, x: 30, y: 20, radius: 10, color: "#6EE7F5", label: "SEO" },
      { id: 3, x: 70, y: 30, radius: 12, color: "#6EE7F5", label: "Content" },
      { id: 4, x: 80, y: 60, radius: 15, color: "#6EE7F5", label: "Social" },
      { id: 5, x: 20, y: 70, radius: 10, color: "#6EE7F5", label: "Ads" },
      { id: 6, x: 40, y: 80, radius: 8, color: "#6EE7F5", label: "Email" },
    ];

    const newLinks: Link[] = [
      { source: 1, target: 2 },
      { source: 1, target: 3 },
      { source: 1, target: 4 },
      { source: 1, target: 5 },
      { source: 1, target: 6 },
      { source: 2, target: 3 },
      { source: 4, target: 3 },
      { source: 5, target: 6 },
    ];

    setNodes(newNodes);
    setLinks(newLinks);
  }, []);

  return (
    <div className="glass-card-light dark:glass-card rounded-2xl p-6 border border-white/20 relative overflow-hidden h-[400px] flex flex-col">
      <div className="flex justify-between items-start mb-4 z-10">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Knowledge Graph
          </h3>
          <p className="text-sm text-gray-500 dark:text-[#98A2B3]">
            Visualizing your content ecosystem
          </p>
        </div>
        <div className="flex gap-2">
           <span className="px-2 py-1 bg-[#0b3d84]/10 dark:bg-[#0b3d84]/30 rounded text-xs text-[#0b3d84] dark:text-[#6EE7F5]">Live</span>
        </div>
      </div>

      <div className="flex-1 relative w-full h-full flex items-center justify-center perspective-1000">
        <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            <defs>
                <linearGradient id="grad-core" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0b3d84" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#051e42" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="grad-node" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6EE7F5" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0b3d84" stopOpacity="0.2" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            {/* Links */}
            {links.map((link, i) => {
                const source = nodes.find(n => n.id === link.source);
                const target = nodes.find(n => n.id === link.target);
                if (!source || !target) return null;
                return (
                    <motion.line
                        key={`link-${i}`}
                        x1={`${source.x}%`}
                        y1={`${source.y}%`}
                        x2={`${target.x}%`}
                        y2={`${target.y}%`}
                        stroke="url(#grad-node)"
                        strokeWidth="0.2"
                        strokeDasharray="2 2"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.6 }}
                        transition={{ duration: 2, delay: i * 0.05 }}
                    />
                );
            })}

            {/* Nodes */}
            {nodes.map((node, i) => {
                const isCore = node.id === 1;
                return (
                    <motion.g key={`node-${node.id}`}>
                        {/* Outer Glow Ring (Orbit) */}
                        <motion.circle
                            cx={`${node.x}%`}
                            cy={`${node.y}%`}
                            r={(node.radius / 3) + 3}
                            fill="transparent"
                            stroke={isCore ? "#0b3d84" : "#6EE7F5"}
                            strokeWidth="0.1"
                            strokeOpacity={0.3}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1.2, delay: i * 0.1 }}
                        />
                        
                        {/* Main Node Body */}
                        <motion.circle
                            cx={`${node.x}%`}
                            cy={`${node.y}%`}
                            r={node.radius / 3}
                            fill={isCore ? "url(#grad-core)" : "url(#grad-node)"}
                            stroke={isCore ? "none" : "#6EE7F5"}
                            strokeWidth={isCore ? 0 : 0.2}
                            strokeOpacity={0.6}
                            filter="url(#glow)"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 12, stiffness: 100, delay: i * 0.1 }}
                            whileHover={{ scale: 1.15, filter: "brightness(1.3)" }}
                            style={{ cursor: "pointer" }}
                        />

                        {/* Glass Reflection Highlight */}
                        <motion.circle
                            cx={`${node.x - (node.radius/10)}%`}
                            cy={`${node.y - (node.radius/10)}%`}
                            r={node.radius / 10}
                            fill="white"
                            fillOpacity={0.4}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.1 + 0.2 }}
                        />

                        {/* Label */}
                        <motion.text
                            x={`${node.x}%`}
                            y={`${node.y + (node.radius/3) + 5}%`}
                            textAnchor="middle"
                            fontSize="2.8"
                            fontWeight="600"
                            fill="currentColor"
                            className="font-[Geist] tracking-wide text-gray-600 dark:text-gray-300 pointer-events-none uppercase"
                            style={{ textShadow: "0px 2px 4px rgba(0,0,0,0.1)" }}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 + i * 0.1 }}
                        >
                            {node.label}
                        </motion.text>
                    </motion.g>
                );
            })}
        </svg>
        
        {/* Ambient Background Pulse */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#0b3d84]/10 dark:bg-[#6EE7F5]/5 rounded-full blur-[60px] animate-pulse pointer-events-none" />
      </div>
    </div>
  );
}
