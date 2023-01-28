export const lerp = (a, b, t) => a + (b - a) * t;

export const getIntersection = (start1, end1, start2, end2) => {
  const tTop = (end2.x - start2.x) * (start1.y - start2.y) - (end2.y - start2.y) * (start1.x - start2.x);
  const uTop = (start2.y - start1.y) * (start1.x - end1.x) - (start2.x - start1.x) * (start1.y - end1.y);
  const bottom = (end2.y - start2.y) * (end1.x - start1.x) - (end2.x - start2.x) * (end1.y - start1.y);

  if (bottom !== 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(start1.x, end1.x, t),
        y: lerp(start1.y, end1.y, t),
        offset: t
      };
    }
  }
  return null;
};

export const polysIntersect = (poly1, poly2) => {
  for (let i = 0; i < poly1.length; i++) {
    const p1 = poly1[i];
    const p2 = poly1[(i + 1) % poly1.length];
    for (let j = 0; j < poly2.length; j++) {
      const p3 = poly2[j];
      const p4 = poly2[(j + 1) % poly2.length];
      if (getIntersection(p1, p2, p3, p4)) {
        return true;
      }
    }
  }
  return false;
};
