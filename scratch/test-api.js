const fetch = require('node-fetch');

async function test() {
  const res = await fetch('http://localhost:3000/api/scores');
  const data = await res.json();
  console.log('Total matches fetched:', data.matches?.length || 0);
  
  if (data.matches) {
     const finished = data.matches.filter(m => m.isFinished && !m.isLive);
     console.log('Finished matches:', finished.length);
     
     const byDate = {};
     data.matches.forEach(m => {
       const d = new Date(m.startTime).toISOString().split('T')[0];
       byDate[d] = (byDate[d] || 0) + 1;
     });
     console.log('Matches by Date:', byDate);
  }
}

test();
