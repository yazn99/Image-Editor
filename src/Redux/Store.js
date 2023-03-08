import { createStore, applyMiddleware } from "redux";
import reducers from "./Reducers";
const thunkMiddleware= require('redux-thunk').default;
const store = createStore(
    reducers, applyMiddleware(thunkMiddleware)
  );
export default store;