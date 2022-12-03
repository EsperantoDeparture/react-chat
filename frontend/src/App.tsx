import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8080");

interface Message {
  username: string;
  text: string;
  date: number;
}

function App() {
  const [username, setUsername] = useState<string>("");
  const [usernameSet, setUsernameSet] = useState<boolean>(false);
  // const [isConnected, setIsConnected] = useState(socket.connected);
  // const [lastPong, setLastPong] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  async function getMessages() {
    try {
      setMessages(await (await fetch('http://localhost:8080/messages')).json());
      console.log(await (await fetch('http://localhost:8080/messages')).json())
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    socket.on('connect', () => {
      getMessages();
    });

    // socket.on('disconnect', () => {
    //   setIsConnected(false);
    // });

    socket.on("message-added", (msg: Message[]) => {
      setMessages(msg);
      console.log("messages added!", msg);
    });

    return () => {
      socket.off("connect");
      socket.off("message-added");
    };
  }, []);

  function sendMessage() {
    const newMessage = { username, text: message, date: +new Date() };
    socket.emit("message-added", newMessage);
    setMessage("");
    setMessages([...messages, newMessage]);
  }

  return (
    <div className="w-screen h-screen grid place-items-center rounded">
      <div className="grid grid-rows-[64px,1fr,50px] justify-center w-5/6 grid-cols-1 h-5/6">
        <div className="align-right">
          <p className="text-sm text-white">
            Username
          </p>
          <input
            className="p-2 rounded-tl rounded-bl"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            disabled={usernameSet}
          ></input>
          <button
            className="p-2 text-white font-bold font-2xl bg-green-500 rounded-tr rounded-br"
            onClick={() => {
              if (!username.length) return;

              setUsernameSet(true);
            }}
          >
            Apply
          </button>
        </div>

        <div className="w-full bg-gradient-to-tr from-blue-500 to-green-500 rounded-t-xl py-4 px-2 overflow-y-auto">
          {messages.map(m => (
            <div key={`${m.username}__${m.date}`} className={m.username === username ? "p-2 m-1 bg-purple-400/90 rounded w-2/3 float-right" : "float-left p-2 m-1 bg-white/90 rounded w-2/3"}>
              <div className="text-sm font-bold">{m.username}</div>
              <div className="text-base">{m.text}</div>
            </div>
          ))}
        </div>

        <div className="w-full grid grid-cols-[1fr,150px] rounded-b-xl">
          <input
            className="p-4 rounded-bl-xl"
            value={message}
            placeholder={"Type something"}
            onChange={(e) => setMessage(e.target.value)}
          ></input>
          <button
            className="text-white font-bold font-2xl bg-green-500 rounded-br-xl"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
