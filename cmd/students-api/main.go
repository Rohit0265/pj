package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/Rohit0265/mygopj/cmd/internal/config"
)


func main(){
	// load config
	cfg := config.MustLoad()
	// database setup

	//setup router
	router := http.NewServeMux()
	router.HandleFunc("GET /",func(w http.ResponseWriter,r *http.Request){
		w.Write([]byte("welcome to students api"))
	})
	//setup server
	server := http.Server{
		Addr:cfg.Addr,
		Handler:router,
	}
	fmt.Println("server started")
	err := server.ListenAndServe()
	if err != nil {
		log.Fatal("failer to start server")
	}

}