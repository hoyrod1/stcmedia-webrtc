// import { response } from "express";
import * as uiUtils from "./uiUtils.js";
import * as constants from "./constants.js";
import * as state from "./state.js";
//================================================================================//

//================================== createRoom ==================================//
// Send AJAX request to create a new room using the fetch API
export function createRoom(roomName, userId) {
  fetch("/create-room", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roomName, userId }),
  })
    .then((response) => response.json())
    .then((resObj) => {
      // console.log(resObj);
      // console.log(constants.type);
      // Logic for fetch success
      if (resObj.data.type === constants.type.ROOM_CREATE.RESPONSE_SUCCESS) {
        state.setRoomName(roomName);
        uiUtils.logToCustomConsole("Your room was created!", constants.myColors.green);
        uiUtils.logToCustomConsole(
          "Waiting for other peer visitors....",
          constants.myColors.orange
        );
        uiUtils.creatorToProceedToRoom();
      }
      // Logic for fetch failure
      if (resObj.data.type === constants.type.ROOM_CREATE.RESPONSE_FAILURE) {
        uiUtils.logToCustomConsole(resObj.data.message, constants.myColors.red);
      }
    })
    .catch((error) => {
      console.log(`An error ocurred trying to create a room: ${error}`);
      uiUtils.logToCustomConsole(
        `There was a error trying to create a room: ${error}`,
        constants.myColors.red
      );
    });
}
//================================================================================//

//================================================================================//
async function createRoomAjax(roomName, userId) {
  try {
    const response = await fetch("/create-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomName, userId }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${
          errorData.message || "Unknown error"
        }`
      );
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(`There was an error creating a new room: ${error}`);
    throw error;
  }
}
//================================================================================//

//===============================  destroyRoomAjax ===============================//
// Destroying a room before peer 2 has entered
export async function destroyRoomAjax(roomName) {
  fetch("/destroy-room", {
    method: "POST",
    headers: { "Content-Type": "application.json" },
    body: JSON.stringify({ roomName }),
  })
    .then((response) => response.json())
    .then((resObj) => {
      // console.log(resObj);
      // Logic to check for room destroy success
      if (resObj.data.type === constants.type.ROOM_DESTR0Y.RESPONSE_SUCCESS) {
        uiUtils.exitRoom();
        uiUtils.logToCustomConsole(resObj.data.message);
      }
      // Logic to check for room destroy failure
      if (resObj.data.type === constants.type.ROOM_DESTR0Y.RESPONSE_FAILURE) {
        uiUtils.logToCustomConsole(resObj.data.message, constants.myColors.red);
      }
    })
    .catch((error) => {
      console.log(`An error ocurred trying to destroy your room: ${error}`);
      uiUtils.logToCustomConsole(
        `There was a error trying to destroy your room: ${error}`,
        constants.myColors.red
      );
    });
}
//================================================================================//
