import * as state from "./state.js";
import * as uiUtils from "./uiUtils.js";
import * as constants from "./constants.js";
import * as webRTCHandler from "./webRTCHandler.js";
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

//******************************** BEGINNING OF OUTGOING MESSAGES *********************************//
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

//============================================ exitRoom ===========================================//
export function exitRoom(roomName, userId) {
  const message = {
    label: constants.labels.NORMAL_SERVER_PROCESS,
    data: {
      type: constants.type.ROOM_EXIT.REQUEST,
      roomName,
      userId,
    },
  };
  state.getState().userWebSocketConnection.send(JSON.stringify(message));
}
//=================================================================================================//

//=========================================== sendOffer ===========================================//
export function sendOffer(offer) {
  console.log(offer);
  const message = {
    label: constants.labels.WEBRTC_PROCESS,
    data: {
      type: constants.type.WEB_RTC.OFFER,
      offer,
      otherUserId: state.getState().otherUserId,
    },
  };
  // Send Websocket message
  state.getState().userWebSocketConnection.send(JSON.stringify(message));
}
//=================================================================================================//

//=========================================== sendAnswer ==========================================//
// Sending an answer back to the signaling server
export function sendAnwser(answer) {
  console.log(answer);
  const message = {
    label: constants.labels.WEBRTC_PROCESS,
    data: {
      type: constants.type.WEB_RTC.ANSWER,
      answer,
      otherUserId: state.getState().otherUserId,
    },
  };
  // Send Websocket message
  state.getState().userWebSocketConnection.send(JSON.stringify(message));
}
//=================================================================================================//

//======================================= sendIceCandidates =======================================//
// Sending Ice Candidates to the other PEER
export function sendIceCandidates(arrayOfIceCandidates) {
  // console.log(iceCandidates);
  const message = {
    label: constants.labels.WEBRTC_PROCESS,
    data: {
      type: constants.type.WEB_RTC.ICE_CANDIDATES,
      candidatesArray: arrayOfIceCandidates,
      otherUserId: state.getState().otherUserId,
    },
  };
  // Send Websocket message
  state.getState().userWebSocketConnection.send(JSON.stringify(message));
}
//=================================================================================================//
//********************************** ENDING OF OUTGOING MESSAGES **********************************//

//********************************** BEGINNING INCOMING MESSAGES *********************************//
//========================================= handleMessage ========================================//
function handleMessage(incomingMessageEventObject) {
  // console.log(messageObject.data);
  const message = JSON.parse(incomingMessageEventObject.data);
  // Process message depending on its label
  switch (message.label) {
    // Normal Server Process
    case constants.labels.NORMAL_SERVER_PROCESS:
      normalServerProcessing(message.data);
      break;
    // WEBRTC Server Process
    case constants.labels.WEBRTC_PROCESS:
      webRTCServerProcessing(message.data);
      break;

    default:
      console.log("Unknown server processing label: ", message.label);
      break;
  }
}
//================================================================================================//
//------------------------------------------------------------------------------------------------//

//------------------------------------------------------------------------------------------------//
//==================================== normalServerProcessing ====================================//
function normalServerProcessing(data) {
  // Process the data depending on the data type
  switch (data.type) {
    // Successfully joined room
    case constants.type.ROOM_JOIN.RESPONSE_SUCCESS:
      joinSuccessHandler(data);
      break;
    // Failure to join room
    case constants.type.ROOM_JOIN.RESPONSE_FAILURE:
      uiUtils.logToCustomConsole(data.message, constants.myColors.red);
      break;
    // Joined room - notification
    case constants.type.ROOM_JOIN.NOTIFY:
      joinNotificationHandler(data);
      break;
    // Exit room - notification
    case constants.type.ROOM_EXIT.NOTIFY:
      exitNotificationHandler(data);
      break;
    // Disconnection - notification
    case constants.type.ROOM_DISCONNECTION.NOTIFY:
      exitNotificationHandler(data);
      break;
    // Catch-all
    default:
      console.log("Unknown data type: ", data.type);
  }
}
//================================================================================================//

//==================================== webRTCServerProcessing ====================================//
function webRTCServerProcessing(data) {
  console.log(data);
  switch (data.type) {
    // Steps 11 & 12, The "offer" has been received
    case constants.type.WEB_RTC.OFFER:
      webRTCHandler.handleOffer(data);
      break;

    default:
      console.log("Unknown data type: ", data);
      break;
  }
}
//================================================================================================//
//------------------------------------------------------------------------------------------------//

//------------------------------------------------------------------------------------------------//
//====================================== joinSuccessHandler ======================================//
// User successfully joined the room
function joinSuccessHandler(data) {
  state.setOtherUserId(data.creatorId);
  state.setRoomName(data.roomName);
  uiUtils.joineeToProceedToRoom();
  // Start the webRTC process
  webRTCHandler.startWebRTCProcess();
}
//================================================================================================//

//=================================== joinNotificationHandler ====================================//
function joinNotificationHandler(data) {
  // console.log(data);
  alert(`User ${data.joinUserId} has joined your room`);
  state.setOtherUserId(data.joinUserId);
  uiUtils.logToCustomConsole(
    `${data.joinUserId} has joined your room: (${data.message})`,
    constants.myColors.green
  );
  uiUtils.updateCreatorsRoom();
}
//================================================================================================//

//=================================== exitNotificationHandler ====================================//
function exitNotificationHandler(data) {
  uiUtils.logToCustomConsole(data.message, constants.myColors.red);
  uiUtils.updateUiForRemainingUser();
}
//================================================================================================//
//*********************************** ENDING INCOMING MESSAGES ***********************************//
