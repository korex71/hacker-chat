import SocketServer from "./socket.js";
import Event from "events";
import { constants } from "./constants.js";
import Controller from "./controller.js";

const eventEmitter = new Event();

// async function testServer() {
//   const options = {
//     port: 9898,
//     host: "localhost",
//     headers: {
//       Connection: "Upgrade",
//       Upgrade: "websocket",
//     },
//   };

//   const http = await import("http");
//   const req = http.request(options);
//   req.end();

//   req.on("upgrade", (response, socket) => {
//     socket.on("data", (data) => {
//       console.log("Client received", data.toString());
//     });

//     setInterval(() => {
//       socket.write("Hello");
//     }, 500);
//   });
// }

const port = process.env.PORT || 9898;
const socketServer = new SocketServer({ port });
const server = await socketServer.initialize(eventEmitter);

console.log("Socket server running at", port);

const controller = new Controller({ socketServer });

eventEmitter.on(
  constants.event.NEW_USER_CONNECTED,
  controller.onNewConnection.bind(controller) // Passando escopo do this como controller
);

// await testServer();
