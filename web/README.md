# Elysian Residue (WebGL / Three.js Prototype)

Browser-playable vertical megastructure prototype with first-person movement and modular placement.

## Run locally

Because this uses ES modules, run a local server:

```bash
python3 -m http.server 4173
```

Then open:

- `http://localhost:4173/web/`

## Download + export to Netlify (step-by-step)

### Option A: drag-and-drop deploy (fastest)
1. Zip only the `web/` folder (inside zip should have `index.html` at root).
2. Go to Netlify → **Sites** → **Add new site** → **Deploy manually**.
3. Drag the zip file into Netlify.
4. Netlify publishes automatically and gives you a URL.

### Option B: Git deploy (recommended)
1. Push this repo to GitHub.
2. In Netlify: **Add new site** → **Import from Git**.
3. Pick your repo.
4. Build settings:
   - Build command: *(leave empty)*
   - Publish directory: `web`
5. Deploy.

`web/netlify.toml` is included for static-hosting headers. If using Git import, ensure publish dir is still `web` in the Netlify UI.

## Controls

- Click viewport to lock mouse
- `WASD` move
- Mouse look
- `Space` jump
- `Shift` sprint
- `1/2/3` switch zone aesthetic (Urban / Mori / Marble)
- `R` procedural room decor pass
- `B` cycle build piece
- `E` place build piece

## What is implemented now

- 120m-scale layered floors, split levels, balconies, loft/crawl-space style sections
- First-person grounded controller with gravity and floor raycast
- Procedural tiled materials (so scene is not flat color only)
- Atmosphere stack: gradient sky dome, drifting clouds, rain particles, dust motes, fog
- Dynamic lighting + shadows + animated neon flicker
- Ambient floating bodies to make spaces feel alive
- Outside city silhouettes
- Procedural decor palette for key furniture categories
- Basic modular placement flow for floor/wall/balcony/stair/loft pieces

## Asset placeholders for better visuals

Replace procedural geometry with your own assets:

- `web/assets/models/*.glb`
- `web/assets/textures/*`
- `web/assets/audio/*`

See `web/assets/README.md` for suggested names.

## Next upgrades

- Replace generated geometry with GLB/FBX assets from `web/assets/models`
- Add GLTFLoader pipeline and spawn real furniture meshes
- Add save/load placed objects and zone metadata
- Add in-world UI sliders for tint/emission/wear per prop
- Add interaction prompts and mission/progression loops
