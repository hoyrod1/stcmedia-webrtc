console.log("==================== Insanity Check For uiUtils.js ====================");
import * as state from "./state.js";
//============================= selecting DOM elements =============================//
const user_session_id_element = document.getElementById("session_id_display");
const infoModalContainer = document.getElementById("info_modal_content_container");
const inputRoomNameElement = document.getElementById("input_room_channel_name");
const roomNameHeadingTag = document.getElementById("room_name_heading_tag");
const LandingPageContainer = document.getElementById("landing_page_container");
const roomInterface = document.getElementById("room_interface");
const messagesContainer = document.getElementById("messages");
const messageInputField = document.getElementById("message_input_field");
const messageInputContainer = document.getElementById("message_input");
const consoleDisplay = document.getElementById("console_display");
//=============================== All the page Buttons ===============================//
const infoModalButton = document.getElementById("info_modal_button");
const closeModalButton = document.getElementById("close");
const joinRoomButton = document.getElementById("join_button");
const createRoomButton = document.getElementById("create_room_button");
const sendMessageButton = document.getElementById("send_message_button");
const destroyRoomButton = document.getElementById("destroy_button");
const exitButton = document.getElementById("exit_button");
//=====================================================================================//

//================================= learning purposes =================================//
//-------------------------------------- offeror --------------------------------------//
const offerorButtonsContainer = document.getElementById("offeror_process_buttons");
const offerorCreatePcButton = document.getElementById("create_pc");
const offerorAddDataTypeButton = document.getElementById("add_data_type");
const offerorCreateOfferButton = document.getElementById("create_offer");
const offerorSetLocalDescriptionButton = document.getElementById(
  "update_local_description"
);
const offerorSendOfferButton = document.getElementById("send_offer");
const offerorSetRemoteDescriptionButton = document.getElementById(
  "set_remote_description"
);
const offerorIceButton = document.getElementById("ice_offeror");
//-------------------------------------------------------------------------------------//

//-------------------------------------- offeree --------------------------------------//
const offereeButtonsContainer = document.getElementById("offeree_process_buttons");
const offereeCreatePcButton = document.getElementById("offeree_create_pc");
const offereeAddDataTypeButton = document.getElementById("offeree_add_data_type");
const offereeSetRemoteDescriptionButton = document.getElementById(
  "offeree_update_remote_description"
);
const offereeCreateAnswerButton = document.getElementById("offeree_create_answer");
const offereeUpdateLocalDescriptionButton = document.getElementById(
  "offeree_update_local_description"
);
const offereeSendAnswerButton = document.getElementById("offeree_send_answer");
const offereeIceButton = document.getElementById("ice_offeree");
//-------------------------------------------------------------------------------------//
//=====================================================================================//

//=============== Exporting all the DOM elements needed in other files ===============//
export const DOM = {
  createRoomButton,
  inputRoomNameElement,
  destroyRoomButton,
  joinRoomButton,
  exitButton,
  offeror: {
    offerorCreatePcButton,
    offerorAddDataTypeButton,
    offerorCreateOfferButton,
    offerorSetLocalDescriptionButton,
  },
};
//====================================================================================//

//================================= ALL UI FUNCTIONS =================================//
//=================================== initializeUI ===================================//
// Initialize UI events as soon as the user enters page
export function initializeUI(userId) {
  user_session_id_element.innerHTML = `Your session id is: ${userId}`;
  state.setUserId(userId);
  // Set up modal functionality
  setUpModalEvent();
}
//====================================================================================//

//================================= setUpModalEvent ==================================//
// Initialize UI events as soon as the user enters page
// This "setUpModalEvent()" function runs the "openModal()" and "closeModal()" function
function setUpModalEvent() {
  infoModalButton.onclick = openModal;
  closeModalButton.onclick = closeModal;
  // This event closes the model whenever someone clicks anywhere outside the modal
  window.onclick = function (e) {
    if (e.target === infoModalContainer) {
      closeModal();
    }
  };
}
//====================================================================================//

