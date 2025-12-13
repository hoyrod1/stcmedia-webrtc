console.log("================== WebRTCHandler File ==================");
//====================================== Import modules ======================================//
import * as uiUtils from "./uiUtils.js";
import { DOM } from "./uiUtils.js";
import * as constants from "./constants.js";
//=================================== END OF Import modules ===================================//

//====================================== GLOBAL VARIABLES =====================================//
// Define a global local peer connection object variable called "pc"
// The "pc" variable will contain everything we need to establish a WebRTC connection
let pc;
// We will set the dataChannel up when we create a peer connection
let dataChannel;
//================================== END OF GLOBAL VARIABLES ==================================//

//==================================== webRTCConfiguration ====================================//
// Step. 1
const webRTCConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun.1.google.com:19302"],
    },
  ],
};
//================================= END OF webRTCConfiguration ================================//

//==================================== startWebRTCProcess =====================================//
export function startWebRTCProcess() {
  //-------------------------------------------------------------------------------//
  uiUtils.logToCustomConsole(
    "Step1. Create a WebRTC peer connectiong object by clicking on the first button"
  );
  //-------------------------------------------------------------------------------//
  // Step. 2
  DOM.offeror.offerorCreatePcButton.addEventListener("click", (e) => {
    // The "createPeerConnectionObject" function is on line 50 //
    createPeerConnectionObject();
    // UI update
    uiUtils.updateUIButton(
      uiUtils.DOM.offeror.offerorCreatePcButton,
      "Step 2: now add the type of data exchange to your PeerConnection object"
    );
    // Console log message to the browser
    console.log(
      "Local Description (null): after creating a peer connection: ",
      pc.localDescription
    );
  });
  //-------------------------------------------------------------------------------//
  // Step 3 & 4
  uiUtils.DOM.offeror.offerorAddDataTypeButton.addEventListener("click", (e) => {
    // console.log(e);
    // Run the createDataChannel function
    createDataChannel(true);
    uiUtils.updateUIButton(
      uiUtils.DOM.offeror.offerorAddDataTypeButton,
      "Now create your WebRTC Offer"
    );
    console.log("Your pc object: after creating a data channel", pc);
  });
}
//================================= END OF startWebRTCProcess =================================//

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
//============================= END OF createPeerConnectionObject =============================//

//===================================== createDataChannel =====================================//
function createDataChannel(isOfferor) {
  if (isOfferor) {
    // Only need to create a data channel when a offer is established
    // To mimic UDP type transport on our data channel set the "ordered" property to false and maxRetransmit to 0
    const dataChannelOptions = {
      ordered: false,
      maxRetransmits: 0,
    };
    dataChannel = pc.createDataChannel("top-secret-chat-room", dataChannelOptions);
    // This function adds event listeners to the data channel
    registerDataChannelEventListener();
    uiUtils.logToCustomConsole(
      "Successfully created a data channel and added it to your PeerConnection object",
      constants.myColors.green
    );
  } else {
    // If this else is executed, we are dealing with the offerree
    // The receiver needs to register a ondatachannel listener
    // This will only fire once a valid webrtc connection has been established
    pc.ondatachannel = (e) => {
      dataChannel = e.channel;
      registerDataChannelEventListener();
      uiUtils.logToCustomConsole(
        "Successfully registered the ondatachannel event listener to your PeerConnection object",
        constants.myColors.green
      );
    };
  }
}
//================================== END OF createDataChannel =================================//

//============================== registerDataChannelEventListener =============================//
function registerDataChannelEventListener() {
  dataChannel.addEventListener("message", (e) => {
    console.log("Message has been recieved from a data channel");
    // Later, we can implement logoc to add the message to the users frontend
  });
  dataChannel.addEventListener("close", (e) => {
    console.log("Data channel has been closed");
  });
  dataChannel.addEventListener("open", (e) => {
    console.log(
      "Data channel has been opened, you are ready to send and receive messages over your data channel"
    );
  });
}
//=========================== END OF registerDataChannelEventListener ===========================//
