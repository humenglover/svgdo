# 벡터 노드를 수상한 서버에 유출하지 마세요: 실시간 AST 파싱과 순수 프론트엔드 렌더링의 아키텍처적 우월성

몇 달 전, 동료가 SVG 아이콘 편집 워크플로를 보여줬습니다. 획 색상을 변경할 때마다 파일을 온라인 편집기에 업로드하고, 서버가 처리할 때까지 기다렸다가, 변경을 적용한 다음, 결과를 다시 다운로드하는 식이었죠. 단지 `stroke="#ff0000"` 하나 바꾸자고 말입니다.

저는 몇 초간 말없이 화면을 바라봤습니다. 그리고 Pictkit을 작성하기 시작했습니다.

이게 디지털 프라이버시를 구하겠다는 숭고한 사명으로 시작된 것처럼 꾸미지 않겠습니다. 그 워크플로를 보는 게 육체적 고통을 유발했기 때문에 시작된 겁니다. 하지만 파싱 엔진을 구축해 나가면서, 문제가 처음 생각보다 훨씬 더 깊다는 걸 깨달았습니다.

---

## 제1부: 잔혹한 현실

오늘날 웹 개발 생태계에서 우리는 완전히 미친 짓을 정상화해 버렸습니다. 이미 브라우저 RAM에 있는 데이터를 텍스트로 직렬화하고, HTTP 헤더로 감싸고, 여섯 개의 네트워크 계층을 통해 수백 킬로미터 떨어진 서버로 보내서, XML 속성 하나만 수정하고, 같은 경로로 결과를 다시 받아오는 겁니다.

일반적인 "온라인 SVG 편집기"를 사용할 때 실제로 어떤 일이 벌어지는지 계산해 봅시다.

**1단계: 직렬화와 패키징.** 브라우저는 SVG 콘텐츠(이미 메모리상의 문자열)를 `multipart/form-data`로 감쌉니다. 이건 공짜가 아닙니다. 브라우저는 MIME 경계를 구성하고, 콘텐츠를 인코딩하고, `Content-Length`를 계산해야 합니다. 4KB SVG의 경우 이 오버헤드는 2-3KB를 추가합니다.

**2단계: 네트워크 여정.** 패킷은 여러분의 기기를 떠나 로컬 라우터를 통과하고, ISP 모뎀에 도달하며, 여러 백본 홉을 거쳐 최종적으로 데이터센터에 도착합니다. 광섬유의 최적 조건에서도 네트워크 지연만 20-80ms입니다. 서버가 다른 지역이나 대륙에 있다면 100-300ms를 더하세요.

**3단계: 인프라 체인.** 요청은 로드 밸런서(NGINX, HAProxy, 또는 AWS ALB)에 도달하고, 애플리케이션 서버로 전달됩니다. 큐가 있으면 기다립니다. 그런 다음 서버는 수신 HTTP 스트림을 읽고, `multipart/form-data`를 파싱하고, 파일을 추출한 후에야 SVG 작업을 시작합니다. 작업이 끝나면 다시 응답을 직렬화합니다.

**4단계: 아무도 말하지 않는 보안 위험.** 잘못 구성된 XML 파서는 XXE(XML 외부 엔티티) 공격의 침입구입니다. 저는 `resolveEntities: true`가 활성화된 파서를 가진 "전문" 도구들을 본 적이 있습니다. 이는 공격자가 다음과 같은 코드를 삽입할 수 있게 합니다:

```xml
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<svg>&xxe;</svg>
```

서버의 파서가 이 엔티티를 해석하면, `/etc/passwd`의 내용이 응답으로 유출됩니다. 이건 이론적인 시나리오가 아닙니다. 2018년에서 2023년 사이, 이미지 처리 서비스의 안전하지 않은 XML 처리와 관련된 CVE가 200건 이상 보고되었습니다. SVG를 업로드하는 모든 온라인 도구는 잠재적인 공격 벡터입니다.

하지만 보안을 제쳐두더라도, 더 근본적인 문제가 있습니다: **이미 가지고 있는 컴퓨팅 파워를 낭비하고 있다는 겁니다.** 현대 브라우저는 믿을 수 없을 정도로 강력한 가상 머신입니다. Chrome의 V8 엔진은 JavaScript를 네이티브 머신 코드로 컴파일합니다. GPU는 렌더링 작업을 기다리며 바로 거기 있습니다. Web Workers를 통해 여러 CPU 코어에 접근할 수 있습니다. IndexedDB로 로컬 영속성을 확보할 수 있습니다. FileReader API로 파일 시스템에서 직접 파일을 읽을 수 있습니다.

