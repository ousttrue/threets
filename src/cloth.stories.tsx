import React from "react";
import './cloth/common.css';
import { Canvas, useFrame } from "@react-three/fiber";
import { yrGL } from './cloth/lib/yrGL';
import { vs_constant, fs_constant } from './cloth/lib/constant';
import { yrTimer } from './cloth/lib/yrTimer';
import { yrInput } from './cloth/lib/yrInput';
import { yrCamera } from './cloth/lib/yrCamera';

interface State {
  gl: yrGL;
  /// 布（後で初期化する）
  cloth: any;
  /// 布の大きさに対するスケーリング（ベースのサイズは2*2）
  scale: number;
  /// 累積時間
  ms_acc: number;
  /// 更新処理の余剰時間（次フレームに持ち越す分）
  ms_surplus: number;
};

function Render() {
  const [state, setState] = React.useState<State>(null);
  useFrame(({ gl, clock }, delta) => {
    const GL = gl.getContext();

    if (!state) {
      // initialize;

      // GL関係のインスタンスを生成
      const y = new yrGL(gl.getContext() as WebGL2RenderingContext);									// レンダラ―
      const material_constant = y.createMaterial(vs_constant, fs_constant);	// マテリアル

      // タイマー
      const timer = new yrTimer();

      // 入力
      const input = new yrInput(gl.domElement);

      // カメラ
      const camera = new yrCamera();
      camera._pos[0] = 1.25;
      camera._pos[1] = 0.0;
      camera._pos[2] = 5.5;
      camera._fov_y = 32.5 * Math.PI / 180.0;	// 画角調整

      setState({
        gl: y,
        cloth: null,
        scale: 1.0,
        ms_acc: 0,
        ms_surplus: 0,
      });
    }
    else {
      // render

      const s = (Math.sin(clock.getElapsedTime()) + 1) / 2.0;
      GL.clearColor(0.0, 0.0, s, 1);
      GL.clear(GL.COLOR_BUFFER_BIT);
    }

    GL.flush();
  }, 1)

  return <></>
}


export function ClothSimulation() {

  return (<div id="main">
    <h1>Cloth Simulation</h1>
    <a href="https://qiita.com/yunta_robo/items/0b468b65f3412554400a"
    >Qiita投稿</a
    >
    <div style={{ width: "512px", height: "512px" }} >
      <Canvas >
        <Render />
      </Canvas>
    </div>
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
