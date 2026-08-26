# SVG 입문부터 신 모드까지: 벡터 세계를 정복하는 종합 가이드

*이 글은 가장 하드코어하고 실용적인 언어로 SVG의 핵심을 파헤칩니다.*

프론트엔드 개발자라면, 혹은 코드에 감각 있는 디자이너라면 SVG(Scalable Vector Graphics)에 대해 애증을 가지고 있을 겁니다.
사랑하는 이유는 선명하고, 깔끔하고, 용량이 작으며 CSS와 JS로 자유자재로 다룰 수 있기 때문이죠.
하지만 싫어하는 이유는 SVG 파일을 열었을 때 화면 가득한 `<path d="M... C... Z">`라는 외계어 코드를 보면 머리가 아프고 손가락이 움찔거리기 때문입니다.

<div align="center">
  <img src="/content/images/angry-typing.gif" alt="SVG Headache" style="border-radius: 12px; max-width: 100%; margin: 20px auto; display: block;" />
</div>

하지만 오늘, 우리는 이 두려움을 끝장낼 겁니다! 가장 직관적인 코드와 실제 브라우저 렌더링 효과를 통해 단계별로 SVG를 정복해 봅시다.

## 1장: SVG란 무엇인가? (왜 PNG를 안 쓸까?)

SVG는 결코 신비로운 하이테크 기술이 아닙니다. 본질적으로는 **XML 파일**에 불과하죠.
네, HTML처럼 아무 텍스트 편집기로나 열 수 있고, 태그를 사용해 그래픽을 표현합니다.

**왜 PNG를 안 쓸까?**
PNG는 픽셀 이미지(비트맵)입니다. PNG를 확대하면 마치 모자이크 퍼즐처럼 보입니다. 확대할수록 모자이크가 더 뚜렷해지죠.
반면 SVG는 벡터 이미지입니다. SVG는 수학 공식을 기록합니다. "좌표(10,10)에 반지름 5인 원을 그려라" 같은 식이죠. 따라서 아무리 확대해도 브라우저가 이 원을 다시 계산해서 렌더링하므로 절대 흐려지지 않습니다!

가장 직관적인 예제를 살펴보겠습니다.

### 1.1 첫 번째 SVG

먼저 맨손으로 가장 간단한 SVG를 작성해 봅시다. 캔버스가 필요합니다.

```html
<svg width="200" height="200" style="background: #f0f4f8; border-radius: 12px;">
  <!-- 여기에 그림을 그립니다 -->
</svg>
```

**[실시간 프론트엔드 렌더링]**
<svg width="200" height="200" style="background: #f0f4f8; border-radius: 12px; display: block; margin: 20px auto;"></svg>

이게 바로 빈 캔버스입니다. 아무것도 없지만, 무한한 가능성을 품고 있습니다.

---

## 2장: 기본 도형 —— 기하학 마스터 되기

SVG는 미리 정의된 "붓"을 제공하여 기본적인 기하학 도형을 쉽게 그릴 수 있게 해줍니다.

### 2.1 직사각형 `<rect>`

`<rect>` 태그는 직사각형을 그리는 데 사용됩니다. 다음 정보를 지정해야 합니다:
- `x`, `y`: 왼쪽 상단 모서리의 좌표 (SVG에서 왼쪽 상단은 (0,0)입니다)
- `width`, `height`: 너비와 높이
- `fill`: 채우기 색상
- `rx`, `ry`: 모서리 둥글기 반경

```html
<svg width="300" height="150" style="background: #f0f4f8; border-radius: 12px;">
  <rect x="50" y="25" width="200" height="100" rx="20" fill="#FF7F50" />
</svg>
```

**[실시간 프론트엔드 렌더링]**
<svg width="300" height="150" style="background: #f0f4f8; border-radius: 12px; display: block; margin: 20px auto;">
  <rect x="50" y="25" width="200" height="100" rx="20" fill="#FF7F50" />
</svg>

보이시나요? 단 한 줄의 코드로 둥근 모서리의 오렌지색 직사각형을 그렸습니다! Canvas보다 훨씬 간단하지 않나요?

