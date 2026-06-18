'use client';

import React, { useState } from 'react';

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
  cards?: string[];
  subbedOut?: string | null;
  subbedIn?: string | null;
  goals?: number;
  assists?: number;
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

// Calculate player coordinates for a vertical half-pitch team lineup
function calculateSinglePitchCoordinates(players: PitchPlayer[], formation: string): Map<string, { x: number; y: number }> {
  const f = (formation || '4-4-2').replace(/\s+/g, '');
  const mappedCoords = new Map<string, { x: number; y: number }>();
  
  // Custom coordinate maps based on formationPlace (1-11)
  const formationPlaceMaps: Record<string, Record<number, { x: number; y: number }>> = {
    '4-2-3-1': {
      1: { x: 50, y: 12 }, // GK
      2: { x: 80, y: 32 }, // RB
      3: { x: 20, y: 32 }, // LB
      5: { x: 60, y: 32 }, // RCB
      6: { x: 40, y: 32 }, // LCB
      4: { x: 38, y: 52 }, // LDM
      8: { x: 62, y: 52 }, // RDM
      11: { x: 22, y: 70 }, // LM / LAM
      7: { x: 78, y: 70 }, // RM / RAM
      10: { x: 50, y: 70 }, // CAM
      9: { x: 50, y: 86 }  // ST
    },
    '4-4-2': {
      1: { x: 50, y: 12 }, // GK
      2: { x: 80, y: 32 }, // RB
      3: { x: 20, y: 32 }, // LB
      5: { x: 60, y: 32 }, // RCB
      6: { x: 40, y: 32 }, // LCB
      11: { x: 20, y: 58 }, // LM
      7: { x: 80, y: 58 }, // RM
      8: { x: 40, y: 58 }, // LCM
      4: { x: 60, y: 58 }, // RCM
      9: { x: 38, y: 84 }, // LF
      10: { x: 62, y: 84 } // RF
    },
    '4-3-3': {
      1: { x: 50, y: 12 }, // GK
      2: { x: 80, y: 32 }, // RB
      3: { x: 20, y: 32 }, // LB
      5: { x: 60, y: 32 }, // RCB
      6: { x: 40, y: 32 }, // LCB
      4: { x: 35, y: 55 }, // LCM
      8: { x: 65, y: 55 }, // RCM
      10: { x: 50, y: 50 }, // CM / DM
      11: { x: 25, y: 76 }, // LW
      7: { x: 75, y: 76 }, // RW
      9: { x: 50, y: 86 }  // ST
    },
    '3-5-2': {
      1: { x: 50, y: 12 }, // GK
      2: { x: 50, y: 32 }, // CB
      5: { x: 72, y: 32 }, // RCB
      6: { x: 28, y: 32 }, // LCB
      3: { x: 18, y: 55 }, // LWB / LM
      7: { x: 82, y: 55 }, // RWB / RM
      4: { x: 35, y: 55 }, // LCM
      8: { x: 65, y: 55 }, // RCM
      10: { x: 50, y: 68 }, // CAM
      9: { x: 38, y: 84 }, // LF
      11: { x: 62, y: 84 } // RF
    },
    '5-3-2': {
      1: { x: 50, y: 12 }, // GK
      2: { x: 82, y: 32 }, // RWB
      3: { x: 18, y: 32 }, // LWB
      5: { x: 62, y: 32 }, // RCB
      6: { x: 38, y: 32 }, // LCB
      10: { x: 50, y: 32 }, // CB
      4: { x: 35, y: 56 }, // LCM
      8: { x: 65, y: 56 }, // RCM
      7: { x: 50, y: 56 }, // CM
      9: { x: 38, y: 82 }, // LF
      11: { x: 62, y: 82 } // RF
    },
    '5-4-1': {
      1: { x: 50, y: 12 }, // GK
      2: { x: 82, y: 32 }, // RWB
      3: { x: 18, y: 32 }, // LWB
      5: { x: 62, y: 32 }, // RCB
      6: { x: 38, y: 32 }, // LCB
      10: { x: 50, y: 32 }, // CB
      11: { x: 22, y: 58 }, // LM
      7: { x: 78, y: 58 }, // RM
      8: { x: 40, y: 58 }, // LCM
      4: { x: 60, y: 58 }, // RCM
      9: { x: 50, y: 84 }  // ST
    },
    '3-4-3': {
      1: { x: 50, y: 12 }, // GK
      2: { x: 50, y: 32 }, // CB
      5: { x: 72, y: 32 }, // RCB
      6: { x: 28, y: 32 }, // LCB
      3: { x: 18, y: 56 }, // LM
      7: { x: 82, y: 56 }, // RM
      4: { x: 38, y: 56 }, // LCM
      8: { x: 62, y: 56 }, // RCM
      11: { x: 25, y: 76 }, // LW
      10: { x: 75, y: 76 }, // RW
      9: { x: 50, y: 86 }  // ST
    }
  };

  const currentMap = formationPlaceMaps[f];
  
  // Try to use formationPlace if it maps successfully
  let successfullyMappedCount = 0;
  players.forEach(p => {
    const place = parseInt(p.formationPlace || '0', 10);
    if (currentMap && currentMap[place]) {
      mappedCoords.set(p.id, currentMap[place]);
      successfullyMappedCount++;
    } else {
      // General fallback mappings if the specific formation is not matched
      const fallbackMap: Record<number, { x: number; y: number }> = {
        1: { x: 50, y: 12 },
        2: { x: 80, y: 32 },
        3: { x: 20, y: 32 },
        4: { x: 38, y: 55 },
        5: { x: 60, y: 32 },
        6: { x: 40, y: 32 },
        7: { x: 75, y: 68 },
        8: { x: 62, y: 55 },
        9: { x: 50, y: 86 },
        10: { x: 50, y: 68 },
        11: { x: 25, y: 68 }
      };
      if (fallbackMap[place]) {
        mappedCoords.set(p.id, fallbackMap[place]);
        successfullyMappedCount++;
      }
    }
  });

  // If the majority of players are mapped, return the map.
  // Otherwise, fall back to the old purely heuristic row-based distributor.
  if (successfullyMappedCount >= 8) {
    return mappedCoords;
  }

  // Clear and run old dynamic distribution logic
  mappedCoords.clear();

  // Sort by formationPlace
  const sorted = [...players].sort((a, b) => parseInt(a.formationPlace || '0') - parseInt(b.formationPlace || '0'));
  
  const defense: PitchPlayer[] = [];
  const midfield: PitchPlayer[] = [];
  const attack: PitchPlayer[] = [];
  let gk: PitchPlayer | null = null;
  
  sorted.forEach(p => {
    const abbr = p.positionAbbr.toUpperCase();
    const name = p.position.toLowerCase();
    
    if (abbr === 'G' || name.includes('goalkeeper')) {
      gk = p;
    } else if (abbr.includes('B') || name.includes('back') || name.includes('defender') || abbr === 'CD' || abbr === 'CB' || abbr === 'LB' || abbr === 'RB' || abbr === 'LWB' || abbr === 'RWB') {
      defense.push(p);
    } else if (abbr.includes('M') || name.includes('midfielder') || abbr === 'DM' || abbr === 'AM' || abbr === 'CM' || abbr === 'LM' || abbr === 'RM') {
      midfield.push(p);
    } else {
      attack.push(p);
    }
  });
  
  // Goalkeeper at the top center
  if (gk) {
    mappedCoords.set((gk as PitchPlayer).id, { x: 50, y: 15 });
  }
  
  // Distribute other rows
  const distributeRow = (rowPlayers: PitchPlayer[], baseY: number) => {
    const count = rowPlayers.length;
    if (count === 0) return;
    
    const startX = 18;
    const endX = 82;
    const range = endX - startX;
    const step = count > 1 ? range / (count - 1) : 0;
    
    rowPlayers.forEach((p, idx) => {
      const x = count === 1 ? 50 : startX + (step * idx);
      
      // Arc curve: outer players are lower (towards bottom, larger Y)
      const centerDist = Math.abs(50 - x) / 50;
      const arcOffset = centerDist * 5;
      
      const y = baseY + arcOffset;
      mappedCoords.set(p.id, { x, y });
    });
  };
  
  distributeRow(defense, 38);
  distributeRow(midfield, 62);
  distributeRow(attack, 82);
  
  return mappedCoords;
}

