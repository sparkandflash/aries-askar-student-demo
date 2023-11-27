import { createStore, applyMiddleware, compose } from "redux";
import SLReducers from "../reducers/index";
import { sampleMiddleware } from "../middleware";
import thunk from "redux-thunk";
const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  SLReducers,
  storeEnhancers(applyMiddleware(sampleMiddleware, thunk))
);
export default store;