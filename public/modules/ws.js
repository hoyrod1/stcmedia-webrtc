import * as state from "./state.js";
import * as uiUtils from "./uiUtils.js";
import * as constants from "./constants.js";
//=================================================================================================//

//======================================= registerSocketEvent =====================================//
// EVENT LISTIENERS THAT THE Websocket object gives us
export function registerSocketEvent(wsClientConnection) {
  //-------------------------------------------------------------------------//
  // Update the state object in "state.js" file with this "wsClientConnection"
  state.setWsConnection(wsClientConnection);
  //-------------------------------------------------------------------------//

  //-------------------------------------------------------------------------//
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
  //-------------------------------------------------------------------------//
}
//================================================================================================//

//========================================== handleClose =========================================//
function handleClose(closeEventObject) {
  // console.log(closeEventObject);
  uiUtils.logToCustomConsole(
    `You have been disconnected from our web socket server, with a code: ${closeEventObject.code}`,
    null,
    true,
    constants.myColors.red
  );
}
//=================================================================================================//

//========================================== handleError ==========================================//
function handleError(errorMessage) {
  uiUtils.logToCustomConsole(
    `An error occured on our web socket server: ${errorMessage}`,
    constants.myColors.red
  );
}
//=================================================================================================//

//*************************************** OUTGOING MESSAGES ***************************************//
//============================================ joinRoom ===========================================//
// Outgoing: join room
export function joinRoom(roomName, userId) {
  const message = {
    label: constants.labels.NORMAL_SERVER_PROCESS,
    data: {
      type: constants.type.ROOM_JOIN.REQUEST,
      roomName,
      userId,
    },
  };
  state.getState().userWebSocketConnection.send(JSON.stringify(message));
}
//=================================================================================================//

//*************************************** INCOMING MESSAGES ***************************************//
//========================================= handleMessage ========================================//
function handleMessage(messageObject) {
  const message = JSON.parse(messageObject);
  // Process message depending on its label
  switch (message.label) {
    case constants.labels.NORMAL_SERVER_PROCESS:
      normalServerProcessing(message.data);
      break;

    default:
      console.log("Unknown server processing label: ", message.label);
      break;
  }
}
//================================================================================================//

//==================================== normalServerProcessing ====================================//
function normalServerProcessing(data) {
  // Process the data depending on the data type
  switch (data.type) {
    // Successfully joined room
    case constants.type.ROOM_JOIN.RESPONSE_SUCCESS:
      joinSuccessHandler(data);
      break;
    // Successfully joined room
    case constants.type.ROOM_JOIN.RESPONSE_FAILURE:
      uiUtils.logToCustomConsole(data.message, constants.myColors.red);
      break;
    // Joined room - notification
    case constants.type.ROOM_JOIN.RESPONSE_FAILURE:
      joinNotificationHandler(data);
      break;
    // Catch-all
    default:
      console.log("Unknown data type: ", data.type);
      break;
  }
}
//================================================================================================//

//====================================== joinSuccessHandler ======================================//
function joinSuccessHandler(data) {
  state.setOtherUserId(data.creatorsId);
}
//================================================================================================//