// Google style rating colors
function getRatingStyle(rating: number): { bg: string; text: string } {
  if (rating >= 7.0) return { bg: '#1e8e3e', text: '#ffffff' }; // Google green
  if (rating >= 6.0) return { bg: '#f9ab00', text: '#ffffff' }; // Google yellow/orange
  return { bg: '#d93025', text: '#ffffff' }; // Google red
}

function TeamPitch({ roster, selectedSubTab, isAway = false }: { roster: TeamRoster; selectedSubTab: 'performance' | 'age' | 'club'; isAway?: boolean }) {
  const coordsMap = calculateSinglePitchCoordinates(roster.starters || [], roster.formation);

  return (
    <div className="w-full bg-[#72bb85] rounded-xl border border-[#c1e5cc] shadow-sm overflow-hidden mb-6 max-w-[480px]">
      {/* Team Header Bar */}
      <div className="flex justify-between items-center px-4 py-3 bg-[#6eba81]/20 border-b border-white/10">
        <div className="flex items-center gap-2">
          {roster.logo ? (
            <img src={roster.logo} alt="" className="w-5 h-5 object-contain rounded-sm" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold text-[#202124]">
              {roster.abbreviation}
            </div>
          )}
          <span className="text-[13px] font-bold text-[#202124]">{roster.name}</span>
        </div>
        <div className="text-[11px] font-bold text-[#202124] bg-white/20 border border-white/30 px-2 py-0.5 rounded-full">
          {roster.formation}
        </div>
      </div>

      {/* Visual Pitch Container */}
      <div className="relative w-full h-[410px] overflow-hidden">
        {/* --- PITCH MARKINGS --- */}
        {!isAway ? (
          <>
            {/* Top Half Outer boundaries */}
            <div className="absolute top-4 left-4 right-4 bottom-0 border border-white/20 border-b-0 pointer-events-none" />
            {/* Half-way line */}
            <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-white/20 pointer-events-none" />
            {/* Center circle arc */}
            <div 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 border border-white/20 rounded-full pointer-events-none translate-y-1/2" 
              style={{ width: 100, height: 100 }}
            />
            {/* Penalty Box (Top) */}
            <div className="absolute top-4 left-1/2 border border-white/20 border-t-0 pointer-events-none -translate-x-1/2" style={{ width: 160, height: 60 }} />
            {/* Goal Box (Top) */}
            <div className="absolute top-4 left-1/2 border border-white/20 border-t-0 pointer-events-none -translate-x-1/2" style={{ width: 70, height: 20 }} />
            {/* Penalty Spot */}
            <div className="absolute top-[46px] left-1/2 w-1 h-1 bg-white/40 rounded-full pointer-events-none -translate-x-1/2" />
            {/* Penalty Arc */}
            <div 
              className="absolute top-[60px] left-1/2 border border-white/20 border-t-0 rounded-b-full pointer-events-none -translate-x-1/2" 
              style={{ width: 50, height: 20 }}
            />
          </>
        ) : (
          <>
            {/* Bottom Half Outer boundaries */}
            <div className="absolute top-0 left-4 right-4 bottom-4 border border-white/20 border-t-0 pointer-events-none" />
            {/* Half-way line */}
            <div className="absolute top-0 left-4 right-4 h-[1px] bg-white/20 pointer-events-none" />
            {/* Center circle arc */}
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 border border-white/20 rounded-full pointer-events-none -translate-y-1/2" 
              style={{ width: 100, height: 100 }}
            />
            {/* Penalty Box (Bottom) */}
            <div className="absolute bottom-4 left-1/2 border border-white/20 border-b-0 pointer-events-none -translate-x-1/2" style={{ width: 160, height: 60 }} />
            {/* Goal Box (Bottom) */}
            <div className="absolute bottom-4 left-1/2 border border-white/20 border-b-0 pointer-events-none -translate-x-1/2" style={{ width: 70, height: 20 }} />
            {/* Penalty Spot */}
            <div className="absolute bottom-[46px] left-1/2 w-1 h-1 bg-white/40 rounded-full pointer-events-none -translate-x-1/2" />
            {/* Penalty Arc */}
            <div 
              className="absolute bottom-[60px] left-1/2 border border-white/20 border-b-0 rounded-t-full pointer-events-none -translate-x-1/2" 
              style={{ width: 50, height: 20 }}
            />
          </>
        )}

        {/* --- PLAYERS --- */}
        {(roster.starters || []).map((player) => {
          let coords = coordsMap.get(player.id) || { x: 50, y: 50 };
          
          // Rotate coordinates 180 degrees for away team so they face each other on the pitch
          if (isAway) {
            coords = { x: 100 - coords.x, y: 100 - coords.y };
          }
          
          let pillText = '';
          let pillBg = '#757575';
          let pillTextColor = '#ffffff';

          if (selectedSubTab === 'performance') {
            if (player.rating > 0) {
              pillText = player.rating.toFixed(1);
              const style = getRatingStyle(player.rating);
              pillBg = style.bg;
              pillTextColor = style.text;
            }
          } else if (selectedSubTab === 'age') {
            const mockAge = (parseInt(player.id || '0') % 12) + 21;
            pillText = `${mockAge}`;
            pillBg = '#f1f3f4';
            pillTextColor = '#5f6368';
          } else if (selectedSubTab === 'club') {
            const clubs = ['RMA', 'FCB', 'MCI', 'ARS', 'PSG', 'JUV', 'BAY', 'CHE', 'LIV', 'ATM', 'INT', 'MIL'];
            pillText = clubs[parseInt(player.id || '0') % clubs.length];
            pillBg = '#f1f3f4';
            pillTextColor = '#5f6368';
          }

          const hasPill = pillText !== '';

          // Emojis for events
          let displayLabel = player.name;
          if (player.goals && player.goals > 0) {
            displayLabel += ` ⚽${player.goals > 1 ? `x${player.goals}` : ''}`;
          }

          return (
            <div 
              key={player.id}
              className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${coords.x}%`, top: `${coords.y}%`, zIndex: 20 }}
            >
              <div className="relative flex flex-col items-center">
                {/* Profile Avatar Container */}
                {player.avatar ? (
                  <div className="w-[42px] h-[42px] sm:w-11 sm:h-11 rounded-full overflow-hidden border border-white/50 shadow-sm flex items-center justify-center bg-gray-100 transition-transform group-hover:scale-105 relative">
                    <img 
                      src={player.avatar} 
                      alt={player.name} 
                      className="w-full h-full object-cover scale-[1.05] z-10"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div 
                      className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold select-none z-0 animate-pulse"
                      style={{ backgroundColor: '#' + roster.color }}
                    >
                      {player.jersey || player.name.slice(0, 2)}
                    </div>
                  </div>
                ) : (
                  <div 
                    className="w-[42px] h-[42px] sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm select-none border border-white/50 transition-transform group-hover:scale-105"
                    style={{ backgroundColor: '#' + roster.color }}
                  >
                    {player.jersey || player.name.slice(0, 2)}
                  </div>
                )}

                {/* Subbed Out Indicator */}
                {player.subbedOut && (
                  <div 
                    className="absolute -top-1 -left-1 w-[15px] h-[15px] rounded-full bg-[#fce8e6] border border-[#d93025] flex items-center justify-center shadow-sm z-30"
                    title={`Subbed out at ${player.subbedOut}`}
                  >
                    <svg className="w-2.5 h-2.5 text-[#d93025]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                )}

                {/* Card Indicator */}
                {player.cards && player.cards.length > 0 && (
                  <div 
                    className="absolute -top-1 -right-1.5 w-3 h-4 rounded-sm border border-white shadow-sm z-30"
                    style={{ backgroundColor: player.cards.includes('red') ? '#d93025' : '#f9ab00' }}
                    title={player.cards.includes('red') ? 'Red Card' : 'Yellow Card'}
                  />
                )}

                {/* Rating / Value Badge */}
                {hasPill && (
                  <div 
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-1 py-0.5 rounded-full text-[9px] font-black border border-white shadow-sm select-none z-20 flex items-center justify-center min-w-[24px]"
                    style={{ backgroundColor: pillBg, color: pillTextColor }}
                  >
                    {pillText}
                  </div>
                )}
              </div>

              {/* Player Name */}
              <div className="mt-2 text-center w-[75px] px-0.5 overflow-hidden">
                <span 
                  className="text-[#202124] font-bold tracking-tight text-[10px] sm:text-[11px] block truncate"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  <span className="font-normal text-gray-500 mr-0.5">{player.jersey}</span> {displayLabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TacticalPitch({ homeRoster, awayRoster }: TacticalPitchProps) {
  const [selectedSubTab, setSelectedSubTab] = useState<'performance' | 'age' | 'club'>('performance');

  return (
    <div className="w-full flex flex-col items-center">
      {/* Sub tabs matching Google Search lineup widget */}
      <div className="flex gap-6 border-b border-gray-200 pb-2 mb-4 text-xs font-bold w-full justify-start px-2">
        <button 
          onClick={() => setSelectedSubTab('performance')} 
          className={`pb-1.5 relative transition-colors ${selectedSubTab === 'performance' ? 'text-[#1a73e8]' : 'text-gray-500 hover:text-gray-800'}`}
        >
          Performance
          {selectedSubTab === 'performance' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1a73e8] rounded-full" />
          )}
        </button>
        <button 
          onClick={() => setSelectedSubTab('age')} 
          className={`pb-1.5 relative transition-colors ${selectedSubTab === 'age' ? 'text-[#1a73e8]' : 'text-gray-500 hover:text-gray-800'}`}
        >
          Age
          {selectedSubTab === 'age' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1a73e8] rounded-full" />
          )}
        </button>
        <button 
          onClick={() => setSelectedSubTab('club')} 
          className={`pb-1.5 relative transition-colors ${selectedSubTab === 'club' ? 'text-[#1a73e8]' : 'text-gray-500 hover:text-gray-800'}`}
        >
          Club
          {selectedSubTab === 'club' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1a73e8] rounded-full" />
          )}
        </button>
      </div>

      {/* Render Home Team Pitch */}
      {homeRoster?.starters?.length > 0 && (
        <TeamPitch roster={homeRoster} selectedSubTab={selectedSubTab} isAway={false} />
      )}

      {/* Render Away Team Pitch */}
      {awayRoster?.starters?.length > 0 && (
        <TeamPitch roster={awayRoster} selectedSubTab={selectedSubTab} isAway={true} />
      )}
    </div>
  );
}
