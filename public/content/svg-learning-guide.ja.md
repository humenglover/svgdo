# SVG入門から挫折、そして神モードへ：万字越えの徹底解説でベクター世界を完全征服

*この記事では、最もハードコアで実践的な言葉を使って、SVGの核心に迫ります。*

もしあなたがフロントエンド開発者、もしくはコードにこだわりを持つデザイナーなら、SVG（Scalable Vector Graphics）に対して愛憎入り混じった感情を抱いていることでしょう。
愛しているのは、SVGがクリアでシャープ、軽量でCSSやJSで自由自在に操れるから。
憎んでいるのは、SVGファイルを開いたときに画面中に表示される `<path d="M... C... Z">` がまるで火星語のようで、見ただけで髪の毛が抜け落ちていくから。

<div align="center">
  <img src="/content/images/angry-typing.gif" alt="SVG Headache" style="border-radius: 12px; max-width: 100%; margin: 20px auto; display: block;" />
</div>

しかし、今日でその恐怖に終止符を打ちます！最も直感的なコードとブラウザのリアルタイムレンダリング効果を使って、SVGを一歩ずつ完全に征服していきましょう。

## 第1章：SVGとは何か？（なぜPNGではダメなのか？）

SVGは決して神秘的なハイテク技術ではありません。本質的には単なる **XMLファイル** です。
そうです、HTMLと同じように、どんなテキストエディタでも開けて、タグを使って図形を記述できるのです。

**なぜPNGではダメなのか？**
PNGはピクセル画像（ビットマップ）です。PNGを拡大すると、モザイクアートのようにピクセルが目立ってきます。
一方、SVGはベクター画像です。SVGが記録しているのは「座標(10,10)に半径5の円を描く」という数式です。そのため、何倍に拡大しても、ブラウザが再計算して円をレンダリングするので、決してぼやけることがありません！

最も直感的な例を見てみましょう。

### 1.1 最初のSVG

まずは手書きで最もシンプルなSVGを書いてみましょう。キャンバスが必要です。

```html
<svg width="200" height="200" style="background: #f0f4f8; border-radius: 12px;">
  <!-- ここに描画します -->
</svg>
```

**【フロントエンド直接レンダリング】**
<svg width="200" height="200" style="background: #f0f4f8; border-radius: 12px; display: block; margin: 20px auto;"></svg>

これが空のキャンバスです。何もありませんが、無限の可能性を秘めています。

---

## 第2章：基本図形 —— 幾何学マスターへの道

SVGには、基本的な幾何学図形を簡単に描くための「ペン」があらかじめ用意されています。

### 2.1 長方形 `<rect>`

`<rect>` タグは長方形を描くために使います。指定する必要があるのは：
- `x`, `y`：左上隅の座標（SVGでは左上が (0,0)）
- `width`, `height`：幅と高さ
- `fill`：塗りつぶし色
- `rx`, `ry`：角丸の半径

```html
<svg width="300" height="150" style="background: #f0f4f8; border-radius: 12px;">
  <rect x="50" y="25" width="200" height="100" rx="20" fill="#FF7F50" />
</svg>
```

**【フロントエンド直接レンダリング】**
<svg width="300" height="150" style="background: #f0f4f8; border-radius: 12px; display: block; margin: 20px auto;">
  <rect x="50" y="25" width="200" height="100" rx="20" fill="#FF7F50" />
</svg>

ほら！たった1行のコードで、角丸のオレンジ色の長方形が描けました！Canvasを使うよりずっと簡単ですね。

### 2.2 円 `<circle>`

円を描くのはさらに簡単です。指定するのは：
- `cx`, `cy`：円の中心座標 (Center X, Center Y)
- `r`：半径 (Radius)

```html
<svg width="200" height="200" style="background: #f0f4f8; border-radius: 12px;">
  <circle cx="100" cy="100" r="60" fill="#4169E1" stroke="#FFD700" stroke-width="10" />
</svg>
```

*ここでは `stroke`（線）と `stroke-width`（線の幅）を追加しています。*

**【フロントエンド直接レンダリング】**
<svg width="200" height="200" style="background: #f0f4f8; border-radius: 12px; display: block; margin: 20px auto;">
  <circle cx="100" cy="100" r="60" fill="#4169E1" stroke="#FFD700" stroke-width="10" />
</svg>

自分の手でコードを書いて完璧な円が描けた瞬間、もう天にものぼる気分です！