### 2.2 원 `<circle>`

원은 더 쉽습니다. 다음을 지정하면 됩니다:
- `cx`, `cy`: 원의 중심 좌표 (Center X, Center Y)
- `r`: 반지름 (Radius)

```html
<svg width="200" height="200" style="background: #f0f4f8; border-radius: 12px;">
  <circle cx="100" cy="100" r="60" fill="#4169E1" stroke="#FFD700" stroke-width="10" />
</svg>
```

*여기서는 `stroke`(윤곽선)와 `stroke-width`(윤곽선 두께)도 추가했습니다.*

**[실시간 프론트엔드 렌더링]**
<svg width="200" height="200" style="background: #f0f4f8; border-radius: 12px; display: block; margin: 20px auto;">
  <circle cx="100" cy="100" r="60" fill="#4169E1" stroke="#FFD700" stroke-width="10" />
</svg>

처음으로 손수 코드를 작성해 완벽한 원을 그렸을 때의 그 감동이란, 하늘에라도 오를 기분입니다!

<div align="center">
  <img src="/content/images/spongebob-rainbow.gif" alt="SVG Success" style="border-radius: 12px; max-width: 100%; margin: 20px auto; display: block;" />
</div>

### 2.3 타원 `<ellipse>`, 다각형 `<polygon>` 및 선 `<line>`

이 형제들도 대동소이합니다:
- `ellipse`는 반지름을 수평 `rx`와 수직 `ry`로 나눈 것뿐입니다.
- `line`은 시작점 `(x1, y1)`과 끝점 `(x2, y2)`을 지정합니다.
- `polygon`은 `points="x,y x,y x,y"` 형태의 좌표들을 받아서 닫힌 도형으로 연결합니다.

한자리에 모아서 만나 봅시다:

```html
<svg width="400" height="200" style="background: #1e1e2f; border-radius: 12px;">
  <!-- 타원 -->
  <ellipse cx="80" cy="100" rx="50" ry="80" fill="#00FF7F" />
  
  <!-- 선 -->
  <line x1="160" y1="20" x2="240" y2="180" stroke="#FF1493" stroke-width="8" stroke-linecap="round" />
  
  <!-- 다각형 (삼각형) -->
  <polygon points="320,20 270,180 370,180" fill="#00BFFF" />
</svg>
```

**[실시간 프론트엔드 렌더링]**
<svg width="400" height="200" style="background: #1e1e2f; border-radius: 12px; display: block; margin: 20px auto;">
  <ellipse cx="80" cy="100" rx="50" ry="80" fill="#00FF7F" />
  <line x1="160" y1="20" x2="240" y2="180" stroke="#FF1493" stroke-width="8" stroke-linecap="round" />
  <polygon points="320,20 270,180 370,180" fill="#00BFFF" />
</svg>

축하합니다! 여러분은 SVG 일상 사용법의 80%를 마스터했습니다!
하지만 진정으로 개발자들을 멘붕에 빠뜨리는 것은, 바로 전설 속의 대마왕 —— `<path>`입니다.

---

## 3장: 궁극의 보스 `<path>` 완전 해부

Figma에서 복잡한 아이콘을 내보내면, rect나 circle은 거의 보이지 않고 온통 `<path>` 투성입니다.
`<path>`는 SVG의 만능 붓으로, 어떤 모양이든 그릴 수 있습니다. 핵심은 `d` 속성(data의 약자)입니다.

`d` 속성에 적힌 난해한 문자열은 사실 일련의 그리기 명령어입니다. 다음 규칙을 기억하세요:
- **대문자**: 절대 좌표 (전체 캔버스의 원점 `0,0` 기준)
- **소문자**: 상대 좌표 (현재 펜 위치 기준)

### 3.1 이동 (M/m)과 직선 (L/l)

