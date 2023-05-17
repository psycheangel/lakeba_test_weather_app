import {AnyAction} from "redux";
const initialState :State  = {
  names: [],
  latlon : [],
  weatherData : null,
  // end
  filters: {
    currentIndex : null,
    isWarning : false,
    isDanger : false,
    failureMessage : null,
    isOffline : false,
  },
};

// Use the initialState as a default value
export default function appReducer(state = initialState, action : AnyAction) {
  // The reducer normally looks at the action type field to decide what happens
  switch (action.type) {
    case 'SET_GEOCODING_LIST':
      console.log(action.payload.NameList)
      console.log(action.payload.LatLonList)
      return {
        ...state,
        names: action.payload.NameList,
        latlon : action.payload.LatLonList,
        filters:{
          ...state.filters,
          failureMessage : null,
          isWarning : false,
          isDanger : false,
        }
      };
    case 'SET_WEATHERDATA_LIST' :
      return {
        ...state,
        weatherData : action.payload.weatherData,
        filters : {
          ...state.filters,
          currentIndex : action.payload.index,
          failureMessage : null,
          isWarning : false,
          isDanger : false,
        }
      }
    case 'FAILURE_WEATHERDATA':
    case 'FAILURE_GEOCODING' : 
    return {
      ...state,
      filters : {
        ...state.filters,
        failureMessage : action.payload,
        isWarning : true,
        isDanger : false,
      }
    }
    case 'RESTART_APP' :
    if(state.filters.isOffline == true){
      return {
        ...state,
        filters:{
          ...state.filters,
          isOffline :  false,
          isWarning : false,
          isDanger : false,
          failureMessage : null,
        }
      }
    } else {
      return {
        ...state,
        filters:{
          ...state.filters,
        }
      }
    }
      case 'ROLLBACK_APP' :
        return {
          ...state,
          filters:{
            ...state.filters,
            isOffline : true,
            failureMessage : "Network is currently offline",
            isWarning : false,
            isDanger : true,
     
          }
        }
      case 'FAILED_FETCH':
        return {
          ...state,
          filters:{
            ...state.filters,
            isOffline : true,
            failureMessage : "Network is unavailable",
            isWarning : true,
            isDanger : false,
     
          }
        }
    // end
    // Do something here based on the different types of actions
    default:
      // If this reducer doesn't recognize the action type, or doesn't
      // care about this specific action, return the existing state unchanged
      return state;
  }
}
