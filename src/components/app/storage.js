export default class Storage {
  constructor(storageName) {
    this.storageName = storageName;
  }
  getItem = (val) => {
    return this.storageName.getItem(val);
  };
  setItem = (name, val) => {
    return this.storageName.setItem(name, val);
  };
}
