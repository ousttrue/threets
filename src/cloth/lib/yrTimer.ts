// ------------------------------------------------------------------------------------------------
// タイマー
// ------------------------------------------------------------------------------------------------


// -------------------------------------------------------------------------------------------
// タイマー
export class yrTimer {
  _update_ct = 0;	// アップデート回数
  _ms_now = 0;		// 現在時間（ミリ秒）
  _ms_acc = 0;		// 累積時間（ミリ秒）
  _ms_delta = 0;		// 差分時間（ミリ秒）
  constructor() {
    this.reset();
  }

  // リセット
  reset() {
    const date = new Date();
    const ms = date.getTime();

    this._update_ct = 0;
    this._ms_now = ms;
    this._ms_acc = 0;
    this._ms_delta = 0;
  }

  // 更新
  update() {
    const date = new Date();
    const ms = date.getTime();

    if (this._update_ct > 0) {
      this._ms_delta = ms - this._ms_now;
      this._ms_acc += this._ms_delta;
      this._ms_now = ms;
    }

    this._update_ct++;
  }
}