//==================================== openModal =====================================//
// Logic for opening a modal in the "setUpModalEvent()" function
function openModal() {
  infoModalContainer.classList.add("show");
  infoModalContainer.classList.remove("hide");
}
//====================================================================================//

//==================================== closeModal ====================================//
// Logic for closing a modal in the "setUpModalEvent()" function
function closeModal() {
  infoModalContainer.classList.add("hide");
  infoModalContainer.classList.remove("show");
}
//====================================================================================//

//================================= enterKeyPressed ==================================//
inputRoomNameElement.addEventListener("keypress", enterKeyPressed);
function enterKeyPressed(e) {
  if (e.key === "Enter") {
    // console.log(e.key);
    createRoomButton.click();
  }
}
//====================================================================================//

//============================== creatorToProceedToRoom ==============================//
export function creatorToProceedToRoom() {
  LandingPageContainer.style.display = "none"; // This hides the landing page
  exitButton.classList.add("hide");
  roomInterface.classList.remove("hidden"); // This shows the room interface
  roomNameHeadingTag.textContent = `You are in the ${state.getState().roomName} chat`;
}
//====================================================================================//

//============================== joineeToProceedToRoom ===============================//
export function joineeToProceedToRoom() {
  LandingPageContainer.style.display = "none"; // This hides the landing page
  roomInterface.classList.remove("hidden"); // This shows the room interface
  destroyRoomButton.classList.add("hide");
  roomNameHeadingTag.textContent = `You have entered the ${
    state.getState().roomName
  } chat`;
  messagesContainer.innerHTML = "Please wait... connecting via webRTC";
  // Show the process button for learning and understanding the process
  offerorButtonsContainer.classList.remove("hidden");
  offerorButtonsContainer.classList.add("show");
}
//====================================================================================//

//====================================================================================//
export function updateCreatorsRoom() {
  destroyRoomButton.classList.add("hide");
  exitButton.classList.remove("hide");
  messagesContainer.innerHTML = "Please wait... connecting via webRTC";
}
//====================================================================================//

//===================================== exitRoom =====================================//
export function exitRoom() {
  inputRoomNameElement.value = " "; // Clear the text input field
  LandingPageContainer.style.display = "block"; // This shows the landing page
  roomInterface.classList.add("hidden"); // This hides the room interface
  // Reset state
  state.resetState();
}
//====================================================================================//

//============================= updateUiForRemainingUser =============================//
export function updateUiForRemainingUser() {
  alert("A user has left the room!");
  state.setOtherUserId(null);
  messagesContainer.innerHTML = "Waiting for a peer to join";
  //  Add more logic later
}
//====================================================================================//

//================================ logToCustomConsole ================================//
// Logic to display our custom logger
export function logToCustomConsole(
  message,
  color = "#ffffff",
  highLight = false,
  highLightColor = "#ffff83"
) {
  const messageElementDiv = document.createElement("div");
  messageElementDiv.classList.add("console-message");
  messageElementDiv.textContent = message;
  messageElementDiv.style.color = color;
  if (highLight) {
    messageElementDiv.style.backgroundColor = highLightColor;
    messageElementDiv.style.fontWeight = "bold";
    messageElementDiv.style.padding = "5px";
    messageElementDiv.style.borderRadius = "3px";
    messageElementDiv.style.transition = "background-color 0.5s ease";
  }
  // Append the "messageElementDiv" div to the "consoleDisplay" div
  consoleDisplay.appendChild(messageElementDiv);
  consoleDisplay.scrollTop = consoleDisplay.scrollHeight;
}
//====================================================================================//

//====================================================================================//
// Learning purposes - styling buttons that have been clicked
export function updateUIButton(button, message) {
  // update UI of the button
  button.classList.remove("process_pending");
  button.classList.add("process_complete");
  button.setAttribute("disabled", true);
  logToCustomConsole(message);
}
//====================================================================================//
