# UE5 Implementation Starter (Elysian Residue)

This repository now includes C++ starter classes you can drop into a UE5 project to begin turning the design prompt into an actual playable prototype.

## Included Classes

- `AERPlayerCharacter`
  - Grounded first-person movement scaffold.
  - Character Movement tuning based on the prompt.
  - Downward ground line trace helper.
- `UERThemeBlendComponent`
  - Per-room theme weights (`UrbanPunk`, `MoriKei`, `AngelicMarble`) with normalization.
- `AERBuildingToolActor`
  - Grid/fine snapped build placement data with `LayerIndex` metadata.

## Files

- `Source/ElysianResidue/Public/ERPlayerCharacter.h`
- `Source/ElysianResidue/Private/ERPlayerCharacter.cpp`
- `Source/ElysianResidue/Public/ERThemeBlendComponent.h`
- `Source/ElysianResidue/Private/ERThemeBlendComponent.cpp`
- `Source/ElysianResidue/Public/ERBuildingToolActor.h`
- `Source/ElysianResidue/Private/ERBuildingToolActor.cpp`

## How to Use in Unreal

1. Create a **new C++ UE5 project** named `ElysianResidue`.
2. Copy this repo's `Source/ElysianResidue` files into your project's `Source/ElysianResidue` module.
3. In Project Settings → Input, add mappings:
   - Axis: `MoveForward` (W=+1, S=-1)
   - Axis: `MoveRight` (D=+1, A=-1)
   - Axis: `Turn` (Mouse X)
   - Axis: `LookUp` (Mouse Y)
   - Action: `Jump` (Space)
4. Set your default pawn class to `AERPlayerCharacter` in your game mode.
5. Create Blueprint children:
   - `BP_ERPlayerCharacter`
   - `BP_ERBuildingToolActor`
6. Add static mesh spawning logic in Blueprint using `FERBuildPlacement` returned by `MakeSnappedPlacement`.
7. Add a Material Parameter Collection and bind to `UERThemeBlendComponent` values.

## What this is / is not

- ✅ **Is**: executable gameplay scaffolding you can compile and extend in UE5.
- ❌ **Is not**: a complete finished AAA game.

Use this as the first vertical slice foundation, then expand tools, UI, save/load, world streaming, and content.