그런데 우리는 이 모든 파워로 무엇을 하나요? 문자열을 낯선 서버에 보내서 `element.setAttribute('fill', '#ff0000')`를 실행하게 합니다. 페라리를 소유하고 편의점 가려고 Uber를 부르는 꼴입니다.

![Disgust](/content/images/this-is-fine-css.gif)
*viewBox 속성 하나 바꾸자고 3노드 Kubernetes 클러스터, 로드 밸런서, Redis, 메시지 큐를 배포하는 "클라우드 네이티브" 아키텍처를 볼 때면, 웃어야 할지 울어야 할지 모르겠습니다. 우리는 단순함을 아키텍처적 망상으로 바꿔버렸습니다.*

---

## 제2부: 순수 프론트엔드의 철학

Pictkit은 아주 단순하고, 거의 순진한 전제에서 탄생했습니다: **데이터가 브라우저에 있다면, 모든 처리는 브라우저에서 이루어져야 한다.** 끝. 예외 없음. "사용 사례에 따라 다르다"는 것도 없음.

이 철학(저는 "제로 서버 아키텍처" 또는 "물리적 프라이버시 아키텍처"라고 부릅니다)은 세 가지 기둥 위에 서 있습니다:

### 기둥 1: 프라이버시 보장으로서의 물리적 격리

처리의 100%가 브라우저 샌드박스 내에서 이루어질 때, 프라이버시는 이용약관의 약속이 아니라 물리 법칙입니다. 여러분의 디자인, 기업 아이콘, 아직 출시되지 않은 제품의 목업 — 그 어떤 것도 여러분 기기의 RAM을 절대 떠나지 않습니다. DevTools를 열고 Network 탭으로 가서 직접 확인해 보세요: 단 하나의 외부 요청도 없습니다. 이더넷 케이블을 뽑아도 Pictkit은 똑같이 작동합니다.

이것은 "정책에 의한 프라이버시"가 아닙니다. "물리적 불가능성에 의한 프라이버시"입니다. 우리는 원한다고 해도 데이터를 유출할 수 없습니다. 우리 코드에는 데이터를 전송할 네트워킹 코드 자체가 없기 때문입니다.

### 기둥 2: GPU는 당신의 것 — 사용하세요

모든 현대 브라우저는 GPU를 통한 하드웨어 가속에 접근할 수 있습니다. DOM의 SVG 요소에서 스타일 속성을 수정하면, 브라우저의 렌더링 엔진(Chrome의 Skia, Firefox의 WebRender, Safari의 Core Animation)이 영향을 받는 픽셀만 다시 계산하여 VRAM으로 보냅니다. 이 과정은 60FPS 유지를 위한 프레임당 예산인 16밀리초 미만으로 완료됩니다.

반면, 서버-클라이언트 방식은: 요청 전송 → 대기 → 비트맵 수신 → 디코딩 → `<canvas>`에 그리기 또는 DOM 교체. 결과가 도착할 때쯤이면 몇 초가 지나 사용자의 정신적 맥락은 이미 끊어져 있습니다.

### 기둥 3: 한계 비용 제로의 컴퓨팅

다른 사람의 서버에서 실행하는 모든 작업에는 비용이 듭니다: CPU, 메모리, 대역폭, 스토리지. 누군가 그 비용을 지불하고, 결국 그 비용은 구독료, 사용량 제한, 또는 더 나쁘게는 데이터 판매의 형태로 사용자에게 도달합니다.

Pictkit에서 여러분이 실행하는 모든 작업은 우리에게 한계 비용이 제로입니다. 말 그대로 제로입니다. 여러분의 CPU가 작업을 수행하고, 여러분의 GPU가 그래픽을 렌더링하고, 여러분의 하드 드라이브가 결과를 저장합니다. 우리는 그저 코드를 한 번 제공하고, 그다음엔 방해하지 않습니다. 이것이 진정한 확장성입니다: 모든 새로운 사용자가 자신의 하드웨어를 가져옵니다.

