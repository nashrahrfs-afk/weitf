#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "ERBuildingToolActor.generated.h"

UENUM(BlueprintType)
enum class EERBuildPieceType : uint8
{
	Floor,
	Wall,
	Balcony,
	StairModern,
	StairSpiral,
	Archway,
	Loft
};

USTRUCT(BlueprintType)
struct FERBuildPlacement
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "ER|Build")
	EERBuildPieceType PieceType = EERBuildPieceType::Floor;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "ER|Build")
	FTransform Transform = FTransform::Identity;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "ER|Build")
	int32 LayerIndex = 0;
};

UCLASS()
class AERBuildingToolActor : public AActor
{
	GENERATED_BODY()

public:
	AERBuildingToolActor();

	UFUNCTION(BlueprintCallable, Category = "ER|Build")
	FERBuildPlacement MakeSnappedPlacement(
		EERBuildPieceType PieceType,
		const FVector& WorldLocation,
		float YawDegrees,
		int32 LayerIndex,
		bool bFineAdjust = false
	) const;

	UFUNCTION(BlueprintCallable, Category = "ER|Build")
	void AddPlacement(const FERBuildPlacement& Placement);

	UFUNCTION(BlueprintPure, Category = "ER|Build")
	const TArray<FERBuildPlacement>& GetPlacements() const { return Placements; }

protected:
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "ER|Build")
	float GridSize = 50.0f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "ER|Build")
	float RotationSnapDegrees = 15.0f;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "ER|Build")
	TArray<FERBuildPlacement> Placements;
};
