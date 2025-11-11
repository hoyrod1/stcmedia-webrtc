console.log("==================== Insanity Check For main.js ====================");
//================================================================================//
//import { initializeUI, DOM } from "./modules/uiUtils.js";
import * as uiUtils from "./modules/uiUtils.js";
import * as ws from "./modules/ws.js";
import * as ajax from "./modules/ajax.js";
import * as state from "./modules/state.js";
//================================================================================//

//================================================================================//
// Generate a unique user code
const userId = Math.round(Math.random() * 1000000);
//  Initialize the DOM
uiUtils.initializeUI(userId);
//================================================================================//

//================================================================================//
//  Establish a WebSocketConnection
const wsClientConnection = new WebSocket(`/?userId=${userId}`);
// pass all of our websocket logic to another module
ws.registerSocketEvent(wsClientConnection);
//================================================================================//

//================================================================================//
// Register eventlistener to "createRoomButton"
uiUtils.DOM.createRoomButton.addEventListener("click", roomButton);
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

//================================================================================//
// Destroying the room (before the second peer has entered the room)
uiUtils.DOM.destroyRoomButton.addEventListener("click", destroyRoom);
function destroyRoom(e) {
  // console.log(e);
  const roomName = state.getState().roomName;
  ajax.destroyRoomAjax(roomName);
}
//================================================================================//
