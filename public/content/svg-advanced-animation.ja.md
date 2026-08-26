# SVGストロークアニメーションとパスモーフィング：ベクターグラフィックを"生き生きと"させる高度なモーションデザインガイド

フロントエンド界隈には根強い誤解がある：「SVGアニメーションって、アイコンをくるくる回したり色を変えたりするだけだろ？」

違うんだよ、兄弟。君が見たことのあるあの洗練されたウェブサイトのオープニングアニメーション——ロゴが目に見えない手で一筆一筆なぞられていくような演出、データチャートの線が曲線に沿って"成長"していく様子、スクロールに合わせてSVGイラストが何もないところから"描かれていく"効果——これらはほぼ全て、高度なSVGアニメーションの賜物だ。そしてその背後にあるコア技術は、突き詰めればたった二つ：**stroke-dashoffsetによる線画アニメーション**と**パスモーフィング**だ。

既存の「SVGアニメーションの落とし穴」記事では、`transform-box: fill-box` のような命綱となるテクニックを既にカバーしている。今回は基礎は飛ばす。面接官を前のめりにさせ、ユーザーを3秒間画面に釘付けにする高度な技を、直接解体していく。

![SVGストロークアニメーションのコードデモ](/content/images/svg-advanced-animation-1.jpg)
*SVGストロークアニメーションは、どんなパス形状もリアルタイムで"描かれた"ように見せることができる——ビットマップや動画では決して実現できない表現だ。すべてのフレームが正確なdashoffset値によって制御されている。*

## ストロークアニメーションの核心原理：「描いている」ように見えるのは、実は「露出させている」だけ

このテクニックの背後にあるロジックは極めて直感に反する。君はブラウザがフレームごとにパスセグメントを追加していると思っているだろう——まったく違う。ブラウザが実際にやっているのは：**最初に線全体を描いてしまい、それを巧妙なCSSプロパティで"隠し"、アニメーションで少しずつ"露出"させているのだ。**

そのプロパティが `stroke-dasharray` だ。

`stroke-dasharray` を理解することが、すべてのSVGストロークアニメーションを理解する鍵だ。これは破線パターンを定義する——実線の長さと間隔の長さを交互に指定する：

```
stroke-dasharray: 10, 5;   /* 10pxの実線 + 5pxの空白、繰り返し */
stroke-dasharray: 20;      /* 20pxの実線 + 20pxの空白（単一値=等間隔）*/
stroke-dasharray: 500;     /* 500pxの実線 + 500pxの空白 */
```

ここで `stroke-dasharray` を**パスの全長と正確に同じ値**に設定する。すると、パス全体をちょうど覆う1本の実線ができ、その後に同じ長さの空白が続く——しかし空白はパスの終点から始まるため、視覚的には連続した実線に見える。

魔法は2つ目のプロパティで起こる：`stroke-dashoffset`。これは破線パターンの開始位置をずらすオフセット値だ。

```
stroke-dashoffset: 0;    /* パターンが先頭から開始 → 線が完全に見える */
stroke-dashoffset: 500;  /* パターンを500px前方にずらす → 実線部分が視野外に押し出される → 完全に不可視！ */
```

**これが目が騙される瞬間だ。** JavaScriptでパスの実際の長さを取得し、`dasharray` と `dashoffset` を両方ともその長さに設定する——線全体が"魔法のように消える"。そして、`dashoffset` を全長から0までアニメーションさせる——線が始点から少しずつ"描かれて"いく：

```javascript
// パスの実際の長さを取得（これがアニメーション全体の基盤）
const path = document.querySelector('#my-line');
const length = path.getTotalLength();  // 例：847.3を返す

// 初期状態を設定：線全体を"隠す"
path.style.strokeDasharray = length;
path.style.strokeDashoffset = length;
path.style.transition = 'stroke-dashoffset 2s ease-in-out';

// アニメーションを発火：オフセットをゼロに → 線が"描かれる"
requestAnimationFrame(() => {
  path.style.strokeDashoffset = 0;
});
```