![Pictkit Local Rendering Preview](/content/images/articles/pictkit-local-rendering-preview.png)
*Pictkit 프리뷰 패널. SVG 렌더링, 노드 하이라이팅, 변환 그리드 등 보이는 모든 것이 로컬 GPU에서 계산됩니다. DevTools의 Network 탭은 완전히 비어 있습니다. 그리고 그것이 마땅히 그래야 하는 모습입니다.*

---

## 제3부: 기술 심층 분석 — 실제 작동 원리

좋습니다. 철학은 충분합니다. 코드로 들어가 봅시다. 결국 아키텍처는 구현으로 증명되는 법이니까요.

### 3.1 파싱 엔진: XML에서 AST까지 1밀리초 미만

Pictkit의 진입점은 FileReader API입니다. 사용자가 SVG 파일을 브라우저로 드래그하면, `drop` 이벤트를 가로채서 내용을 직접 `ArrayBuffer`로 읽어 들입니다:

```javascript
const file = event.dataTransfer.files[0];
const reader = new FileReader();

reader.onload = (e) => {
  const rawBytes = new Uint8Array(e.target.result); // 이미 RAM에 있음
  const decoder = new TextDecoder('utf-8');
  const xmlString = decoder.decode(rawBytes);
  
  // 마법은 여기서 시작: 메인 스레드에서 동기식 파싱
  const ast = parseSVGToAST(xmlString);
  
  // 그런 다음에야 DOM을 건드림
  renderASTToDOM(ast);
};

reader.readAsArrayBuffer(file);
```

중요한 세부 사항에 주목하세요: `readAsText`가 아닌 `readAsArrayBuffer`를 사용합니다. 이는 문자 디코딩에 대한 완전한 제어권을 줍니다. 많은 SVG에는 `<?xml version="1.0" encoding="ISO-8859-1"?>`와 같은 인코딩 선언이 포함되어 있는데, `readAsText`는 이를 잘못 해석할 수 있습니다. 원시 바이트를 읽음으로써, 해석 방법을 우리가 결정합니다.

그렇다면 `parseSVGToAST`는 정확히 무엇을 할까요? 이 함수는 시스템의 심장입니다. XML을 문자 단위로 순회하며 추상 구문 트리를 구축하는 재귀 하강 파서(recursive descent parser)를 구현합니다. 구조 파싱에 정규 표현식을 사용하지 않고(이는 재앙적 백트래킹을 일으키는 고전적인 실수입니다), 유한 상태 기계를 사용합니다.

다음은 렉서 코어의 단순화된 버전입니다:

```javascript
function tokenize(xml) {
  const tokens = [];
  let pos = 0;
  
  while (pos < xml.length) {
    // 공백 소비
    if (/\s/.test(xml[pos])) {
      pos++;
      continue;
    }
    
    // 열기 태그 감지
    if (xml[pos] === '<') {
      pos++;
      
      // 주석인가? <!-- ... -->
      if (xml.slice(pos, pos + 3) === '!--') {
        const end = xml.indexOf('-->', pos);
        tokens.push({ type: 'COMMENT', value: xml.slice(pos + 3, end) });
        pos = end + 3;
        continue;
      }
      
      // 닫기 태그인가? </g>
      if (xml[pos] === '/') {
        pos++;
        const nameEnd = xml.indexOf('>', pos);
        tokens.push({ type: 'CLOSE_TAG', name: xml.slice(pos, nameEnd) });
        pos = nameEnd + 1;
        continue;
      }
      
      // 열기 태그: <path d="..." fill="..." />
      const nameEnd = xml.indexOf('>', pos);
      const fullTag = xml.slice(pos, nameEnd);
      const spaceIdx = fullTag.indexOf(' ');
      const name = spaceIdx === -1 ? fullTag : fullTag.slice(0, spaceIdx);
      
      const selfClosing = xml[nameEnd - 1] === '/';
      const attrs = parseAttributes(fullTag.slice(name.length));
      
      tokens.push({
        type: selfClosing ? 'SELF_CLOSING_TAG' : 'OPEN_TAG',
        name,
        attributes: attrs
      });
      
      pos = nameEnd + 1;
      continue;
    }
    
    // 태그 사이의 텍스트 콘텐츠
    const tagStart = xml.indexOf('<', pos);
    const text = xml.slice(pos, tagStart === -1 ? xml.length : tagStart);
    if (text.trim()) {
      tokens.push({ type: 'TEXT', value: text });
    }
    pos = tagStart === -1 ? xml.length : tagStart;
  }
  
  return tokens;
}
```

