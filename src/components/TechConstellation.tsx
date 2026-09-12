'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  Layers, Code2, Wrench, Paintbrush, Route, Sparkles,
  Database, Globe2, Cpu, Image as ImageIcon, LayoutTemplate
} from 'lucide-react';

const TECH_IDS = [
  { id: 'react', name: 'React', level: 0, icon: Layers },
  { id: 'ts', name: 'TypeScript', level: 1, icon: Code2 },
  { id: 'vite', name: 'Vite', level: 1, icon: Wrench },
  { id: 'wasm', name: 'WebAssembly', level: 1, icon: Cpu },
  { id: 'fabric', name: 'DOMParser', level: 1, icon: ImageIcon },
  { id: 'router', name: 'React Router', level: 2, icon: Route },
  { id: 'radix', name: 'Radix UI', level: 2, icon: LayoutTemplate },
  { id: 'framer', name: 'Framer Motion', level: 2, icon: Sparkles },
  { id: 'canvas', name: 'Canvas API', level: 2, icon: Globe2 },
  { id: 'zustand', name: 'Zustand', level: 2, icon: Database },
  { id: 'lucide', name: 'Lucide Icons', level: 2, icon: Paintbrush },
  { id: 'tailwind', name: 'Tailwind CSS', level: 2, icon: Paintbrush },
];

const EDGES = [
  { source: 0, target: 1 },
  { source: 0, target: 2 },
  { source: 0, target: 3 },
  { source: 0, target: 4 },
  { source: 1, target: 5 },
  { source: 1, target: 11 },
  { source: 2, target: 5 },
  { source: 2, target: 6 },
  { source: 2, target: 7 },
  { source: 3, target: 7 },
  { source: 3, target: 8 },
  { source: 3, target: 9 },
  { source: 4, target: 9 },
  { source: 4, target: 10 },
  { source: 4, target: 11 },
];

export default function TechConstellation() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current, 'dark', { renderer: 'canvas' });

    const nodes = TECH_IDS.map((tech) => {
      const isCore = tech.level === 0;
      const isPrimary = tech.level === 1;
      
      const size = isCore ? 64 : isPrimary ? 48 : 36;
      const iconSize = isCore ? 40 : isPrimary ? 32 : 24;
      
      const color = isCore 
        ? '#3b82f6'
        : isPrimary 
          ? '#06b6d4'
          : '#8b5cf6';
          
      const svgString = renderToStaticMarkup(
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
          <defs>
            <radialGradient id="grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor="#030712" stopOpacity="0.9" />
            </radialGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation={isCore ? "6" : "4"} floodColor={color} floodOpacity="0.8" />
            </filter>
          </defs>
          <circle cx="50" cy="50" r="38" fill="url(#grad)" stroke={color} strokeWidth={isCore ? "3" : "1.5"} filter="url(#glow)" />
          <g transform={`translate(${50 - iconSize/2}, ${50 - iconSize/2})`}>
            <tech.icon color={isCore ? "#ffffff" : color} size={iconSize} strokeWidth={isCore ? 2 : 1.5} />
          </g>
        </svg>
      );
      
      const dataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
          
      return {
        id: tech.id,
        name: tech.name,
        symbol: `image://${dataUri}`,
        symbolSize: size * (100 / 76),
        label: {
          show: true,
          position: 'bottom',
          distance: 4,
          color: '#cbd5e1',
          fontSize: isCore ? 14 : 12,
          fontWeight: isCore ? 'bold' : 'normal',
          backgroundColor: 'rgba(3, 7, 18, 0.7)',
          padding: [4, 8],
          borderRadius: 4,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.1)',
        }
      };
    });

    const links = EDGES.map((edge) => {
      const pseudoRandom = (edge.source + edge.target) / 30;
      return {
        source: TECH_IDS[edge.source].id,
        target: TECH_IDS[edge.target].id,
        lineStyle: {
          width: 1.5,
          curveness: 0.15 + pseudoRandom * 0.1,
          opacity: 0.6,
          color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.2)' },
            { offset: 1, color: 'rgba(6, 182, 212, 0.8)' }
          ])
        }
      };
    });

    const option: any = {
      backgroundColor: 'transparent',
      tooltip: { show: false },
      animationDurationUpdate: 1500,
      animationEasingUpdate: 'quinticInOut',
      series: [
        {
          type: 'graph',
          layout: 'force',
          data: nodes,
          links: links,
          roam: true,
          label: {
            show: true
          },
          force: {
            repulsion: 400,
            edgeLength: [100, 180],
            gravity: 0.05,
            layoutAnimation: true
          },
          lineStyle: {
            color: 'source'
          },
          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              width: 3,
              opacity: 1
            }
          }
        }
      ]
    };

    chart.setOption(option);

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, []);

  return (
    <div className="w-full mt-12 mb-24 relative">
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(0.8); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        .galaxy-bg {
          background: radial-gradient(ellipse at bottom, #0d1d31 0%, #030712 100%);
        }
      `}</style>

      {/* Main Galaxy Canvas */}
      <div className="relative w-full h-[600px] md:h-[700px] galaxy-bg rounded-[40px] overflow-hidden border border-white/5 shadow-2xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-500/10 blur-[120px] pointer-events-none rounded-full" />
        
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-100 pointer-events-none"
            style={{
              width: Math.random() * 2.5 + 0.5 + 'px',
              height: Math.random() * 2.5 + 0.5 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `twinkle ${Math.random() * 4 + 2}s infinite ${Math.random() * 2}s`
            }}
          />
        ))}

        <div ref={chartRef} className="w-full h-full relative z-10" />
      </div>
    </div>
  );
}