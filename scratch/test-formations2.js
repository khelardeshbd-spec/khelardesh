const positions = [
  { p: 'LB', abbr: 'LB', place: '1' },
  { p: 'CB', abbr: 'CB', place: '2' },
  { p: 'CB', abbr: 'CB', place: '3' },
  { p: 'RB', abbr: 'RB', place: '4' },
  { p: 'CDM', abbr: 'CDM', place: '5' },
  { p: 'CDM', abbr: 'CDM', place: '6' },
  { p: 'LM', abbr: 'LM', place: '7' },
  { p: 'RM', abbr: 'RM', place: '8' },
  { p: 'CAM', abbr: 'CAM', place: '9' },
  { p: 'ST', abbr: 'ST', place: '10' },
  { p: 'GK', abbr: 'G', place: '11' }
];

function calculatePitchCoordinates(players, isHome) {
  // Sort by formationPlace to ensure consistent ordering
  const sorted = [...players].sort((a, b) => parseInt(a.formationPlace || '0') - parseInt(b.formationPlace || '0'));
  
  // Group players by approximate Y band (Defense, Midfield, Attack)
  // For GK, assign explicit coordinate
  
  const defense = [];
  const midfield = [];
  const attack = [];
  let gk = null;
  
  sorted.forEach(p => {
    const abbr = p.positionAbbr.toUpperCase();
    const name = p.position.toLowerCase();
    
    if (abbr === 'G' || name.includes('goalkeeper')) {
      gk = p;
    } else if (abbr.includes('B') || name.includes('back') || name.includes('defender')) {
      defense.push(p);
    } else if (abbr.includes('M') || name.includes('midfielder')) {
      midfield.push(p);
    } else {
      attack.push(p);
    }
  });
  
  const mappedCoords = new Map();
  
  if (gk) {
    mappedCoords.set(gk.id, { x: 50, y: isHome ? 90 : 10 });
  }
  
  // Helper to distribute players evenly across an X row
  const distributeRow = (rowPlayers, baseY) => {
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
      const arcOffset = isHome ? - (centerDist * 3) : (centerDist * 3); // Move edges up (smaller Y for home, larger Y for away)
      
      const x = count === 1 ? 50 : startX + (step * idx);
      const y = baseY + arcOffset;
      
      mappedCoords.set(p.id, { x, y });
    });
  };

  // 11 players total.
  // We need to handle sub-layers (e.g. DM vs AM) if possible.
  // A simpler robust way: just group them correctly. If midfield has 5, spread 5.
  
  distributeRow(defense, isHome ? 75 : 25);
  distributeRow(midfield, isHome ? 58 : 42);
  distributeRow(attack, isHome ? 40 : 60);
  
  return mappedCoords;
}

let players = positions.map((p, i) => ({
  id: i.toString(),
  position: p.p,
  positionAbbr: p.abbr,
  formationPlace: p.place
}));

console.log(calculatePitchCoordinates(players, true));

