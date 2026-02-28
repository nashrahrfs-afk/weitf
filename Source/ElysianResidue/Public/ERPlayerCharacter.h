#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "ERPlayerCharacter.generated.h"

class UCameraComponent;

UCLASS()
class AERPlayerCharacter : public ACharacter
{
	GENERATED_BODY()

public:
	AERPlayerCharacter();

	virtual void SetupPlayerInputComponent(class UInputComponent* PlayerInputComponent) override;
	virtual void Tick(float DeltaSeconds) override;

protected:
	virtual void BeginPlay() override;

	void MoveForward(float Value);
	void MoveRight(float Value);
	void StartJump();
	void StopJump();
	void LookYaw(float Value);
	void LookPitch(float Value);
	bool IsGroundedByTrace() const;

	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "ER|Camera")
	TObjectPtr<UCameraComponent> FirstPersonCamera;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "ER|Movement")
	float GroundTraceDistance = 110.0f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "ER|Movement")
	float LookRateYaw = 1.0f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "ER|Movement")
	float LookRatePitch = 1.0f;
};
