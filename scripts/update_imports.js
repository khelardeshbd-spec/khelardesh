const fs = require('fs');
const path = require('path');

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let i = 0;
    (function next() {
      let file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

const rootDir = path.join(__dirname, '..');
const frontendAppPath = path.join(rootDir, 'app/(frontend)');
const componentsPath = path.join(rootDir, 'components/frontend');

// Move all components from components/ to components/frontend/
const componentsDir = path.join(rootDir, 'components');
const items = fs.readdirSync(componentsDir);
items.forEach(item => {
  const itemPath = path.join(componentsDir, item);
  if (fs.statSync(itemPath).isFile() && item.endsWith('.tsx')) {
    fs.renameSync(itemPath, path.join(componentsPath, item));
  }
});

// Update imports in app/(frontend)
walk(frontendAppPath, (err, results) => {
  if (err) throw err;
  results.forEach(file => {
    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(file, 'utf8');
      if (content.includes('@/components/')) {
        content = content.replace(/@\/components\//g, '@/components/frontend/');
        fs.writeFileSync(file, content, 'utf8');
      }
    }
  });
  
  // Update imports inside components/frontend itself
  walk(componentsPath, (err, res) => {
    if (err) throw err;
    res.forEach(file => {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        let content = fs.readFileSync(file, 'utf8');
        // Replace absolute imports
        if (content.includes('@/components/')) {
          content = content.replace(/@\/components\//g, '@/components/frontend/');
          fs.writeFileSync(file, content, 'utf8');
        }
        // Replace relative imports (e.g. import ScoreCard from './ScoreCard')
        // We moved them all together, so relative imports like './ScoreCard' still work!
      }
    });
    console.log('Imports updated successfully.');
  });
});
