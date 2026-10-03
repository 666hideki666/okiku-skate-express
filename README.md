# オキク スケート配達便

ブラウザで遊ぶ: https://666hideki666.github.io/okiku-skate-express/

初回ブラウザ版。`index.html`、`style.css`、`game.js` と同じ場所に `Concept Art/` を置いてください。

```sh
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000/` を開きます。右半分をタップでジャンプ、左半分を押している間しゃがみます。キーボードでは Space または ↑ でジャンプ、↓ を押している間しゃがみます。

道中は100m、約53秒です。モイモイに見送られて出発し、メイちゃんのお店に着くと配達成功です。3回ぶつかるとゲームオーバーになり、再挑戦できます。

開発時の確認には `node tests/game-smoke.cjs` を実行できます。ブラウザで全障害物を避ける通し確認は `http://localhost:8000/tests/browser-acceptance.html` で行えます。
