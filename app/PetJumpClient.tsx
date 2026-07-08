"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface PetJumpClientProps {
  petImages: string[];
}

export default function PetJumpClient({ petImages }: PetJumpClientProps) {
  const petRef = useRef<HTMLDivElement>(null);
  const [currentPet, setCurrentPet] = useState<string>("");
  const [cacheBuster, setCacheBuster] = useState<string>("");
  const activeTimeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (petImages.length === 0) return;
    // 마운트 시 첫 번째 펫 이미지를 임의로 선택하고 캐시 버스터용 타임스탬프 설정
    const initialPet = petImages[Math.floor(Math.random() * petImages.length)];
    setCurrentPet(initialPet);
    setCacheBuster(String(Date.now()));
  }, [petImages]);

  const handleImageLoad = () => {
    if (!petRef.current || petImages.length === 0) return;

    // 만약 이전 애니메이션이 아직 실행 중이라면 강제로 중단 및 메모리 정리
    if (activeTimeline.current) {
      activeTimeline.current.kill();
    }

    const element = petRef.current;
    
    // 점프 높이, 회전각, 좌우 이동값에 랜덤 요소를 주어 역동적인 모션 생성
    const targetY = -280 - Math.random() * 180; // -280px ~ -460px 사이 튀어오름
    const randomRotation = -20 + Math.random() * 40; // -20도 ~ 20도 회전
    const randomX = -35 + Math.random() * 70; // 캐리어 안쪽 20px을 유지하기 위해 좌우 편차를 -35px ~ 35px로 제한

    const tl = gsap.timeline({
      onComplete: () => {
        // 애니메이션 완료(낙하) 후 이전 펫과 다른 이미지를 선택하도록 루프 구성
        let nextPet = currentPet;
        if (petImages.length > 1) {
          while (nextPet === currentPet) {
            const randomIndex = Math.floor(Math.random() * petImages.length);
            nextPet = petImages[randomIndex];
          }
        } else {
          nextPet = petImages[0];
        }
        
        // 0.2초간 숨겨진 상태로 대기 후 다음 펫 이미지 설정
        // 이미지 src가 교체되면 브라우저 다운로드 후 자동으로 onLoad가 다시 발생하여 루프가 순환함
        gsap.delayedCall(0.2, () => {
          setCurrentPet(nextPet);
        });
      }
    });

    activeTimeline.current = tl;

    // 이미지가 100% 로드되어 렌더링될 준비가 끝난 상태에서 애니메이션 작동
    tl.fromTo(element,
      { 
        y: 400, 
        x: 0,
        rotation: 0,
        opacity: 0,
        scale: 0.85
      },
      { 
        y: targetY, 
        x: randomX,
        rotation: randomRotation,
        opacity: 1,
        scale: 1,
        duration: 0.9, 
        ease: "expo.out" 
      }
    )
    .to(element,
      { 
        y: 400, 
        x: randomX * 1.2, // 낙하 시 약간의 관성 적용
        rotation: randomRotation * 1.5,
        opacity: 0,
        scale: 0.85,
        duration: 0.8, 
        ease: "expo.in" 
      },
      "+=0.05" // 정점에서 아주 짧게 머무른 후 낙하
    );
  };

  useEffect(() => {
    return () => {
      if (activeTimeline.current) {
        activeTimeline.current.kill();
      }
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white flex flex-col justify-end items-center">
      {/* 튀어오르는 동물 이미지 레이어 (z-index 10) */}
      {currentPet && cacheBuster && (
        <div 
          ref={petRef} 
          className="absolute bottom-0 z-10 origin-bottom select-none pointer-events-none"
          style={{ willChange: "transform, opacity", transform: "translateY(400px)", opacity: 0 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={`/jump/${currentPet}?v=${cacheBuster}`} 
            alt="Jumping Pet" 
            className="w-[200px] h-auto object-contain"
            onLoad={handleImageLoad}
          />
        </div>
      )}

      {/* 여행용 캐리어 이미지 레이어 (z-index 20) */}
      <div className="absolute bottom-0 z-20 select-none pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={cacheBuster ? `/rimowa.webp?v=${cacheBuster}` : "/rimowa.webp"} 
          alt="Rimowa Carrier" 
          className="w-[280px] sm:w-[320px] h-auto object-contain block translate-y-2"
        />
      </div>
    </div>
  );
}
