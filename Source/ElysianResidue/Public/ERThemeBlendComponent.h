#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "ERThemeBlendComponent.generated.h"

USTRUCT(BlueprintType)
struct FERThemeWeights
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "ER|Theme")
	float UrbanPunkWeight = 0.33f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "ER|Theme")
	float MoriKeiWeight = 0.33f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "ER|Theme")
	float AngelicMarbleWeight = 0.34f;

	void Normalize();
};

UCLASS(ClassGroup=(Custom), meta=(BlueprintSpawnableComponent))
class UERThemeBlendComponent : public UActorComponent
{
	GENERATED_BODY()

public:
	UERThemeBlendComponent();

	UFUNCTION(BlueprintCallable, Category = "ER|Theme")
	void SetThemeWeights(FERThemeWeights NewWeights);

	UFUNCTION(BlueprintPure, Category = "ER|Theme")
	FERThemeWeights GetThemeWeights() const { return ThemeWeights; }

protected:
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "ER|Theme")
	FERThemeWeights ThemeWeights;
};
