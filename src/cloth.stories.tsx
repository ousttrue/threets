import React from "react";
import './cloth/common.css';
import { Canvas, useFrame } from "@react-three/fiber";
import { yrGL, yrGLRenderer, yrGLMaterial } from './cloth/lib/yrGL';
import { vs_constant, fs_constant } from './cloth/lib/constant';
import { yrTimer } from './cloth/lib/yrTimer';
import { yrInput } from './cloth/lib/yrInput';
import { yrCamera } from './cloth/lib/yrCamera';
import { Cloth } from './cloth/cloth';
import { mat4, vec4 } from 'gl-matrix';

const GL = WebGL2RenderingContext;

class State {
  /// 布（後で初期化する）
  cloth: any;
  /// 布の大きさに対するスケーリング（ベースのサイズは2*2）
  scale = 1.0;
  /// 累積時間
  ms_acc = 0;
  /// 更新処理の余剰時間（次フレームに持ち越す分）
  ms_surplus = 0;

  gl: yrGL;
  renderer: yrGLRenderer;
  material_constant: yrGLMaterial;
  timer = new yrTimer();
  input: yrInput;
  camera: yrCamera;

  // -------------------------------------------------------------------------------------------
  // UI（ボタンやスライダーなど）用パラメータ
  reset = true;				// リセット
  div = 0;					// 質点分割数
  relaxation = 0;				// 制約充足の反復回数
  g = 0.0;					// 重力
  w = 0.0;					// 風力
  r = 0.0;					// 抵抗
  k = 0.0;					// 制約バネの特性（基本強度）
  structural_shrink = 0.0;	// 制約バネの特性（構成バネの伸び抵抗）
  structural_stretch = 0.0;	// 制約バネの特性（構成バネの縮み抵抗）
  shear_shrink = 0.0;			// 制約バネの特性（せん断バネの伸び抵抗）
  shear_stretch = 0.0;		// 制約バネの特性（せん断バネの縮み抵抗）
  bending_shrink = 0.0;		// 制約バネの特性（曲げバネの伸び抵抗）
  bending_stretch = 0.0;		// 制約バネの特性（曲げバネの縮み抵抗）
  collision = false;			// 球との衝突判定

  constructor(_gl: WebGL2RenderingContext, element: HTMLElement) {
    this.renderer = new yrGLRenderer(_gl);

    // GL関係のインスタンスを生成
    this.gl = new yrGL(_gl);
    this.material_constant = this.gl.createMaterial(vs_constant, fs_constant);	// マテリアル

    // カメラ
    this.camera = new yrCamera();
    this.camera._pos[0] = 1.25;
    this.camera._pos[1] = 0.0;
    this.camera._pos[2] = 5.5;
    this.camera._fov_y = 32.5 * Math.PI / 180.0;	// 画角調整

    this.input = new yrInput(element);
  }

