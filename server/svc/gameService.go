package svc

import (
	"errors"
	"fmt"
	"log"
	"maze-game-server/core"
)

var gameStore = map[string]core.Game{}
var gameStateStore = map[string]core.GameState{}
var pubsubs = map[string]*PubSub{}

const (
    TOPIC_ACTIONS = "game-actions"
    TOPIC_GAME_STATE = "game-state"
    PUBLISHER_GAME_STATE = "game-state-publisher"
)

func CreateGame(room core.Room) (core.Game, error) {
    gameCode := room.Code
    game, exists := gameStore[gameCode]

    if exists {
        return game, core.NewHttpError(409, "Game already exists")
    }

    game = core.Game{}
    gameStore[gameCode] = game

    gameStateStore[gameCode] = newGameState(room)

    go gameStateJob(gameCode)

    return game, nil
}

func newGameState(room core.Room) core.GameState {
    players := map[string]core.GamePlayer{}
    gameState := core.GameState{
        Players: players,
    }
    for _, pl := range room.Players {
        gameState.Players[pl.Name] = core.GamePlayer{
           Position: core.Vec2{
               X: 0,
               Y: 0,
           },
           Velocity: core.Vec2{
               X: 0,
               Y: 0,
           },
       }
    }
    return gameState
}

func GetGamePubsub(gameCode string) (ps *PubSub, err error) {
    ps, ok := pubsubs[gameCode]
    if !ok {
        err = errors.New(fmt.Sprintf("Found no pubsub for game %s", gameCode))
    }
    return ps, err
}

func gameStateJob(gameCode string) {
    log.Printf("Starting job for game %s", gameCode)
    ps := NewPubSub()
    subActions := ps.Sub(PUBLISHER_GAME_STATE, TOPIC_ACTIONS)
    pubsubs[gameCode] = ps

    defer func() {
        log.Printf("Stopping job for game %s", gameCode)
        ps.CloseAll()
        delete(pubsubs, gameCode)
    }()

    /* TODO:
     *  - break loop if no actions are received for a while
     *  - process in batches and sort by game tick
     */
    for msg := range subActions.Channel {
        action, ok := msg.(core.GameAction)
        if !ok {
            log.Printf("invalid action %+v in game state loop. Skipping update", action)
            continue
        }
        applyAction(action, gameCode)
        gameState := gameStateStore[gameCode]
        ps.Pub(gameState, TOPIC_GAME_STATE)
    }
}

func applyAction(action core.GameAction, gameCode string) {
    prevState := gameStateStore[gameCode].Players[action.Sender]
    vNext := prevState.Velocity
    switch(action.Id) {
    case core.ACTION_MOVE_LEFT:
        vNext = core.NewVec2(-core.PLAYER_SPEED, 0)
    case core.ACTION_MOVE_RIGHT:
        vNext = core.NewVec2(core.PLAYER_SPEED, 0)
    case core.ACTION_MOVE_STOP:
        vNext = core.NewVec2(0, 0)
    }
    gameStateStore[gameCode].Players[action.Sender] = core.GamePlayer{
        Position: prevState.Position,
        Velocity: vNext,
    }
}
