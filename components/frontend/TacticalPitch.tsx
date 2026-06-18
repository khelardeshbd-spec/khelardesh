'use client';

import React from 'react';

interface PitchPlayer {
  id: string;
  name: string;
  fullName: string;
  jersey: string;
  position: string;
  positionAbbr: string;
  formationPlace: string;
  rating: number;
  avatar?: string;
}

interface TeamRoster {
  teamId: string;
  name: string;
  abbreviation: string;
  logo: string;
  color: string;
  formation: string;
  starters: PitchPlayer[];
  bench: PitchPlayer[];
}

interface TacticalPitchProps {
  homeRoster: TeamRoster;
  awayRoster: TeamRoster;
}

// Calculate all player coordinates dynamically to avoid overlaps
function calculatePitchCoordinates(players: PitchPlayer[], isHome: boolean): Map<string, { x: number; y: number }> {
  // Sort by formationPlace to ensure consistent ordering across the pitch
  const sorted = [...players].sort((a, b) => parseInt(a.formationPlace || '0') - parseInt(b.formationPlace || '0'));
  
  const defense: PitchPlayer[] = [];
  const midfield: PitchPlayer[] = [];
  const attack: PitchPlayer[] = [];
  let gk: PitchPlayer | null = null;
  
  // Group players by approximate Y band (Defense, Midfield, Attack)
  sorted.forEach(p => {
    const abbr = p.positionAbbr.toUpperCase();
    const name = p.position.toLowerCase();
    
    if (abbr === 'G' || name.includes('goalkeeper')) {
      gk = p;
    } else if (abbr.includes('B') || name.includes('back') || name.includes('defender') || abbr === 'CD') {
      defense.push(p);
    } else if (abbr.includes('M') || name.includes('midfielder')) {
      midfield.push(p);
    } else {
      attack.push(p);
    }
  });
  
  const mappedCoords = new Map<string, { x: number; y: number }>();
  
  if (gk) {
    mappedCoords.set(gk.id, { x: 50, y: isHome ? 90 : 10 });
  }
  
  // Helper to distribute players evenly across an X row with a slight natural curve
  const distributeRow = (rowPlayers: PitchPlayer[], baseY: number) => {
    const count = rowPlayers.length;
    if (count === 0) return;
    
    // Spread players from roughly x=20 to x=80
    const startX = 20;
    const endX = 80;
    const range = endX - startX;
    const step = count > 1 ? range / (count - 1) : 0;
    
    rowPlayers.forEach((p, idx) => {
      // Create a slight arc effect for aesthetics (ends slightly higher up the pitch)
      const centerDist = Math.abs((count - 1) / 2 - idx) / ((count - 1) / 2 || 1); // 0 at center, 1 at edges
      const arcOffset = isHome ? - (centerDist * 2.5) : (centerDist * 2.5); // Move edges up (smaller Y for home, larger Y for away)
      
      const x = count === 1 ? 50 : startX + (step * idx);
      const y = baseY + arcOffset;
      
      mappedCoords.set(p.id, { x, y });
    });
  };

  // Base Y positions for the 3 main bands
  distributeRow(defense, isHome ? 75 : 25);
  distributeRow(midfield, isHome ? 58 : 42);
  distributeRow(attack, isHome ? 42 : 58);
  
  return mappedCoords;
}

// Google style rating colors
function getRatingColor(rating: number): string {
  if (rating >= 7.5) return '#10b981'; // vibrant green
  if (rating >= 6.5) return '#34d399'; // light green
  if (rating >= 6.0) return '#f59e0b'; // amber/yellow
  if (rating >= 5.0) return '#f97316'; // orange
  return '#ef4444'; // red
}