- `M x y` (Move to): 펜을 들어 올려 좌표 `(x,y)`로 이동합니다. 흔적을 남기지 않습니다.
- `L x y` (Line to): 현재 점에서 좌표 `(x,y)`까지 직선을 그립니다.
- `H x` / `V y`: 수평선 / 수직선을 그립니다.
- `Z` / `z` (Close path): 현재 점과 시작점을 연결해 도형을 닫습니다.

"집" 아이콘을 직접 그려 봅시다:
```html
<svg width="200" height="200" style="background: #282c34; border-radius: 12px;">
  <!--
    1. M 100 30 -> 꼭대기로 이동
    2. L 170 100 -> 오른쪽 처마까지 선 긋기
    3. L 150 100 -> 오른쪽 벽까지 약간 후퇴
    4. L 150 170 -> 오른쪽 벽을 아래로 그림
    5. L 50 170 -> 왼쪽으로 바닥 그림
    6. L 50 100 -> 왼쪽 벽을 위로 그림
    7. L 30 100 -> 왼쪽 처마를 밖으로 빼냄
    8. Z -> 닫아서 꼭대기로 연결
  -->
  <path d="M 100 30 L 170 100 L 150 100 L 150 170 L 50 170 L 50 100 L 30 100 Z" 
        fill="#E06C75" stroke="#ABB2BF" stroke-width="4" stroke-linejoin="round" />
</svg>
```

**[실시간 프론트엔드 렌더링]**
<svg width="200" height="200" style="background: #282c34; border-radius: 12px; display: block; margin: 20px auto;">
  <path d="M 100 30 L 170 100 L 150 100 L 150 170 L 50 170 L 50 100 L 30 100 Z" 
        fill="#E06C75" stroke="#ABB2BF" stroke-width="4" stroke-linejoin="round" />
</svg>

와우! 코드로 그림을 그리는 기분이네요!

### 3.2 베지어 곡선 (C/Q)과 호 (A)

직선은 너무 딱딱합니다. 우아한 곡선이 필요하죠. 이때 베지어 곡선을 알아야 합니다.
- `C x1 y1, x2 y2, x y` (3차 베지어 곡선): 두 개의 제어점이 필요합니다.
- `Q x1 y1, x y` (2차 베지어 곡선): 하나의 제어점만 필요합니다.
- `A rx ry x-axis-rotation large-arc-flag sweep-flag x y` (호): 매개변수가 극도로 복잡합니다.

`Q`(2차 베지어)로 나뭇잎을 그려 봅시다:
```html
<svg width="200" height="200" style="background: #f0f4f8; border-radius: 12px;">
  <!--
    M 50 150: 시작점은 왼쪽 아래
    Q 50 50, 150 50: 제어점은 왼쪽 위 (50,50), 끝점은 오른쪽 위 (150,50)
    Q 150 150, 50 150: 제어점은 오른쪽 아래 (150,150), 끝점은 시작점 (50,150)
  -->
  <path d="M 50 150 Q 50 50, 150 50 Q 150 150, 50 150" 
        fill="#98C379" stroke="#3E4451" stroke-width="4" />
</svg>
```

**[실시간 프론트엔드 렌더링]**
<svg width="200" height="200" style="background: #f0f4f8; border-radius: 12px; display: block; margin: 20px auto;">
  <path d="M 50 150 Q 50 50, 150 50 Q 150 150, 50 150" 
        fill="#98C379" stroke="#3E4451" stroke-width="4" />
</svg>

### 3.3 실전: 완벽한 로고 그리기

앞서 배운 경로(path), 도형 및 변환(Transform)을 결합하여 우리 사이트의 멋진 로고를 그려 보는 실전 예제입니다!

