import './cloth/common.css';
// "main.ts"></script>
// "cloth.ts"></script>
// "./lib/yrGL.ts"></script>
// "./lib/yrUtil.ts"></script>
// "./lib/yrTimer.ts"></script>
// "./lib/yrInput.ts"></script>
// "./lib/yrCamera.ts"></script>
// "./lib/gl-matrix-min.js"></script>
// "./lib/constant.js"></script>

export function ClothSimulation() {

  return (<div id="main">
    <h1>Cloth Simulation</h1>
    <a href="https://qiita.com/yunta_robo/items/0b468b65f3412554400a"
    >Qiita投稿</a
    >
    <h2></h2>
    <canvas id="canvas_main" width="512" height="512"
    >canvasに対応していません。</canvas
    >
    <br />
    <br />
    <form name="form_ui" style={{ fontSize: "14px" }}>
      左ドラッグまたはスワイプ操作でカメラを回転させることができます。
      <br />
      <br />
      <input type="button" value="リセット" onClick="button_reset()" />
      <br />
      <br />
      ■質点分割数（低負荷→高負荷）
      <br />
      <input type="radio" name="div" value="15" />15
      <input type="radio" name="div" value="31" checked="checked" />31
      <br />
      ■制約充足の反復回数（低負荷→高負荷）
      <br />
      <input type="radio" name="relaxation" value="1" />1
      <input type="radio" name="relaxation" value="2" checked="checked" />2
      <input type="radio" name="relaxation" value="3" />3
      <input type="radio" name="relaxation" value="4" />4
      <input type="radio" name="relaxation" value="5" />5
      <input type="radio" name="relaxation" value="6" />6
      <br />
      ■重力（弱→強）
      <br />
      <input
        type="range"
        name="g"
        min="0.0"
        max="9.8"
        step="0.1"
        value="7.0"
      />
      <br />
      ■風力（弱→強）
      <br />
      <input
        type="range"
        name="w"
        min="0.0"
        max="20.0"
        step="0.1"
        value="7.5"
      />
      <br />
      ■抵抗（弱→強）
      <br />
      <input
        type="range"
        name="r"
        min="0.0"
        max="2.0"
        step="0.01"
        value="0.2"
      />
      <br />
      ■制約バネの特性
      <br />
      <input
        type="range"
        name="k"
        min="0.0"
        max="5000.0"
        step="10.0"
        value="3000.0"
      />　基本強度（弱→強）
      <br />
      <input
        type="range"
        name="structural_shrink"
        min="0.0"
        max="1.0"
        step="0.01"
        value="1.0"
      />　構成バネの伸び抵抗（弱→強）
      <br />
      <input
        type="range"
        name="structural_stretch"
        min="0.0"
        max="1.0"
        step="0.01"
        value="1.0"
      />　構成バネの縮み抵抗（弱→強）
      <br />
      <input
        type="range"
        name="shear_shrink"
        min="0.0"
        max="1.0"
        step="0.01"
        value="1.0"
      />　せん断バネの伸び抵抗（弱→強）
      <br />
      <input
        type="range"
        name="shear_stretch"
        min="0.0"
        max="1.0"
        step="0.01"
        value="1.0"
      />　せん断バネの縮み抵抗（弱→強）
      <br />
      <input
        type="range"
        name="bending_shrink"
        min="0.0"
        max="1.0"
        step="0.01"
        value="1.0"
      />　曲げバネの伸び抵抗（弱→強）
      <br />
      <input
        type="range"
        name="bending_stretch"
        min="0.0"
        max="1.0"
        step="0.01"
        value="0.5"
      />　曲げバネの縮み抵抗（弱→強）
      <br />
      ■球との衝突判定
      <br />
      <input type="checkbox" name="collision" value="0" checked="checked" />
    </form>
  </div >);
}
