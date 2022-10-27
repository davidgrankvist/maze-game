package api

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"

	"maze-game-server/core"
	"maze-game-server/svc"
)

type createRoomDto struct {
    PlayerName string `json:"playerName"`
}

type createRoomResponseDto struct {
    RoomCode string `json:"roomCode"`
}

func CreateRoom(w http.ResponseWriter, req *http.Request) {
    var createRoom createRoomDto
    err := json.NewDecoder(req.Body).Decode(&createRoom)
    if err != nil {
        http.Error(w, "Bad body", 400)
        return
    }
    room, err := svc.CreateRoom(createRoom.PlayerName)
    if err != nil {
        err := core.NewHttpErrorFromError(err)
        http.Error(w, err.Message, err.Code)
        return
    }

    roomResponse := createRoomResponseDto{
        RoomCode: room.Code,
    }
    w.WriteHeader(http.StatusCreated)
    w.Header().Add("Content-Type", "application/json")
    json.NewEncoder(w).Encode(&roomResponse)
}

type joinRoomDto struct {
    PlayerName string `json:"playerName"`
}

func JoinRoom(w http.ResponseWriter, req *http.Request) {
    var joinRoom joinRoomDto

    err := json.NewDecoder(req.Body).Decode(&joinRoom)
    if err != nil {
        http.Error(w, "Bad body", 400)
        return
    }

    vars := mux.Vars(req)
    roomCode := vars["roomCode"]

    _, err = svc.JoinRoom(joinRoom.PlayerName, roomCode)
    if err != nil {
        err := core.NewHttpErrorFromError(err)
        http.Error(w, err.Message, err.Code)
        return
    }

    w.WriteHeader(http.StatusCreated)
    w.Header().Add("Content-Type", "application/json")
    json.NewEncoder(w).Encode(&joinRoom)
}

func GetRoom(w http.ResponseWriter, req *http.Request) {
    vars := mux.Vars(req)
    roomCode := vars["roomCode"]

    room, err := svc.GetRoom(roomCode)
    if err != nil {
        err := core.NewHttpErrorFromError(err)
        http.Error(w, err.Message, err.Code)
        return
    }

    w.Header().Add("Content-Type", "application/json")
    json.NewEncoder(w).Encode(&room)
}

