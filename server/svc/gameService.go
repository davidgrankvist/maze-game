package svc

import "maze-game-server/core"

var gameStore = map[string]core.Game{}
var gameStateStore = map[string]core.GameState{}

func CreateGame(room core.Room) (core.Game, error) {
    gameCode := room.Code
    game, exists := gameStore[gameCode]

    if exists {
        return game, core.NewHttpError(409, "Game already exists")
    }

    _, err := initGameState(room)
    if err != nil {
        return game, core.NewHttpError(500, "Failed to initialize game")
    }
    game = core.Game{}
    gameStore[gameCode] = game

    return game, nil
}

func initGameState(room core.Room) (core.GameState, error) {
    gameCode := room.Code
    players := map[string]core.GamePlayer{}
    gameState := core.GameState{
        Players: players,
    }
    for _, pl := range room.Players {
        gameState.Players[pl.Name] = core.GamePlayer{
           Name: pl.Name,
           Velocity: core.Velocity{
               X: 0,
               Y: 0,
           },
       }
    }
    gameStateStore[gameCode] = gameState
    return gameState, nil
}
