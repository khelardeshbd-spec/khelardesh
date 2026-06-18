const positions = [
  { p: 'LB', abbr: 'LB' },
  { p: 'CB', abbr: 'CB' },
  { p: 'CB', abbr: 'CB' },
  { p: 'RB', abbr: 'RB' },
  { p: 'CDM', abbr: 'CDM' },
  { p: 'CDM', abbr: 'CDM' },
  { p: 'LM', abbr: 'LM' },
  { p: 'RM', abbr: 'RM' },
  { p: 'CAM', abbr: 'CAM' },
  { p: 'ST', abbr: 'ST' },
  { p: 'GK', abbr: 'G' }
];

let players = positions.map((p, i) => ({
  id: i.toString(),
  position: p.p,
  positionAbbr: p.abbr,
  formationPlace: (i + 1).toString()
}));

function getPlayerCoordinates(player, isHome) {
  const abbr = player.positionAbbr.toUpperCase();
  const name = player.position.toLowerCase();

  let x = 50;
  let y = isHome ? 75 : 25; // default center

  if (abbr === 'G' || name.includes('goalkeeper')) return { x: 50, y: isHome ? 90 : 10 };

  const isLB = abbr === 'LB' || abbr === 'LWB' || name.includes('left back') || name.includes('left wing back');
  const isRB = abbr === 'RB' || abbr === 'RWB' || name.includes('right back') || name.includes('right wing back');
  const isCD = abbr === 'CD' || abbr === 'CB' || name.includes('center') && name.includes('defender');
  const isCDL = abbr === 'CD-L' || abbr === 'LCB' || name.includes('center left');
  const isCDR = abbr === 'CD-R' || abbr === 'RCB' || name.includes('center right');

  if (isLB) { x = 18; y = isHome ? 78 : 22; }
  else if (isRB) { x = 82; y = isHome ? 78 : 22; }
  else if (isCDL) { x = 36; y = isHome ? 80 : 20; }
  else if (isCDR) { x = 64; y = isHome ? 80 : 20; }
  else if (isCD) { x = 50; y = isHome ? 80 : 20; }

  const isDM = abbr.includes('DM') || name.includes('defensive midfielder');
  const isLM = abbr === 'LM' || name.includes('left midfielder');
  const isRM = abbr === 'RM' || name.includes('right midfielder');
  const isAM = abbr.includes('AM') || name.includes('attacking midfielder');
  const isCM = abbr === 'CM' || abbr.includes('CM') || name.includes('central midfielder') || name.includes('center midfielder') || name.includes('midfielder');

  if (isDM) {
    if (abbr.includes('L') || name.includes('left')) x = 35;
    else if (abbr.includes('R') || name.includes('right')) x = 65;
    else x = 50;
    y = isHome ? 68 : 32;
  } else if (isLM) { x = 18; y = isHome ? 62 : 38; }
  else if (isRM) { x = 82; y = isHome ? 62 : 38; }
  else if (isAM) {
    if (abbr.includes('L') || name.includes('left')) x = 32;
    else if (abbr.includes('R') || name.includes('right')) x = 68;
    else x = 50;
    y = isHome ? 58 : 42;
  } else if (isCM) {
    if (abbr.includes('L') || name.includes('left')) x = 35;
    else if (abbr.includes('R') || name.includes('right')) x = 65;
    else x = 50;
    y = isHome ? 64 : 36;
  }

  const isLW = abbr === 'LW' || name.includes('left wing');
  const isRW = abbr === 'RW' || name.includes('right wing');
  const isCF = abbr === 'CF' || abbr === 'F' || abbr === 'ST' || name.includes('forward') || name.includes('striker');

  if (isLW) { x = 22; y = isHome ? 52 : 48; }
  else if (isRW) { x = 78; y = isHome ? 52 : 48; }
  else if (isCF) {
    if (abbr.includes('L') || name.includes('left')) x = 36;
    else if (abbr.includes('R') || name.includes('right')) x = 64;
    else x = 50;
    y = isHome ? 50 : 50;
  }

  if (player.formationPlace) {
    const place = parseInt(player.formationPlace, 10);
    const offsetSeed = (place * 7) % 5 - 2;
    x += offsetSeed;
  }
  return { x, y, abbr };
}

console.log(players.map(p => getPlayerCoordinates(p, true)));
