import { combineReducers } from "redux";
import { CanvasReducers } from "./CanvasReducers";
import { CropperReducers } from "./CropperReducers";
import { TransformationsReducers } from "./TransformationsReducer";


const reducers = combineReducers({
  Canvas: CanvasReducers,
  Cropper: CropperReducers,
  Transformations: TransformationsReducers,
});


export default reducers;