```html
<svg width="120" height="120" viewBox="0 0 120 120" style="background: #f0f4f8; border-radius: 12px; display: block; margin: 20px auto;">
  <!-- 메인 연결선 (베지어 곡선) -->
  <path d="M 22 58 C 45 90, 65 15, 95 35" fill="none" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round"></path>
  
  <!-- 오렌지색 중앙 모듈 -->
  <rect x="42" y="65" width="12" height="12" rx="2" fill="#f97316" stroke="#1e293b" stroke-width="3"></rect>
  
  <!-- 양쪽 끝의 파란색 노드 -->
  <circle cx="22" cy="58" r="6" fill="#818cf8" stroke="#1e293b" stroke-width="3"></circle>
  <circle cx="95" cy="35" r="6" fill="#818cf8" stroke="#1e293b" stroke-width="3"></circle>
  
  <!-- 마우스 포인터 아이콘 (그룹화 및 회전) -->
  <g transform="translate(68, 48) scale(2.4) rotate(-8)">
    <path d="M 0,0 L 0,14 L 3.5,10.5 L 6.5,17 L 9,15.5 L 6,9 L 10.5,9 Z" fill="#2dd4bf" stroke="#1e293b" stroke-width="1.8" stroke-linejoin="round"></path>
  </g>
</svg>
```

**[실시간 프론트엔드 렌더링]**
<svg width="120" height="120" viewBox="0 0 120 120" style="background: #f0f4f8; border-radius: 12px; display: block; margin: 20px auto;">
  <path d="M 22 58 C 45 90, 65 15, 95 35" fill="none" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round"></path>
  <rect x="42" y="65" width="12" height="12" rx="2" fill="#f97316" stroke="#1e293b" stroke-width="3"></rect>
  <circle cx="22" cy="58" r="6" fill="#818cf8" stroke="#1e293b" stroke-width="3"></circle>
  <circle cx="95" cy="35" r="6" fill="#818cf8" stroke="#1e293b" stroke-width="3"></circle>
  <g transform="translate(68, 48) scale(2.4) rotate(-8)">
    <path d="M 0,0 L 0,14 L 3.5,10.5 L 6.5,17 L 9,15.5 L 6,9 L 10.5,9 Z" fill="#2dd4bf" stroke="#1e293b" stroke-width="1.8" stroke-linejoin="round"></path>
  </g>
</svg>

Path와 조합을 마스터하면, 마치 마법을 부리는 것처럼 브라우저에서 무엇이든凭空 창조할 수 있습니다!

<div align="center">
  <img src="/content/images/mind-blown.gif" alt="SVG Magic" style="border-radius: 12px; max-width: 100%; margin: 20px auto; display: block;" />
</div>

---

## 4장: SVG의 우주 좌표계 —— viewBox 완전 그림 해설

다른 사람이 작성한 SVG 코드를 복사해서 자신의 프로젝트에 붙여넣었는데, **도형이 갑자기 엄청 커지거나, 반이 잘리거나, 아예 안 보이는** 경험을 해보셨나요?
이 모든 혼란의 원인은 바로 SVG의 좌표계, 특히 `viewBox`라는 에픽급 속성을 이해하지 못했기 때문입니다.

### 4.1 width/height vs viewBox

최상위 `<svg>` 태그에는 보통 `width`와 `height`를 작성합니다. 이것은 SVG가 브라우저 페이지에서 차지하는 **물리적 공간(뷰포트)** 을 나타냅니다.
마치 여러분 집 창문의 크기라고 생각하면 됩니다.

반면 `viewBox="min-x min-y width height"`는 SVG 내부의 **가상 우주 좌표계**를 나타냅니다.
창문을 통해 바깥 풍경을 바라볼 때의 확대/축소 비율과 시야 범위라고 상상해 보세요.

```html
<!-- 물리적 공간은 200x200이지만, 내부 좌표계는 0~100으로 매핑됨 -->
<svg width="200" height="200" viewBox="0 0 100 100" style="background: #e2e8f0; border-radius: 12px; display: block; margin: 20px auto;">
  <!-- 이 내부 좌표계에서 가로세로 50인 직사각형을 그림 -->
  <!-- 내부 최대 좌표가 100이므로, 이 직사각형은 물리적 창의 절반을 차지합니다! -->
  <rect x="0" y="0" width="50" height="50" fill="#3b82f6" />
</svg>
```

**[실시간 프론트엔드 렌더링]**
<svg width="200" height="200" viewBox="0 0 100 100" style="background: #e2e8f0; border-radius: 12px; display: block; margin: 20px auto;">
  <rect x="0" y="0" width="50" height="50" fill="#3b82f6" />
