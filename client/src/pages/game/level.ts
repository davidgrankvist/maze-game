import { GameTile } from "../../common/gameTypes";

/**
 * Takes a set of tiles and spawns sprites on the positions
 * marked as Block. Adjacent tiles are merged into one
 * and rendered with the `tiled` option.
 *
 * The reason for this is that adding a lot of sprites is costly,
 * but rendering large sprites with a repeated image is cheap.
 */
export function addMergedLevel(map: GameTile[][]){
  const mergedTiles = mergeTiles(map);
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

interface Block {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Tile merge in two steps:
 *
 * 1. Merge horizontally, one row at a time. Skip isolated tiles.
 * 2. Merge the remaining tiles vertically, one column at a time
 *
 * This simple approach is meant for maps with many thin walls, such as a maze.
 *
 */
function mergeTiles(mat: GameTile[][]): Block[] {
  const target = GameTile.Block;
  const blocks: Block[] = [];
  const shouldMergeVertically: Record<string, boolean> = {};

  for (let i = 0; i < mat.length; i++) {
    let blockStart = -1;
    for (let j = 0; j < mat[0].length; j++) {
      const b = mat[i][j];
      const bPrev = j === 0 ? null : mat[i][j - 1];
      const bNext = j + 1 < mat[i].length ? mat[i][j + 1] : null;

      shouldMergeVertically[i + '-' + j] = false;

      if (b !== target) {
        continue;
      }

      if (bPrev !== target) {
        blockStart = j;
      }

      if (bNext === target) {
        continue;
      }

      const blockEnd = j;
      if (blockStart === blockEnd) {
        shouldMergeVertically[i + '-' + j] = true;
      } else {
        blocks.push({
          x: blockStart * 64,
          y: i * 64,
          width: 64 * (blockEnd - blockStart + 1),
          height: 64,
        });
      }
    }
  }
  const isTarget = (b: GameTile | null, i: number, j: number) => {
    return b === target && shouldMergeVertically[i + '-' + j];
  }
  for (let j = 0; j < mat[0].length; j++) {
    let blockStart = -1;
    for (let i = 0; i < mat.length; i++) {
      const b = mat[i][j];
      const bPrev = i === 0 ? null : mat[i - 1][j];
      const bNext = i + 1 < mat.length ? mat[i + 1][j] : null;

      if (!isTarget(b, i, j)) {
        continue;
      }

      if (!isTarget(bPrev, i-1, j)) {
        blockStart = i;
      }

      if (isTarget(bNext, i+1, j)) {
        continue;
      }

      const blockEnd = i;
      blocks.push({
        x: j * 64,
        y: blockStart * 64,
        width: 64,
        height: 64 * (blockEnd - blockStart + 1),
      });
    }
  }

  return blocks;
}
