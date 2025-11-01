//================ This file is to keep all states related to our user ================//
console.log("======= (state.js) file is to keep all states related to our user =======");
// The state object stores the "userId" and "userWebSocketConnection".
let state = {
  userId: null,
  userWebSocketConnection: null,
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
// set the userId
export const setUserId = (userId) => {
  setState({ userId });
};
// set the ws object state for the user
export const setWsConnection = (wsConnection) => {
  setState({ userWebSocketConnection: wsConnection });
};