이 렉서는 현대 노트북에서 일반적인 5KB SVG를 0.3ms 미만으로 처리합니다. 개발 중에 `performance.now()`로 수십 번 측정했기 때문에 압니다. 서버의 방해 없이 마이크로 벤치마크를 실행할 수 있다는 것은 사치입니다.

토큰화가 완료되면 파서가 AST를 구축합니다. 각 트리 노드는 타입이 지정된 속성, 자식 요소, 그리고 원본 파일 내 위치(나중에 소스 코드에 오류를 매핑하기 위함)와 같은 메타데이터를 가진 SVG 요소를 나타냅니다:

```javascript
// 단순화된 AST 노드 구조
{
  type: 'element',
  tagName: 'path',
  attributes: {
    d: { type: 'path_data', value: 'M 10 10 L 20 20 ...' },
    fill: { type: 'color', value: '#ff0000' },
    stroke: { type: 'color', value: '#000000' },
    'stroke-width': { type: 'number', value: 2, unit: 'px' }
  },
  children: [],
  sourceLocation: { line: 247, column: 4, length: 156 },
  computedBBox: null  // 필요 시 계산
}
```

왜 브라우저의 `DOMParser`를 그냥 사용하지 않고 AST를 쓰는 걸까요? 좋은 질문입니다. 세 가지 이유가 있습니다:

1. **오류 제어.** `DOMParser`는 잘못된 XML에 너무 관대합니다. SVG에 오류가 있으면 `DOMParser`는 조용히 수정을 시도하며, 때로는 예측할 수 없는 결과를 낳습니다. 우리 파서는 정확히 몇 번째 줄, 몇 번째 열에 문제가 있는지 알려줍니다.

2. **원본 구조 보존.** `DOMParser`는 XML을 정규화합니다: 속성 순서를 재배열하고, 중요하지 않다고 판단되는 공백을 제거하며, 엔티티를 확장합니다. 원래 형식을 유지하며 SVG를 편집하려는 경우 이는 재앙입니다. 우리 AST는 정보의 모든 바이트를 보존합니다.

3. **타입 지정 속성.** DOM의 속성은 항상 문자열입니다. 우리 AST에서 `stroke-width`는 단위가 있는 숫자, `fill`은 파싱된 색상(hex, rgb, hsl, 명명된 색상 지원), `d`는 타입이 지정된 경로 명령의 시퀀스입니다. 이는 의미론적 검증과 조작을 가능하게 합니다.

![Pictkit AST Code Split](/content/images/articles/pictkit-ast-code-split.png)
*분할 보기: 왼쪽은 실시간 구문 강조가 적용된 SVG 소스 코드. 오른쪽은 우리 파서가 구축한 AST의 시각적 표현. 소스 코드의 각 색상은 트리 내의 다른 노드 유형에 대응합니다.*

### 3.2 속성 패널: 외과적 DOM 뮤테이션

사용자가 SVG의 노드를 클릭하면, 엔진은 어떤 AST 요소가 그 지점에 해당하는지 파악합니다. 이는 각 요소의 바운딩 박스에 대한 히트 테스트를 포함하며, 공간 인덱스(viewBox를 사분면으로 분할하는 단순 R-tree)로 가속화됩니다.

노드가 선택되면 Appearance 패널이 편집 가능한 속성을 표시합니다. 여기가 Pictkit이 진정으로 빛나는 지점입니다:

```javascript
function updateNodeProperty(astNode, property, newValue) {
  // 1. 속성 유형에 대해 새 값 검증
  const validator = PROPERTY_VALIDATORS[property];
  if (validator && !validator(newValue)) {
    throw new Error(`${property}에 대한 유효하지 않은 값: ${newValue}`);
  }
  
  // 2. AST 업데이트 (진실의 원천)
  astNode.attributes[property].value = newValue;
  
  // 3. 영향을 받는 DOM 요소만 변경 — 나머지는 그대로
  const domElement = astNode._domRef;
  domElement.setAttribute(property, newValue);
  
  // 4. 브라우저가 나머지 처리: 영향받은 픽셀만 GPU 재페인트
  
  // 5. Undo 히스토리에 푸시
  undoManager.push({
    undo: () => updateNodeProperty(astNode, property, oldValue),
    redo: () => updateNodeProperty(astNode, property, newValue)
  });
}
```

