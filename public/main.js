console.log("==================== Insanity Check For main.js ====================");
//================================================================================//
import * as uiUtils from "./modules/uiUtils.js";
import { DOM } from "./modules/uiUtils.js";
import * as ws from "./modules/ws.js";
import * as ajax from "./modules/ajax.js";
import * as state from "./modules/state.js";
//================================================================================//

//================================= unique userId ================================//
// Generate a unique user code
const userId = Math.round(Math.random() * 1000000);
//  Initialize the DOM
uiUtils.initializeUI(userId);
//================================================================================//

//============================== WebSocketConnection =============================//
//  Establish a WebSocketConnection
const wsClientConnection = new WebSocket(`/?userId=${userId}`);
// pass all of our websocket logic to another module
ws.registerSocketEvent(wsClientConnection);
//================================================================================//

//============================ Peer1 createRoomButton ============================//
// Register eventlistener to "createRoomButton"
DOM.createRoomButton.addEventListener("click", roomButton);
function roomButton(e) {
  // console.log(e);
  const roomName = uiUtils.DOM.inputRoomNameElement.value;
  if (!roomName) {
    return alert("Your room needs a name!");
  }
  uiUtils.logToCustomConsole(
    `WS server is checking to see if ${roomName} is avaiable, please standby....`
  );
  ajax.createRoom(roomName, userId);
}
//================================================================================//

//============================ Peer1 destroyRoomButton ===========================//
// Destroying the room (before the second peer has entered the room)
DOM.destroyRoomButton.addEventListener("click", destroyRoom);
function destroyRoom(e) {
  // console.log(e);
  const roomName = state.getState().roomName;
  ajax.destroyRoomAjax(roomName);
}
//================================================================================//

//================================ Peer2 joinRoom ================================//
// Peer2 join room
DOM.joinRoomButton.addEventListener("click", joinRoom);
function joinRoom(e) {
  // console.log(e);
  const roomName = DOM.inputRoomNameElement.value;
  if (roomName) {
    return alert("You have to join a room with a valid name!");
  }
  ws.joinRoom(roomName, userId);
}
//================================================================================//
