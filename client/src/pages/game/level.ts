/**
 * Takes a level similar to addLevel and merges sprites
 * that are connected.
 *
 * The reason for this is that adding a lot of sprites is costly,
 * but rendering large sprites with a repeated image is cheap.
 */
export function addMergedLevel(smap: string[], target: string){
  const mergedTiles = mergeTiles(smap, target);
  mergedTiles.forEach(({ width, height, x, y }) => {
    add([
        sprite("steel", { width, height, tiled: true }),
        pos(x, y),
        area(),
        solid(),
        "block"
    ]);
  })
}

interface Tile {
  x: number;
  y: number;
  width: number;
  height: number;
}

function mergeTiles(smap: string[], target: string): Tile[] {
  const horizontallyMergedTiles: Tile[] = [];
  for (let i = 0; i < smap.length; i++) {
    let blockStart = -1;
    for (let j = 0; j < smap[i].length; j++) {
      const c = smap[i].charAt(j);
      const cPrev = j === 0 ? "" : smap[i][j - 1];
      const cNext = j + 1 < smap[i].length ? smap[i][j + 1] : "";

      const isEnd = cNext !== target;

      if (c === target && cPrev !== target) {
        blockStart = j;
      }

      if (c === target && isEnd){
        const blockEnd = j;
        horizontallyMergedTiles.push({
          x: blockStart * 64,
          y: i * 64,
          width: 64 * (blockEnd - blockStart + 1),
          height: 64,
        })
      }
    }
  }

  // make an extra sweep to merge single tile columns
  const verticallyMergedTiles: Tile[] = [];
  const hsort = horizontallyMergedTiles.sort((t1, t2) => t2.x - t1.x);

  let blockStart = -1;
  let wTarget = 64;
  let yMin = Infinity;

  for (let i = 0; i < hsort.length; i++) {
    const t = hsort[i];
    const tPrev = i === 0 ? null : horizontallyMergedTiles[i - 1];
    const tNext = i + 1 < horizontallyMergedTiles.length ? horizontallyMergedTiles[i + 1] : null;

    const isEnd = tNext?.width !== wTarget || tNext?.x !== t.x || tNext?.y > t.y + 64;

    if (t.width === wTarget && tPrev?.width !== wTarget) {
      blockStart = i;
    }

    if (t.y < yMin) {
      yMin = t.y;
    }

    if (t.width === wTarget && isEnd) {
      const blockEnd = i;
      verticallyMergedTiles.push({
        ...t,
        y: yMin,
        height: 64 * (blockEnd - blockStart + 1),
      });
      yMin = Infinity;
    } else if (t.width !== wTarget) {
      verticallyMergedTiles.push(t);
    }
  }

  return verticallyMergedTiles;
}