3단계에 주목하세요: `domElement.setAttribute(property, newValue)`. 브라우저가 재페인트하는 데 필요한 것은 이게 전부입니다. 전체 DOM이 재생성되지 않고, 페이지 레이아웃이 무효화되지 않으며, 전역 리플로우가 트리거되지 않습니다. 렌더링 엔진은 특정 페인트 속성만 변경되었음을 감지하고 국소적인 리페인트만 예약합니다. 색상만 변경된 경우, GPU가 픽셀 버퍼에서 몇 개의 값만 교체하면 끝입니다.

그 결과, 불투명도 슬라이더를 0에서 1로 드래그할 때 단일 프레임 드롭 없이 실시간으로 변화를 볼 수 있습니다. 이와 대조되는 서버 방식은: 슬라이더 값을 서버로 전송 → 200ms 대기 → 새 비트맵 수신 → 디코딩 → 표시. 완전히 다른 두 가지 경험입니다.

![Pictkit Node Property Manipulation](/content/images/articles/pictkit-node-property-manipulation.png)
*Appearance 패널의 실제 동작. 모든 슬라이더 변경, 컬러 피커, 토글 — 모두 JavaScript 메인 스레드에서 처리되어 16ms 이내에 GPU에 반영됩니다. 네트워크 없음. 대기 없음. 변명의 여지 없음.*

### 3.3 아핀 변환: 흑마법이 아닌, 진짜 수학

Pictkit을 구축하면서 가장 통찰력 있었던 순간 중 하나는 변환을 구현할 때였습니다. "90° 회전"을 클릭하면, 대부분의 온라인 편집기는 파일을 서버로 보내고 서버에서 ImageMagick이나 librsvg를 실행해 모든 좌표를 다시 계산합니다. 이는 자동차 문을 열기 위해 외과 의사를 부르는 것과 같습니다.

실제로 2D 아핀 변환은 3×3 행렬로 표현됩니다:

```
| a  c  e |
| b  d  f |
| 0  0  1 |
```

여기서:
- `a`, `d`는 X 및 Y 방향 스케일
- `b`, `c`는 기울기(skew)
- `e`, `f`는 X 및 Y 방향 이동

이것이 `transform="matrix(1.04, 0, 0, 1.04, 0.02, 45.20)"`의 의미입니다: 104% 균일 스케일, 기울기 없음, X 이동 0.02px, Y 이동 45.20px.

중심점 (cx, cy)를 기준으로 점 (x, y)를 각도 θ만큼 회전:

```javascript
function rotatePoint(x, y, cx, cy, angleRad) {
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  
  // 원점으로 이동, 회전, 다시 이동
  const dx = x - cx;
  const dy = y - cy;
  
  return {
    x: dx * cos - dy * sin + cx,
    y: dx * sin + dy * cos + cy
  };
}
```

하지만 Pictkit에서는 점 단위로 회전하지 않습니다. 수백 개의 좌표를 가진 경로에는 비효율적이기 때문입니다. 대신, 새로운 변환을 요소의 행렬에 합성합니다. 요소가 이미 변환 `T1`을 가지고 있고 회전 `R`을 적용하면, 새 변환은 `R × T1`입니다 (3×3 행렬 곱셈):

```javascript
function composeMatrices(a, b) {
  // a와 b는 평면 배열로 저장된 3x3 행렬 [a,c,e, b,d,f, 0,0,1]
  return [
    a[0]*b[0] + a[1]*b[3] + a[2]*b[6],  // a
    a[0]*b[1] + a[1]*b[4] + a[2]*b[7],  // c  
    a[0]*b[2] + a[1]*b[5] + a[2]*b[8],  // e
    a[3]*b[0] + a[4]*b[3] + a[5]*b[6],  // b
    a[3]*b[1] + a[4]*b[4] + a[5]*b[7],  // d
    a[3]*b[2] + a[4]*b[5] + a[5]*b[8],  // f
    0, 0, 1
  ];
}
```

세 줄의 부동 소수점 연산. CPU는 나노초 단위로 해결합니다. 서버에서는 SVG 전체를 보내고, 처리 큐에서 기다리고, 정확히 동일한 곱셈을 실행하고(데이터센터에 있다고 수학이 달라지지 않으니까요), 결과를 반송해야 합니다. 이 아이러니는 참으로 훌륭합니다.

