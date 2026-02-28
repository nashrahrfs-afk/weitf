#include "ERPlayerCharacter.h"

#include "Camera/CameraComponent.h"
#include "Components/CapsuleComponent.h"
#include "GameFramework/CharacterMovementComponent.h"
#include "Kismet/KismetSystemLibrary.h"

AERPlayerCharacter::AERPlayerCharacter()
{
	PrimaryActorTick.bCanEverTick = true;

	GetCapsuleComponent()->InitCapsuleSize(42.0f, 96.0f);

	FirstPersonCamera = CreateDefaultSubobject<UCameraComponent>(TEXT("FirstPersonCamera"));
	FirstPersonCamera->SetupAttachment(GetCapsuleComponent());
	FirstPersonCamera->SetRelativeLocation(FVector(-10.0f, 0.0f, 64.0f));
	FirstPersonCamera->bUsePawnControlRotation = true;

	UCharacterMovementComponent* MoveComp = GetCharacterMovement();
	MoveComp->MaxWalkSpeed = 500.0f;
	MoveComp->MaxAcceleration = 2200.0f;
	MoveComp->BrakingDecelerationWalking = 1800.0f;
	MoveComp->GroundFriction = 7.0f;
	MoveComp->AirControl = 0.12f;
	MoveComp->JumpZVelocity = 470.0f;
	MoveComp->MaxStepHeight = 50.0f;
	MoveComp->RotationRate = FRotator(0.0f, 720.0f, 0.0f);
	MoveComp->bUseControllerDesiredRotation = true;
	bUseControllerRotationYaw = true;
}

void AERPlayerCharacter::BeginPlay()
{
	Super::BeginPlay();
}

void AERPlayerCharacter::Tick(float DeltaSeconds)
{
	Super::Tick(DeltaSeconds);

	if (!GetCharacterMovement()->IsMovingOnGround() && IsGroundedByTrace())
	{
		GetCharacterMovement()->SetMovementMode(MOVE_Walking);
	}
}

void AERPlayerCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
	Super::SetupPlayerInputComponent(PlayerInputComponent);
	PlayerInputComponent->BindAxis(TEXT("MoveForward"), this, &AERPlayerCharacter::MoveForward);
	PlayerInputComponent->BindAxis(TEXT("MoveRight"), this, &AERPlayerCharacter::MoveRight);
	PlayerInputComponent->BindAxis(TEXT("Turn"), this, &AERPlayerCharacter::LookYaw);
	PlayerInputComponent->BindAxis(TEXT("LookUp"), this, &AERPlayerCharacter::LookPitch);
	PlayerInputComponent->BindAction(TEXT("Jump"), IE_Pressed, this, &AERPlayerCharacter::StartJump);
	PlayerInputComponent->BindAction(TEXT("Jump"), IE_Released, this, &AERPlayerCharacter::StopJump);
}

void AERPlayerCharacter::MoveForward(float Value)
{
	if (Controller && !FMath::IsNearlyZero(Value))
	{
		const FRotator ControlRotation = Controller->GetControlRotation();
		const FVector Direction = FRotationMatrix(FRotator(0.0f, ControlRotation.Yaw, 0.0f)).GetUnitAxis(EAxis::X);
		AddMovementInput(Direction, Value);
	}
}

void AERPlayerCharacter::MoveRight(float Value)
{
	if (Controller && !FMath::IsNearlyZero(Value))
	{
		const FRotator ControlRotation = Controller->GetControlRotation();
		const FVector Direction = FRotationMatrix(FRotator(0.0f, ControlRotation.Yaw, 0.0f)).GetUnitAxis(EAxis::Y);
		AddMovementInput(Direction, Value);
	}
}

void AERPlayerCharacter::StartJump()
{
	Jump();
}

void AERPlayerCharacter::StopJump()
{
	StopJumping();
}

void AERPlayerCharacter::LookYaw(float Value)
{
	AddControllerYawInput(Value * LookRateYaw);
}

void AERPlayerCharacter::LookPitch(float Value)
{
	AddControllerPitchInput(Value * LookRatePitch);
}

bool AERPlayerCharacter::IsGroundedByTrace() const
{
	FHitResult Hit;
	const FVector Start = GetActorLocation();
	const FVector End = Start - FVector(0.0f, 0.0f, GroundTraceDistance);

	TArray<AActor*> IgnoredActors;
	IgnoredActors.Add(const_cast<AERPlayerCharacter*>(this));

	return UKismetSystemLibrary::LineTraceSingle(
		GetWorld(),
		Start,
		End,
		UEngineTypes::ConvertToTraceType(ECC_Visibility),
		false,
		IgnoredActors,
		EDrawDebugTrace::None,
		Hit,
		true
	);
}
