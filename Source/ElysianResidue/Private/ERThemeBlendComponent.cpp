#include "ERThemeBlendComponent.h"

void FERThemeWeights::Normalize()
{
	UrbanPunkWeight = FMath::Max(UrbanPunkWeight, 0.0f);
	MoriKeiWeight = FMath::Max(MoriKeiWeight, 0.0f);
	AngelicMarbleWeight = FMath::Max(AngelicMarbleWeight, 0.0f);

	const float Total = UrbanPunkWeight + MoriKeiWeight + AngelicMarbleWeight;
	if (Total <= KINDA_SMALL_NUMBER)
	{
		UrbanPunkWeight = MoriKeiWeight = AngelicMarbleWeight = 1.0f / 3.0f;
		return;
	}

	UrbanPunkWeight /= Total;
	MoriKeiWeight /= Total;
	AngelicMarbleWeight /= Total;
}

UERThemeBlendComponent::UERThemeBlendComponent()
{
	PrimaryComponentTick.bCanEverTick = false;
	ThemeWeights.Normalize();
}

void UERThemeBlendComponent::SetThemeWeights(FERThemeWeights NewWeights)
{
	NewWeights.Normalize();
	ThemeWeights = NewWeights;
}