**비아핀 변환은 어떻게 할까요?** 자유 변형이나 원근 변환 같은 경우 말이죠. 여기서 대부분의 편집기들이 백기를 들고 백엔드로 넘깁니다. Pictkit에서는 각 경로의 베지에 제어점에 직접 변환을 적용하고 `d` 속성을 재구성합니다. CPU 작업이 약간 더 많지만, 수천 개 노드까지의 SVG에는 충분히 감당할 만합니다.

### 3.4 래스터 내보내기: Canvas, GPU, 그리고 서버를 사용하지 않는 기술

걸작을 PNG나 WebP로 내보낼 때가 왔습니다. 전통적인 편집기라면:

1. SVG를 서버로 전송
2. 서버가 Headless Chrome을 실행(200-500MB RAM)하거나 ImageMagick/librsvg 호출
3. 픽셀 버퍼로 렌더링
4. PNG/WebP로 인코딩
5. 결과를 스트리밍 반환

Pictkit의 방식:

```javascript
async function exportToPNG(svgElement, scale = 2) {
  // 1. SVG를 Data URI로 직렬화
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  
  // 2. Image를 생성하고 SVG 로드
  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  });
  
  // 3. 목표 배율로 canvas에 그리기
  const canvas = document.createElement('canvas');
  const bbox = svgElement.getBBox();
  canvas.width = bbox.width * scale;
  canvas.height = bbox.height * scale;
  
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  ctx.drawImage(img, 0, 0);
  
  // 4. GPU는 이미 drawImage()를 통해 래스터화 작업을 완료했습니다.
  //    이제 바이트를 추출하기만 하면 됩니다:
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  
  // 5. 정리
  URL.revokeObjectURL(url);
  
  return blob;
}
```

여기서 일어나는 네 가지 중요한 사항:

1. **`ctx.drawImage()`는 GPU를 사용합니다.** SVG를 canvas 2D 컨텍스트에 그릴 때, 브라우저는 CPU에서 래스터화하지 않습니다. 웹 페이지를 렌더링할 때 사용하는 것과 동일한 하드웨어 가속 파이프라인을 사용합니다. Chrome에서는 Skia와 GPU를 통과합니다. 결과: 1000×1000 SVG를 2배 스케일로 래스터화하는 데 10ms 미만.

2. **`canvas.toBlob()`이 비동기인 데는 이유가 있습니다.** 내부적으로 브라우저는 PNG 압축을 별도 스레드에 위임할 수 있어, 메인 스레드는 반응성 있는 UI를 위해 확보됩니다.

3. **서버 측에서 JPEG 품질 설정을 제공할 필요가 없습니다.** `canvas.toBlob()`은 MIME 유형과 품질을 매개변수로 받습니다. 날카로운 에지 그래픽에는 PNG, 사진에는 WebP, 호환성에는 JPEG. 모두 로컬에서 처리.

4. **최종 다운로드는 단 한 줄:** `<a>` 요소를 생성하고, `href = URL.createObjectURL(blob)`, `download = '내-파일.png'`를 설정하고, `click()`을 실행한 후 URL을 해제합니다. 브라우저가 하드 드라이브에 쓰기 전까지 파일은 RAM을 떠나지 않습니다.

![Mind Blown](/content/images/mind-blown.gif)
*가장 가까운 서버에 HTTP 요청이 도달하는 것보다 더 빠르게 로컬 GPU에서 2x/3x/4x 해상도로 벡터를 래스터화할 수 있다는 것을 깨닫는 순간. 게다가 아무도 당신의 디자인을 볼 수 없습니다.*

---

## 제4부: 실제 측정치 (마케팅 허풍이 아닌)

구체적인 숫자로 이야기합시다. 측정된. 재현 가능한.

비교 환경: M1 MacBook Pro, 16GB RAM, Chrome 125, 600Mbps 대칭 광회선, AWS us-east-1 서버(동일 대륙, 이상적 조건). 테스트 SVG: 14개의 `<path>` 요소, 3중첩 `<g>` 그룹, 선형 그라데이션 1개를 가진 4.7KB "스프링 롤" 아이콘.

### 테스트 1: 파일 열기 시간

