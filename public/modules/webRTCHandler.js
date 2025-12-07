console.log("================== WebRTCHandler File ==================");
//=============================================================================================//
// Import modules
import * as uiUtils from "./uiUtils.js";
import { DOM } from "./uiUtils.js";
import * as constants from "./constants.js";
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
// Step. 1
const webRTCConfiguration = {
  iceServers: [
    {
      urls: [
        "stun:stun.1.google.com:19302",
        // "stun:stun2.1.google.com:19302",
        // "stun:stun3.1.google.com:19302",
        // "stun:stun4.1.google.com:19302",
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
  // Step. 2
  DOM.offeror.offerorCreatePcButton.addEventListener("click", (e) => {
    // The "createPeerConnectionObject" function is on line 50 //
    createPeerConnectionObject();
    // UI update
    uiUtils.updateUIButton(
      uiUtils.DOM.offeror.offerorCreatePcButton,
      "Step 2: now add the type of data to your PC object"
    );
    console.log(
      "Local Description (null): after creating a peer connection: ",
      pc.localDescription
    );
  });
}
//=============================================================================================//

//================================= createPeerConnectionObject ================================//
// Create a users local peer connection object by invoking the RTCPeerConnection Object
function createPeerConnectionObject() {
  // This creates a RTCPeerConnection object that will handle this peers entire webRTC session
  pc = new RTCPeerConnection(webRTCConfiguration);
  // Then register event listeners
  // #1 Listen for webRTC connection state change event(Goal is the "connected" state change)
  pc.addEventListener("connectionstatechange", (e) => {
    console.log(e);
    console.log("Connection state changed to: ", pc.connectionState);
    if (pc.connectionState === "connected") {
      alert("A webRTC connection has been established between you and the other peer");
      uiUtils.logToCustomConsole(
        `Connection state change to ${pc.connectionState}`,
        null,
        true,
        constants.myColors.green
      );
      // Later update UI to remove all learning buttons and allow users to insert text
    }
  });
  // #2 Listen for webRTC signaling state change event
  pc.addEventListener("signalingstatechange", (e) => {
    uiUtils.logToCustomConsole(
      `Signaling state changed to : ${pc.signalingState}`,
      null,
      true,
      constants.myColors.orange
    );
  });
  // Return out of this function
  return uiUtils.logToCustomConsole(
    "You have successfully created a PC object",
    constants.myColors.green
  );
}
//=============================================================================================//