</svg>

보이시나요? `rect`의 너비를 50으로 설정했지만, 시각적으로는 100픽셀을 차지합니다! 이것이 `viewBox` 스케일링의 마법입니다. 이것만 마스터하면 아이콘을 **진정한 반응형**으로 만들 수 있습니다.

---

## 5장: 코드 재사용 마스터 —— `<g>`, `<defs>`와 `<use>`

HTML을 작성할 때는 반복되는 코드를 컴포넌트로 추출합니다. SVG에도 코드 재사용 메커니즘이 있습니다. 더 이상 긴 `<path>` 문자열을 복붙하지 마세요!

### 5.1 `<g>` 그룹 태그

`<g>`는 Group(그룹)을 나타냅니다. 코드를 더 깔끔하게 만들어 줄 뿐만 아니라, 변환(`transform`), 색상, 투명도 등의 속성을 그룹 전체에 한 번에 적용할 수 있습니다. 앞서 로고를 그릴 때도 `<g>`를 사용해 포인터 아이콘에 회전과 스케일을 일괄 적용했었죠.

### 5.2 `<defs>`와 `<use>`: SVG 속 "컴포넌트화"

`<defs>`(Definitions)는 일종의 창고입니다. 안에 넣은 도형은 직접 렌더링되지 않다가, `<use>`를 통해 "소환"해야 비로소 나타납니다.

반복되는 패턴(그리드, 별하늘, 숲 등)을 그릴 때 이는 신급 도구입니다!

```html
<svg width="300" height="150" style="background: #1e1e2f; border-radius: 12px; display: block; margin: 20px auto;">
  <!-- 별 컴포넌트 정의 -->
  <defs>
    <g id="star">
      <polygon points="10,0 13,7 20,7 15,12 17,20 10,15 3,20 5,12 0,7 7,7" fill="#FCD34D" />
    </g>
  </defs>

  <!-- 별을 마구 소환! 각각 다른 위치에 배치 -->
  <use href="#star" x="30" y="30" transform="scale(1.5)" />
  <use href="#star" x="100" y="80" transform="scale(0.8)" />
  <use href="#star" x="150" y="20" transform="scale(2)" />
  <use href="#star" x="220" y="60" transform="scale(1.2)" />
  <use href="#star" x="260" y="100" />
</svg>
```

**[실시간 프론트엔드 렌더링]**
<svg width="300" height="150" style="background: #1e1e2f; border-radius: 12px; display: block; margin: 20px auto;">
  <defs>
    <g id="star">
      <polygon points="10,0 13,7 20,7 15,12 17,20 10,15 3,20 5,12 0,7 7,7" fill="#FCD34D" />
    </g>
  </defs>
  <use href="#star" x="30" y="30" transform="scale(1.5)" />
  <use href="#star" x="100" y="80" transform="scale(0.8)" />
  <use href="#star" x="150" y="20" transform="scale(2)" />
  <use href="#star" x="220" y="60" transform="scale(1.2)" />
  <use href="#star" x="260" y="100" />
</svg>

이렇게 하면 엄청난 양의 코드를 줄일 수 있을 뿐만 아니라 렌더링 성능도 크게 최적화됩니다!

---

## 6장: 텍스트의 예술 —— `<text>`와 `<textPath>`

SVG가 기하학 도형만 그릴 수 있다고 생각한다면 오산입니다! SVG의 텍스트 지원은 놀라울 정도로 강력합니다. 렌더링된 텍스트는 검색 엔진이 크롤링할 수 있고, 사용자가 선택하여 복사할 수 있으며, 각종 화려한 기술을 지원합니다.

### 6.1 기본 텍스트 렌더링

```html
<svg width="300" height="100" style="background: #f0f4f8; border-radius: 12px; display: block; margin: 20px auto;">
  <!-- 참고: 텍스트의 y 좌표는 베이스라인(baseline)입니다 -->
  <text x="150" y="55" font-size="32" font-family="sans-serif" font-weight="bold" fill="#ec4899" text-anchor="middle">
    Hello SVG Text!
  </text>
</svg>
```