| 지표 | 전통적 클라우드 편집기 | Pictkit |
|:---|:---|:---|
| TTFB (첫 바이트까지의 시간) | 0ms (파일이 이미 로컬에 있음) | 0ms (파일이 이미 로컬에 있음) |
| 네트워크 지연 | 800ms - 2.5s (서버 부하에 따라) | **0ms** (네트워크 없음, 서버 없음) |
| 파싱 시간 | 백엔드 의존 + 응답 직렬화 | 0.3ms (자체 파서) + 2ms (DOM 마운트) |
| **인터랙티브까지 총합** | **3-5초** | **< 50ms** |

이것은 10%나 50% 개선이 아닙니다. **60-100배** 개선입니다. 사용자 경험으로 말하면, "로딩되는 동안 트위터나 보자"와 "눈 깜빡할 틈도 없었다"의 차이입니다.

### 테스트 2: 편집 지연 (채우기 색상 변경)

컬러 피커에서 클릭을 놓은 후 화면에 최종 결과가 나타나기까지의 시간.

| 단계 | 클라우드 편집기 | Pictkit |
|:---|:---|:---|
| 네트워크 RTT | 80-150ms | 0ms |
| 서버 처리 | 50-200ms | 0ms |
| DOM 업데이트 | 응답 형식에 따라 다름 | **< 1ms** (`setAttribute`) |
| GPU 재페인트 | 8-16ms (데이터 수신 후) | **< 16ms** (즉시) |
| **체감 총합** | **200-500ms** | **즉시 (< 16ms)** |

200-500ms는 별것 아닌 것처럼 들릴 수 있지만, 인간의 뇌가 액션을 "즉각적"이라고 인식하는 100ms 임계값을 넘습니다. Pictkit에서의 편집은 네이티브 애플리케이션과 구별할 수 없습니다.

### 테스트 3: 2배 PNG로 내보내기 (약 240KB 출력)

| 단계 | 클라우드 편집기 | Pictkit |
|:---|:---|:---|
| SVG 업로드 | 이미 서버에 있음 | 불필요 |
| 렌더링 | 1-3s (Headless Chrome 또는 librsvg) | **8ms** (canvas 통한 GPU) |
| PNG 압축 | 50-200ms | **15ms** (`canvas.toBlob`) |
| 다운로드 | 500ms - 2s (HTTP 스트리밍) | **< 1ms** (로컬 blob URL 생성) |
| **총합** | **2-5초** | **< 30ms** |

### 그리고 비용은?

아키텍처 결정을 내리는 사람이 가장 신경 써야 할 표입니다:

| 항목 | 클라우드 편집기 (월 1만 사용자) | Pictkit (무제한 사용자) |
|:---|:---|:---|
| 애플리케이션 서버 | $200-600/월 | **$0** |
| 로드 밸런서 | $30-80/월 | **$0** |
| 임시 스토리지 | $50-200/월 | **$0** |
| 송신 대역폭 | $100-500/월 | **$0 (초기 HTML/JS만)** |
| 사용자당 한계 비용 | 높음 | **완전히 제로** |

순수 프론트엔드 아키텍처는 단지 더 빠르고 더 안전할 뿐만 아니라, **확장이 무료**입니다. 모든 새로운 사용자는 자신의 CPU, 자신의 GPU, 자신의 RAM을 가져옵니다. 여러분의 인프라 비용은 한 푼도 움직이지 않습니다. 이것은 비용 최적화가 아닙니다 — 완전히 새로운 범주입니다.

---

## 제5부: 이 아키텍처의 대가 (공짜 점심은 없기에)

트레이드오프 없는 완벽한 해결책이라고 제시하는 것은 지적으로 정직하지 못할 것입니다. 100% 프론트엔드 아키텍처에는 실제 비용이 있으며, 이를 문서화하는 것이 중요하다고 생각합니다:

### 대가 1: 초기 번들 크기

완전한 SVG 파서, 행렬 변환 엔진, Undo 기록 관리자, 히트 테스트 시스템... 모두 합치면 꽤 큽니다. 우리의 JavaScript 번들은 처리를 외부화하는 편집기보다 무겁습니다. 트리 셰이킹과 코드 분할에 많은 노력을 기울여 파서는 사용자가 실제로 파일을 열 때만 로드되도록 했지만, 초기 다운로드는 여전히 더 큽니다.

**우리의 답변:** 이 비용을 받아들입니다. 한 번만 다운로드되는 200-300KB의 잘 캐시된 번들이, 지속적인 서버 호출에 의존하는 100KB보다 낫습니다. 두 번째 상호작용부터는 이미 우리가 이긴 겁니다.

### 대가 2: 브라우저 샌드박스 한계

