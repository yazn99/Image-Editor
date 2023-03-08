import { combineReducers } from "redux";
import { TransformationsReducers } from "./TransformationsReducers";


const reducers = combineReducers({
  Transformations: TransformationsReducers,
});


export default reducers;