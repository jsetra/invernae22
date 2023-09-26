const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const WebSocket = require("websocket").server;
require("dotenv").config();
const dbConnect = require("./config/mongo");
const { sendRandomData } = require('./web_socket/web_socket_logic');
const app = express();
const cors = require("cors");
const { router } = require("./routes");
const path = require("path");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const swaggerSpec = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node invernaderos UP",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: [`${path.join(__dirname, "./routes/*.js")}`],
};

app.use(cors());
const port = process.env.PORT || 5000;

app.use(express.json());

app.use("/api", router);
app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)));

// Crear un servidor HTTP
const server = http.createServer(app);

// Conectar el servidor WebSocket al mismo servidor HTTP
const wsServer = new WebSocket({
  httpServer: server,
});

// Manejar las conexiones WebSocket
wsServer.on("request", (request) => {
    const connection = request.accept(null, request.origin);
  
    // Enviar datos al cliente cada segundo
    const intervalId = setInterval(() => {
      sendRandomData(connection); // Llama a la función importada
    }, 2000);
  
    // Manejar el cierre de la conexión
    connection.on("close", () => {
      clearInterval(intervalId);
    });
  });
  

// Iniciar el servidor HTTP en el puerto 5000
server.listen(port, () => {
  console.log(`Listening at ${port}`);
});

// Conectar a la base de datos MongoDB
dbConnect();
