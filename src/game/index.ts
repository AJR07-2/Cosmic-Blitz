import Display from "../display/display";

export let display: Display | null = null;
export let setDisplay = (newDisplay: Display) => {
    display = newDisplay;
};
