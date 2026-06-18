const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// ─── Environment Variables Loader ────────────────────────────────────────────
try {
  const envPath = path.resolve(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        let val = parts.slice(1).join('=').trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        process.env[key] = val;
      }
    });
  }
} catch (e) {
  console.log('No .env.local file found or failed to parse it.');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: Missing Supabase credentials in environment variables.");
  console.error("Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function for delaying execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log("Starting player photo backfill process...");
  
  // 1. Fetch all players where photo_url is null
  const { data: players, error } = await supabase
    .from('players')
    .select('id, name, sofascore_id')
    .is('photo_url', null);

  if (error) {
    console.error("Error fetching players from Supabase:", error);
    process.exit(1);
  }

  console.log(`Found ${players.length} players missing a photo_url.`);

  let sofascoreCount = 0;
  let wikidataCount = 0;
  let placeholderCount = 0;
  let failedCount = 0;

  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    console.log(`\n[${i + 1}/${players.length}] Processing player: ${player.name} (ID: ${player.id}, Sofascore ID: ${player.sofascore_id})`);
    
    let imageBuffer = null;
    let contentType = 'image/jpeg';
    let photoSource = null;

    // --- STEP 1: Sofascore Fallback ---
    if (player.sofascore_id) {
      const sofascoreUrl = `https://api.sofascore.com/api/v1/player/${player.sofascore_id}/image`;
      console.log(`Attempting Sofascore URL: ${sofascoreUrl}`);
      try {
        const res = await fetch(sofascoreUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
          }
        });
        if (res.ok && res.status !== 404) {
          const buffer = await res.arrayBuffer();
          // Check if it's empty or a default tiny placeholder (usually defaults are tiny or have specific content-length)
          if (buffer.byteLength > 1000) { // standard profile photo is > 1KB
            imageBuffer = Buffer.from(buffer);
            contentType = res.headers.get('content-type') || 'image/png';
            photoSource = 'sofascore';
            console.log(`Successfully fetched from Sofascore! (Size: ${buffer.byteLength} bytes)`);
          } else {
            console.log("Sofascore returned an empty/default tiny placeholder.");
          }
        } else {
          console.log(`Sofascore image returned status ${res.status}`);
        }
      } catch (err) {
        console.log(`Sofascore fetch failed: ${err.message}`);
      }
    } else {
      console.log("No Sofascore ID for this player, skipping Step 1.");
    }

    // Delay between requests
    await delay(300 + Math.random() * 200);

    // --- STEP 2: Wikidata / Wikipedia Fallback ---
    if (!imageBuffer && player.name) {
      console.log(`Attempting Wikidata search for: ${player.name}`);
      try {
        // Search Wikidata
        const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(player.name)}&type=item&language=en&format=json`;
        const searchRes = await fetch(searchUrl, {
          headers: { 'User-Agent': 'KhelardeshBot/1.0 (contact@khelardesh.com)' }
        });
        
        if (searchRes.ok) {
          const searchData = await searchRes.json();
          const entityId = searchData.search?.[0]?.id;
          
          if (entityId) {
            console.log(`Found Wikidata Entity ID: ${entityId}`);
            
            // Get claims for property P18 (image)
            const claimsUrl = `https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=${entityId}&property=P18&format=json`;
            const claimsRes = await fetch(claimsUrl, {
              headers: { 'User-Agent': 'KhelardeshBot/1.0 (contact@khelardesh.com)' }
            });
            
            if (claimsRes.ok) {
              const claimsData = await claimsRes.json();
              const fileName = claimsData.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
              
              if (fileName) {
                console.log(`Found image file name on Wikidata: ${fileName}`);
                
                // Get Wikimedia Commons URL
                const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(fileName)}&prop=imageinfo&iiprop=url&format=json`;
                const commonsRes = await fetch(commonsUrl, {
                  headers: { 'User-Agent': 'KhelardeshBot/1.0 (contact@khelardesh.com)' }
                });
                
                if (commonsRes.ok) {
                  const commonsData = await commonsRes.json();
                  const pages = commonsData.query?.pages;
                  const pageId = Object.keys(pages)[0];
                  const directImageUrl = pages[pageId]?.imageinfo?.[0]?.url;
                  
                  if (directImageUrl) {
                    console.log(`Wikimedia direct image URL: ${directImageUrl}`);
                    
                    // Download the image
                    const downloadRes = await fetch(directImageUrl, {
                      headers: { 'User-Agent': 'KhelardeshBot/1.0 (contact@khelardesh.com)' }
                    });
                    if (downloadRes.ok) {
                      const buffer = await downloadRes.arrayBuffer();
                      imageBuffer = Buffer.from(buffer);
                      contentType = downloadRes.headers.get('content-type') || 'image/jpeg';
                      photoSource = 'wikidata';
                      console.log(`Successfully downloaded from Wikimedia! (Size: ${buffer.byteLength} bytes)`);
                    } else {
                      console.log(`Failed to download Wikimedia image: status ${downloadRes.status}`);
                    }
                  }
                }
              } else {
                console.log("No P18 (image) property found for this entity.");
              }
            }
          } else {
            console.log("No matching Wikidata entity found.");
          }
        }
      } catch (err) {
        console.log(`Wikidata fallback failed: ${err.message}`);
      }
      
      // Delay between requests
      await delay(300 + Math.random() * 200);
    }

    // --- STEP 3: Save results to Supabase ---
    try {
      if (imageBuffer) {
        // Determine file extension
        let ext = 'jpg';
        if (contentType.includes('png')) ext = 'png';
        else if (contentType.includes('webp')) ext = 'webp';
        
        const fileName = `${player.id}-${Date.now()}.${ext}`;
        console.log(`Uploading image to Supabase Storage bucket 'player-photos' as: ${fileName}`);
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('player-photos')
          .upload(fileName, imageBuffer, {
            contentType,
            upsert: true
          });

        if (uploadError) {
          throw new Error(`Storage upload failed: ${uploadError.message}`);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('player-photos')
          .getPublicUrl(fileName);

        console.log(`Supabase public URL: ${publicUrl}`);

        // Update players table
        const { error: updateError } = await supabase
          .from('players')
          .update({
            photo_url: publicUrl,
            photo_source: photoSource
          })
          .eq('id', player.id);

        if (updateError) {
          throw new Error(`Database update failed: ${updateError.message}`);
        }

        if (photoSource === 'sofascore') sofascoreCount++;
        else if (photoSource === 'wikidata') wikidataCount++;
        
        console.log("Player updated successfully!");
        
      } else {
        // Fallback to placeholder
        console.log("Both fallbacks failed. Flagging as placeholder...");
        const { error: updateError } = await supabase
          .from('players')
          .update({
            photo_url: 'placeholder',
            photo_source: 'placeholder'
          })
          .eq('id', player.id);

        if (updateError) {
          throw new Error(`Database update for placeholder failed: ${updateError.message}`);
        }

        placeholderCount++;
        console.log("Player flagged as placeholder successfully!");
      }
    } catch (err) {
      console.error(`Failed to complete database operation for ${player.name}:`, err.message);
      failedCount++;
    }
  }

  // --- Print Summary ---
  console.log("\n" + "=".repeat(40));
  console.log("BACKFILL PROCESS SUMMARY");
  console.log("=".repeat(40));
  console.log(`Total Players Processed: ${players.length}`);
  console.log(`Successfully filled from Sofascore: ${sofascoreCount}`);
  console.log(`Successfully filled from Wikidata: ${wikidataCount}`);
  console.log(`Fell back to Placeholder flag:    ${placeholderCount}`);
  console.log(`Database operations failed:       ${failedCount}`);
  console.log("=".repeat(40));
}

main();
