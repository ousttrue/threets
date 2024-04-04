// ------------------------------------------------------------------------------------------------
// カメラ制御
// ------------------------------------------------------------------------------------------------


// -------------------------------------------------------------------------------------------
// カメラ制御
class yrCamera {
  constructor() {
    // ビューパラメータ
    this._pos = vec3.fromValues(0.0, 0.0, 5.0);
    this._at = vec3.fromValues(0.0, 0.0, 0.0);	// 注視点
    this._up = vec3.fromValues(0.0, 1.0, 0.0);	// ワールドの上方向

    // プロジェクションパラメータ
    this._fov_y = 90.0 * Math.PI / 180.0;
    this._aspect = 1.0;
    this._near = 0.5;
    this._far = 10.0;
    this._left = -1.0;
    this._right = 1.0;
    this._bottom = -1.0;
    this._top = 1.0;
  }

  // 更新（エディタモード）
  updateEditorMode(d_rot_x, d_rot_y, d_length) {
    this._up = vec3.fromValues(0.0, 1.0, 0.0);	// 固定

    var inv_dir = vec3.create();
    vec3.sub(inv_dir, this._pos, this._at);
    var rot = vec3.create();
    rot[0] = Math.atan2(inv_dir[2], inv_dir[0]) + d_rot_x;
    var xz = vec3.fromValues(inv_dir[0], 0.0, inv_dir[2]);
    rot[1] = Math.atan2(inv_dir[1], vec3.length(xz)) - d_rot_y;
    rot[1] = Math.min(Math.max(rot[1], -89.0 * Math.PI / 180.0), 89.0 * Math.PI / 180.0);
    rot[2] = 0.0;

    var length = Math.max(vec3.length(inv_dir) + d_length, this._near);

    vec3.set(this._pos, Math.cos(rot[1]) * Math.cos(rot[0]), Math.sin(rot[1]), Math.cos(rot[1]) * Math.sin(rot[0]));
    vec3.scale(this._pos, this._pos, length);
    vec3.add(this._pos, this._pos, this._at);
  }

  // 更新（FPSモード）
  updateFPSMode(d_rot_x, d_rot_y, d_forward, d_backward, d_left, d_right) {
    this._up = vec3.fromValues(0.0, 1.0, 0.0);	// 固定

    var dir = vec3.create();
    vec3.sub(dir, this._at, this._pos);
    var rot = vec3.create();
    rot[0] = Math.atan2(dir[2], dir[0]) + d_rot_x;
    var xz = vec3.fromValues(dir[0], 0.0, dir[2]);
    rot[1] = Math.atan2(dir[1], vec3.length(xz)) + d_rot_y;
    rot[1] = Math.min(Math.max(rot[1], -89.0 * Math.PI / 180.0), 89.0 * Math.PI / 180.0);
    rot[2] = 0.0;

    var ndir = vec3.create();
    vec3.normalize(ndir, dir);
    var fb = vec3.create();
    vec3.scale(fb, ndir, d_forward - d_backward);
    var lr = vec3.create();
    vec3.cross(lr, ndir, this._up);
    vec3.normalize(lr, lr);
    vec3.scale(lr, lr, d_right - d_left);

    vec3.set(this._at, Math.cos(rot[1]) * Math.cos(rot[0]), Math.sin(rot[1]), Math.cos(rot[1]) * Math.sin(rot[0]));
    vec3.scale(this._at, this._at, vec3.length(dir));
    vec3.add(this._pos, this._pos, fb);
    vec3.add(this._pos, this._pos, lr);
    vec3.add(this._at, this._at, this._pos);
  }

  // ビューマトリクス取得
  getViewMatrix() {
    var m = mat4.create();
    mat4.lookAt(m, this._pos, this._at, this._up);

    return m;
  }

  // プロジェクションマトリクス取得
  getProjectionMatrix(is_perspective) {
    var m = mat4.create();
    if (is_perspective) {
      mat4.perspective(m, this._fov_y, this._aspect, this._near, this._far);
    }
    else {
      mat4.ortho(m, this._left, this._right, this._bottom, this._top, this._near, this._far);
    }

    return m;
  }
}
