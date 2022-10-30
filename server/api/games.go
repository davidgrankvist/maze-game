package api

import (
    "fmt"
    "log"
    "maze-game-server/core"
    "maze-game-server/svc"
    "net/http"

    "github.com/gorilla/mux"
    "github.com/gorilla/websocket"
)
var upgrader = websocket.Upgrader{
    CheckOrigin: func(r *http.Request) bool { return true },
}

const (
    TOPIC_ACTIONS = "game-actions"
)

type GameMessage struct {
    Topic string `json:"topic"`
    Payload core.GameAction `json:"payload"`
}

func GameWs(w http.ResponseWriter, req *http.Request) {
    vars := mux.Vars(req)
    gameCode := vars["gameCode"]
    playerName := vars["playerName"]

    log.Printf("Starting websocket for player %s in game %s", playerName, gameCode)
    c, err := upgrader.Upgrade(w, req, nil)
    if err != nil {
        log.Print("Failed to upgrade", err)
        return
    }
    actionTopic := fmt.Sprintf("%s/%s", gameCode, TOPIC_ACTIONS)
    subActions := svc.PS.Sub(playerName, actionTopic)

    defer func() {
        log.Printf("Closing connection for player %s in game %s", playerName, gameCode)
        svc.PS.Unsub(playerName, actionTopic)
        c.Close()
    }()

    // receive messages from all players and push to WS of current player
    go func () {
        for msg := range subActions.Channel {
            action, ok := msg.(core.GameAction)
            if !ok {
                log.Printf("invalid action in %+v in channel loop. Skipping WS push", action)
                continue
            }

            message := GameMessage{
                Topic: TOPIC_ACTIONS,
                Payload: action,
            }

            // TODO apply actions to game state here
            err = c.WriteJSON(&message)
            if err != nil {
                log.Printf("player %s in game %s failed to write: %s", playerName, gameCode, err.Error())
                break;
            }
        }
    }()

    // receive WS messages from current player and publish to all players
    for {
        message := GameMessage{}
        err := c.ReadJSON(&message)
        if err != nil {
            log.Print("Failed to read message: ", err.Error())
            break;
        }

        if message.Topic != TOPIC_ACTIONS {
            continue
        }

        action := message.Payload
        if !action.IsValid() {
            log.Printf("invalid action in game message loop %+v. Skipping publish", action)
            continue
        }

        action.Sender = playerName
        svc.PS.Pub(action, actionTopic)
    }
}
