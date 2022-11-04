package svc

import (
	"errors"
	"fmt"
	"log"
	"maze-game-server/core"
	"time"
)

var gameStore = map[string]core.Game{}
var gameStateStore = map[string]core.GameState{}
var pubsubs = map[string]*PubSub{}

const (
    TOPIC_ACTIONS = "game-actions"
    TOPIC_GAME_STATE = "game-state"
    PUBLISHER_GAME_STATE = "game-state-publisher"
    TIME_OUT_SECONDS = 30
    TICK_MS = 100
    TICKS_PER_SECOND = 10
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
        gameState.Players[pl.Name] = core.NewGamePlayer()
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

    ticker := time.NewTicker(TICK_MS * time.Millisecond)
    pendingActions := []core.GameAction{}
    defer func() {
        log.Printf("Stopping job for game %s", gameCode)
        ps.Unsub(PUBLISHER_GAME_STATE, TOPIC_ACTIONS)
        ticker.Stop()
    }()

    latestActionTime := time.Now()
    for {
       t := time.Now()
       if t.Sub(latestActionTime) > TIME_OUT_SECONDS * time.Second {
           log.Printf("Game %s timed out. Stopping ticker", gameCode)
           break;
       }

       select {
       case msg := <- subActions.Channel:
           action, ok := msg.(core.GameAction)
           if !ok {
               log.Printf("invalid action %+v in game state loop. Skipping update", action)
               continue
           }
           pendingActions = append(pendingActions, action)

           latestActionTime = time.Now()
       case <- ticker.C:
           simulateMovement(gameCode)
           applyActions(pendingActions, gameCode)
           pendingActions = nil

           gameState := gameStateStore[gameCode]
           ps.Pub(gameState, TOPIC_GAME_STATE)
       }
    }
}

func simulateMovement(gameCode string) {
    prevState := gameStateStore[gameCode]
    newState := core.GameState{
        Players: map[string]core.GamePlayer{},
    }

    for playerName, playerState := range prevState.Players {
        if len(playerName) == 0 {
            continue
        }
        prevPos := playerState.Position
        prevVel := playerState.Velocity

        dx := prevVel.X / TICKS_PER_SECOND
        dy := prevVel.Y / TICKS_PER_SECOND
        newPos := core.NewVec2(prevPos.X + dx, prevPos.Y + dy)

        newState.Players[playerName] = core.GamePlayer{
            Velocity: prevVel,
            Position: newPos,
        }
    }

    gameStateStore[gameCode] = newState
}

func applyActions(actions []core.GameAction, gameCode string) {
    for _, action := range actions {
        if len(action.Sender) == 0 {
            continue
        }
        applyAction(action, gameCode)
    }
}

func applyAction(action core.GameAction, gameCode string) {
    prevState := gameStateStore[gameCode].Players[action.Sender]
    vPrev := prevState.Velocity;
    vNext := prevState.Velocity
    switch(action.Id) {
    case core.ACTION_MOVE_LEFT:
        vNext = core.NewVec2(-core.PLAYER_SPEED, vPrev.Y)
    case core.ACTION_MOVE_RIGHT:
        vNext = core.NewVec2(core.PLAYER_SPEED, vPrev.Y)
    case core.ACTION_MOVE_UP:
        vNext = core.NewVec2(vPrev.X, -core.PLAYER_SPEED)
    case core.ACTION_MOVE_DOWN:
        vNext = core.NewVec2(vPrev.X, core.PLAYER_SPEED)
    case core.ACTION_MOVE_LEFT_STOP:
        vNext = core.NewVec2(0, vPrev.Y)
    case core.ACTION_MOVE_RIGHT_STOP:
        vNext = core.NewVec2(0, vPrev.Y)
    case core.ACTION_MOVE_UP_STOP:
        vNext = core.NewVec2(vPrev.X, 0)
    case core.ACTION_MOVE_DOWN_STOP:
        vNext = core.NewVec2(vPrev.X, 0)
    }
    gameStateStore[gameCode].Players[action.Sender] = core.GamePlayer{
        Position: prevState.Position,
        Velocity: vNext,
    }
}