**[실시간 프론트엔드 렌더링]**
<svg width="300" height="100" style="background: #f0f4f8; border-radius: 12px; display: block; margin: 20px auto;">
  <text x="150" y="55" font-size="32" font-family="sans-serif" font-weight="bold" fill="#ec4899" text-anchor="middle">
    Hello SVG Text!
  </text>
</svg>

### 6.2 경로를 따르는 텍스트 (Text on Path)

이것은 SVG가 독보적으로 자랑하는 특급 기술입니다! 텍스트를 임의의 복잡한 `<path>` 경로를 따라 배치할 수 있습니다. CSS에서는 극도로 구현하기 어렵지만, SVG에서는 단 두 줄의 코드면 충분합니다!

```html
<svg width="300" height="150" style="background: #1e293b; border-radius: 12px; display: block; margin: 20px auto;">
  <defs>
    <!-- 곡선 경로를 정의하고 ID 부여 -->
    <path id="curve" d="M 30 100 Q 150 20, 270 100" fill="transparent" stroke="#334155" />
  </defs>
  
  <!-- 경로를 눈으로 확인할 수 있도록 그림 -->
  <use href="#curve" />
  
  <!-- 텍스트를 곡선을 따라 배치 -->
  <text font-size="18" fill="#38bdf8" font-weight="bold">
    <textPath href="#curve" startOffset="50%" text-anchor="middle">
      곡선을 따라 춤추는 섹시한 텍스트
    </textPath>
  </text>
</svg>
```

**[실시간 프론트엔드 렌더링]**
<svg width="300" height="150" style="background: #1e293b; border-radius: 12px; display: block; margin: 20px auto;">
  <defs>
    <path id="curve" d="M 30 100 Q 150 20, 270 100" fill="transparent" stroke="#334155" />
  </defs>
  <use href="#curve" />
  <text font-size="18" fill="#38bdf8" font-weight="bold">
    <textPath href="#curve" startOffset="50%" text-anchor="middle">
      곡선을 따라 춤추는 섹시한 텍스트
    </textPath>
  </text>
</svg>

---

## 7장: 색상과 질감 —— 그라디언트와 필터

단색 채우기만 있는 SVG는 영혼이 없습니다. 현대 웹 디자인은 질감, 그림자, 그라디언트를 요구합니다. SVG에서는 이 모든 것을 완벽하게 구현할 수 있습니다.

### 7.1 선형 그라디언트 `<linearGradient>`

컴포넌트와 유사하게, 그라디언트도 `<defs>` 태그 안에 정의한 후 `url(#id)` 방식으로 도형에 적용합니다.

```html
<svg width="300" height="120" style="background: #f8fafc; border-radius: 12px; display: block; margin: 20px auto;">
  <defs>
    <linearGradient id="cyberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ec4899" />
      <stop offset="100%" stop-color="#8b5cf6" />
    </linearGradient>
  </defs>
  
  <!-- 둥근 모서리 직사각형의 fill 속성에 그라디언트 적용 -->
  <rect x="20" y="20" width="260" height="80" rx="40" fill="url(#cyberGradient)" />
  
  <text x="150" y="65" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle">
    Cyberpunk Gradient
  </text>
</svg>
```

**[실시간 프론트엔드 렌더링]**
<svg width="300" height="120" style="background: #f8fafc; border-radius: 12px; display: block; margin: 20px auto;">
  <defs>
    <linearGradient id="cyberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ec4899" />
      <stop offset="100%" stop-color="#8b5cf6" />
    </linearGradient>
  </defs>
  <rect x="20" y="20" width="260" height="80" rx="40" fill="url(#cyberGradient)" />
  <text x="150" y="65" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle">
    Cyberpunk Gradient
  </text>
</svg>

### 7.2 고급 네온 발광 필터 `<filter>`

여기서부터는 진정한 하이엔드 영역입니다. `<feGaussianBlur>`와 `<feMerge>`를 사용해 화려한 네온 발광 효과를 구현해 봅시다!

