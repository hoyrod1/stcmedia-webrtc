console.log("================== WebRTCHandler File ==================");
//====================================== Import modules ======================================//
import * as uiUtils from "./uiUtils.js";
// import { DOM } from "./uiUtils.js";
import * as constants from "./constants.js";
import * as ws from "./ws.js";
//=================================== END OF Import modules ===================================//

//====================================== GLOBAL VARIABLES =====================================//
// Define a global local peer connection object variable called "pc"
// The "pc" variable will contain everything we need to establish a WebRTC connection
let pc;
// We will set the dataChannel up when we create a peer connection
let dataChannel;
// Array of ice candidates
const iceCandidatesGenerated = [];
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
  // DEFINE FUNCTION SCOPED VARIABLE
  let offer;
  //-------------------------------------------------------------------------------//
  uiUtils.logToCustomConsole(
    "Step1. Create a WebRTC peer connectiong object by clicking on the first button"
  );
  //-------------------------------------------------------------------------------//
  // Step. 2
  uiUtils.DOM.offeror.offerorCreatePcButton.addEventListener("click", (e) => {
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
    // Run the createDataChannel function
    createDataChannel(true);
    uiUtils.updateUIButton(
      uiUtils.DOM.offeror.offerorAddDataTypeButton,
      "Now create your WebRTC Offer"
    );
    // Console log the Peer Connection object
    console.log("Your pc object: after creating a data channel", pc);
  });
  //-------------------------------------------------------------------------------//
  // Step 5 - create an offer
  uiUtils.DOM.offeror.offerorCreateOfferButton.addEventListener("click", async (e) => {
    offer = await pc.createOffer(); // This is a promise
    uiUtils.logToCustomConsole(
      "Successfully created an offer check the browsers console",
      constants.myColors.green
    );
    // Console log the offer
    console.log("Here is your offer: ", offer);
    uiUtils.updateUIButton(
      uiUtils.DOM.offeror.offerorCreateOfferButton,
      "Now you have to update you local peer connection object with your offer"
    );
  });
  //-------------------------------------------------------------------------------//
  // Step 6 - Adding offer to offeror PeerConnection object
  // NOTE STEP 7 IS IN THE createPeerConnectionObject() FUNCTION
  uiUtils.DOM.offeror.offerorSetLocalDescriptionButton.addEventListener(
    "click",
    async (e) => {
      // console.log(e);
      // Set local Description
      await pc.setLocalDescription(offer);
      // Update the UI button
      uiUtils.updateUIButton(
        uiUtils.DOM.offeror.offerorSetLocalDescriptionButton,
        "You must now send your offer to the other peer"
      );
      // Console log the Peer Connection object
      console.log(
        "Your pc object: after adding your offer to your peer connection object",
        pc
      );
      // Ice candidates will be gathered by the browser
    }
  );
  //-------------------------------------------------------------------------------//
  // Step 8 - Send offer to signaling server
  uiUtils.DOM.offeror.offerorSendOfferButton.addEventListener("click", (e) => {
    // console.log(e);
    ws.sendOffer(offer);
    // Update the UI button
    uiUtils.updateUIButton(
      uiUtils.DOM.offeror.offerorSendOfferButton,
      "The Offer has been sent, now waiting for an answer..."
    );
  });
  //-------------------------------------------------------------------------------//
}
//================================= END OF startWebRTCProcess =================================//

