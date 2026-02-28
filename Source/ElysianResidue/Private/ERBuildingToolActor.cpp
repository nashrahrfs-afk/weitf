#include "ERBuildingToolActor.h"

AERBuildingToolActor::AERBuildingToolActor()
{
	PrimaryActorTick.bCanEverTick = false;
}

FERBuildPlacement AERBuildingToolActor::MakeSnappedPlacement(
	EERBuildPieceType PieceType,
	const FVector& WorldLocation,
	float YawDegrees,
	int32 LayerIndex,
	bool bFineAdjust
) const
{
	FERBuildPlacement Placement;
	Placement.PieceType = PieceType;
	Placement.LayerIndex = LayerIndex;

	const float UseGrid = bFineAdjust ? GridSize * 0.25f : GridSize;
	FVector Snapped = WorldLocation;
	Snapped.X = FMath::GridSnap(WorldLocation.X, UseGrid);
	Snapped.Y = FMath::GridSnap(WorldLocation.Y, UseGrid);
	Snapped.Z = FMath::GridSnap(WorldLocation.Z, UseGrid);

	const float UseRotSnap = bFineAdjust ? RotationSnapDegrees * 0.5f : RotationSnapDegrees;
	const float SnappedYaw = FMath::GridSnap(YawDegrees, UseRotSnap);

	Placement.Transform = FTransform(FRotator(0.0f, SnappedYaw, 0.0f), Snapped, FVector::OneVector);
	return Placement;
}

void AERBuildingToolActor::AddPlacement(const FERBuildPlacement& Placement)
{
	Placements.Add(Placement);
}
