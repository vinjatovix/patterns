/* eslint-disable no-console */
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static newCartesianPoint(x, y) {
    return new Point(x, y);
  }

  static newPolarPoint(rho, theta) {
    return new Point(rho * Math.cos(theta), rho * Math.sin(theta));
  }

  // this violates single responsibility principle but gives us a nice API
  static get factory() {
    return new PointFactory();
  }
}

class PointFactory {
  // not necessarily static
  newCartesianPoint(x, y) {
    return new Point(x, y);
  }

  static newPolarPoint(rho, theta) {
    return new Point(rho * Math.cos(theta), rho * Math.sin(theta));
  }
}

// Point → PointFactory
let p2 = PointFactory.newPolarPoint(5, Math.PI / 2);
console.log(p2);

// this line will not work if newCartesianPoint is static!
let p3 = Point.factory.newCartesianPoint(2, 3);
console.log(p3);
