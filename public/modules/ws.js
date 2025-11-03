import * as state from "./state.js";
import * as uiUtils from "./uiUtils.js";
import * as constants from "./constants.js";
// EVENT LISTIENERS THAT THE Websocket object gives us
export function registerSocketEvent(wsClientConnection) {
  //======================================================================================//
  // Update the state object in "state.js" file with this "wsClientConnection"
  state.setWsConnection(wsClientConnection);
  //======================================================================================//

  //======================================================================================//
  // Listen for the 4 events
  // 1. (onpen) event
  // 2. (onmessage) event
  // 3. (onclose) event
  // 4. (onerror) event
  wsClientConnection.onopen = () => {
    // Tell the user that they have connected with our ws server
    uiUtils.logToCustomConsole("You have connected to our web socket server!");
    // Register the remaining events
    wsClientConnection.onmessage = handleMessage;
    wsClientConnection.onclose = handleClose;
    wsClientConnection.onerror = handleError;
  };
}

function handleMessage(messageObject) {
  console.log(messageObject);
}

function handleClose(closeEventObject) {
  uiUtils.logToCustomConsole(
    `You have been disconnected from our web socket server: ${closeEventObject}`,
    null,
    true,
    constants.myColors.red
  );
}

function handleError(errorMessage) {
  uiUtils.logToCustomConsole(
    `An error occured on our web socket server: ${errorMessage}`,
    constants.myColors.red
  );
}
