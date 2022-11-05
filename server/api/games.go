package api

import (
    "log"
    "maze-game-server/core"
    "maze-game-server/svc"
    "net/http"
    "time"

    "github.com/gorilla/mux"
    "github.com/gorilla/websocket"
)

type ActionGameMessage struct {
    Topic string `json:"topic"`
    Payload core.GameAction `json:"payload"`
}

type GameStateMessage struct {
    Topic string `json:"topic"`
    Payload core.GameState `json:"payload"`
}


var upgrader = websocket.Upgrader{
    CheckOrigin: func(r *http.Request) bool { return true },
}
func GameWs(w http.ResponseWriter, req *http.Request) {
    vars := mux.Vars(req)
    gameCode := vars["gameCode"]
    playerName := vars["playerName"]

    _, err := svc.GetGame(gameCode)
    if err != nil {
        return
    }

    log.Printf("Starting websocket for player %s in game %s", playerName, gameCode)
    c, err := upgrader.Upgrade(w, req, nil)
    if err != nil {
        log.Print("Failed to upgrade", err)
        return
    }

    ps, err := svc.GetGamePubsub(gameCode)
    if err != nil {
        log.Print("Failed to get pubsub", err)
        return
    }

    subGameState := ps.Sub(playerName, svc.TOPIC_GAME_STATE)
    defer func() {
        log.Printf("Closing connection for player %s in game %s", playerName, gameCode)
        ps.Unsub(playerName, svc.TOPIC_GAME_STATE)
        c.Close()
    }()

    // receive messages from game state job and push to WS of current player
    go func () {
        for msg := range subGameState.Channel {
            gameState, ok := msg.(core.GameState)
            if !ok {
                log.Printf("invalid game state in player channel loop %+v. Skipping WS push", gameState)
                continue
            }
            message := GameStateMessage{
                Topic: svc.TOPIC_GAME_STATE,
                Payload: gameState,
            }

            err = c.WriteJSON(&message)
            if err != nil {
                log.Printf("player %s in game %s failed to write: %s", playerName, gameCode, err.Error())
                break;
            }
        }
    }()

    // receive WS messages from current player and publish to game state job
    for {
        c.SetReadDeadline(time.Now().Add(time.Second * 2 * svc.GAME_TIME_OUT_SECONDS))

        message := ActionGameMessage{}
        err := c.ReadJSON(&message)
        if err != nil {
            log.Printf("Failed to read message from player %s in game %s: %s", playerName, gameCode, err.Error())
            break;
        }

        if message.Topic != svc.TOPIC_ACTIONS {
            continue
        }

        action := message.Payload
        if !action.IsValid() {
            log.Printf("invalid action in game message loop %+v. Skipping publish", action)
            continue
        }

        action.Sender = playerName
        ps.Pub(action, svc.TOPIC_ACTIONS)
    }
}
