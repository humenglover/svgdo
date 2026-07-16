---

## SVG는 정적 이미지가 아닙니다

대부분의 사람들은 SVG를 "깨지지 않는 PNG"라고 생각합니다. 하지만 SVG는 움직일 수 있습니다.

CSS 애니메이션으로 아이콘을 회전시키고, 색을 바꾸고, 바운스시키고, 변형시킬 수 있습니다 — GIF나 비디오 없이 몇 줄의 CSS만으로 가능합니다.

---

## SVG 애니메이션의 세 가지 방법

### 1. CSS 애니메이션 (가장 쉬움)

가장 권장되는 방법입니다:

```css
.icon {
  animation: spin 2s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### 2. CSS 트랜지션 (인터랙티브 효과)

호버나 클릭에 의한 효과에 최적:

```css
.icon:hover {
  fill: #3b82f6;
  transform: scale(1.2);
  transition: all 0.3s ease;
}
```

---

## 실전 예: 회전 로더

```html
<svg class="spinner" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="10" fill="none"
          stroke="#3b82f6" stroke-width="3"
          stroke-dasharray="31.4 31.4"/>
</svg>
```

```css
.spinner { animation: rotate 1s linear infinite; }
@keyframes rotate { 100% { transform: rotate(360deg); } }
```

---

SVG 에디터에서 시도해보세요: 아이콘을 로드하고 코드 뷰에서 CSS 애니메이션을 추가한 후 미리보기에서 효과를 확인하세요.
