//================ This file is to keep all states related to our user ================//
console.log("======= (state.js) file is to keep all states related to our user =======");
// The state object stores the "userId" and "userWebSocketConnection".
let state = {
  userId: null,
  userWebSocketConnection: null,
  roomName: null,
};
// The generic "setState()" setter function is for our state object above
// This is used below in the "setUserId()" function
const setState = (newState) => {
  // This updates the state object above
  state = {
    ...state,
    ...newState,
  };
};
// set the "state" object "userId" property with the new value
export const setUserId = (userId) => {
  setState({ userId });
};
// set the "state" object "userWebSocketConnection" property for the user
export const setWsConnection = (wsConnection) => {
  setState({ userWebSocketConnection: wsConnection });
};
// set the "state" object "roomName" property with the new value
export const setRoomName = (roomName) => {
  setState({ roomName });
};
// Reset the "state" object "roomName" property back to null
export const resetState = () => {
  setState({ roomName: null });
};
// Define the getter for a "state{}" object
export const getState = () => {
  return state;
};
