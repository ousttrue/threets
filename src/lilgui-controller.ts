import GUI from "lil-gui";

export class GUIController {
  private static _instance: GUIController | null;
  private _gui: GUI | null = null;

  private constructor() {}

  static get instance() {
    if (!this._instance) {
      this._instance = new GUIController();
    }
    return this._instance;
  }

  initialize(container: HTMLDivElement, initiliazer: Function) {
    if (!this._gui) {
      console.log(container);
      this._gui = new GUI({ container });
      initiliazer(this);
    }
  }

  private _folder = (title: string) => {
    if (!this._gui) {
      throw new Error("no _gui");
    }
    let folder = this._gui.folders.find((f) => f._title === title);
    if (!folder) folder = this._gui.addFolder(title);
    return folder;
  };

  private _uncontainedName = (folder: GUI, name: string) => {
    return !folder.controllers.find((c) => c._name === name);
  };

  add(
    folderTitle: string,
    obj: object,
    name: string,
    min: number,
    max: number
  ) {
    const folder = this._folder(folderTitle);
    if (this._uncontainedName(folder, name)) {
      return folder.add(obj, name, min, max, 1);
    }
  }
}
