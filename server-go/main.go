package main

import (
	"log"
	"net/http"

	socketio "github.com/googollee/go-socket.io"
)

type CustomServer struct {
	Server *socketio.Server
}

func main() {
	ioServer := configureSocketIO()
   	wsServer := new(CustomServer)
   	wsServer.Server = ioServer

	println("Serviço sendo escutado na porta 8000...")
	http.Handle("/socket.io/", wsServer)
	http.ListenAndServe(":8000", nil)

	// server, err := socketio.NewServer(nil)
	// 	if err != nil {
	// 		log.Fatal("error establishing new socketio server")
	// 	}

	// server.On("connection", func(so socketio.Socket) {
	// 	log.Println("On connection established", so.Id())

	// 	so.On("chat message", func(msg string) {
	// 		log.Println("messge received: " + msg)
	// 		so.BroadcastTo("mychat", "chat message", msg) //broadcasting the message to the room so all the clients connected can get it
	// 	})
	// })

	// fmt.Println("Server running on localhost: 8000")

	// http.Handle("/socket.io/", server)
	// log.Fatal(http.ListenAndServe(":8000", nil))
}

func configureSocketIO() *socketio.Server {
	println("Configurando Socket...")

	server, err := socketio.NewServer(nil)
		if err != nil {
			log.Fatal("error establishing new socketio server")
		}

	server.On("connection", func(so socketio.Socket) {
		log.Println("On connection established", so.Id())

		so.On("join_room", func(roomId string) {
			log.Println("Join_Room", roomId)
			so.Join(roomId);
		})

		so.On("chat message", func(msg string) {
			log.Println("messge received: " + msg)
			so.BroadcastTo("mychat", "chat message", msg) //broadcasting the message to the room so all the clients connected can get it
		})
	})

	return server
 }

func (s *CustomServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	origin := r.Header.Get("Origin")
	w.Header().Set("Access-Control-Allow-Origin", origin)
	s.Server.ServeHTTP(w, r)
}

// package main

// import (
// 	"log"
// 	"net/http"

// 	socketio "github.com/googollee/go-socket.io"
// 	"github.com/googollee/go-socket.io/engineio"
// 	"github.com/googollee/go-socket.io/engineio/transport"
// 	"github.com/googollee/go-socket.io/engineio/transport/polling"
// 	"github.com/googollee/go-socket.io/engineio/transport/websocket"
// )

// // Easier to get running with CORS. Thanks for help @Vindexus and @erkie
// var allowOriginFunc = func(r *http.Request) bool {
// 	return true
// }

// func main() {
// 	server := socketio.NewServer(&engineio.Options{
// 		Transports: []transport.Transport{
// 			&polling.Transport{
// 				CheckOrigin: allowOriginFunc,
// 			},
// 			&websocket.Transport{
// 				CheckOrigin: allowOriginFunc,
// 			},
// 		},
// 	})

// 	server.OnConnect("/", func(s socketio.Conn) error {
// 		s.SetContext("")
// 		log.Println("connected:", s.ID())
// 		return nil
// 	})

// 	server.OnEvent("/", "notice", func(s socketio.Conn, msg string) {
// 		log.Println("notice:", msg)
// 		s.Emit("reply", "have "+msg)
// 	})

// 	server.OnEvent("/chat", "msg", func(s socketio.Conn, msg string) string {
// 		log.Println("chat:", msg)
// 		s.SetContext(msg)
// 		return "recv " + msg
// 	})

// 	server.OnEvent("/", "bye", func(s socketio.Conn) string {
// 		last := s.Context().(string)
// 		s.Emit("bye", last)
// 		s.Close()
// 		return last
// 	})

// 	server.OnError("/", func(s socketio.Conn, e error) {
// 		log.Println("meet error:", e)
// 	})

// 	server.OnDisconnect("/", func(s socketio.Conn, reason string) {
// 		log.Println("closed", reason)
// 	})

// 	go func() {
// 		if err := server.Serve(); err != nil {
// 			log.Fatalf("socketio listen error: %s\n", err)
// 		}
// 	}()
// 	defer server.Close()

// 	http.Handle("/socket.io/", server)
// 	http.Handle("/", http.FileServer(http.Dir("../asset")))

// 	log.Println("Serving at localhost:8000...")
// 	log.Fatal(http.ListenAndServe(":8000", nil))
// }



// package main

// import (
// 	"net/http"

// 	socketio "github.com/googollee/go-socket.io"
// )

// type CustomServer struct {
// 	Server *socketio.Server
// }

// func (s *CustomServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
// 	w.Header().Set("Access-Control-Allow-Credentials", "true")
// 	origin := r.Header.Get("Origin")
// 	w.Header().Set("Access-Control-Allow-Origin", origin)
// 	s.Server.ServeHTTP(w, r)
// }

// func configureSocketIO() *socketio.Server {
// 	println("Configurando Socket...")
// 	server := socketio.NewServer(nil)

// 	server.OnEvent("/", "connect", func(s socketio.Conn) error {
// 		println("Socket Connectado. SID:", s.ID())
// 		s.SetContext("")
// 		return nil
// 	})

// 	server.OnConnect("/", func(s socketio.Conn) error {
// 		println("Socket Connectado. SID:", s.ID())
// 		s.SetContext("")
// 		return nil
// 	})

// 	server.OnError("/", func(s socketio.Conn, e error) {
// 		// server.Remove(s.ID())
// 		println("meet error:", e)
// 	});

// 	return server
//  }
 

// func main() {
// 	ioServer := configureSocketIO()
//    	wsServer := new(CustomServer)
//    	wsServer.Server = ioServer

//    	println("Serviço sendo escutado na porta 8000...")
//    	http.Handle("/socket.io/", wsServer)
//    	http.ListenAndServe(":8000", nil)
// }
