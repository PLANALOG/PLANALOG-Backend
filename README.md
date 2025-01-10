# PLANALOG : 일상 관리와 공유를 동시에 

![PLANALOG](https://github.com/PLANALOG/PLANALOG-Backend/blob/develop/image.png)

## 프로젝트 소개 
사용자가 플래너를 통해 일상을 관리하고, 이를 게시물 형식으로 공유하여 지속적인 동기부여를 받을 수 있는 일상 관리 플랫폼입니다.

## 주요 기능
- **목표 설정 및 일정 관리** : 사용자가 목표를 설정하고 일정을 효율적으로 관리할 수 있는 플래너 기능 제공
- **블로그 작성 및 기록** : 플래너의 일정을 기반으로 블로그 형식의 글을 작성하여 자기 표현과 기록을 지원
- **소셜 네트워크 형성** : 사용자 간 목표와 성과를 공유하고, 피드백과 응원을 통해 지속적인 동기부여 제공

##  기술 스택
<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">  서버 개발을 위한 JavaScript 런타임 환경


<img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white"> 간단하고 유연한 Node.js 웹 프레임워크


<img src="https://img.shields.io/badge/prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white"> 데이터베이스와 상호작용을 쉽게 해주는 ORM 도구


<img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white"> 관계형 데이터베이스 관리 시스템


<img src="https://img.shields.io/badge/amazonaws-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white"> 클라우드 서비스 제공 플랫폼


<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"> 코드 버전 관리 및 협업 플랫폼



## 브랜치 전략 
master (배포) - develop - feature 

## 컨벤션 
  ### 커밋 컨벤션 
    - Feat	새로운 기능 추가
    - Fix	버그 수정
    - Docs	문서 수정
    - Style	코드 formatting, 세미콜론 누락, 코드 자체의 변경이 없는 경우
    - Refactor	코드 리팩토링
    - Test	테스트 코드, 리팩토링 테스트 코드 추가
    - Chore	패키지 매니저 수정, 그 외 기타 수정 ex) .gitignore
    - Design	CSS 등 사용자 UI 디자인 변경
    - Comment	필요한 주석 추가 및 변경
    - Rename	파일 또는 폴더 명을 수정하거나 옮기는 작업만인 경우
    - Remove	파일을 삭제하는 작업만 수행한 경우
    - !BREAKING CHANGE	커다란 API 변경의 경우
    - !HOTFIX	급하게 치명적인 버그를 고쳐야 하는 경우
  
   - **제목과 본문을 빈행으로 분리**
      - 커밋 유형 이후 제목과 본문은 한글로 작성하여 내용이 잘 전달될 수 있도록 할 것
      - 본문에는 변경한 내용과 이유 설명 (어떻게보다는 무엇 & 왜를 설명)   
   - **제목 첫 글자는 대문자로, 끝에는 . 금지**
  
  ### 코드 컨벤션
  
  - 문자열을 처리할 때는 **쌍따옴표**를 사용하도록 합니다.
  - 문장이 종료될 때는 **세미콜론**을 붙여줍니다.
  - 함수명, 변수명은 **카멜케이스**로 작성합니다.
  - 가독성을 위해 **한 줄에 하나의 문장**만 작성합니다.
  - 주석은 설명하려는 **구문에 맞춰 들여쓰기** 합니다.
  - **연산자 사이에는 공백**을 추가하여 가독성을 높입니다.
  - 콤마 다음에 값이 올 경우 공백을 추가하여 가독성을 높입니다.
