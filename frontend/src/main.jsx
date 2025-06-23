import React from "react";
import ReactDOM from "react-dom/client";
import './index.css'
import App from './App.jsx'
import { SocketContext } from "./api/SocketContext";
import { socket } from "./api/socket";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SocketContext.Provider value={socket}>
      <App />
    </SocketContext.Provider>
  </React.StrictMode>,
)