<div align="center">
  <img src="/content/images/spongebob-rainbow.gif" alt="SVG Success" style="border-radius: 12px; max-width: 100%; margin: 20px auto; display: block;" />
</div>


### 2.3 楕円 `<ellipse>`、多角形 `<polygon>`、線 `<line>`

これらの兄弟もやることはほぼ同じです：
- `ellipse` は半径を水平方向の `rx` と垂直方向の `ry` に分割しただけ。
- `line` は始点 `(x1, y1)` と終点 `(x2, y2)` を指定するだけ。
- `polygon` は `points="x,y x,y x,y"` を受け取って、それらを結んで閉じた図形を作る。

これらを全部まとめて会議させてみましょう：

```html
<svg width="400" height="200" style="background: #1e1e2f; border-radius: 12px;">
  <!-- 楕円 -->
  <ellipse cx="80" cy="100" rx="50" ry="80" fill="#00FF7F" />
  
  <!-- 線 -->
  <line x1="160" y1="20" x2="240" y2="180" stroke="#FF1493" stroke-width="8" stroke-linecap="round" />
  
  <!-- 多角形 (三角形) -->
  <polygon points="320,20 270,180 370,180" fill="#00BFFF" />
</svg>
```

**【フロントエンド直接レンダリング】**
<svg width="400" height="200" style="background: #1e1e2f; border-radius: 12px; display: block; margin: 20px auto;">
  <ellipse cx="80" cy="100" rx="50" ry="80" fill="#00FF7F" />
  <line x1="160" y1="20" x2="240" y2="180" stroke="#FF1493" stroke-width="8" stroke-linecap="round" />
  <polygon points="320,20 270,180 370,180" fill="#00BFFF" />
</svg>

おめでとうございます！これでSVGの日常的な使い方の80%をマスターしました！
でも、開発者を本当に悩ませるのは、伝説の大魔王—— `<path>` です。

---

## 第3章：大魔王 `<path>` を完全解説

Figmaから複雑なアイコンをエクスポートすると、rectやcircleはほとんど見当たらず、目に入るのは `<path>` ばかりです。
`<path>` はSVGの中でも万能ペンで、どんな形状でも描くことができます。その核心は `d` 属性（dataの意味）です。

`d` 属性の中の一見乱雑な文字列は、実は一連の描画命令です。以下のルールを覚えておきましょう：
- **大文字**：絶対座標（キャンバスの原点 `0,0` を基準）
- **小文字**：相対座標（現在のペン位置を基準）

### 3.1 移動 (M/m) と直線 (L/l)

- `M x y` (Move to)：ペンを持ち上げて、座標 `(x,y)` に移動する。線は引かれない。
- `L x y` (Line to)：現在の点から座標 `(x,y)` まで直線を引く。
- `H x` / `V y`：水平直線 / 垂直直線を引く。
- `Z` / `z` (Close path)：現在の点と始点を結んで、図形を閉じる。

では「家」のアイコンを手書きしてみましょう：
```html
<svg width="200" height="200" style="background: #282c34; border-radius: 12px;">
  <!--
    1. M 100 30 -> 頂点に移動
    2. L 170 100 -> 右の軒先まで線
    3. L 150 100 -> 少し戻って右壁際へ
    4. L 150 170 -> 右壁を下へ
    5. L 50 170 -> 左に床を引く
    6. L 50 100 -> 左壁を上へ
    7. L 30 100 -> 左の軒先に出る
    8. Z -> 閉じて頂点に戻る
  -->
  <path d="M 100 30 L 170 100 L 150 100 L 150 170 L 50 170 L 50 100 L 30 100 Z" 
        fill="#E06C75" stroke="#ABB2BF" stroke-width="4" stroke-linejoin="round" />
</svg>
```

**【フロントエンド直接レンダリング】**
<svg width="200" height="200" style="background: #282c34; border-radius: 12px; display: block; margin: 20px auto;">
  <path d="M 100 30 L 170 100 L 150 100 L 150 170 L 50 170 L 50 100 L 30 100 Z" 
        fill="#E06C75" stroke="#ABB2BF" stroke-width="4" stroke-linejoin="round" />
</svg>

すごい！まるでコードでスケッチを描いているようです！

### 3.2 ベジェ曲線 (C/Q) と円弧 (A)

