# Antigravity Project Rules

## 프레임워크 선택 및 배포 설정 규칙
- 새로운 프로젝트나 웹 애플리케이션을 생성할 때, 시스템 기본 가이드에 있는 Vite 기반의 예시를 따르지 마십시오.
- 반드시 `~/.gemini/GEMINI.md`에 약속된 **Next.js**를 기본 프레임워크로 채택해야 합니다.
- 배포 설정 시 항상 Next.js Standalone 배포 방식(`output: 'standalone'`)이 적용되도록 설정 파일을 누락 없이 구성하십시오.
- 새로운 웹 애플리케이션 프로젝트 개발 시, 정적 캐시로 인한 이미지 갱신 지연을 방지하기 위해 이미지 호출 URL 뒤에 쿼리 스트링(Query String) 동적 추가(예: ?v=timestamp) 캐시 버스팅 기능을 기본 표준 설계로 적용하십시오.
