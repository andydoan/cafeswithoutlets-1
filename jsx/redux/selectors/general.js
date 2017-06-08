const checkForNesting = (state) => state["GENERAL"] || state;

export const selectCoffeeShopsLoading = (state) => checkForNesting(state)["coffee_shops"].loading;

export const selectCoffeeShopsData = (state) => checkForNesting(state)["coffee_shops"].data;

export const selectCoffeeShopsError = (state) => checkForNesting(state)["coffee_shops"].error;