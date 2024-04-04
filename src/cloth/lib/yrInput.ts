// ------------------------------------------------------------------------------------------------
// 入力
// ------------------------------------------------------------------------------------------------


// -------------------------------------------------------------------------------------------
// ボタンの状態（ビット）
var yrInputButtonStatusBit =
{
  just: 1,
  pushing: 2,
  release: 4
}


// -------------------------------------------------------------------------------------------
// 一時記憶用
var __mouse_pos_x_temp__ = 0;
var __mouse_pos_y_temp__ = 0;
var __mouse_npos_x_temp__ = 0.0;
var __mouse_npos_y_temp__ = 0.0;
var __mouse_button_l_temp__ = false;
var __mouse_button_m_temp__ = false;
var __mouse_button_r_temp__ = false;
var __key_button_w_temp__ = false;	// 動的な連想配列か何かにしたい
var __key_button_s_temp__ = false;	// 
var __key_button_a_temp__ = false;	// 
var __key_button_d_temp__ = false;	// 
var __touch_id__ = -1;


// -------------------------------------------------------------------------------------------
// マウスイベント
function __onMouseEvent__(e) {
  __mouse_pos_x_temp__ = e.offsetX;
  __mouse_pos_y_temp__ = e.offsetY;
  __mouse_npos_x_temp__ = __mouse_pos_x_temp__ / e.target.offsetWidth * 2.0 - 1.0;
  __mouse_npos_y_temp__ = -(__mouse_pos_y_temp__ / e.target.offsetHeight * 2.0 - 1.0);

  __mouse_button_l_temp__ = (0 != (e.buttons & 1));
  __mouse_button_m_temp__ = (0 != (e.buttons & 4));
  __mouse_button_r_temp__ = (0 != (e.buttons & 2));
}


// -------------------------------------------------------------------------------------------
// タッチイベント
function __onTouchStartEvent__(e) {
  e.preventDefault();

  if (-1 == __touch_id__) {
    __touch_id__ = e.targetTouches[0].identifier;

    __mouse_pos_x_temp__ = e.targetTouches[0].pageX - e.target.offsetLeft;
    __mouse_pos_y_temp__ = e.targetTouches[0].pageY - e.target.offsetTop;
    __mouse_npos_x_temp__ = __mouse_pos_x_temp__ / e.target.offsetWidth * 2.0 - 1.0;
    __mouse_npos_y_temp__ = -(__mouse_pos_y_temp__ / e.target.offsetHeight * 2.0 - 1.0);

    __mouse_button_l_temp__ = true;
  }
}
function __onTouchEndEvent__(e) {
  //	e.preventDefault();

  for (var i in e.changedTouches) {
    if (__touch_id__ == e.changedTouches[i].identifier) {
      __touch_id__ = -1;

      __mouse_pos_x_temp__ = e.changedTouches[i].pageX - e.target.offsetLeft;
      __mouse_pos_y_temp__ = e.changedTouches[i].pageY - e.target.offsetTop;
      __mouse_npos_x_temp__ = __mouse_pos_x_temp__ / e.target.offsetWidth * 2.0 - 1.0;
      __mouse_npos_y_temp__ = -(__mouse_pos_y_temp__ / e.target.offsetHeight * 2.0 - 1.0);

      __mouse_button_l_temp__ = false;
    }
  }
}
function __onTouchMoveEvent__(e) {
  //	e.preventDefault();

  for (var i in e.changedTouches) {
    if (__touch_id__ == e.changedTouches[i].identifier) {
      __mouse_pos_x_temp__ = e.changedTouches[i].pageX - e.target.offsetLeft;
      __mouse_pos_y_temp__ = e.changedTouches[i].pageY - e.target.offsetTop;
      __mouse_npos_x_temp__ = __mouse_pos_x_temp__ / e.target.offsetWidth * 2.0 - 1.0;
      __mouse_npos_y_temp__ = -(__mouse_pos_y_temp__ / e.target.offsetHeight * 2.0 - 1.0);
    }
  }
}
function __onTouchCancelEvent__(e) {
  __touch_id__ = -1;
  __mouse_button_l_temp__ = false;
}


// -------------------------------------------------------------------------------------------
// キーボードイベント
function __onKeyDown__(e) {
  switch (e.keyCode) {
    case 87:
      __key_button_w_temp__ = true;
      break;
    case 83:
      __key_button_s_temp__ = true;
      break;
    case 65:
      __key_button_a_temp__ = true;
      break;
    case 68:
      __key_button_d_temp__ = true;
      break;
  }
}
function __onKeyUp__(e) {
  switch (e.keyCode) {
    case 87:
      __key_button_w_temp__ = false;
      break;
    case 83:
      __key_button_s_temp__ = false;
      break;
    case 65:
      __key_button_a_temp__ = false;
      break;
    case 68:
      __key_button_d_temp__ = false;
      break;
  }
}

