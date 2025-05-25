export default class ConfigModel {
  keyName: string;
  keyType: any;
  pattern?: any;
  default?: any;
  useDefault: boolean;

  constructor() {
    this.keyName = "";
    this.keyType = undefined;
    this.pattern = undefined;
    this.default = undefined;
    this.useDefault = false;
  }

  isEmpty(): boolean {
    for (const key in this) {
      if (
        Object.prototype.hasOwnProperty.call(this, key) &&
        this[key as keyof this] === ""
      ) {
        return false;
      }
    }
    return true;
  }

  getDefaultObject(): {
    keyName: string;
    keyType: any;
    pattern?: any;
    default?: any;
    useDefault: boolean;
  } {
    return {
      keyName: "",
      keyType: undefined,
      pattern: undefined,
      default: undefined,
      useDefault: false,
    };
  }
}
