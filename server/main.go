package main

import (
    "fmt"
    "net/http"

    "github.com/gorilla/mux"

    "maze-game-server/api"
    "maze-game-server/util"
)

func main() {
    fmt.Println("\n=== STARTING SERVER ===\n")

    util.InitRandomSeed()

    r := mux.NewRouter()

    s := r.PathPrefix("/rooms").Headers("Content-Type", "application/json").Subrouter()
    s.HandleFunc("", api.CreateRoom).Methods("POST")
    s.HandleFunc("/{roomCode}/join", api.JoinRoom).Methods("POST")
    s.HandleFunc("/{roomCode}", api.GetRoom).Methods("GET")

    http.Handle("/", r)

    printRoutes(r)

    fmt.Println("\nListening on port 8090\n")

    http.ListenAndServe(":8090", nil)
}

func printRoutes(r *mux.Router) {
    r.Walk(func(route *mux.Route, router *mux.Router, ancestors []*mux.Route) error {
        tpl, _ := route.GetPathTemplate()
        met, _ := route.GetMethods()
        if len(met) == 0 {
            return nil
        }
        for _, m := range met {
            fmt.Println(m, "\t", tpl)
        }
        return nil
    })
}
