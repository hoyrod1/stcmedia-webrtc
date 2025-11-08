// Import modules
import http from "http"; // Native module
import express from "express";
import { WebSocketServer } from "ws";
import * as constants from "./constants.js";
// Define a port for live and testing environments
const PORT = process.env.PORT || 8080;
// initialize the expess aplication
const app = express();
app.use(express.static("public"));
// Create a HTTP server and pass our express aplication to the server
const server = http.createServer(app);
//======================================================================================//

//======================================================================================//
// Define global connection array that will contain objects
const connections = [
  // This will contain objects that contain {ws_connection, userId}
];
//======================================================================================//

//======================================================================================//
// Define state for our rooms
const rooms = [
  // Will contain objects containing {roomName, peer1, peer2}
];
//======================================================================================//

//======================================================================================//
// Serve static html file
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/public/index.html");
});
//  Room creation using the POST request
app.post("/create-room", (req, res) => {
  // Parse the body of the incoming request
  let body = "";
  // "Data"
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  // "End"
  req.on("end", () => {
    // extract the variables from our body
    const { roomName, userId } = JSON.parse(body);
    // Check if room already exist
    const existingRoom = rooms.find((room) => {
      room.roomName === roomName;
    });
    // Check if "existingRoom" has a been created already
    if (existingRoom) {
      // If a room has already been created send a failure message back to the client
      const failureMessage = {
        data: {
          type: constants.type.ROOM_CHECK.RESPONSE_FAILURE,
          message: "That room has already been created, try another name or join",
        },
      };
      res.status(400).json(failureMessage);
    } else {
      // The room does not exist so we have to add it to the rooms array
      rooms.push({
        roomName,
        peer1: userId,
        peer1: null,
      });
      // Send a success message to the client
      const successMessage = {
        data: {
          type: constants.type.ROOM_CHECK.RESPONSE_SUCCESS,
          message: "The room has successfully been created",
        },
      };
      res.status(200).json(successMessage);
    }
  });
});
//============================= THE END OF CREATING A ROOM =============================//

//======================================================================================//
// Serve static html file
// app.get("/secret", (req, res) => {
//   res.send("This is magic");
// });
//======================================================================================//

// ========================= Set up the websocket server setup ======================== //
// Mount the web socket server to the http server
const wss = new WebSocketServer({ server });
//======================================================================================//

//======================================================================================//
// Web sockets have 4 events
// 1. (onconnection) event
// 2. (onmessage) event
// 3. (onclose) event
// 4. (onerror) event
wss.on("connection", (ws, req) => handleConnection(ws, req));
//======================================================================================//

//======================================================================================//
function handleConnection(ws, req) {
  //------------------------------------------------------------------------------------//
  const userId = extractUserId(req);
  console.log(`The users ID: ${userId} is connected to the WS server`);
  //------------------------------------------------------------------------------------//

  //------------------------------------------------------------------------------------//
  // Update our "connection" array
  addConnection(ws, userId);
  //------------------------------------------------------------------------------------//
  //========== Register all 3 event listners, "message", "close" and "error" ===========//
  // "message"
  ws.on("message", (data) => handleMessage(data));
  //------------------------------------------------------------------------------------//
  // "close"
  ws.on("close", () => handleDisconnection(userId));
  //------------------------------------------------------------------------------------//
  // "error"
  ws.on("error", () => console.log("An error has occured"));
  //------------------------------------------------------------------------------------//
}
//======================================================================================//

//=================================== addConnection() ==================================//
function addConnection(ws, userId) {
  connections.push({
    wsConnection: ws,
    userId,
  });
  console.log(`Total connected users: ${connections.length}`);
}
//======================================================================================//

//=================================== extractUserId() ==================================//
function extractUserId(req) {
  const queryParam = new URLSearchParams(req.url.split("?")[1]);
  return Number(queryParam.get("userId"));
}
//======================================================================================//

//=================================== handleMessage() ==================================//
function handleMessage(data) {
  try {
    // Handle logic later
  } catch (error) {
    console.log("Failed to parse message: ", error);
    return;
  }
}
//======================================================================================//

//================================ handleDisconnection() ===============================//
function handleDisconnection(userId) {
  // Find the index of the connetion associated with the uder ID
  const connectionIndex = connections.findIndex((conn) => conn.userId === userId);
  // If the user ID is not found in the connection array log an error and exit the function
  if (connectionIndex === -1) {
    console.log(`User: ${userId} was not found!`);
    return;
  }
  // Remove the user's connection from the active connection array
  connections.splice(connectionIndex, 1);
  // Provide feedback
  console.log(`User: ${userId} was removed from connection`);
  console.log(`Total connected users: ${connections.length}`);
}
//======================================================================================//

//======================================================================================//
// APPLICATION LISTENING ON PORT 9000//
server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
//======================================================================================//