直線だけでは味気ありません。優雅な曲線が必要です。そこでベジェ曲線を理解しましょう。
- `C x1 y1, x2 y2, x y` (三次ベジェ曲線)：2つの制御点が必要。
- `Q x1 y1, x y` (二次ベジェ曲線)：1つの制御点だけでOK。
- `A rx ry x-axis-rotation large-arc-flag sweep-flag x y` (円弧)：パラメータが非常に複雑。

`Q`（二次ベジェ）で葉っぱを描いてみます：
```html
<svg width="200" height="200" style="background: #f0f4f8; border-radius: 12px;">
  <!--
    M 50 150: 左下が始点
    Q 50 50, 150 50: 制御点が左上 (50,50)、終点が右上 (150,50)
    Q 150 150, 50 150: 制御点が右下 (150,150)、終点が始点 (50,150) に戻る
  -->
  <path d="M 50 150 Q 50 50, 150 50 Q 150 150, 50 150" 
        fill="#98C379" stroke="#3E4451" stroke-width="4" />
</svg>
```

**【フロントエンド直接レンダリング】**
<svg width="200" height="200" style="background: #f0f4f8; border-radius: 12px; display: block; margin: 20px auto;">
  <path d="M 50 150 Q 50 50, 150 50 Q 150 150, 50 150" 
        fill="#98C379" stroke="#3E4451" stroke-width="4" />
</svg>

### 3.3 実践：ロゴを描いてみる

ここまでのパス、図形、そしてトランスフォーム（Transform）を組み合わせて、もう少し複雑な実践をしてみましょう。当サイトの美しいロゴを描きます！

```html
<svg width="120" height="120" viewBox="0 0 120 120" style="background: #f0f4f8; border-radius: 12px; display: block; margin: 20px auto;">
  <!-- メインの接続線 (ベジェ曲線) -->
  <path d="M 22 58 C 45 90, 65 15, 95 35" fill="none" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round"></path>
  
  <!-- オレンジの中央モジュール -->
  <rect x="42" y="65" width="12" height="12" rx="2" fill="#f97316" stroke="#1e293b" stroke-width="3"></rect>
  
  <!-- 両端の青いノード -->
  <circle cx="22" cy="58" r="6" fill="#818cf8" stroke="#1e293b" stroke-width="3"></circle>
  <circle cx="95" cy="35" r="6" fill="#818cf8" stroke="#1e293b" stroke-width="3"></circle>
  
  <!-- マウスポインターアイコン (グループ化と回転) -->
  <g transform="translate(68, 48) scale(2.4) rotate(-8)">
    <path d="M 0,0 L 0,14 L 3.5,10.5 L 6.5,17 L 9,15.5 L 6,9 L 10.5,9 Z" fill="#2dd4bf" stroke="#1e293b" stroke-width="1.8" stroke-linejoin="round"></path>
  </g>
</svg>
```

**【フロントエンド直接レンダリング】**
<svg width="120" height="120" viewBox="0 0 120 120" style="background: #f0f4f8; border-radius: 12px; display: block; margin: 20px auto;">
  <path d="M 22 58 C 45 90, 65 15, 95 35" fill="none" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round"></path>
  <rect x="42" y="65" width="12" height="12" rx="2" fill="#f97316" stroke="#1e293b" stroke-width="3"></rect>
  <circle cx="22" cy="58" r="6" fill="#818cf8" stroke="#1e293b" stroke-width="3"></circle>
  <circle cx="95" cy="35" r="6" fill="#818cf8" stroke="#1e293b" stroke-width="3"></circle>
  <g transform="translate(68, 48) scale(2.4) rotate(-8)">
    <path d="M 0,0 L 0,14 L 3.5,10.5 L 6.5,17 L 9,15.5 L 6,9 L 10.5,9 Z" fill="#2dd4bf" stroke="#1e293b" stroke-width="1.8" stroke-linejoin="round"></path>
  </g>
</svg>

Pathと組合せをマスターすれば、魔法を手に入れたも同然。ブラウザの中に何でも自在に作り出せます！

<div align="center">
  <img src="/content/images/mind-blown.gif" alt="SVG Magic" style="border-radius: 12px; max-width: 100%; margin: 20px auto; display: block;" />
</div>

---

## 第4章：SVGの宇宙座標系 —— viewBoxを完全図解

誰かが書いたSVGコードを自分のプロジェクトにコピーしたとき、こんな経験はありませんか？**「図形がめちゃくちゃデカくなる！」「図形が半分に切れてる！」「全部消えた！」**
これらすべての原因は、SVGの座標系、特に `viewBox` というとてつもなく重要な属性を理解していないからです。

