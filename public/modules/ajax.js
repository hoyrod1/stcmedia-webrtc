import { response } from "express";
import * as uiUtils from "./uiUtils.js";
import * as constants from "./constants.js";

// Send AJAX request to create a new room using the fetch API
export function createRoom(roomName, userId) {
  fetch("/create-room", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roomName, userId }),
  })
    .then((response) => response.JSON())
    .then((resObj) => {})
    .catch((error) => {
      console.log(`An error ocurred trying to create a room: ${error}`);
      uiUtils.logToCustomConsole(
        `There was a error trying tot create a room: ${error}`,
        constants.myColors.red
      );
    });
}

async function create(roomName, userId) {
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
