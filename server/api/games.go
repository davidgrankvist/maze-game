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
var upgrader = websocket.Upgrader{}

const (
    TOPIC_ACTIONS = "game-actions"
)

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
    log.Printf("Player %s is subscripted to topic %s", subActions.Id, actionTopic)

    defer func() {
        c.Close()
        svc.PS.Unsub(actionTopic, playerName)
    }()

    // receive messages from all players and push to WS of current player
    go func () {
        for msg := range subActions.Channel {
            action, ok := msg.(core.GameAction)
            if !ok {
                continue
            }
            // TODO apply actions to game state here
            err = c.WriteJSON(&action)
            if err != nil {
                log.Print("Failed to write message: ", err.Error())
                break;
            }
        }
    }()

    // receive WS messages from current player and publish to all players
    for {
        action := core.GameAction{
            Id: core.ACTION_NOOP,
            Sender: playerName,
        }
        err := c.ReadJSON(&action)
        if err != nil {
            log.Print("Failed to read message: ", err.Error())
            break;
        }
        if action.IsNoop() {
            continue
        }
        svc.PS.Pub(action, actionTopic)
    }
}