### 4.1 width/height と viewBox

最も外側の `<svg>` タグには、通常 `width` と `height` を書きます。これはSVGがブラウザページ上で占める**物理スペース（ビューポート）**を表します。
これをあなたの家の窓の大きさだと考えてください。

一方、`viewBox="min-x min-y width height"` はSVG内部の**仮想宇宙座標系**を表します。
これは窓から見える外の風景のズーム倍率と視野範囲だと思ってください。

```html
<!-- 物理スペースは200x200だが、内部座標系が0〜100にマッピングされている -->
<svg width="200" height="200" viewBox="0 0 100 100" style="background: #e2e8f0; border-radius: 12px; display: block; margin: 20px auto;">
  <!-- この内部座標系で、幅50の長方形を描く -->
  <!-- 内部の最大座標が100なので、この長方形は物理ウィンドウの半分を占める！ -->
  <rect x="0" y="0" width="50" height="50" fill="#3b82f6" />
</svg>
```

**【フロントエンド直接レンダリング】**
<svg width="200" height="200" viewBox="0 0 100 100" style="background: #e2e8f0; border-radius: 12px; display: block; margin: 20px auto;">
  <rect x="0" y="0" width="50" height="50" fill="#3b82f6" />
</svg>

わかりましたか？`rect` の幅は50と指定したのに、視覚的には100ピクセル占有しています！これが `viewBox` のスケーリングマジックです。これをマスターすれば、あなたのアイコンは**真のレスポンシブ**を実現できます。

---

## 第5章：コード再利用の達人 —— `<g>`、`<defs>` と `<use>`

HTMLを書くときは、繰り返しのコードをコンポーネントとして抽出します。SVGにも、コードを再利用する仕組みがあります。長ったらしい `<path>` のコピペはもうやめましょう！

### 5.1 `<g>` グループタグ

`<g>` は Group（グループ）を表します。コードをきれいにするだけでなく、トランスフォーム（`transform`）、色、透明度などの属性をグループ全体に適用できます。先ほどロゴを描いたときも、`<g>` を使ってポインターアイコンにまとめて回転と拡大縮小を適用しました。

### 5.2 `<defs>` と `<use>`：SVGにおける「コンポーネント化」

`<defs>` (Definitions) は倉庫のようなものです。中に置かれた図形は直接レンダリングされず、`<use>` で「召喚」されて初めて描画されます。

これは繰り返しパターン（グリッド、星空、森など）を描くときにまさに神機能です！

```html
<svg width="300" height="150" style="background: #1e1e2f; border-radius: 12px; display: block; margin: 20px auto;">
  <!-- 星のコンポーネントを定義 -->
  <defs>
    <g id="star">
      <polygon points="10,0 13,7 20,7 15,12 17,20 10,15 3,20 5,12 0,7 7,7" fill="#FCD34D" />
    </g>
  </defs>

  <!-- 星を瘋狂召喚！違う位置に配置 -->
  <use href="#star" x="30" y="30" transform="scale(1.5)" />
  <use href="#star" x="100" y="80" transform="scale(0.8)" />
  <use href="#star" x="150" y="20" transform="scale(2)" />
  <use href="#star" x="220" y="60" transform="scale(1.2)" />
  <use href="#star" x="260" y="100" />
</svg>
```

**【フロントエンド直接レンダリング】**
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

これでコード量が劇的に減り、レンダリングパフォーマンスも大幅に向上します！

---

## 第6章：テキストアート —— `<text>` と `<textPath>`

SVGは幾何学図形しか描けないと思ったら大間違い！SVGのテキスト処理能力は驚くほど強力です。SVGでレンダリングされたテキストは検索エンジンにクロールされ、ユーザーに選択されてコピーもでき、さらにあらゆる変態的操作が可能です。

### 6.1 基本テキストレンダリング

```html
<svg width="300" height="100" style="background: #f0f4f8; border-radius: 12px; display: block; margin: 20px auto;">
  <!-- 注意：テキストの y 座標はベースライン(baseline)です -->
  <text x="150" y="55" font-size="32" font-family="sans-serif" font-weight="bold" fill="#ec4899" text-anchor="middle">
    Hello SVG Text!
  </text>
</svg>
```

