---

## SVGは静止画だけじゃない

ほとんどの人はSVGを「ぼやけないPNG」だと思っています。しかしSVGは動かせます。

CSSアニメーションで、アイコンを回転させたり、色を変えたり、バウンドさせたり、変形させたり — GIFも動画も不要です。数行のCSSだけで実現できます。

---

## SVGアニメーションの3つの方法

### 1. CSSアニメーション（最も簡単）

最も推奨される方法です。SVG要素にCSSアニメーションを直接適用します：

```css
.icon {
  animation: spin 2s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### 2. CSSトランジション（インタラクティブ効果）

ホバーやクリックによるエフェクトに最適：

```css
.icon:hover {
  fill: #3b82f6;
  transform: scale(1.2);
  transition: all 0.3s ease;
}
```

### 3. SMILアニメーション（非推奨）

```html
<animate attributeName="r" from="10" to="20" dur="1s" repeatCount="indefinite" />
```

SMILはSVGネイティブのアニメーションタグですが、Chromeはかつて廃止を計画し、サポートも不安定です。新規プロジェクトでは避けてください。

---

## 実例：回転ローダー

```html
<svg class="spinner" viewBox="0 0 24 24" width="48" height="48">
  <circle cx="12" cy="12" r="10" fill="none"
          stroke="#3b82f6" stroke-width="3"
          stroke-dasharray="31.4 31.4" stroke-linecap="round"/>
</svg>
```

```css
.spinner {
  animation: rotate 1s linear infinite;
}
@keyframes rotate {
  100% { transform: rotate(360deg); }
}
```

たったこれだけです。

---

## アニメーションパフォーマンスのヒント

- **`transform`と`opacity`を優先** — コンポジットのみでレイアウト再計算なし
- **`width`/`height`のアニメーションを避ける** — 完全なレイアウト再計算が発生
- **複雑なアニメーションには`requestAnimationFrame`を使う**

---

SVGエディタで試してみてください：アイコンを読み込み、コードビューでCSSアニメーションを追加し、プレビューで効果を確認できます。
