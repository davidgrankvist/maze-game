package svc

import "maze-game-server/core"


const (
    TILE_SIZE = 64
)


func CapPosition(player core.GamePlayer, newPos core.Vec2, gameMap *core.GameMap) core.Vec2 {
    xMax := len(gameMap.Tiles[0])
    yMax := len(gameMap.Tiles)

    tileX := (newPos.X / TILE_SIZE) % xMax
    tileY := (newPos.Y / TILE_SIZE) % yMax

    if newPos.X < 0 || newPos.X > xMax * TILE_SIZE || newPos.Y < 0 || newPos.Y > yMax * TILE_SIZE {
        return player.Position
    } else if gameMap.Tiles[tileY][tileX] == core.TILE_BLOCK {
        return player.Position
    } else {
        return newPos
    }
}


func NewGameMap(smap []string) core.GameMap {
    xMax := len(smap[0])
    yMax := len(smap)

    tiles := make([][]core.Tile, yMax)
    for i := range tiles {
        tiles[i] = make([]core.Tile, xMax)
        for j := range tiles[i] {
            if string(smap[i][j]) == "=" {
                tiles[i][j] = core.TILE_BLOCK
            } else {
                tiles[i][j] = core.TILE_EMPTY
            }
        }
    }
    return core.GameMap{
        Tiles: tiles,
    }
}

var DEFAULT_SMAP []string = []string{
    "                           ",
    "     == ===============    ",
    "                      =    ",
    "         ====              ",
    "                      =    ",
    "               =      =    ",
    "==================  =======",
    "                      =    ",
    "     ==  ==============    ",
    "     ==                    ",
}