메인 스레드에서 50MB SVG를 UI 프리즈 없이 처리할 수는 없습니다. 매우 큰 파일의 경우, 파싱을 Web Worker로 오프로드하고 렌더링을 청크로 나눕니다. 하지만 실용적인 한계가 있습니다: 약 20MB를 초과하는 파일은 브라우저에서 문제가 되기 시작합니다.

**우리의 답변:** 사용 사례의 99.7%(아이콘, 일러스트레이션, 웹 그래픽)에서 SVG는 1KB에서 2MB 사이입니다. 지적도(cadastral map)를 SVG로 편집해야 한다면, 타일 렌더링을 갖춘 전문 도구가 필요할 것입니다. Pictkit은 그런 도구가 되려 하지 않습니다.

### 대가 3: 크로스 브라우저 일관성

Firefox, Chrome, Safari는 SVG 렌더링 구현이 미묘하게 다릅니다: 폰트 안티에일리어싱, 색 공간 처리, 그리고 `getBBox()`가 때때로 일관되지 않은 값을 반환합니다. 각 브라우저에 대한 정규화 레이어를 작성해야 했습니다.

**우리의 답변:** Playwright를 사용한 자동화된 비주얼 회귀 테스트로 브라우저 간 스크린샷을 비교합니다. 완벽하지는 않지만, 원격 서버에서 이러한 차이를 디버깅하는 것보다 훨씬 유지보수하기 쉽습니다.

---

## 제6부: 결론 — 클라우드 마케팅은 줄이고, 진짜 엔지니어링을 늘리자

보세요, 저는 특정 용도에서 클라이언트-서버 아키텍처가 타당하다는 것을 이해합니다. 기가바이트 규모의 데이터셋, 머신러닝 모델 훈련, 수백 명의 동시 사용자 간 상태 조정 — 이런 것들은 실제로 서버가 필요합니다. 모든 컴퓨팅이 로컬에서 이루어져야 한다고 말하는 게 아닙니다.

하지만 SVG 같은 "스테로이드 맞은 텍스트 파일" 하나 편집하는 데?

**타당한 기술적 변명은 존재하지 않습니다.**

우리 업계는 "클라우드"라는 단어가, 아무리 비효율적이더라도 모든 아키텍처 결정을 정당화하는 마법의 단어가 되어버린 불합리한 지점에 도달했습니다. "클라우드에 올립니다"는 현대적이고, 혁신적이고, 확장 가능하게 들립니다. 하지만 그 마케팅 아래에는 불편한 현실이 있습니다: 통제할 수 없는 서버에 사용자 데이터를 보내고, 모든 상호작용에 수백 밀리초의 지연을 추가하며, 그렇게 할 수 있는 특권에 돈을 지불하고 있다는 것입니다.

Pictkit은 다른 길이 있음을 보여주려는 저의 시도입니다:

- **코드는 데이터가 있는 곳에서 실행됩니다.** 그 반대가 아닙니다.
- **프라이버시는 시스템의 물리적 속성**이며, 이용약관의 조항이 아닙니다.
- **성능은 프레임 단위로 측정**되며, 서버 응답 시간이 아닙니다.
- **확장성은 무료**입니다 — 모든 사용자가 자신의 하드웨어를 가져오니까요.
- **사용자 경험은 네이티브 앱과 구별할 수 없습니다** — 실질적으로 네이티브 앱이니까요.

제 도구를 꼭 써야 하는 건 아닙니다. 다른 프론트엔드 우선 옵션도 있습니다. 하지만 이제부터 아키텍처를 설계할 때마다 스스로에게 한 가지 질문을 하기 시작해야 합니다: **이게 사용자 브라우저에서 실행될 수 있을까?** 답이 '예'라면, 그러지 않을 정말, 정말로 타당한 이유가 필요합니다.

코드는 정직합니다. 아키텍처도 그래야 합니다.

---

*Pictkit의 소스 코드를 살펴보고 싶다면, [GitHub](https://github.com/SVG-Editor/pictkit)에 공개되어 있습니다. 개선할 점을 찾으면 이슈를 열거나 PR을 보내주세요. 제가 완전히 틀렸고 서버 측 처리가 올바른 길이라고 생각한다면, 그것도 이슈를 열어주세요 — 좋은 아키텍처 논의야말로 이 업계를 앞으로 나아가게 하는 원동력이니까요.*
