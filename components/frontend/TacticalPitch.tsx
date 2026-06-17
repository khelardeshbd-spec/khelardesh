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

// Map player position abbreviations/names to precise tactical coordinates (X: 0-100, Y: 0-100)
// Home team defends bottom (GK at Y=90, FW at Y=52)
// Away team defends top (GK at Y=10, FW at Y=48)
function getPlayerCoordinates(player: PitchPlayer, isHome: boolean): { x: number; y: number } {
  const abbr = player.positionAbbr.toUpperCase();
  const name = player.position.toLowerCase();

  let x = 50;
  let y = isHome ? 75 : 25; // default center

  // Goalkeeper
  if (abbr === 'G' || name.includes('goalkeeper')) {
    return { x: 50, y: isHome ? 90 : 10 };
  }

  // Defenders / Fullbacks
  const isLB = abbr === 'LB' || abbr === 'LWB' || name.includes('left back') || name.includes('left wing back');
  const isRB = abbr === 'RB' || abbr === 'RWB' || name.includes('right back') || name.includes('right wing back');
  const isCD = abbr === 'CD' || abbr === 'CB' || name.includes('center') && name.includes('defender');
  const isCDL = abbr === 'CD-L' || abbr === 'LCB' || name.includes('center left');
  const isCDR = abbr === 'CD-R' || abbr === 'RCB' || name.includes('center right');

  if (isLB) {
    x = 18;
    y = isHome ? 78 : 22;
  } else if (isRB) {
    x = 82;
    y = isHome ? 78 : 22;
  } else if (isCDL) {
    x = 36;
    y = isHome ? 80 : 20;
  } else if (isCDR) {
    x = 64;
    y = isHome ? 80 : 20;
  } else if (isCD) {
    x = 50;
    y = isHome ? 80 : 20;
  }

  // Midfielders (DM, CM, LM, RM, AM)
  const isDM = abbr.includes('DM') || name.includes('defensive midfielder');
  const isLM = abbr === 'LM' || name.includes('left midfielder');
  const isRM = abbr === 'RM' || name.includes('right midfielder');
  const isAM = abbr.includes('AM') || name.includes('attacking midfielder');
  const isCM = abbr === 'CM' || abbr.includes('CM') || name.includes('central midfielder') || name.includes('center midfielder') || name.includes('midfielder');

  if (isDM) {
    if (abbr.includes('L') || name.includes('left')) {
      x = 35;
    } else if (abbr.includes('R') || name.includes('right')) {
      x = 65;
    } else {
      x = 50;
    }
    y = isHome ? 68 : 32;
  } else if (isLM) {
    x = 18;
    y = isHome ? 62 : 38;
  } else if (isRM) {
    x = 82;
    y = isHome ? 62 : 38;
  } else if (isAM) {
    if (abbr.includes('L') || name.includes('left')) {
      x = 32;
    } else if (abbr.includes('R') || name.includes('right')) {
      x = 68;
    } else {
      x = 50;
    }
    y = isHome ? 58 : 42;
  } else if (isCM) {
    if (abbr.includes('L') || name.includes('left')) {
      x = 35;
    } else if (abbr.includes('R') || name.includes('right')) {
      x = 65;
    } else {
      x = 50;
    }
    y = isHome ? 64 : 36;
  }

  // Forwards / Attackers
  const isLW = abbr === 'LW' || name.includes('left wing');
  const isRW = abbr === 'RW' || name.includes('right wing');
  const isCF = abbr === 'CF' || abbr === 'F' || abbr === 'ST' || name.includes('forward') || name.includes('striker');

  if (isLW) {
    x = 22;
    y = isHome ? 52 : 48;
  } else if (isRW) {
    x = 78;
    y = isHome ? 52 : 48;
  } else if (isCF) {
    if (abbr.includes('L') || name.includes('left')) {
      x = 36;
    } else if (abbr.includes('R') || name.includes('right')) {
      x = 64;
    } else {
      x = 50;
    }
    y = isHome ? 50 : 50;
  }

  // Adjust overlapping positions using formationPlace mapping as secondary heuristic
  if (player.formationPlace) {
    const place = parseInt(player.formationPlace, 10);
    // Add minor offsets based on formationPlace to prevent identical overlaps
    const offsetSeed = (place * 7) % 5 - 2; // -2 to 2
    x += offsetSeed;
  }

  return { x, y };
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
        className="relative w-full h-[620px] max-w-[480px] bg-[#1a73e8] overflow-hidden my-4 border border-[#e2e2e2]"
        style={{
          borderRadius: 8,
          // Green grass texture gradient and pitch lines
          background: 'radial-gradient(circle, #27ae60 0%, #1e824c 100%)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}
      >
        {/* --- PITCH MARKINGS --- */}
        {/* Border Line */}
        <div className="absolute inset-4 border border-white/20 pointer-events-none" />

        {/* Center Line */}
        <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-white/20 pointer-events-none" />

        {/* Center Circle */}
        <div 
          className="absolute top-1/2 left-1/2 border border-white/20 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" 
          style={{ width: 100, height: 100 }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white/30 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" 
        />

        {/* Penalty Box Top (Away) */}
        <div className="absolute top-4 left-1/2 border border-white/20 border-t-0 pointer-events-none -translate-x-1/2" style={{ width: 180, height: 80 }} />
        {/* Goal Box Top (Away) */}
        <div className="absolute top-4 left-1/2 border border-white/20 border-t-0 pointer-events-none -translate-x-1/2" style={{ width: 80, height: 26 }} />
        {/* Penalty Arc Top */}
        <div 
          className="absolute top-[84px] left-1/2 border border-white/20 rounded-full pointer-events-none -translate-x-1/2" 
          style={{ width: 60, height: 24, clipPath: 'inset(12px 0 0 0)' }}
        />

        {/* Penalty Box Bottom (Home) */}
        <div className="absolute bottom-4 left-1/2 border border-white/20 border-b-0 pointer-events-none -translate-x-1/2" style={{ width: 180, height: 80 }} />
        {/* Goal Box Bottom (Home) */}
        <div className="absolute bottom-4 left-1/2 border border-white/20 border-b-0 pointer-events-none -translate-x-1/2" style={{ width: 80, height: 26 }} />
        {/* Penalty Arc Bottom */}
        <div 
          className="absolute bottom-[84px] left-1/2 border border-white/20 rounded-full pointer-events-none -translate-x-1/2" 
          style={{ width: 60, height: 24, clipPath: 'inset(0 0 12px 0)' }}
        />


        {/* --- AWAY PLAYERS (Top Half) --- */}
        {(awayRoster.starters || []).map((player) => {
          const { x, y } = getPlayerCoordinates(player, false);
          const ratingColor = getRatingColor(player.rating);
          return (
            <div 
              key={player.id}
              className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${x}%`, top: `${y}%`, zIndex: 20 }}
            >
              {/* Player Node */}
              <div className="relative">
                {/* Profile Circle / Jersey */}
                <div 
                  className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-white text-xs font-bold shadow-md select-none transition-transform group-hover:scale-105"
                  style={{ 
                    backgroundColor: '#' + awayRoster.color, 
                    borderColor: '#ffffff',
                  }}
                >
                  {player.jersey || player.name.slice(0, 2)}
                </div>

                {/* Rating Badge */}
                <div 
                  className="absolute -bottom-1 -right-2 w-5.5 h-5.5 rounded-full flex items-center justify-center text-[9px] font-black text-white border border-white shadow select-none"
                  style={{ backgroundColor: ratingColor }}
                >
                  {player.rating.toFixed(1)}
                </div>
              </div>

              {/* Player Name */}
              <span 
                className="mt-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white font-bold tracking-tight text-[10px] whitespace-nowrap text-center"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {player.name}
              </span>
            </div>
          );
        })}


        {/* --- HOME PLAYERS (Bottom Half) --- */}
        {(homeRoster.starters || []).map((player) => {
          const { x, y } = getPlayerCoordinates(player, true);
          const ratingColor = getRatingColor(player.rating);
          return (
            <div 
              key={player.id}
              className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${x}%`, top: `${y}%`, zIndex: 20 }}
            >
              {/* Player Node */}
              <div className="relative">
                {/* Profile Circle / Jersey */}
                <div 
                  className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-white text-xs font-bold shadow-md select-none transition-transform group-hover:scale-105"
                  style={{ 
                    backgroundColor: '#' + homeRoster.color, 
                    borderColor: '#ffffff',
                  }}
                >
                  {player.jersey || player.name.slice(0, 2)}
                </div>

                {/* Rating Badge */}
                <div 
                  className="absolute -bottom-1 -right-2 w-5.5 h-5.5 rounded-full flex items-center justify-center text-[9px] font-black text-white border border-white shadow select-none"
                  style={{ backgroundColor: ratingColor }}
                >
                  {player.rating.toFixed(1)}
                </div>
              </div>

              {/* Player Name */}
              <span 
                className="mt-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white font-bold tracking-tight text-[10px] whitespace-nowrap text-center"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {player.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
