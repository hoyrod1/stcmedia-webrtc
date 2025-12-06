console.log("================== WebRTCHandler File ==================");
//=============================================================================================//
// Import modules
//=============================================================================================//
import * as uiUtils from "./uiUtils.js";
//=============================================================================================//
// Set up global variables
//=============================================================================================//
// Define a global local peer connection object variable called "pc"
// The "pc" variable will contain everything we need to establish a WebRTC connection
let pc;
//=============================================================================================//

//=============================================================================================//
// We will set this up when we create a peer connection
let dataChannel;
//=============================================================================================//

//=============================================================================================//
const webRTCConfiguration = {
  iceServers: [
    {
      urls: [
        "stun:stun.1.google.com:19302",
        "stun:stun2.1.google.com:19302",
        "stun:stun3.1.google.com:19302",
        "stun:stun4.1.google.com:19302",
      ],
    },
  ],
};
//=============================================================================================//

//==================================== startWebRTCProcess =====================================//
export function startWebRTCProcess() {
  uiUtils.logToCustomConsole(
    "Step1. Create a WebRTC peer connectiong object by clicking on the first button"
  );
}
//=============================================================================================//
