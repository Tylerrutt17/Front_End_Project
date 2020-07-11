import makemap from "./map.js";
import fetchStates from "./fetchStates.js";

const callback = data => {
    console.log(data)
    makemap(data);
    // This is where we start the map
}
fetchStates(callback)