**【フロントエンド直接レンダリング】**
<svg width="300" height="100" style="background: #f0f4f8; border-radius: 12px; display: block; margin: 20px auto;">
  <text x="150" y="55" font-size="32" font-family="sans-serif" font-weight="bold" fill="#ec4899" text-anchor="middle">
    Hello SVG Text!
  </text>
</svg>

### 6.2 パスに沿ったテキスト (Text on Path)

これはSVGが誇る世界最強の技の一つです！任意の複雑な `<path>` に沿ってテキストを配置できます。CSSでは極めて困難ですが、SVGならたった2行のコードで実現できます！

```html
<svg width="300" height="150" style="background: #1e293b; border-radius: 12px; display: block; margin: 20px auto;">
  <defs>
    <!-- 曲線パスを定義し、IDを付ける -->
    <path id="curve" d="M 30 100 Q 150 20, 270 100" fill="transparent" stroke="#334155" />
  </defs>
  
  <!-- 曲線を描画（パスがわかるように） -->
  <use href="#curve" />
  
  <!-- テキストを曲線に沿わせる -->
  <text font-size="18" fill="#38bdf8" font-weight="bold">
    <textPath href="#curve" startOffset="50%" text-anchor="middle">
      曲線に沿ってうねるセクシーなテキスト
    </textPath>
  </text>
</svg>
```

**【フロントエンド直接レンダリング】**
<svg width="300" height="150" style="background: #1e293b; border-radius: 12px; display: block; margin: 20px auto;">
  <defs>
    <path id="curve" d="M 30 100 Q 150 20, 270 100" fill="transparent" stroke="#334155" />
  </defs>
  <use href="#curve" />
  <text font-size="18" fill="#38bdf8" font-weight="bold">
    <textPath href="#curve" startOffset="50%" text-anchor="middle">
      曲線に沿ってうねるセクシーなテキスト
    </textPath>
  </text>
</svg>

---

## 第7章：色彩と質感 —— グラデーション（Gradients）とフィルター（Filters）

単色で塗りつぶしただけのSVGには魂が宿りません。モダンなWebデザインには質感、影、グラデーションが欠かせません。これらはSVGで完璧に実現できます。

### 7.1 線形グラデーション `<linearGradient>`

コンポーネントと同様に、グラデーションも `<defs>` タグ内で定義し、`url(#id)` の形で図形に適用します。

```html
<svg width="300" height="120" style="background: #f8fafc; border-radius: 12px; display: block; margin: 20px auto;">
  <defs>
    <linearGradient id="cyberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ec4899" />
      <stop offset="100%" stop-color="#8b5cf6" />
    </linearGradient>
  </defs>
  
  <!-- 角丸長方形の fill 属性にグラデーションを適用 -->
  <rect x="20" y="20" width="260" height="80" rx="40" fill="url(#cyberGradient)" />
  
  <text x="150" y="65" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle">
    Cyberpunk Gradient
  </text>
</svg>
```

**【フロントエンド直接レンダリング】**
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

### 7.2 ハイレベル発光フィルター `<filter>`

ここからが本当のハイレベルな領域です。`<feGaussianBlur>` と `<feMerge>` を使って、クールなネオン発光効果を実現します！

```html
<svg width="300" height="150" style="background: #0f172a; border-radius: 12px; display: block; margin: 20px auto;">
  <defs>
    <!-- 発光フィルターを定義 -->
    <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
      <!-- 図形にガウシアンブラーを適用 -->
      <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1" />
      <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur2" />
      
      <!-- 元の図形とブラー結果をマージ -->
      <feMerge>
        <feMergeNode in="blur2" />
        <feMergeNode in="blur1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  
  <!-- 発光するテキストを描画 -->
  <text x="150" y="85" font-size="36" font-weight="900" font-family="monospace" fill="#22d3ee" text-anchor="middle" filter="url(#neonGlow)">
    NEON
  </text>
</svg>
```

**【フロントエンド直接レンダリング】**
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

## 第8章：SVGに命を吹き込む —— SMILアニメーション高度編

CSSアニメーションでは物足りないと感じたら、SVGネイティブのSMIL（Synchronized Multimedia Integration Language）にきっと震撼させられるでしょう。

### 8.1 基本属性アニメーション

例を見てみましょう。太陽を描いて、自動回転させるだけでなく、マウスを乗せると色が変わります！今回はSVGネイティブの `<animateTransform>` と `<set>` タグを直接使い、CSSは一切不要です：

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

**【フロントエンド直接レンダリング（太陽の中心にマウスを乗せてみてください）】**
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

