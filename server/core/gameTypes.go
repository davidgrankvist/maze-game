package core

type Velocity struct {
    X int `json:"x"`
    Y int `json:"y"`
}

type GamePlayer struct {
    Name string `json:"name"`
    Velocity Velocity `json:"position"`
}

type Tile int

const (
    TILE_EMPTY Tile = iota
    TILE_BLOCK
)

type GameMap struct {
    Tiles [][]Tile `json:"tiles"`
}

type Game struct {
    GameMap GameMap `json:"gameMap"`
}

type GameState struct {
    Players map[string]GamePlayer `json:"players"`
}

type GameActionId int
const (
    ACTION_NOOP GameActionId = iota
    ACTION_MOVE_LEFT
    ACTION_MOVE_RIGHT
    ACTION_MOVE_STOP
    ACTION_JUMP
    action_end
)

type GameAction struct {
    Id GameActionId `json:"id"`
    Sender string `json:"sender"`
    Payload interface{} `json:"payload"`
}

func (action *GameAction) IsValid() bool {
    return action.Id >= 0 && action.Id < action_end
}

func (action *GameAction) IsNoop() bool {
    return action.Id == ACTION_NOOP || !action.IsValid()
}
