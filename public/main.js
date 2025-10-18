console.log("==================== Insanity Check For main.js ====================");
import * as uiUtils from "./modules/uiUtils.js";
// Generate a unique user code
const userId = Math.round(Math.random() * 1000000);
//  Initialize the DOM
uiUtils.initializeUI(userId);