重要なコードはこの3行だけ。外部ライブラリも複雑なロジックも不要——ブラウザのネイティブなSVG破線レンダリングを利用した目の錯覚に過ぎない。しかしこの錯覚は非常に強力だ——CSSプロパティを操作しているため、`@keyframes` に入れられるし、`transition` も使えるし、`requestAnimationFrame` で正確なフレーム制御もできるし、SMILの `<animate>` タグで宣言的に定義することもできる。

### なぜ getTotalLength() を使わなければならないのか

こう思うかもしれない：パスの長さを目測で適当な数値を入れてはダメなのか？例えば `stroke-dasharray: 800` では？

ダメだ。精度不足は2つの問題を引き起こす。値が小さすぎると——アニメーション終了時に線がまだ描き切れておらず、終点に"切断面"が残る。値が大きすぎると——アニメーション終了後も残りの空白が前に押し出され続け、線の終点が視覚的に"ちらつく"。

`getTotalLength()` はSVG座標系におけるパスの正確な弧長を返す。すべてのベジェ曲線セグメントの実際の長さを含んでいる。これがJavaScriptでこの値を取得しなければならない理由だ——CSSだけでは任意のSVGパスの弧長を計算する能力がない。

レスポンシブ対応のシナリオ（SVGの寸法がビューポートに応じて変化する場合）では、パスの長さも変わる。`resize` イベントで再計算することを忘れずに：

```javascript
window.addEventListener('resize', () => {
  const newLength = path.getTotalLength();
  path.style.strokeDasharray = newLength;
  path.style.strokeDashoffset = newLength;
});
```

![SVGアニメーションによるデータ可視化](/content/images/svg-advanced-animation-2.jpg)
*動的なデータ可視化チャートは、SVGアニメーションの最も一般的な応用分野の一つだ。すべての成長する曲線、すべての上昇するバーチャートの背後には、dasharrayとdashoffsetの精密な連携がある。*

## 3つの実装アプローチ：CSS、JS、SMILの選び方

### 純粋CSS @keyframes：最も簡単だが制限あり

パスの長さが固定されている場合（特定のサイズのロゴなど）、長さの値をCSSに直接ハードコードできる：

```css
.logo-path {
  fill: none;
  stroke: #3b82f6;
  stroke-width: 2;
  stroke-linecap: round;        /* 端点を丸く */
  stroke-linejoin: round;       /* 角を滑らかに */
  stroke-dasharray: 847;        /* パスの全長（事前に把握）*/
  stroke-dashoffset: 847;
  animation: draw-line 2s ease-in-out forwards;
}

@keyframes draw-line {
  to { stroke-dashoffset: 0; }
}
```

`forwards` が重要だ——これがないと、アニメーション終了時に `dashoffset` が初期値に跳ね返り、線が一瞬で消える。それは気まずい。

純粋CSSアプローチの利点は、JS依存ゼロで、GPUが `stroke-dashoffset` の遷移を引き受けられること。欠点は、パスの長さがCSSに埋め込まれているため、SVGをレスポンシブにスケーリングする必要がある場合に破綻することだ。

### JavaScript動的トリガー：最も柔軟、本番環境の第一選択

上記のJSコードが本番環境で最もよく使われるアプローチだ。パス長を動的に取得でき、任意のタイミング（ページロード、ビューポート進入、ユーザークリック）でアニメーションを発火でき、複数パスのタイミングを正確に制御できる。

一般的なパターンは複数パスのアニメーションを連結すること——文字が一文字ずつ"書かれていく"：

```javascript
const paths = document.querySelectorAll('.handwriting-path');
paths.forEach((path, index) => {
  const length = path.getTotalLength();
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;
  path.style.transition = `stroke-dashoffset 0.6s ${index * 0.15}s ease-out`;
  // 各パスを index × 0.15秒遅延 → 文字が順番に現れる
});

// 全パスの準備ができたら一斉に発火
requestAnimationFrame(() => {
  paths.forEach(p => p.style.strokeDashoffset = '0');
});
```

このコードの効果：テキストが誰かに一筆一筆書かれているように見える。無数のブランドサイトのヒーローセクションで使われている手法だ。

### SMIL `<animate>`：ネイティブだが既に終焉

