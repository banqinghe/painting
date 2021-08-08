export default class PathList extends Array {
  head() {
    return this[0];
  }
  tail() {
    return this[this.length - 1];
  }
}
