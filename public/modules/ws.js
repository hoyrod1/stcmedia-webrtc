import * as state from "./state.js";
import * as uiUtils from "./uiUtils.js";
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
    // Register the remaining events
    wsClientConnection.onmessage = handleMessage;
    wsClientConnection.onclose = handleClose;
    wsClientConnection.onerror = handleError;
  };
}