SMIL（Synchronized Multimedia Integration Language）はSVGに組み込まれた宣言的アニメーションタグで、SVGマークアップ内に直接記述できる：

```html
<path d="M10,80 Q95,10 180,80" fill="none" stroke="#333" stroke-width="3"
      stroke-dasharray="200" stroke-dashoffset="200">
  <animate attributeName="stroke-dashoffset"
           from="200" to="0"
           dur="1.5s"
           fill="freeze"
           begin="0s" />
</path>
```

利点：CSSもJSも不要。アニメーション定義が完全にSVGファイル内に自己完結している。このSVGを `<img>` として使っても、CSS背景画像として使っても、メールに埋め込んでも——アニメーションは動作する。

現実：Chromeは2025年にSMILサポートを完全に削除した。SafariとFirefoxにはまだ残っているが、いつまで残るかは誰にもわからない。特定の制御された環境向けのSVG（メール内のアニメーションロゴなど）を作っているのでなければ、**新規プロジェクトでSMILを使うべきではない。**

![](https://i.giphy.com/media/3o7TKzZUoKk4Sdkc1q.gif)
*SMILで華麗なアニメーションを書いて、Chromeで開いたら何も動かなかった時の気持ち——SMILが動いていた日々が懐かしくなる。*

## 応用編：単一の線画から完全な視覚的ナラティブへ

基本をマスターした後、本当に差がつくのは、これらの基本アニメーションをどう組み合わせてナラティブ（語り）のある完成されたモーションに仕上げるかだ。

### ローディングプログレスリング

ストロークアニメーションの最も一般的な応用：0%から100%までリングが満たされていくローディングアニメーション。コツは `dasharray` を円周の長さに設定し、`dashoffset` をアニメーションさせること：

```css
.progress-ring {
  fill: none;
  stroke: #3b82f6;
  stroke-width: 6;
  stroke-linecap: round;
  /* 円周 = 2πr = 2 × 3.14159 × 45 ≈ 282.7 */
  stroke-dasharray: 282.7;
  /* 初期オフセット 282.7 → 進捗0%；オフセット0 → 進捗100% */
  stroke-dashoffset: 282.7;
  transition: stroke-dashoffset 0.3s ease;
}
```

実際の進捗値に基づいてdashoffsetを動的に計算する：

```javascript
function setProgress(percent) {
  const circumference = 2 * Math.PI * 45;  // 円周
  const offset = circumference - (percent / 100) * circumference;
  ring.style.strokeDashoffset = offset;
  // percent=0   → offset=circumference → 完全に空
  // percent=100 → offset=0              → 完全なリング
}

setProgress(75);  // リングが75%まで充填
```

`stroke-linecap` の値の違いがプログレスリングの視覚スタイルに影響する：`round` はモダンUIに適した丸みのある端点、`butt` はダッシュボードスタイルに適したフラットな端点になる。

### マーチングアンツ（流れる破線ボーダー）

マーチングアンツ効果（Photoshopの選択範囲の点線が流れるような効果）は、本質的に短い破線＋連続的に変化するdashoffsetだ：

```css
@keyframes marching-ants {
  to { stroke-dashoffset: -20; }  /* 負の値で"前方に流れる" */
}

.marching-border {
  stroke-dasharray: 10, 5;  /* 10px実線 + 5px空白 */
  animation: marching-ants 0.5s linear infinite;
}
```

方向を逆にするには `to { stroke-dashoffset: 20; }` に変更する。このエフェクトは画像の切り抜き選択範囲や地図の境界線ハイライトなどで特に効果的だ。

### 手書き署名アニメーション

多くのブランドサイトがヒーローエリアに"手書き署名"アニメーションを配置している——"Signature"という単語をSVGパスとして作り、一筆一筆描いていく。

技術レシピ：
1. Illustrator / Figmaでテキストをアウトライン化（Outline Stroke）
2. SVGとしてエクスポートし、各文字/画が独立した `<path>` になるようにする
3. 筆順にパスを並べ、各パスの長さを計算
4. JSでアニメーションを連結——1本目が完了したら2本目が始まる、実際の筆記リズムをシミュレート

筆圧の変化は静的なSVGではパスの形状で表現できるが、アニメーションレベルでは `stroke-width` しか制御できない——ストロークアニメーションに加えて `stroke-width` の `@keyframes` を重ねることで、書き始めは細く、書き進めるほど太くなる効果を出せる：

```css
@keyframes write-with-pressure {
  0%   { stroke-dashoffset: var(--len); stroke-width: 1; }
  30%  { stroke-width: 3; }
  70%  { stroke-width: 3; }
  100% { stroke-dashoffset: 0; stroke-width: 1; }
}
```

このレベルの細部へのこだわりが「良い」と「息をのむ」の差だ。

## パスモーフィング：形が目の前で変化する

ストロークアニメーションが制御するのは「線の可視性」。パスモーフィングが制御するのは「形そのものの変化」——円が四角に、三角形が矢印に、Aの文字がBの文字に変わる。

パスモーフィングの核心的操作：**`<path>` 要素の `d` 属性をアニメーションさせること。**

`d` 属性はパスの形状を定義する——`M` は移動、`L` は直線、`C` は3次ベジェ曲線、`Q` は2次ベジェ曲線。開始形状と終了形状のパス構造が完全に同一（同じコマンドタイプ、同じポイント数）であれば、ブラウザは2つの `d` 文字列間をスムーズに補間できる。

### CSS d属性アニメーション（2026年時点で十分にサポート）

数年前まで、`d` 属性はCSSアニメーションの立入禁止区域だった——ブラウザは `fill`、`stroke`、`opacity` のような「表示属性」しかアニメーションできず、`d` のような「幾何属性」はアニメーションできなかった。しかし2024年以降、主要ブラウザがCSSの `d` 属性アニメーションに次々と対応した：

```css
.morph-shape {
  /* 円 → 四角 → 円 */
  animation: morph 3s ease-in-out infinite alternate;
}

@keyframes morph {
  0% {
    d: path("M50,10 A40,40 0 1,1 49.9,10 Z");  /* 近似円 */
  }
  100% {
    d: path("M15,15 L85,15 L85,85 L15,85 Z");   /* 四角形 */
  }
}
```

**致命的な要件：** 開始パスと終了パスは**完全に同じ数と種類のコマンド**を含まなければならない。一方のパスに4つのポイントがあり、もう一方に8つある場合、アニメーションはエラーにならない——しかし遷移効果は非常に奇妙になり、ブラウザは予測不可能な中間形状を生成する。これがパスモーフィングで最もハマりやすい落とし穴だ。

### ポイントマッチングの原則

三角形を矢印に変形させたいとしよう。三角形は3つの頂点しか持たないかもしれないが、矢印には7つ必要だ。直接変形すると破綻する。正しいアプローチ：三角形のパスに"こっそり"追加のポイントを挿入する——これらのポイントは既存の頂点と重なっているため三角形の外観は変わらないが、パス構造が矢印と一致する：

```
三角形（視覚的には3点、矢印と合わせるため実際は8点）:
M50,80 L85,20 L15,20 L15,20 L15,20 L15,20 L15,20 Z

矢印（8点）:
M15,40 L50,15 L85,40 L70,40 L70,70 L30,70 L30,40 Z
```

これで両方のパスが同じコマンド数を持ち、変形はスムーズになる。SVGDOエディタでは、コードビューで `d` 属性を直接編集してパスポイント数を調整できる。

## スクロール駆動のSVGアニメーション：スクロールホイールをタイムラインに変える

スクロール駆動アニメーションは2025〜2026年のフロントエンドで最もホットなトレンドの一つだ。核心的な考え方：**ユーザーがスクロールしたピクセル数 ＝ アニメーションの進行フレーム数。**

### IntersectionObserver：最も安定したアプローチ

`IntersectionObserver` は要素がビューポートに出入りするタイミングを正確に検出できる。従来の使い方はブーリアン的——進入時にアニメーションを発火する。しかし、コールバックで `intersectionRatio`（要素の可視割合）を取得し、スクロール位置をアニメーションの進行度にマッピングできる：

```javascript
const svgIllustration = document.querySelector('#animated-illustration');
const paths = svgIllustration.querySelectorAll('.draw-on-scroll');

// 全パスのストロークアニメーションパラメータを初期化
paths.forEach(path => {
  const len = path.getTotalLength();
  path.style.strokeDasharray = len;
  path.style.strokeDashoffset = len;
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    // entry.intersectionRatio: 0（完全に不可視）→ 1（完全に可視）
    const progress = Math.min(1, Math.max(0, entry.intersectionRatio));
    
    paths.forEach(path => {
      const len = parseFloat(path.style.strokeDasharray);
      // スクロールの進行度からdashoffsetを逆算
      path.style.strokeDashoffset = len * (1 - progress);
    });
  });
}, {
  threshold: Array.from({ length: 101 }, (_, i) => i / 100)
  // 1%ごとにコールバック発火 → アニメーションがスクロールに滑らかに追従
});

observer.observe(svgIllustration);
```

このコードの効果：ユーザーが下にスクロールすると、SVGの線がスクロールの進行に合わせて"描かれて"いく。速くスクロールすれば描画も加速する。上にスクロールすれば線も逆に後退する。これは極めて強力なナラティブツールだ——製品紹介ページ、データレポート、年次総括のような「読みながら見る」体験に最適である。

### パフォーマンス上の注意

101個のthresholdブレークポイントを設定して、コールバック内で全パスに対して `getTotalLength()` を実行してはいけない。**初期化段階で全パスの長さを一度だけ計算し**、Mapに保存しておく。スクロールコールバックでは純粋な数値演算（`length * (1 - progress)`）だけを行い、DOM測定APIには一切触れないこと。

## パフォーマンス最適化：アニメーションをスライドショーにするな

### ルール1：transform と opacity だけをアニメーションさせろ

ブラウザが1フレームをレンダリングする際の5つの段階：JavaScript → Style → Layout → Paint → Composite。

- `transform` と `opacity` のアニメーションは **Composite** 段階だけを必要とする——GPUコンポジターがコンポジタースレッド上で直接処理し、LayoutとPaintを完全にスキップする。
- `stroke-dashoffset` は **Paint** 段階を必要とするが、Layoutは不要。
- `width`、`height`、`top`、`left` のアニメーションは5段階すべてを必要とする——毎フレーム再レイアウト、再描画、再合成。これはパフォーマンスの災害だ。

最適戦略は：ストロークアニメーションには `stroke-dashoffset` を使い（Paintのみ、許容範囲）、位置やサイズの変化には `transform: translate() scale()` を使い（Compositeのみ、理想的）、**レイアウトプロパティは絶対にアニメーションさせない。**

### ルール2：同時アニメーション要素数を制御しろ

ページ上で50個のCSSアニメーションを同時に走らせると、開発マシンでは問題なく見えても、ローエンドのスマートフォンではフレームレートが急降下する。実測のしきい値は約30要素前後（アニメーションの複雑さとデバイスに依存する）。

解決策：**ビューポート内の要素だけをアニメーションさせる。** `IntersectionObserver` を使って要素がビューポート内にあるかを検出し——画面外の要素からは `animation` クラスを削除し、アニメーションを一時停止する。ユーザーは画面外のアニメーションをどうせ見ることができない。一時停止しても何の損失もなく、パフォーマンスは大幅に向上する。

### ルール3：will-change を正しく使え

`will-change: stroke-dashoffset` はブラウザに「このプロパティはもうすぐ変更されるから、最適化リソースを事前に準備しておいてくれ」と伝える。しかしこれは無料ではない——ブラウザは `will-change` を宣言した要素ごとに追加のGPUメモリレイヤーを割り当てる。使いすぎるとGPUメモリが枯渇し、全体が逆に遅くなる。

正しいパターン：**アニメーション開始前に `will-change` を追加し、アニメーション終了後に削除する。**

```css
.animate-in {
  will-change: stroke-dashoffset;
  animation: draw-line 2s ease-out forwards;
}

.animate-done {
  will-change: auto;  /* GPUリソースを解放 */
}
```

### ルール4：ユーザーの「動きを減らす」設定を尊重しろ

オペレーティングシステムには「視差効果を減らす」（prefers-reduced-motion）アクセシビリティ設定がある。前庭障害（乗り物酔いのような症状）のあるユーザーがこのオプションを有効にしていることがある。開発者として、これを尊重しなければならない：

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

注意：`animation: none` にしているのではない——アニメーションをほぼ一瞬で完了するように圧縮している。これにより、アニメーションを通じて伝達される情報（プログレスリングの最終状態など）は失われないが、ユーザーは運動の過程を経験しない。

しかし落とし穴がある——`@media (prefers-reduced-motion)` はSVGがHTMLドキュメントに**インラインで埋め込まれている**場合にのみ機能する。SVGを `<img src="animated-logo.svg">` として使うと、SVGファイル内部の `@media` ルールはブラウザのサンドボックスに隔離され、ホストページのユーザー設定を読み取れない。アクセシビリティを重視するなら（重視すべきだ）、**重要なアニメーションSVGは必ずインライン化すること。**

## 技術選定の意思決定マトリックス

ここまでの分析を経て、各シナリオに適したアプローチは明確になった：

| シナリオ | 推奨アプローチ | 理由 |
|------|------|------|
| アイコンのホバーマイクロインタラクション | CSS transition | コード量ゼロ、GPU加速、200ms以内 |
| ロゴ表示のストロークアニメーション | JS + stroke-dashoffset | 柔軟なタイミング制御、レスポンシブなパス長対応 |
| スクロールナラティブSVGモーション | IntersectionObserver + JS | スクロール進行度とアニメーション進行度の精密な連動 |
| 複雑なマルチパスタイムライン | WAAPI または GSAP | CSS @keyframes では複雑なシーケンス管理が困難 |
| メール内のアニメーションSVG | SMIL `<animate>` | 自己完結型、外部CSS/JS不要 |
| デザイナー制作の複雑なアニメーション | Lottie | After Effectsから直接出力、手コーディング不要 |
| ページ背景の装飾アニメーション | CSS @keyframes | シンプル、GPU加速、メインスレッドを占有しない |
| データ可視化の動的チャート | JS + requestAnimationFrame | 正確なフレームレベル制御とデータバインディングが必要 |

「最善」の単一アプローチは存在しない——現在のシナリオに最適なものがあるだけだ。ほとんどのプロジェクトは2〜3のアプローチを混在させる：CSSでマイクロインタラクション、JSでストロークアニメーション、GSAPで複雑なタイムライン。

## SVGDOで実践する

原理を理解したら、SVGDOエディター（svgdo.com）での実践は速い。

エディターを開き、SVGをインポートする——Figma/Illustratorからエクスポートしたアイコンでも、手書きのパスコードでもよい。分割ビューに切り替えると：左側にビジュアルキャンバス、右側にライブコード——右側で書いた `stroke-dasharray` と `stroke-dashoffset` が左側ですぐに反映される。

ストロークアニメーションのコアワークフロー：
1. コードビューで、アニメーションさせたい全 `<path>` 要素を `querySelectorAll` で選択
2. ブラウザのコンソールを開き、`getTotalLength()` を実行して各パスの長さを取得
3. 長さの値を各要素の `stroke-dasharray` と `stroke-dashoffset` に記述
4. CSSで `@keyframes` または `transition` を記述
5. プレビューモードに切り替えて効果を確認

パスモーフィングでは、SVGDOのコードエディターがシンタックスハイライトを備えている——2つの `d` 文字列のコマンド構造を視覚的に比較して、ポイント数が一致していることを確認できる。

![フロントエンド開発環境でのSVGアニメーションデバッグ](/content/images/svg-advanced-animation-3.jpg)
*実際の開発環境でSVGアニメーションをデバッグする：片側でコードを書き、もう片側でライブプレビューを確認。たった一つのdashoffset値を変えるだけで、ストロークアニメーションの進行が即座に変わる。*

これまでの数千語が理論の講義だとしたら、SVGDOを開いて自分で作ってみるのが実験の時間だ。ストロークアニメーションというのは、原理なら10分読めば理解できる。しかし、ベジェ曲線が「消えた」状態から「完全に描かれた」状態になる瞬間を実際に目の当たりにした時——思わず「おおっ」と声が漏れる。それがSVGの本当の魔法だ。
