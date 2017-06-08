import generalintialState from './initial_state.js';
import { handleActions } from 'redux-actions';
import { createAction } from 'redux-actions';


const generalActions = (type) => `GENERAL/${type}`;

// ACTION TYPES
const GET_COFFEE_SHOPS = generalActions('GET_COFFEE_SHOPS');

const GET_COFFEE_SHOPS_START = generalActions('GET_COFFEE_SHOPS_START');
const GET_COFFEE_SHOPS_SUCCESS = generalActions('GET_COFFEE_SHOPS_SUCCESS');
const GET_COFFEE_SHOPS_FAILED = generalActions('GET_COFFEE_SHOPS_FAILED');

// ACTIONS

const getCoffeeShopsStart = createAction(GET_COFFEE_SHOPS_START);
const getCoffeeShopsSuccess = createAction(GET_COFFEE_SHOPS_SUCCESS);
const getCoffeeShopsFail = createAction(GET_COFFEE_SHOPS_FAILED);

// THUNK'D ACTIONS
export const getCoffeeShops = (dispatch, getState) => {
  dispatch(getCoffeeShopsStart);
  axios.get('http://138.197.133.223:5000', {
    params: {
      address: "33 Bay Street"
    }
  })
  .then(res => {
    dispatch(getCoffeeShopsSuccess({ data: res.data }));
  })
  .catch(err => {
    dispatch(getCoffeeShopsFail({ error: err.message }));
  });
};

const generalReducers = {
  [GET_COFFEE_SHOPS_START]: (state) => {
    const coffeeShopsObj = state["coffee_shops"];
    const newCoffeeShopObj = Object.assign({}, coffeeShopsObj, { loading: true })

    return Object.assign({}, state, { coffee_shops: newCoffeeShopObj });
  },
  [GET_COFFEE_SHOPS_SUCCESS]: (state, { payload }) => {
    const coffeeShopsObj = state["coffee_shops"];
    const newCoffeeShopObj = Object.assign({}, coffeeShopsObj, {
      data: payload.data,
      loading: false,
      error: ""
    })

    return Object.assign({}, state, { coffee_shops: newCoffeeShopObj });
  },
  [GET_COFFEE_SHOPS_FAILED]: (state, { payload }) => {
    const coffeeShopsObj = state["coffee_shops"];
    const newCoffeeShopObj = Object.assign({}, coffeeShopsObj, {
      error: payload.error || "Something went wrong when getting coffee shops",
      loading: false,
      data: []
    })

    return Object.assign({}, state, { coffee_shops: newCoffeeShopObj });
  }
}

export default handleActions(generalReducers, generalintialState)