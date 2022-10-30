package svc

import (
	"maze-game-server/core"
)

var roomStore = map[string]core.Room{}

func CreateRoom(playerName string) (core.Room, error) {
    room := core.Room{
        Code: core.RandomString(20),
        Host: playerName,
        Players: []core.Player{
            { Name: playerName },
        },
    }

    _, exists := roomStore[room.Code]
    if exists {
        return room, core.NewHttpError(409, "Room already exists")
    }

    roomStore[room.Code] = room
    return room, nil
}

func JoinRoom(playerName string, roomCode string) (core.Room, error) {
    room, exists := roomStore[roomCode]

    if !exists {
        return room, core.NewHttpError(404, "Room not found")
    }

    for _, pl := range room.Players {
        if pl.Name == playerName {
            return room, core.NewHttpError(409, "Player name exists in room")
        }
    }

    newPlayers := append(room.Players, core.Player{ Name: playerName })
    newRoom := core.Room{
        Code: room.Code,
        Host: room.Host,
        Players: newPlayers,
        IsGameTime: room.IsGameTime,
    }
    roomStore[roomCode] = newRoom

    return room, nil
}

func GetRoom(roomCode string) (core.Room, error) {
    room, exists := roomStore[roomCode]

    if !exists {
        return room, core.NewHttpError(404, "Room not found")
    }
    return room, nil
}

func StartGame(roomCode string) (core.Room, error) {
    room, exists := roomStore[roomCode]

    if !exists {
        return room, core.NewHttpError(404, "Room not found")
    }

    _, err := CreateGame(room)
    if err != nil {
        return room, err
    }
    newRoom := core.Room{
        Code: room.Code,
        Host: room.Host,
        Players: room.Players,
        IsGameTime: true,
    }
    roomStore[roomCode] = newRoom
    return room, nil
}
