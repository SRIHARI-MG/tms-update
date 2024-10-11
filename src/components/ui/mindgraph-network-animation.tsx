import React from "react";
import { motion } from "framer-motion";

const NODES = [
  { id: 0, x: 155, y: 110, radius: 8 },
  { id: 1, x: 130, y: 80, radius: 6 },
  { id: 2, x: 175, y: 70, radius: 7 },
  { id: 3, x: 240, y: 100, radius: 7 },
  { id: 4, x: 280, y: 80, radius: 5 },
  { id: 5, x: 280, y: 120, radius: 5 },
  { id: 6, x: 200, y: 140, radius: 10 },
  { id: 7, x: 120, y: 140, radius: 10 },
  { id: 8, x: 80, y: 120, radius: 5 },
  { id: 9, x: 100, y: 160, radius: 5 },
  { id: 10, x: 160, y: 160, radius: 6 },
  { id: 11, x: 220, y: 160, radius: 5 },
];

const EDGES = [
  { source: 0, target: 1, width: 2 },
  { source: 0, target: 2, width: 2 },
  { source: 0, target: 6, width: 3 },
  { source: 0, target: 7, width: 3 },
  { source: 6, target: 3, width: 3 },
  { source: 3, target: 4, width: 2 },
  { source: 3, target: 5, width: 2 },
  { source: 6, target: 10, width: 2 },
  { source: 6, target: 7, width: 2 },
  { source: 2, target: 3, width: 2 },
  { source: 7, target: 8, width: 2 },
  { source: 10, target: 8, width: 2 },
  { source: 7, target: 9, width: 2 },
  { source: 6, target: 11, width: 2 },
];

export default function MindgraphNetwork({
  width = 400,
  height = 200,
  className = "",
  nodeScale = 0.7,
}) {
  const scaleX = width / 400;
  const scaleY = height / 200;

  return (
    <div
      className={`w-full h-full flex items-center justify-center ${className}`}
    >
      <svg width={width} height={height} className="bg-transparent">
        <defs>
          <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffe604" />
            <stop offset="50%" stopColor="#FFA500" />
            <stop offset="100%" stopColor="#ff3f04" />
          </linearGradient>
        </defs>
        {EDGES.map((edge, index) => {
          const sourceNode = NODES[edge.source];
          const targetNode = NODES[edge.target];

          return (
            <motion.line
              key={`edge-${index}`}
              x1={sourceNode.x * scaleX}
              y1={sourceNode.y * scaleY}
              x2={targetNode.x * scaleX}
              y2={targetNode.y * scaleY}
              stroke="url(#nodeGradient)"
              strokeWidth={edge.width * Math.min(scaleX, scaleY)}
              initial={{ opacity: 0.4 }}
              animate={{
                opacity: [0.4, 1, 0.4],
                strokeWidth: [
                  edge.width * Math.min(scaleX, scaleY),
                  edge.width * 1.5 * Math.min(scaleX, scaleY),
                  edge.width * Math.min(scaleX, scaleY),
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          );
        })}
        {NODES.map((node) => {
          const isLargeNode = node.radius >= 6;
          const pulseScale = isLargeNode ? 1.009 : 1;
          const pulseDuration = isLargeNode ? 2 : 3;

          return (
            <motion.circle
              key={`node-${node.id}`}
              cx={node.x * scaleX}
              cy={node.y * scaleY}
              r={node.radius * Math.min(scaleX, scaleY)}
              fill="url(#nodeGradient)"
              initial={{ scale: 1 }}
              animate={{
                scale: [nodeScale, pulseScale, nodeScale],
                opacity: [1, 1, 1],
              }}
              transition={{
                duration: pulseDuration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
