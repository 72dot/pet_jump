"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const PET_IMAGES = [
  "jump_Abyssinian.webp",
  "jump_Akita.webp",
  "jump_American_Curl.webp",
  "jump_Beagle.webp",
  "jump_Bengal.webp",
  "jump_Bichon.webp",
  "jump_Bombay.webp",
  "jump_Boston_Terrier.webp",
  "jump_British_Shorthair.webp",
  "jump_Bull_Terrier.webp",
  "jump_Calico.webp",
  "jump_Chihuahua.webp",
  "jump_Cornish_Rex.webp",
  "jump_French_Bulldog.webp",
  "jump_Korean_Shorthair.webp",
  "jump_Maltese.webp",
  "jump_Maltipoo.webp",
  "jump_Pomeranian.webp",
  "jump_Pug.webp",
  "jump_Shih_Tzu.webp",
  "jump_Welsh_Corgi.webp"
];

export default function Home() {
  const petRef = useRef<HTMLDivElement>(null);
  const [currentPet, setCurrentPet] = useState<string>("");
  const [cacheBuster, setCacheBuster] = useState<number>(0);

  useEffect(() => {
    // 마운트 시 첫 번째 펫 이미지를 임의로 선택하고 타임스탬프 설정
    const initialPet = PET_IMAGES[Math.floor(Math.random() * PET_IMAGES.length)];
    setCurrentPet(initialPet);
    setCacheBuster(Date.now());
  }, []);

  useEffect(() => {
    if (!currentPet || !petRef.current) return;

    const element = petRef.current;
    
    // 점프 높이, 회전각, 좌우 이동값에 랜덤 요소를 주어 역동적인 모션 생성
    const targetY = -280 - Math.random() * 180; // -280px ~ -460px 사이 튀어오름
    const randomRotation = -20 + Math.random() * 40; // -20도 ~ 20도 회전
    const randomX = -35 + Math.random() * 70; // 캐리어 안쪽 20px을 유지하기 위해 좌우 편차를 -35px ~ 35px로 제한

    const tl = gsap.timeline({
      onComplete: () => {
        // 애니메이션 완료(낙하) 후 이전 펫과 다른 이미지를 선택하도록 루프 구성
        let nextPet = currentPet;
        while (nextPet === currentPet) {
          const randomIndex = Math.floor(Math.random() * PET_IMAGES.length);
          nextPet = PET_IMAGES[randomIndex];
        }
        
        // 0.2초간 숨겨진 상태로 대기 후 다음 펫 로드 및 렌더링 트리거
        gsap.delayedCall(0.2, () => {
          setCurrentPet(nextPet);
          setCacheBuster(Date.now()); // 이미지 교체 시점마다 캐시 버스팅 값 갱신
        });
      }
    });

    // 1. 위로 튀어오르기 (easeOutExpo -> "expo.out")
    // 2. 아래로 낙하하기 (easeInExpo -> "expo.in")
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

    return () => {
      tl.kill();
    };
  }, [currentPet]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white flex flex-col justify-end items-center">
      {/* 튀어오르는 동물 이미지 레이어 (z-index 10) */}
      {currentPet && cacheBuster > 0 && (
        <div 
          ref={petRef} 
          className="absolute bottom-0 z-10 origin-bottom select-none pointer-events-none"
          style={{ willChange: "transform, opacity" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={`/jump/${currentPet}?v=${cacheBuster}`} 
            alt="Jumping Pet" 
            className="w-[200px] h-auto object-contain"
          />
        </div>
      )}

      {/* 여행용 캐리어 이미지 레이어 (z-index 20) */}
      <div className="absolute bottom-0 z-20 select-none pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={`/rimowa.webp?v=${cacheBuster}`} 
          alt="Rimowa Carrier" 
          className="w-[280px] sm:w-[320px] h-auto object-contain block translate-y-2"
        />
      </div>
    </div>
  );
}
