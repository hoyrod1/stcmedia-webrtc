console.log("==================== Insanity Check For main.js ====================");
import * as uiUtils from "./modules/uiUtils.js";
import * as ws from "./modules/ws.js";
// Generate a unique user code
const userId = Math.round(Math.random() * 1000000);
//  Initialize the DOM
uiUtils.initializeUI(userId);
//  Establish a WebSocketConnection
const wsClientConnection = new WebSocket(`/?userId=${userId}`);
// pass all of our websocket logic to another module
ws.registerSocketEvent(wsClientConnection);