export default function TacticalPitch({ homeRoster, awayRoster }: TacticalPitchProps) {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Formations Label Row */}
      <div className="w-full flex justify-between px-4 py-2 border-b border-[#e2e2e2] text-xs font-bold text-gray-500 bg-gray-50">
        <span>{awayRoster.name} ({awayRoster.formation})</span>
        <span className="text-right">{homeRoster.name} ({homeRoster.formation})</span>
      </div>

      {/* Visual Pitch Container */}
      <div 
        className="relative w-full h-[620px] max-w-[480px] overflow-hidden my-4 border border-[#e2e2e2]"
        style={{
          borderRadius: 8,
          background: '#7bc087', // Google-style light green pitch
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          touchAction: 'none',
          overscrollBehavior: 'none'
        }}
      >
        {/* --- PITCH MARKINGS --- */}
        {/* Border Line */}
        <div className="absolute inset-4 border border-white/30 pointer-events-none" />

        {/* Center Line */}
        <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-white/30 pointer-events-none" />

        {/* Center Circle */}
        <div 
          className="absolute top-1/2 left-1/2 border border-white/30 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" 
          style={{ width: 100, height: 100 }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white/40 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" 
        />

        {/* Penalty Box Top (Away) */}
        <div className="absolute top-4 left-1/2 border border-white/30 border-t-0 pointer-events-none -translate-x-1/2" style={{ width: 180, height: 80 }} />
        {/* Goal Box Top (Away) */}
        <div className="absolute top-4 left-1/2 border border-white/30 border-t-0 pointer-events-none -translate-x-1/2" style={{ width: 80, height: 26 }} />
        {/* Penalty Arc Top */}
        <div 
          className="absolute top-[84px] left-1/2 border border-white/30 rounded-full pointer-events-none -translate-x-1/2" 
          style={{ width: 60, height: 24, clipPath: 'inset(12px 0 0 0)' }}
        />

        {/* Penalty Box Bottom (Home) */}
        <div className="absolute bottom-4 left-1/2 border border-white/30 border-b-0 pointer-events-none -translate-x-1/2" style={{ width: 180, height: 80 }} />
        {/* Goal Box Bottom (Home) */}
        <div className="absolute bottom-4 left-1/2 border border-white/30 border-b-0 pointer-events-none -translate-x-1/2" style={{ width: 80, height: 26 }} />
        {/* Penalty Arc Bottom */}
        <div 
          className="absolute bottom-[84px] left-1/2 border border-white/30 rounded-full pointer-events-none -translate-x-1/2" 
          style={{ width: 60, height: 24, clipPath: 'inset(0 0 12px 0)' }}
        />


        {/* --- AWAY PLAYERS (Top Half) --- */}
        {(() => {
          const coordsMap = calculatePitchCoordinates(awayRoster.starters || [], false);
          return (awayRoster.starters || []).map((player) => {
            const coords = coordsMap.get(player.id) || { x: 50, y: 25 };
            const ratingColor = getRatingColor(player.rating);
            return (
              <div 
                key={player.id}
                className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${coords.x}%`, top: `${coords.y}%`, zIndex: 20 }}
              >
                <div className="relative flex flex-col items-center">
                  {/* Profile Avatar / Circle */}
                  {player.avatar ? (
                    <div className="w-[42px] h-[42px] sm:w-12 sm:h-12 rounded-full overflow-hidden shadow-sm flex items-center justify-center bg-gray-100 transition-transform group-hover:scale-105">
                      <img src={player.avatar} alt={player.name} className="w-full h-full object-cover scale-[1.1]" />
                    </div>
                  ) : (
                    <div 
                      className="w-[42px] h-[42px] sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm select-none transition-transform group-hover:scale-105"
                      style={{ backgroundColor: '#' + awayRoster.color }}
                    >
                      {player.name.slice(0, 2)}
                    </div>
                  )}

                  {/* Rating Badge */}
                  <div 
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white border-2 border-[#7bc087] shadow-sm select-none"
                    style={{ backgroundColor: ratingColor }}
                  >
                    {player.rating.toFixed(1)}
                  </div>
                </div>

                {/* Player Name */}
                <div className="mt-2.5 text-center px-1">
                  <span 
                    className="text-[#1a1a1a] font-semibold tracking-tight text-[10px] sm:text-[11px] whitespace-nowrap"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    <span className="font-normal text-[#333333] mr-0.5">{player.jersey}</span> {player.name}
                  </span>
                </div>
              </div>
            );
          });
        })()}


        {/* --- HOME PLAYERS (Bottom Half) --- */}
        {(() => {
          const coordsMap = calculatePitchCoordinates(homeRoster.starters || [], true);
          return (homeRoster.starters || []).map((player) => {
            const coords = coordsMap.get(player.id) || { x: 50, y: 75 };
            const ratingColor = getRatingColor(player.rating);
            return (
              <div 
                key={player.id}
                className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${coords.x}%`, top: `${coords.y}%`, zIndex: 20 }}
              >
                <div className="relative flex flex-col items-center">
                  {/* Profile Avatar / Circle */}
                  {player.avatar ? (
                    <div className="w-[42px] h-[42px] sm:w-12 sm:h-12 rounded-full overflow-hidden shadow-sm flex items-center justify-center bg-gray-100 transition-transform group-hover:scale-105">
                      <img src={player.avatar} alt={player.name} className="w-full h-full object-cover scale-[1.1]" />
                    </div>
                  ) : (
                    <div 
                      className="w-[42px] h-[42px] sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm select-none transition-transform group-hover:scale-105"
                      style={{ backgroundColor: '#' + homeRoster.color }}
                    >
                      {player.name.slice(0, 2)}
                    </div>
                  )}

                  {/* Rating Badge */}
                  <div 
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white border-2 border-[#7bc087] shadow-sm select-none"
                    style={{ backgroundColor: ratingColor }}
                  >
                    {player.rating.toFixed(1)}
                  </div>
                </div>

                {/* Player Name */}
                <div className="mt-2.5 text-center px-1">
                  <span 
                    className="text-[#1a1a1a] font-semibold tracking-tight text-[10px] sm:text-[11px] whitespace-nowrap"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    <span className="font-normal text-[#333333] mr-0.5">{player.jersey}</span> {player.name}
                  </span>
                </div>
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
}