```html
<svg width="300" height="150" style="background: #0f172a; border-radius: 12px; display: block; margin: 20px auto;">
  <defs>
    <!-- 발광 필터 정의 -->
    <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
      <!-- 도형에 가우시안 블러 적용 -->
      <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1" />
      <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur2" />
      
      <!-- 원본 이미지와 블러 결과를 병합 -->
      <feMerge>
        <feMergeNode in="blur2" />
        <feMergeNode in="blur1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  
  <!-- 발광하는 텍스트 그리기 -->
  <text x="150" y="85" font-size="36" font-weight="900" font-family="monospace" fill="#22d3ee" text-anchor="middle" filter="url(#neonGlow)">
    NEON
  </text>
</svg>
```

**[실시간 프론트엔드 렌더링]**
<svg width="300" height="150" style="background: #0f172a; border-radius: 12px; display: block; margin: 20px auto;">
  <defs>
    <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1" />
      <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur2" />
      <feMerge>
        <feMergeNode in="blur2" />
        <feMergeNode in="blur1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  <text x="150" y="85" font-size="36" font-weight="900" font-family="monospace" fill="#22d3ee" text-anchor="middle" filter="url(#neonGlow)">
    NEON
  </text>
</svg>

---

## 8장: SVG에 생명을 불어넣다 —— SMIL 애니메이션 고급

CSS 애니메이션만으로 부족하다고 느낀다면, SVG가 기본 내장한 SMIL(Synchronized Multimedia Integration Language)이 여러분을 충격에 빠뜨릴 것입니다.

### 8.1 기본 속성 애니메이션

예제를 하나 보겠습니다. 태양을 그려서 자동으로 회전할 뿐만 아니라, 마우스를 올리면 색상이 변합니다! 여기서는 CSS를 전혀 사용하지 않고 SVG 네이티브 `<animateTransform>`과 `<set>` 태그만 사용합니다:

```html
<svg width="200" height="200" style="background: #1e1e2f; border-radius: 12px; display: block; margin: 20px auto;">
  <g>
    <path d="M 100 20 L 100 180 M 20 100 L 180 100 M 45 45 L 155 155 M 45 155 L 155 45" 
          stroke="#FFD700" stroke-width="8" stroke-linecap="round" />
    <circle cx="100" cy="100" r="40" fill="#FFD700">
      <set attributeName="fill" to="#FF4500" begin="mouseover" end="mouseout" />
    </circle>
    <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="10s" repeatCount="indefinite" />
  </g>
</svg>
```

**[실시간 프론트엔드 렌더링 (태양 중심에 마우스를 올려보세요)]**
<svg width="200" height="200" style="background: #1e1e2f; border-radius: 12px; display: block; margin: 20px auto;">
  <g>
    <path d="M 100 20 L 100 180 M 20 100 L 180 100 M 45 45 L 155 155 M 45 155 L 155 45" 
          stroke="#FFD700" stroke-width="8" stroke-linecap="round" />
    <circle cx="100" cy="100" r="40" fill="#FFD700">
      <set attributeName="fill" to="#FF4500" begin="mouseover" end="mouseout" />
    </circle>
    <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="10s" repeatCount="indefinite" />
  </g>
</svg>

정말 멋지지 않나요?! 외부 JS 라이브러리나 CSS 스타일시트에 전혀 의존하지 않고, SVG 내부에서만으로 복잡한 인터랙티브 상태를 구현했습니다.

### 8.2 궁극의 간지 기술: 선 긋기 애니메이션 (Stroke Dasharray Animation)

SVG 애니메이션 중 가장 클래식한 것은 단연 "선 긋기 애니메이션"입니다. "선이 서서히 그려지는" 극강의 테크니컬한 효과를 구현할 수 있습니다.

핵심 원리는 단 두 가지 속성입니다:
- `stroke-dasharray`: 실선을 점선으로 바꿉니다. 이 값을 매우 크게 설정해서 경로 전체를 덮으면, 전체 길이의 실선 + 전체 길이의 빈 공간이 됩니다.
- `stroke-dashoffset`: 점선의 시작 오프셋을 변경합니다. 이 오프셋을 동적으로 변경하면 드로잉 애니메이션이 완성됩니다!