//================================= createPeerConnectionObject ================================//
// Create a users local peer connection object by invoking the RTCPeerConnection Object
function createPeerConnectionObject() {
  //-----------------------------------------------------------------------------------------//
  // This creates a RTCPeerConnection object that will handle this peers entire webRTC session
  pc = new RTCPeerConnection(webRTCConfiguration);
  //-----------------------------------------------------------------------------------------//
  // Then register event listeners
  // #1 Listen for webRTC connection state change event(Goal is the "connected" state change)
  pc.addEventListener("connectionstatechange", (e) => {
    // console.log(e);
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
  //-----------------------------------------------------------------------------------------//
  // #2 Listen for webRTC signaling state change event
  pc.addEventListener("signalingstatechange", (e) => {
    uiUtils.logToCustomConsole(
      `Signaling state changed to : ${pc.signalingState}`,
      null,
      true,
      constants.myColors.orange
    );
  });
  //-----------------------------------------------------------------------------------------//
  // Step 7 - Listening for ice candidates
  // #3 Listen for ice candidates generation
  pc.addEventListener("icecandidate", (e) => {
    uiUtils.logToCustomConsole(
      `Ice candidate has been generated by the browser`,
      null,
      true,
      constants.myColors.blue
    );
    if (e.candidate) {
      console.log("Ice candidate: ", e.candidate);
      iceCandidatesGenerated.push(e.candidate);
    }
  });
  //-----------------------------------------------------------------------------------------//
  // Return out of this function
  return uiUtils.logToCustomConsole(
    "You have successfully created a PC object",
    constants.myColors.green
  );
  //-----------------------------------------------------------------------------------------//
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

//========================================= handleOffer =========================================//
export function handleOffer(data) {
  // console.log(data);
  let answer;
  uiUtils.logToCustomConsole(
    "WebRTC offer received, created your peer connection object"
  );
  // Show the button to the peer
  uiUtils.showOffereeButtons();
  // This is steps 13 and 14
  // Add event listening to the learning buttons
  uiUtils.DOM.offeree.offereeCreatePcButton.addEventListener("click", (e) => {
    // console.log(e);
    // Create Peer Object
    createPeerConnectionObject();
    // UI changes
    uiUtils.updateUIButton(
      uiUtils.DOM.offeree.offereeCreatePcButton,
      "Next register an event listener on 'pc' object for the data channel"
    );
  });
  // This is steps 15 and 16
  uiUtils.DOM.offeree.offereeAddDataTypeButton.addEventListener("click", (e) => {
    // console.log(e)
    createDataChannel(false); // Passing in false to ensure that a new "Datachannel Object" is not created
    // UI changes
    uiUtils.updateUIButton(
      uiUtils.DOM.offeree.offereeAddDataTypeButton,
      "Now you can update your 'pc object' by setting the remote description "
    );
    // console.log("=====", pc);
  });
  // This is steps 17
  uiUtils.DOM.offeree.offereeSetRemoteDescriptionButton.addEventListener(
    "click",
    async (e) => {
      // console.log(e)
      // Set Remote Description
      await pc.setRemoteDescription(data.offer);
      //  UI changes
      uiUtils.updateUIButton(
        uiUtils.DOM.offeree.offereeSetRemoteDescriptionButton,
        "Next create your answer"
      );
    }
  );
  // This is steps 18
  uiUtils.DOM.offeree.offereeCreateAnswerButton.addEventListener("click", async (e) => {
    // console.log(e)
    answer = await pc.createAnswer();
    uiUtils.logToCustomConsole(
      "Succefully created an answer, you can view it in the console",
      constants.myColors.green
    );
    console.log("Offereree's answer: ", answer);
    //  UI changes
    uiUtils.updateUIButton(
      uiUtils.DOM.offeree.offereeCreateAnswerButton,
      "Next update your local description with your that answer"
    );
  });
  // This is steps 19
  uiUtils.DOM.offeree.offereeSetLocalDescriptionButton.addEventListener(
    "click",
    async (e) => {
      // console.log(e)
      // Setting Local Description with the answer
      await pc.setLocalDescription(answer);
      // UI changes
      uiUtils.updateUIButton(
        uiUtils.DOM.offeree.offereeSetLocalDescriptionButton,
        "Send your answer to PEER1"
      );
    }
  );
  // Step 20
  uiUtils.DOM.offeree.offereeSendAnswerButton.addEventListener("click", (e) => {
    // console.log(e)
    ws.sendAnwser(answer);
    // UI changes
    uiUtils.updateUIButton(
      uiUtils.DOM.offeree.offereeSendAnswerButton,
      "Your answer has been sent, don't forget to send ice candidates"
    );
    // Show Ice Candidate button
    uiUtils.DOM.offeree.offereeIceButton.classList.remove("hidden");
    uiUtils.DOM.offeree.offereeIceButton.classList.add("show-ice");
  });
  // Add event listener to the Ice Button
  uiUtils.DOM.offeree.offereeIceButton.addEventListener("click", (e) => {
    // console.log(e);
    ws.sendIceCandidates(iceCandidatesGenerated);
    uiUtils.logToCustomConsole("Ice Candidates Sent");
    uiUtils.logToCustomConsole(
      "🧊 🧊 🧊 Waiting to recieve Ice Candidates from the other PEER 🧊 🧊 🧊"
    );
    // UI changes
    uiUtils.updateUIButton(
      uiUtils.DOM.offeree.offereeIceButton,
      "You are all done, wait for the other side"
    );
  });
}
//====================================== END OF handleOffer =====================================//

//========================================= handleAnswer ========================================//
export function handleAnswer(data) {
  // console.log(data);
  uiUtils.logToCustomConsole("Änswer received, send your ice candadtes");
  uiUtils.DOM.offeror.offerorIceButton.classList.remove("hidden");
  uiUtils.DOM.offeror.offerorIceButton.classList.add("show-ice");
  uiUtils.DOM.offeror.offerorIceButton.addEventListener("click", (e) => {
    // console.log(e);
    ws.sendIceCandidates(iceCandidatesGenerated);
    uiUtils.updateUIButton(
      uiUtils.DOM.offeror.offerorIceButton,
      "Finally set your remote description"
    );
    // Show the setRemoteDescription button
    uiUtils.DOM.offeror.offerorSetRemoteDescriptionButton.classList.remove("hidden");
  });
}
//===================================== END OF handleAnswer =====================================//

//===================================== handleIceCandidates =====================================//
// export function handleIceCandidates(data) {
//   console.log(data);
// }
//================================== END OF handleIceCandidates =================================//
