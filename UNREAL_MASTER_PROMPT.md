# 🎮 UNREAL ENGINE MASTER PROMPT

## “Elysian Residue” — High-Fidelity Architectural Sandbox

### PROJECT TYPE

Create a large-scale Unreal Engine 5 sandbox building game titled **“Elysian Residue.”**

Use:

- Lumen (Global Illumination)
- Nanite (high-detail meshes)
- Virtual Shadow Maps
- World Partition (if needed for scale)
- Blueprint-based building tools
- Character Movement Component for player controller

---

## 🏢 WORLD STRUCTURE

Design a **massive vertical apartment megastructure**.

Each floor must:

- Be no smaller than 120m x 120m
- Include multiple elevation layers
- Contain split-level living areas
- Include balconies and overhangs
- Have spiral + modern staircases
- Include loft sections
- Contain hidden corridors
- Include under-floor crawl spaces
- Have rooftop garden access sections

Avoid box layouts.
Avoid small rooms.
Avoid flat floor-only design.

Create architectural depth, height variation, and layered geometry.

### Vertical Layer Stack (Required)

Every major floor should be designed as a **5-layer vertical stack**:

1. **Subfloor Layer**: utility tunnels, crawlspaces, drainage, pipe corridors
2. **Primary Living Layer**: main circulation + social spaces
3. **Split-Mezzanine Layer**: half-level offsets for bedrooms/studios
4. **Overhang/Balcony Layer**: bridges, cantilevers, suspended access
5. **Ceiling/Rafter Layer**: beams, skylight wells, hanging decor, maintenance routes

At least 3 of these 5 layers must be player-accessible on any full-size floor.

### Macro Spatial Rhythm

To prevent repetition, enforce floor archetype rotation:

- Floor A: wide civic/open-concourse style
- Floor B: dense residential labyrinth style
- Floor C: mixed gallery + atrium style
- Floor D: industrial service + hidden-route style

Repeat with variation every 4 floors (materials, stairs, ceiling heights, void placement).

---

## 🚶 PLAYER CONTROLLER (Unreal Implementation)

Create a smooth grounded first-person controller using:

- Capsule collider
- Character Movement Component
- Proper floor trace (line trace downward for ground detection)
- Stable acceleration curve
- Low air control
- Controlled jump Z velocity
- Proper stair stepping height
- No camera sway
- Very subtle head bob (optional)
- No excessive inertia
- Clean collision response
- Fixed camera pivot (non-wobbly)

Movement must feel stable like Roblox or Minecraft, but slightly more realistic and weighted.

### Suggested Baseline Tuning (UE5)

- Max Walk Speed: 460–520
- Max Acceleration: 1800–2600
- Braking Deceleration Walking: 1600–2200
- Ground Friction: 6–8
- Air Control: 0.08–0.18
- Jump Z Velocity: 420–520
- Max Step Height: 45–60

Use these as defaults, then tune per playtest.

---

## 🌫 LIGHTING & RENDERING

Use Unreal 5 rendering systems:

- Lumen global illumination
- Volumetric fog
- Reflection captures
- Dynamic day/night cycle
- Light shafts through windows
- High-resolution PBR materials
- 4K marble material with subtle roughness variation
- Moss material with displacement
- Emissive neon materials with bloom

Outside windows:

- Fog-covered procedural cityscape
- Distant building silhouettes
- Subtle neon flicker
- Moving cloud layer
- Soft ambient haze

### Layered Lighting Passes

Run lighting in passes so each floor has depth:

1. **Base pass**: physical key/fill practical lights
2. **Mood pass**: emissive accents + localized fog cards
3. **Story pass**: flicker variation, broken fixtures, shaft placement
4. **Readability pass**: silhouette recovery for navigation paths

---

## 🎨 AESTHETIC BLENDING SYSTEM

Create a zone-based aesthetic blending system.

Each zone can mix:

#### Urban Punk

- Exposed concrete walls
- Rusted metal beams
- Industrial pipes
- Neon signage
- Graffiti decals
- Rough texture normals

#### Mori Kei

- Warm wooden beams
- Moss creeping along walls
- Hanging herbs
- Soft linen curtains
- Wooden cabinets
- Warm yellow point lights

#### Angelic Marble

- White marble floors
- Gold trim detailing
- Arched ceilings
- Soft volumetric light beams
- Minimal marble statues
- Polished reflective surfaces

Use material instances so themes can blend per room.

### Blend Weights (Per Room)

Assign 0.0–1.0 blend weights for each theme:

- `UrbanPunkWeight`
- `MoriKeiWeight`
- `AngelicMarbleWeight`

Normalize to 1.0 total and drive:

- Material parameter collections
- Decal spawn tables
- Light temperature/intensity presets
- Ambient audio profile selection

---

## 🏗 MODULAR BUILDING SYSTEM (Blueprint Tools)

Implement interactive construction tools:

- Floor stamping tool (grid or free placement)
- Wall extrusion tool (drag-based spline system)
- Curved wall generator
- Balcony generator
- Spiral staircase generator
- Modern staircase generator
- Multi-height floor editing
- Archway insertion tool
- Loft creation tool

All tools must snap cleanly.
Allow rotation snapping + fine adjustment.

### Layer-Aware Building Rules

- Any tool placement must store `LayerIndex` metadata.
- Walls and stairs should auto-detect neighboring layers for openings.
- Balcony generation should support underside detail meshes.
- Loft tool must auto-cut floor volumes and create guardrails.

---

## 🛋 FURNITURE SYSTEM

Create themed modular furniture packs.

Each object must include:

- Adjustable material instance
- Tint slider
- Emission slider (for neon)
- Wear/dirt slider
- Roughness control
- Optional decal overlay system

Furniture types:

- Ivy plants
- Chandeliers
- Vintage radios
- Marble statues
- Glass partitions
- Neon signs
- Wooden cabinets
- Leather couches
- Hanging lamps
- Bookshelves
- Potted moss

### Furniture Density Layers

Support decor density profiles per room:

- **Sparse**: hero props only
- **Balanced**: practical + decorative props
- **Dense**: stacked storytelling props + clutter anchors

---

## 🧠 PROCEDURAL DECORATION SYSTEM

Create an AI-assisted room decorator:

- User selects aesthetic intensity sliders
- System places decor props logically
- Adds wall decals
- Adjusts lighting warmth
- Applies material blending
- Ensures no clutter overlap

Rooms must look layered and lived-in, not empty.

### Decor Pass Order

1. Structural anchors (large furniture)
2. Secondary function props (storage, lights, partitions)
3. Lifestyle clutter (books, plants, cloth, tools)
4. Surface dressing (decals, dirt masks, edge wear)
5. Validation pass (overlap, pathing, gameplay readability)

---

## 🌆 ENVIRONMENT SCALE

The megastructure must feel:

- Large
- Vertical
- Expansive
- Deep
- Cinematic
- Architecturally complex

Avoid:

- Minimal scenes
- Repetitive small rooms
- Flat geometry
- Empty spaces

### Scale Targets

- Playable floors target: 12+ distinct major floors
- Average floor-to-floor vertical variation: 4m–12m
- Visible long sightlines per floor: minimum 3
- Traversal loop per floor: at least 2 primary + 2 hidden routes

---

## 🎬 ATMOSPHERIC DETAIL

Add:

- Dust particles in sunlight
- Subtle ambient audio zones
- Reverb changes per room size
- Light flicker events
- Soft wind audio near balconies

### Layered Audio Zones

Each floor should include at least 4 blended audio layers:

- Infrastructure hum
- Wind leakage/vent tones
- Distant city ambience
- Local prop detail loops

---

## ⚙️ EXECUTION BLUEPRINT (Build Order)

Execute in this order to avoid shallow output:

1. **Blockout Phase**: macro vertical stack + circulation + traversal loops
2. **Systems Phase**: movement controller + construction tool prototypes
3. **Layering Phase**: split-levels, hidden routes, underfloor access, overhang depth
4. **Aesthetic Phase**: theme blending + material instance controls
5. **Atmosphere Phase**: fog, shafts, decals, particles, audio zoning
6. **Polish Phase**: collision cleanup, readability pass, performance tuning

If scope is too large, ship a **Vertical Slice** first:

- 3 fully realized floors
- full toolchain prototype
- one complete decor automation pass
- day/night cycle + atmosphere stack

---

## 🎯 FINAL DESIGN GOAL

The game must feel:

- Immersive
- Cinematic
- Architecturally layered
- Highly aesthetic
- Large-scale
- Deep
- Detailed
- Not basic

---

## 🔥 IMPORTANT NOTE

This prompt guides structure and system scaffolding.
Unreal will not auto-generate a full AAA product from one prompt alone.

To reach top-tier quality, iterate through:

1. Base architecture generation
2. Modular asset production
3. Lighting refinement
4. Material optimization
5. Movement and traversal tuning
6. Performance + memory optimization
