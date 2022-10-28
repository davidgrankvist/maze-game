package core

type Player struct {
    Name string `json:"name"`
}

type Room struct {
    Code string `json:"code"`
    Host string `json:"host"`
    Players []Player `json:"players"`
    IsGameTime bool `json:"isGameTime"`
}