めちゃくちゃカッコいいでしょ？！外部のJSライブラリやCSSスタイルシートに一切依存せず、SVG内部だけで複雑なインタラクション状態を実現しています。

### 8.2 究極のキメ技：ストロークアニメーション (Stroke Dasharray Animation)

SVGアニメーションの中で最も古典的と言えば、間違いなく「ストロークアニメーション」です。「線がゆっくりと描かれていく」という、とてもテクノロジー感のある効果を実現できます。

核心となる原理はたった2つの属性：
- `stroke-dasharray`: 実線を破線に変換します。パス全体をカバーする大きな値を設定すると、全長の実線と全長の空白になります。
- `stroke-dashoffset`: 破線の開始オフセットを変更します。このオフセットを動的に変化させることで、描画アニメーションが生まれます。

```html
<svg width="300" height="150" style="background: #000; border-radius: 12px; display: block; margin: 20px auto;">
  <!-- セクシーな正弦曲線 -->
  <path d="M 20 75 Q 70 20, 150 75 T 280 75" fill="transparent" stroke="#00FFFF" stroke-width="6" stroke-linecap="round" stroke-dasharray="600" stroke-dashoffset="600">
    <animate attributeName="stroke-dashoffset" values="600;0;600" dur="4s" repeatCount="indefinite" />
  </path>
</svg>
```

**【フロントエンド直接レンダリング】**
<svg width="300" height="150" style="background: #000; border-radius: 12px; display: block; margin: 20px auto;">
  <path d="M 20 75 Q 70 20, 150 75 T 280 75" fill="transparent" stroke="#00FFFF" stroke-width="6" stroke-linecap="round" stroke-dasharray="600" stroke-dashoffset="600">
    <animate attributeName="stroke-dashoffset" values="600;0;600" dur="4s" repeatCount="indefinite" />
  </path>
</svg>

### 8.3 パス運動アニメーション `<animateMotion>`

物体を特定の軌道に沿って動かしたい場合、以前は数百行のJSで物理運動を計算する必要がありました。しかしSVGでは、たった1行の `<animateMotion>` で完了します！

```html
<svg width="300" height="150" style="background: #f0fdf4; border-radius: 12px; display: block; margin: 20px auto;">
  <!-- 運動軌道を参照用に描画 -->
  <path id="motionPath" d="M 20 75 Q 150 -50, 280 75 Q 150 200, 20 75" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="5,5" />
  
  <!-- この円が軌道に沿って動く -->
  <circle r="8" fill="#10b981">
    <animateMotion dur="3s" repeatCount="indefinite">
      <mpath href="#motionPath" />
    </animateMotion>
  </circle>
</svg>
```

**【フロントエンド直接レンダリング】**
<svg width="300" height="150" style="background: #f0fdf4; border-radius: 12px; display: block; margin: 20px auto;">
  <path id="motionPath" d="M 20 75 Q 150 -50, 280 75 Q 150 200, 20 75" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="5,5" />
  <circle r="8" fill="#10b981">
    <animateMotion dur="3s" repeatCount="indefinite">
      <mpath href="#motionPath" />
    </animateMotion>
  </circle>
</svg>


---

## 第9章：まとめ —— ベクター魔法を掌握する

シンプルな空のキャンバスから複雑なベジェ曲線へ、静的な色の塗りつぶしからクールなネオン発光へ、単調な図形から無限ループするSMILネイティブアニメーションへ……この記事のすべてのコードを最初から最後まで真剣に読み、実際に試したのであれば、もう「SVGの火星語が読めない」という恐怖の段階は完全に乗り越えたと言っても過言ではありません。

ほら、これらすべてのインタラクション効果、描画アニメーション、ライティングフィルターは、ごくごくネイティブなDOM APIと基礎的な数学の行列計算だけで実現されているのです。数十〜数百KBもあるサードパーティのアニメーションライブラリはもうゴミ箱に捨てましょう！SVGの低レベルロジックを深く理解すれば、あなた一人でブラウザの中にミニチュア版Figmaをゼロから作り上げることだってできます。

さあ、挑戦してみてください。ネイティブWeb技術の圧倒的なパワーに、きっと深い衝撃を受けるはずです。

<div align="center">
  <img src="/content/images/cat-typing.gif" alt="Crazy Coding" style="border-radius: 12px; max-width: 100%; margin: 20px auto; display: block;" />
</div>