// -------------------------------------------------------------------------------------------
// 入力
export class yrInput {
  _mouse_pos_x = 0;
  _mouse_pos_y = 0;
  _mouse_npos_x = 0.0;
  _mouse_npos_y = 0.0;
  _mouse_move_x = 0;
  _mouse_move_y = 0;
  _mouse_nmove_x = 0.0;
  _mouse_nmove_y = 0.0;
  _mouse_button_l = false;
  _mouse_button_m = false;
  _mouse_button_r = false;
  _mouse_button_status_l = 0;
  _mouse_button_status_m = 0;
  _mouse_button_status_r = 0;
  _key_button_w = false;		// 動的な連想配列か何かにしたい
  _key_button_s = false;		// 
  _key_button_a = false;		// 
  _key_button_d = false;		// 
  _key_button_status_w = 0;	// 
  _key_button_status_s = 0;	// 
  _key_button_status_a = 0;	// 
  _key_button_status_d = 0;	// 

  constructor(target: HTMLElement) {
    // イベントリスナー追加
    target.addEventListener("mousedown", __onMouseEvent__);			// マウスイベント
    target.addEventListener("mouseup", __onMouseEvent__);			// 
    target.addEventListener("mouseover", __onMouseEvent__);			// 
    target.addEventListener("mouseout", __onMouseEvent__);			// 
    target.addEventListener("mousemove", __onMouseEvent__);			// 
    target.addEventListener("touchstart", __onTouchStartEvent__);	// タッチイベント
    target.addEventListener("touchend", __onTouchEndEvent__);		// 
    target.addEventListener("touchmove", __onTouchMoveEvent__);		// 
    target.addEventListener("touchcancel", __onTouchCancelEvent__);	// 
    document.addEventListener("keydown", __onKeyDown__);			// キーボードイベント
    document.addEventListener("keyup", __onKeyUp__);				// 
  }

  // 更新
  update() {
    this._mouse_move_x = __mouse_pos_x_temp__ - this._mouse_pos_x;
    this._mouse_move_y = __mouse_pos_y_temp__ - this._mouse_pos_y;
    this._mouse_nmove_x = __mouse_npos_x_temp__ - this._mouse_npos_x;
    this._mouse_nmove_y = __mouse_npos_y_temp__ - this._mouse_npos_y;
    this._mouse_pos_x = __mouse_pos_x_temp__;
    this._mouse_pos_y = __mouse_pos_y_temp__;
    this._mouse_npos_x = __mouse_npos_x_temp__;
    this._mouse_npos_y = __mouse_npos_y_temp__;
    this._mouse_button_status_l = this.checkButtonStatus(this._mouse_button_l, __mouse_button_l_temp__);
    this._mouse_button_status_m = this.checkButtonStatus(this._mouse_button_m, __mouse_button_m_temp__);
    this._mouse_button_status_r = this.checkButtonStatus(this._mouse_button_r, __mouse_button_r_temp__);
    this._mouse_button_l = __mouse_button_l_temp__;
    this._mouse_button_m = __mouse_button_m_temp__;
    this._mouse_button_r = __mouse_button_r_temp__;
    this._key_button_status_w = this.checkButtonStatus(this._key_button_w, __key_button_w_temp__);
    this._key_button_status_s = this.checkButtonStatus(this._key_button_s, __key_button_s_temp__);
    this._key_button_status_a = this.checkButtonStatus(this._key_button_a, __key_button_a_temp__);
    this._key_button_status_d = this.checkButtonStatus(this._key_button_d, __key_button_d_temp__);
    this._key_button_w = __key_button_w_temp__;
    this._key_button_s = __key_button_s_temp__;
    this._key_button_a = __key_button_a_temp__;
    this._key_button_d = __key_button_d_temp__;

    __mouse_move_x_temp__ = 0;
    __mouse_move_y_temp__ = 0;
  }

  // ボタンの状態を取得する
  checkButtonStatus(old, now) {
    var out = 0;

    if (!now) {
      if (old) {
        out |= yrInputButtonStatusBit.release;
      }
    }
    else {
      if (!old) {
        out |= yrInputButtonStatusBit.just;
      }
      out |= yrInputButtonStatusBit.pushing;
    }

    return out;
  }

  // デバッグ表示
  debug(debug: string) {
    if (document.getElementById(debug)) {
      document.getElementById(debug).innerHTML += "mouse pos : " + this._mouse_pos_x + " " + this._mouse_pos_y + "<br>";
      document.getElementById(debug).innerHTML += "mouse npos : " + this._mouse_npos_x + " " + this._mouse_npos_y + "<br>";
      document.getElementById(debug).innerHTML += "mouse move : " + this._mouse_move_x + " " + this._mouse_move_y + "<br>";
      document.getElementById(debug).innerHTML += "mouse nmove : " + this._mouse_nmove_x + " " + this._mouse_nmove_y + "<br>";
      document.getElementById(debug).innerHTML += "mouse button : " + this._mouse_button_l + " " + this._mouse_button_m + " " + this._mouse_button_r + "<br>";
      document.getElementById(debug).innerHTML += "mouse button status : " + this._mouse_button_status_l + " " + this._mouse_button_status_m + " " + this._mouse_button_status_r + "<br>";
      document.getElementById(debug).innerHTML += "key button : " + this._key_button_w + " " + this._key_button_s + " " + this._key_button_a + " " + this._key_button_d + "<br>";
      document.getElementById(debug).innerHTML += "key button status : " + this._key_button_status_w + " " + this._key_button_status_s + " " + this._key_button_status_a + " " + this._key_button_status_d + "<br>";
    }
  }
}

