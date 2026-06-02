# レッサーパンダ威嚇隊 コード構造

## ファイル構成

- `index.html`
  - 画面の骨組みです。
  - HUD、キャンバス、操作ボタン、スキル・ガチャ・スキンのポップアップを定義しています。

- `styles.css`
  - UIの見た目を担当します。
  - HUD、操作ボタン、モーダル、ガチャ結果、スキン一覧などのレイアウトと装飾を管理しています。

- `script.js`
  - ゲーム本体です。
  - 移動、カメラ、威嚇、レベル、スキル、レパンPT、ガチャ、人間AI、描画をまとめて制御しています。

## `script.js` の主な区分

- UI references
  - HTML要素の取得です。

- Balance constants
  - ダメージ、範囲、回復時間、ガチャ費用などの調整値です。

- Gacha and skin data
  - 通常スキン20種類、隠しスキン、所持スキン関連のデータです。

- Skill data
  - 購入可能なスキル3種類のデータです。

- Level and progression
  - 経験値、レベルアップ、移動速度、レパンPT上限の計算です。

- Human AI
  - 人間の視線、警戒度、逃走、復活を扱います。

- Skills and attacks
  - 威嚇、スキル技、HPダメージ、報酬処理です。

- Gacha and skin collection
  - ガチャ抽選、重複時の進化チケット、所持スキン一覧、着替え処理です。

- Map rendering
  - 道路、歩道、草、街路樹、建物、公園などの描画です。

## 今後の追加方針

- 数値調整はまず `Balance constants` を見る。
- スキル追加は `skillCatalog` にデータを追加する。
- スキン追加は `skinCatalog` にデータを追加する。
- 人間の行動追加は `Human AI` 区分に追加する。
- 町の見た目追加は `Map rendering` 区分に追加する。
