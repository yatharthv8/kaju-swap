export default class autoRouteGraph {
  constructor() {
    this.sides = {};
  }

  //Undirected Graph
  addPairAsEdges(u, v) {
    if (this.sides[u] === undefined) {
      this.sides[u] = [];
    }
    this.sides[u].push(v);
    if (this.sides[v] === undefined) {
      this.sides[v] = [];
    }
    this.sides[v].push(u);
  }
}
