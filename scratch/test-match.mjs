const players = [
  { id: '1', formationPlace: '1', positionAbbr: 'G' },
  { id: '2', formationPlace: '2', positionAbbr: 'CD' },
  { id: '3', formationPlace: '3', positionAbbr: 'CD-L' },
  { id: '4', formationPlace: '4', positionAbbr: 'CD-R' },
  { id: '5', formationPlace: '5', positionAbbr: 'CM-L' },
  { id: '6', formationPlace: '6', positionAbbr: 'CM-R' },
  { id: '7', formationPlace: '7', positionAbbr: 'LM' },
  { id: '8', formationPlace: '8', positionAbbr: 'RM' },
  { id: '9', formationPlace: '9', positionAbbr: 'F' },
  { id: '10', formationPlace: '10', positionAbbr: 'CF-L' },
  { id: '11', formationPlace: '11', positionAbbr: 'CF-R' }
].map(p => ({ ...p, position: p.positionAbbr }));

function calculatePitchCoordinates(players, isHome) {
  const sorted = [...players].sort((a, b) => parseInt(a.formationPlace || '0') - parseInt(b.formationPlace || '0'));
  
  const defense = [];
  const midfield = [];
  const attack = [];
  let gk = null;
  
  sorted.forEach(p => {
    const abbr = p.positionAbbr.toUpperCase();
    const name = p.position.toLowerCase();
    
    if (abbr === 'G' || name.includes('goalkeeper')) {
      gk = p;
    } else if (abbr.includes('B') || name.includes('back') || name.includes('defender') || abbr.includes('CD')) {
      defense.push(p);
    } else if (abbr.includes('M') || name.includes('midfielder')) {
      midfield.push(p);
    } else {
      attack.push(p);
    }
  });
  
  console.log('DEF:', defense.map(p => p.positionAbbr));
  console.log('MID:', midfield.map(p => p.positionAbbr));
  console.log('ATT:', attack.map(p => p.positionAbbr));
  
  const mappedCoords = new Map();
  
  if (gk) {
    mappedCoords.set(gk.id, { x: 50, y: isHome ? 90 : 10 });
  }
  
  const distributeRow = (rowPlayers, baseY) => {
    const count = rowPlayers.length;
    if (count === 0) return;
    const startX = 20;
    const endX = 80;
    const range = endX - startX;
    const step = count > 1 ? range / (count - 1) : 0;
    
    rowPlayers.forEach((p, idx) => {
      const centerDist = Math.abs((count - 1) / 2 - idx) / ((count - 1) / 2 || 1);
      const arcOffset = isHome ? - (centerDist * 2.5) : (centerDist * 2.5);
      const x = count === 1 ? 50 : startX + (step * idx);
      const y = baseY + arcOffset;
      mappedCoords.set(p.id, { x, y });
    });
  };

  distributeRow(defense, isHome ? 75 : 25);
  distributeRow(midfield, isHome ? 58 : 42);
  distributeRow(attack, isHome ? 42 : 58);
  
  return mappedCoords;
}

const map = calculatePitchCoordinates(players, false);
players.forEach(p => {
  const c = map.get(p.id);
  console.log(p.positionAbbr + ': ' + (c ? 'X:' + c.x.toFixed(1) + ' Y:' + c.y.toFixed(1) : 'NOT RENDERED'));
});
