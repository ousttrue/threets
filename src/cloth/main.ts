import { yrGL } from './lib/yrGL';
import { vs_constant, fs_constant } from './lib/constant';
import { yrTimer } from './lib/yrTimer';
import { yrInput } from './lib/yrInput';
import { yrCamera } from './lib/yrCamera';

// ------------------------------------------------------------------------------------------------
// メイン処理
// ------------------------------------------------------------------------------------------------


// -------------------------------------------------------------------------------------------
// UI（ボタンやスライダーなど）用パラメータ
let reset = true;				// リセット
let div = 0;					// 質点分割数
let relaxation = 0;				// 制約充足の反復回数
let g = 0.0;					// 重力
let w = 0.0;					// 風力
let r = 0.0;					// 抵抗
let k = 0.0;					// 制約バネの特性（基本強度）
let structural_shrink = 0.0;	// 制約バネの特性（構成バネの伸び抵抗）
let structural_stretch = 0.0;	// 制約バネの特性（構成バネの縮み抵抗）
let shear_shrink = 0.0;			// 制約バネの特性（せん断バネの伸び抵抗）
let shear_stretch = 0.0;		// 制約バネの特性（せん断バネの縮み抵抗）
let bending_shrink = 0.0;		// 制約バネの特性（曲げバネの伸び抵抗）
let bending_stretch = 0.0;		// 制約バネの特性（曲げバネの縮み抵抗）
let collision = false;			// 球との衝突判定


// -------------------------------------------------------------------------------------------
// リセットボタンイベント
function button_reset() {
  reset = true;
}


// -------------------------------------------------------------------------------------------
// ページ読み込み完了イベント
export function onload(GL: WebGL2RenderingContext, element: HTMLElement) {
  // メインループ
  // main_loop();


  // -------------------------------------------------------------------------------------------
  // メインループ
  // function main_loop() {
  //   // UI（ボタンやスライダーなど）の取得
  //   for (let i = 0; i < document.form_ui.div.length; i++) {
  //     if (document.form_ui.div[i].checked) {
  //       const value = parseInt(document.form_ui.div[i].value);
  //       if (div !== value) {
  //         div = value;
  //         reset = true;
  //       }
  //     }
  //   }
  //   for (let i = 0; i < document.form_ui.relaxation.length; i++) {
  //     if (document.form_ui.relaxation[i].checked) {
  //       relaxation = parseInt(document.form_ui.relaxation[i].value);
  //     }
  //   }
  //   g = parseFloat(document.form_ui.g.value);
  //   w = parseFloat(document.form_ui.w.value);
  //   r = parseFloat(document.form_ui.r.value);
  //   k = parseFloat(document.form_ui.k.value);
  //   structural_shrink = parseFloat(document.form_ui.structural_shrink.value);
  //   structural_stretch = parseFloat(document.form_ui.structural_stretch.value);
  //   shear_shrink = parseFloat(document.form_ui.shear_shrink.value);
  //   shear_stretch = parseFloat(document.form_ui.shear_stretch.value);
  //   bending_shrink = parseFloat(document.form_ui.bending_shrink.value);
  //   bending_stretch = parseFloat(document.form_ui.bending_stretch.value);
  //   collision = document.form_ui.collision.checked;
  //
  //   // タイマー更新
  //   timer.update();
  //
  //   // 入力更新
  //   input.update();
  //
  //   // カメラ更新
  //   camera.updateEditorMode(
  //     input._mouse_button_l ? input._mouse_nmove_x * 1.0 : 0.0,
  //     input._mouse_button_l ? input._mouse_nmove_y * 1.0 : 0.0,
  //     0.0
  //   );
  //
  //   // 初期化（リセット）
  //   if (reset) {
  //     init();
  //     reset = false;
  //   }
  //
  //   // 更新
  //   const ms_step = 16;								// シミュレーションのタイムステップ（固定）
  //   let ms_delta = timer._ms_delta + ms_surplus;	// フレームの差分時間
  //   ms_delta = Math.min(ms_delta, 100);				// リミッター
  //   while (ms_delta >= ms_step) {
  //     // 大きなタイムステップでシミュレーションを実行すると精度の問題で破綻が生じるため、
  //     // フレームの差分時間を固定のシミュレーションタイムステップで分割し、複数回処理する。
  //     // 余剰時間は次のフレームに持ち越す。
  //     update(ms_step / 1000.0, ms_acc / 1000.0);
  //     ms_acc += ms_step;
  //     ms_delta -= ms_step;
  //   }
  //   ms_surplus = ms_delta;
  //
  //   // 描画
  //   render();
  //
  //   // バッファリングされたWebGLコマンドをただちに実行する
  //   renderer.flush();
  //
  //   // このフレームは終了
  //   requestAnimationFrame(main_loop);
  //
  //   // -------------------------------------------------------------------------------------------
  //   // 初期化
  //   function init() {
  //     cloth = undefined;
  //     ms_acc = 0;
  //     ms_surplus = 0;
  //
  //     cloth = new Cloth(scale, div);	// スケーリング, 質点分割数
  //   }
  //
  //   // -------------------------------------------------------------------------------------------
  //   // 更新
  //   function update(step, acc) {
  //     cloth.update(
  //       step, 				// タイムステップ（秒）
  //       acc, 				// 累積時間（秒）
  //       relaxation, 		// 制約充足の反復回数
  //       g, 					// 重力
  //       w, 					// 風力
  //       r, 					// 抵抗
  //       k, 					// 制約バネの特性（基本強度）
  //       structural_shrink,	// 制約バネの特性（構成バネの伸び抵抗）
  //       structural_stretch,	// 制約バネの特性（構成バネの縮み抵抗）
  //       shear_shrink,		// 制約バネの特性（せん断バネの伸び抵抗）
  //       shear_stretch,		// 制約バネの特性（せん断バネの縮み抵抗）
  //       bending_shrink,		// 制約バネの特性（曲げバネの伸び抵抗）
  //       bending_stretch,	// 制約バネの特性（曲げバネの縮み抵抗）
  //       collision			// 球との衝突判定
  //     );
  //   }
  //
  //   // -------------------------------------------------------------------------------------------
  //   // 描画
  //   function render() {
  //     // カメラ行例
  //     const view_matrix = camera.getViewMatrix();					// ビュー行列
  //     const projection_matrix = camera.getProjectionMatrix(true);	// プロジェクション行列
  //
  //     // カラーバッファとZバッファをクリアする
  //     renderer.clearBuffer();
  //
  //     // 布のジオメトリを生成
  //     // Todo : 毎フレームVBO/IBOを作り直すという、残念な実装になっています
  //     //      : 動的書き換えに適したDYNAMIC_DRAW / bufferSubDataあたりに対応させるべき
  //     //      : また、インターリーブ対応など、他にも最適化の余地があります
  //     const geometry_cloth = gl.createGeometry(cloth._vertices, cloth._indeces, gl._gl.LINES);
  //
  //     // 描画
  //     const wvp_matrix = mat4.create();
  //     mat4.mul(wvp_matrix, projection_matrix, view_matrix);
  //     material_constant.SetUniformFloat32Array("u_wvp", wvp_matrix);
  //     material_constant.SetUniformFloat32Array("u_color", vec4.fromValues(1.0, 1.0, 1.0, 1.0));
  //     renderer.renderGeometry(geometry_cloth, material_constant);
  //
  //     // 布のジオメトリを破棄
  //     geometry_cloth.release();
  //   }
  // }
}

