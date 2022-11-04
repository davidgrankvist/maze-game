package core

type Vec2 struct {
    X int `json:"x"`
    Y int `json:"y"`
}

func NewVec2(x int, y int) Vec2 {
    return Vec2{
        X: x,
        Y: y,
    }
}

type GamePlayer struct {
    Position Vec2 `json:"position"`
    Velocity Vec2 `json:"velocity"`
}

func NewGamePlayer() GamePlayer {
    return GamePlayer{
        Position: NewVec2(0, 0),
        Velocity: NewVec2(0, 0),
    }
}

const PLAYER_SPEED = 400

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
    ACTION_MOVE_UP
    ACTION_MOVE_DOWN
    ACTION_MOVE_LEFT_STOP
    ACTION_MOVE_RIGHT_STOP
    ACTION_MOVE_UP_STOP
    ACTION_MOVE_DOWN_STOP
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