  onFrame() {
    // UI（ボタンやスライダーなど）の取得
    for (let i = 0; i < document.form_ui.div.length; i++) {
      if (document.form_ui.div[i].checked) {
        const value = parseInt(document.form_ui.div[i].value);
        if (this.div !== value) {
          this.div = value;
          this.reset = true;
        }
      }
    }
    for (let i = 0; i < document.form_ui.relaxation.length; i++) {
      if (document.form_ui.relaxation[i].checked) {
        this.relaxation = parseInt(document.form_ui.relaxation[i].value);
      }
    }

    this.g = parseFloat(document.form_ui.g.value);
    this.w = parseFloat(document.form_ui.w.value);
    this.r = parseFloat(document.form_ui.r.value);
    this.k = parseFloat(document.form_ui.k.value);
    this.structural_shrink = parseFloat(document.form_ui.structural_shrink.value);
    this.structural_stretch = parseFloat(document.form_ui.structural_stretch.value);
    this.shear_shrink = parseFloat(document.form_ui.shear_shrink.value);
    this.shear_stretch = parseFloat(document.form_ui.shear_stretch.value);
    this.bending_shrink = parseFloat(document.form_ui.bending_shrink.value);
    this.bending_stretch = parseFloat(document.form_ui.bending_stretch.value);
    this.collision = document.form_ui.collision.checked;

    // タイマー更新
    this.timer.update();

    // 入力更新
    this.input.update();

    // カメラ更新
    this.camera.updateEditorMode(
      this.input._mouse_button_l ? this.input._mouse_nmove_x * 1.0 : 0.0,
      this.input._mouse_button_l ? this.input._mouse_nmove_y * 1.0 : 0.0,
      0.0
    );

    // 初期化（リセット）
    if (this.reset) {
      // init();
      this.cloth = undefined;
      this.ms_acc = 0;
      this.ms_surplus = 0;
      this.cloth = new Cloth(this.scale, this.div);	// スケーリング, 質点分割数
      this.reset = false;
    }

    // 更新
    const ms_step = 16;								// シミュレーションのタイムステップ（固定）
    let ms_delta = this.timer._ms_delta + this.ms_surplus;	// フレームの差分時間
    ms_delta = Math.min(ms_delta, 100);				// リミッター
    while (ms_delta >= ms_step) {
      // 大きなタイムステップでシミュレーションを実行すると精度の問題で破綻が生じるため、
      // フレームの差分時間を固定のシミュレーションタイムステップで分割し、複数回処理する。
      // 余剰時間は次のフレームに持ち越す。
      this.update(ms_step / 1000.0, this.ms_acc / 1000.0);

      this.ms_acc += ms_step;
      ms_delta -= ms_step;
    }
    this.ms_surplus = ms_delta;

    this.render();

    // バッファリングされたWebGLコマンドをただちに実行する
    this.gl.flush();
  }

  update(step: number, acc: number) {
    this.cloth.update(
      step, 				// タイムステップ（秒）
      acc, 				// 累積時間（秒）
      this.relaxation, 		// 制約充足の反復回数
      this.g, 					// 重力
      this.w, 					// 風力
      this.r, 					// 抵抗
      this.k, 					// 制約バネの特性（基本強度）
      this.structural_shrink,	// 制約バネの特性（構成バネの伸び抵抗）
      this.structural_stretch,	// 制約バネの特性（構成バネの縮み抵抗）
      this.shear_shrink,		// 制約バネの特性（せん断バネの伸び抵抗）
      this.shear_stretch,		// 制約バネの特性（せん断バネの縮み抵抗）
      this.bending_shrink,		// 制約バネの特性（曲げバネの伸び抵抗）
      this.bending_stretch,	// 制約バネの特性（曲げバネの縮み抵抗）
      this.collision			// 球との衝突判定
    );
  }

  // 描画
  render() {
    // カメラ行例
    const view_matrix = this.camera.getViewMatrix();					// ビュー行列
    const projection_matrix = this.camera.getProjectionMatrix(true);	// プロジェクション行列

    // カラーバッファとZバッファをクリアする
    this.renderer.clearBuffer();

    // 布のジオメトリを生成
    // Todo : 毎フレームVBO/IBOを作り直すという、残念な実装になっています
    //      : 動的書き換えに適したDYNAMIC_DRAW / bufferSubDataあたりに対応させるべき
    //      : また、インターリーブ対応など、他にも最適化の余地があります
    const geometry_cloth = this.gl.createGeometry(this.cloth._vertices, this.cloth._indeces, GL.LINES);

    // 描画
    const wvp_matrix = mat4.create();
    mat4.mul(wvp_matrix, projection_matrix, view_matrix);
    this.material_constant.SetUniformFloat32Array("u_wvp", wvp_matrix);
    this.material_constant.SetUniformFloat32Array("u_color", vec4.fromValues(1.0, 1.0, 1.0, 1.0));
    this.renderer.renderGeometry(geometry_cloth, this.material_constant);

    // 布のジオメトリを破棄
    geometry_cloth.release();
  }
}

function Render() {
  const [state, setState] = React.useState<State>(null);
  useFrame(({ gl, clock }, delta) => {
    if (!state) {
      // initialize;
      setState(new State(gl.getContext() as WebGL2RenderingContext, gl.domElement));
    }
    else {
      // render
      state.onFrame();
    }
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