```html
<svg width="300" height="150" style="background: #000; border-radius: 12px; display: block; margin: 20px auto;">
  <!-- 섹시한 사인파 곡선 -->
  <path d="M 20 75 Q 70 20, 150 75 T 280 75" fill="transparent" stroke="#00FFFF" stroke-width="6" stroke-linecap="round" stroke-dasharray="600" stroke-dashoffset="600">
    <animate attributeName="stroke-dashoffset" values="600;0;600" dur="4s" repeatCount="indefinite" />
  </path>
</svg>
```

**[실시간 프론트엔드 렌더링]**
<svg width="300" height="150" style="background: #000; border-radius: 12px; display: block; margin: 20px auto;">
  <path d="M 20 75 Q 70 20, 150 75 T 280 75" fill="transparent" stroke="#00FFFF" stroke-width="6" stroke-linecap="round" stroke-dasharray="600" stroke-dashoffset="600">
    <animate attributeName="stroke-dashoffset" values="600;0;600" dur="4s" repeatCount="indefinite" />
  </path>
</svg>

### 8.3 경로 운동 애니메이션 `<animateMotion>`

특정한 궤적을 따라 물체를 움직이고 싶다면, 예전에는 수백 줄의 JS로 물리 운동을 계산해야 했을 겁니다. 하지만 SVG에서는 한 줄의 `<animateMotion>`으로 해결됩니다!

```html
<svg width="300" height="150" style="background: #f0fdf4; border-radius: 12px; display: block; margin: 20px auto;">
  <!-- 운동 궤적을 참조용으로 그림 -->
  <path id="motionPath" d="M 20 75 Q 150 -50, 280 75 Q 150 200, 20 75" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="5,5" />
  
  <!-- 이 동그라미가 궤적을 따라 움직입니다 -->
  <circle r="8" fill="#10b981">
    <animateMotion dur="3s" repeatCount="indefinite">
      <mpath href="#motionPath" />
    </animateMotion>
  </circle>
</svg>
```

**[실시간 프론트엔드 렌더링]**
<svg width="300" height="150" style="background: #f0fdf4; border-radius: 12px; display: block; margin: 20px auto;">
  <path id="motionPath" d="M 20 75 Q 150 -50, 280 75 Q 150 200, 20 75" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="5,5" />
  <circle r="8" fill="#10b981">
    <animateMotion dur="3s" repeatCount="indefinite">
      <mpath href="#motionPath" />
    </animateMotion>
  </circle>
</svg>

---

## 9장: 결론 —— 벡터 마법의 정복

간단한 빈 캔버스에서 복잡한 베지어 곡선까지, 정적인 색상 채우기에서 화려한 네온 발광까지, 단조로운 도형에서 무한 반복되는 SMIL 네이티브 애니메이션까지... 만약 이 글의 모든 코드를 처음부터 끝까지 꼼꼼히 읽고 직접 실습했다면, 의심할 여지없이 "SVG 외계어가 두렵다"는 공포의 단계를 넘어선 것입니다.

보시다시피, 이 모든 인터랙티브 효과, 그리기 애니메이션, 빛과 그림자 필터는 가장 네이티브한 DOM API와 가장 기초적인 수학 행렬 계산을 벗어나지 않았습니다. 용량만 수십에서 수백 KB에 달하는 서드파티 애니메이션 라이브러리는 이제 집어치우세요! SVG의 저수준 로직을 깊이 이해하면, 여러분 혼자서 브라우저에 미니 Figma를 순수 수작업으로 만들어낼 수 있습니다.

직접 도전해 보세요. 네이티브 웹 기술의 강력함에 깊은 감동을 받을 것입니다.

<div align="center">
  <img src="/content/images/cat-typing.gif" alt="Crazy Coding" style="border-radius: 12px; max-width: 100%; margin: 20px auto; display: block;" />
</div>
