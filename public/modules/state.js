// This file is to keep all states related to our user
console.log("==================== Insanity Check For state.js ====================");
// The state object stores the user ID.
let state = {
  userId: null,
};
// Generic setter function for our state object
const setState = (newState) => {
  state = {
    ...state,
    ...newState,
  };
};
// set the userId
export const setUserId = (userId) => {
  setState({ userId });
};
