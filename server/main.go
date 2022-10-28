package main

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"

	"maze-game-server/api"
	"maze-game-server/core"
)

func main() {
    fmt.Println("\n=== STARTING SERVER ===\n")

    core.InitRandomSeed()

    r := mux.NewRouter()

    s := r.PathPrefix("/api/rooms").Headers("Content-Type", "application/json").Subrouter()
    s.HandleFunc("", api.CreateRoom).Methods("POST")
    s.HandleFunc("/{roomCode}/join", api.JoinRoom).Methods("POST")
    s.HandleFunc("/{roomCode}", api.GetRoom).Methods("GET")
    s.HandleFunc("/{roomCode}/start", api.StartGame).Methods("POST")

    s = r.PathPrefix("/api/games/{gameCode}").Subrouter()
    s.HandleFunc("/{playerName}/ws", api.GameWs)

    printRoutes(r)

    credentials := handlers.AllowCredentials()
    methods := handlers.AllowedMethods([]string{"GET", "POST", "OPTIONS"})
    origins := handlers.AllowedOrigins([]string{"*"})
    headers := handlers.AllowedHeaders([]string{"Content-Type"})

    fmt.Println("\nListening on port 8090\n")
    http.ListenAndServe(":8090", handlers.CORS(credentials, methods, origins, headers)(r))
}

func printRoutes(r *mux.Router) {
    r.Walk(func(route *mux.Route, router *mux.Router, ancestors []*mux.Route) error {
        tpl, _ := route.GetPathTemplate()
        met, _ := route.GetMethods()
        if len(met) == 0 {
            if strings.Contains(tpl, "/ws") {
                fmt.Println("WS", "\t", tpl)
            }
            return nil
        }
        for _, m := range met {
            fmt.Println(m, "\t", tpl)
        }
        return nil
    })
}
