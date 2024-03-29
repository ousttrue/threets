# gui

- r3f では本家のサンプルが leva を使っているのだが、ladle と組み合わせたときにエラーになる場合があってよくわからなったので見送り
- 代替として lil-gui と tweakpane を試してみたが使い勝手は似た感じだったので、見た目で tweakpane を使うことにした。

- leva は機能面でも違いがあって container を指定できないぽい。代わりに移動可能なWindowが付属している。docking UI と組み合わせる
  予定なので container が指定できないと困る。

## dat.GUI

- [React + dat.GUI でササッと入力GUIを実装 #JavaScript - Qiita](https://qiita.com/harumaxy/items/4f378dcb5a8f55807bd5)
- [Positioning dat.GUI](https://jsfiddle.net/2pha/zka4qkt2/)
