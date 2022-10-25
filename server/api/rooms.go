package api

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"

	"maze-game-server/core"
)

type createRoomDto struct {
    PlayerName string `json:"playerName"`
    RoomCode string `json:"roomCode"`
}

func CreateRoom(w http.ResponseWriter, req *http.Request) {
    var room createRoomDto
    err := json.NewDecoder(req.Body).Decode(&room)
    if err != nil {
        http.Error(w, "Bad body", 400)
        return
    }
    w.WriteHeader(http.StatusCreated)
    w.Header().Add("Content-Type", "application/json")
    json.NewEncoder(w).Encode(&room)
}

type joinRoomDto struct {
    PlayerName string `json:"playerName"`
}

func JoinRoom(w http.ResponseWriter, req *http.Request) {
    var room joinRoomDto

    //vars := mux.Vars(req)
    //roomCode := vars["roomCode"]

    err := json.NewDecoder(req.Body).Decode(&room)
    if err != nil {
        http.Error(w, "Bad body", 400)
        return
    }
    w.WriteHeader(http.StatusCreated)
    w.Header().Add("Content-Type", "application/json")
    json.NewEncoder(w).Encode(&room)
}

func GetRoom(w http.ResponseWriter, req *http.Request) {
    vars := mux.Vars(req)
    roomCode := vars["roomCode"]

    room := core.Room{
        Code: roomCode,
        Host: "someperson",
        Players: []core.Player{},
    }

    w.Header().Add("Content-Type", "application/json")
    json.NewEncoder(w).Encode(&room)
}

