package api

import (
    "log"
    "maze-game-server/core"
    "net/http"

    "github.com/gorilla/mux"
    "github.com/gorilla/websocket"
)
var upgrader = websocket.Upgrader{}

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
    defer c.Close()
    for {
        action := core.GameAction{
            Id: core.ACTION_NOOP,
        }
        err := c.ReadJSON(&action)
        if err != nil {
            log.Print("Failed to read message: ", err.Error())
            break;
        }
        action = core.GetActionOrNoop(action.Id)
        log.Printf("Incoming action: %+v", action)
        err = c.WriteJSON(&action)
        if err != nil {
            log.Print("Failed to write message: ", err.Error())
            break;
        }
    }
}
