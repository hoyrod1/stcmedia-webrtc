// Import modules
import http from "http"; // Native module
import express from "express";
import { WebSocketServer } from "ws";
import * as constants from "./constants.js";
// import { joinRoom } from "./public/modules/ws.js";
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
//======================================================================================//

//========================== THE BEGINNING OF CREATING A ROOM ==========================//
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
      // Always return the value to be passed and used in the variable
      return room.roomName === roomName;
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
        peer2: null,
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

//========================= THE BEGINNING OF DESTROYING A ROOM =========================//
app.post("/destroy-room", (req, res) => {
  // console.log(req);
  // console.log(res);
  // Parse the body of the incoming request
  let body = "";
  // "Data"
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  // "End"
  req.on("end", () => {
    // extract the variables from our body
    const { roomName } = JSON.parse(body);
    // Check if room already exist
    const existingRoomIndex = rooms.findIndex((room) => {
      // Always "return" the value to be passed and used in the variable
      return room.roomName === roomName;
    });
    // Check if the room exist by also comparing "existingRoomIndex" with "-1"
    if (existingRoomIndex !== -1) {
      // If a room wth the "roomName" exist remove it with the "splice()" method
      rooms.splice(existingRoomIndex, 1);
      console.log(
        "Peer1 (in this case is the creator) has left the room and removed from the database before anyone else has joined the room"
      );
      const successMessage = {
        data: {
          type: constants.type.ROOM_DESTR0Y.RESPONSE_SUCCESS,
          message: "The room has been removed from the server",
        },
      };
      return res.status(200).json(successMessage);
    } else {
      const failureMessage = {
        data: {
          type: constants.type.ROOM_DESTR0Y.RESPONSE_FAILURE,
          message: "The server failed to find and or remove the room from the server",
        },
      };
      return res.status(400).json(failureMessage);
    }
  });
});
//============================ THE END OF DESTROYING A ROOM ============================//

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

//================================ wss.on("connection") ================================//
// Web sockets have 4 events
// 1. (onconnection) event
// 2. (onmessage) event
// 3. (onclose) event
// 4. (onerror) event
wss.on("connection", (ws, req) => handleConnection(ws, req));
//======================================================================================//

//================================== handleConnection ==================================//
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
  // Remove a room when a client closes the browser
  rooms.forEach((room) => {
    // Remove the user from the room
    if (room.peer1 === userId) {
      room.peer1 = null;
    }
    if (room.peer2 === userId) {
      room.peer2 = null;
    }
    // Clear the empty room
    if (room.peer1 === null && room.peer2 === null) {
      const roomIndex = rooms.findIndex((roomInArray) => {
        return roomInArray.roomName === room.roomName;
      });
      if (roomIndex !== -1) {
        rooms.splice(roomIndex, 1);
        console.log(`Room ${room.roomName} has been removed!`);
      }
    }
  });
}
//======================================================================================//

//=================================== handleMessage() ==================================//
function handleMessage(data) {
  try {
    // Handle logic later
    let message = JSON.parse(data);
    // process message depending on its label type
    switch (message.label) {
      case constants.labels.NORMAL_SERVER_PROCESS:
        console.log("==== NORMAL SERVER MESSAGE ====");
        normalServerProcessing(message.data);
        break;

      default:
        console.log("Uknown message label:", message.label);
      // break;
    }
  } catch (error) {
    console.log("Failed to parse message: ", error);
    return;
  }
}
//======================================================================================//

//======================================================================================//
// Normal Server
function normalServerProcessing(data) {
  // Process the request depending on the data type
  switch (data.type) {
    case constants.type.ROOM_JOIN.REQUEST:
      joinRoomHandler(data);
      break;

    default:
      console.log("Uknown message label:", data.type);
    // break;
  }
}
//======================================================================================//

//=================================== joinRoomHandler ===================================//
function joinRoomHandler(data) {
  // console.log(data);
  const { roomName, userId } = data;
  const existingRoom = rooms.find((room) => room.roomName === roomName);
  let otherUserId = null;
  //---------------------------------------------------------------------//
  // 1. Check whether the room exist.
  if (!existingRoom) {
    // Send a failure message to the console
    console.log("A user tried to join the room but the room doesn't exist");
    const failureMessage = {
      label: constants.labels.NORMAL_SERVER_PROCESS,
      data: {
        type: constants.type.ROOM_JOIN.RESPONSE_FAILURE,
        message: "The room with that name does not exist",
      },
    };
    // Send a failure response back to the user
    sendWebSocketMessageToUser(userId, failureMessage);
    return;
  }
  //---------------------------------------------------------------------//
  // 2. Check whether the room is full.
  if (existingRoom.peer1 && existingRoom.peer2) {
    // Send a failure message to the console
    console.log("A user tried to join but the room is full");
    const failureMessage = {
      label: constants.labels.NORMAL_SERVER_PROCESS,
      data: {
        type: constants.type.ROOM_JOIN.RESPONSE_FAILURE,
        message: "This room already has two participants",
      },
    };
    // Send a failure response back to the user
    sendWebSocketMessageToUser(userId, failureMessage);
    return;
  }
  //---------------------------------------------------------------------//
  // 3. Allow user to join a room
  // At this point if our code executes the room is both available and exist
  console.log("A user is attempting to enter/join the room");
  if (!existingRoom.peer1) {
    existingRoom.peer1 = userId;
    otherUserId = existingRoom.peer2;
    console.log(`Added user: ${userId} as peer1`);
  } else {
    existingRoom.peer2 = userId;
    otherUserId = existingRoom.peer1;
    console.log(`Added user: ${userId} as peer2`);
  }
  // Send a success message
  const successMessage = {
    label: constants.labels.NORMAL_SERVER_PROCESS,
    data: {
      type: constants.type.ROOM_JOIN.RESPONSE_SUCCESS,
      message: `You have successfully joined room ${existingRoom.roomName}`,
      creatorId: otherUserId,
      roomName: existingRoom.roomName,
    },
  };
  // Send a success response back to the user
  sendWebSocketMessageToUser(userId, successMessage);
  //---------------------------------------------------------------------//
  // 4. Notify the other user that a peer has joined a room
  const notificationMessage = {
    label: constants.labels.NORMAL_SERVER_PROCESS,
    data: {
      type: constants.type.ROOM_JOIN.NOTIFY,
      message: `User: ${userId} has joined room`,
      joinUserId: userId,
    },
  };
  // Sene notification message to the other user
  sendWebSocketMessageToUser(otherUserId, notificationMessage);
  //---------------------------------------------------------------------//
  // Return function
  return;
}
//======================================================================================//

//======================================================================================//
// WebRTC Server
//======================================================================================//

//======================================================================================//
// Websocket server generic function
// Send a message to a specific user
function sendWebSocketMessageToUser(sendToUserId, message) {
  const userConnection = connections.find((connObj) => connObj.userId === sendToUserId);
  if (userConnection && userConnection.wsConnection) {
    userConnection.wsConnection.send(JSON.stringify(message));
    console.log(`Message sent to ${sendToUserId}`);
  } else {
    console.log(`User ${sendToUserId} not found`);
  }
}
//======================================================================================//

//================================= SPIN UP THE SERVER =================================//
// APPLICATION LISTENING ON PORT 9000//
server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
//======================================================================================//
