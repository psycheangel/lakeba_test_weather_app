import {isJsonString} from "../helpers/JsonDecode";

export const SetSearchIndex : SetSearchIndex = index => {
    return {
      type : "SET_SEARCH_INDEX",
      payload : index,
    }
};

export const getGeoCoding: getGeoCoding = query => {
  return (dispatch, getState , WeatherAPI ) => {
    WeatherAPI.getAllLocations(query).then((data : GeoCodingResponse[])=>{
     
      if(data && typeof data === "object" && Array.isArray(data) === true && data.length > 0 ){
        let ArrayLatLon :  number[][]= [];
        const _getLatLng = (previousValue: number[][], currentValue : GeoCodingResponse) =>  {
          if(currentValue && currentValue.hasOwnProperty("lat") && currentValue.hasOwnProperty("lon")){
            previousValue.push([currentValue.lat,currentValue.lon]);
          }
          return previousValue;
        }
        ArrayLatLon = data.reduce(_getLatLng, ArrayLatLon); 
  
        let ArrayName :  string[]= [];
        const _getNames = (previousValue: string[], currentValue : GeoCodingResponse) =>  {
          if(currentValue && currentValue.hasOwnProperty("lat") && currentValue.hasOwnProperty("lon")){
            previousValue.push(currentValue.name);
          }
          return previousValue;
        }
        ArrayName = data.reduce(_getNames, ArrayName); 
  
        dispatch(setGeoCoding(ArrayLatLon, ArrayName));
      } else {
        console.log("geocoding 1");
        dispatch(failGeoCoding("Location Not Found"));  
      }
    }).catch((error : Error)=>{
      
      if(isJsonString(error.message)){
        let msgData = JSON.parse(error.message);
        if(msgData.hasOwnProperty("message")){
          dispatch(failGeoCoding(msgData.message));
        } else {
          dispatch(failGeoCoding("Failure in service to check data"));
        }
        
      } else {
        if(error.message === "Failed to fetch"){
          dispatch({ type: "FAILED_FETCH" });
        } else {
          dispatch(failGeoCoding(error.message));
        }
        
      }
    })
  };
};

export const getGeoCodingByZip: getGeoCodingByZip = zipCode => {
  return (dispatch, getState , WeatherAPI ) => {
    WeatherAPI.getLocation({zipCode : zipCode}).then((data)=>{
      if(data){
        dispatch(setGeoCoding([[data.lat, data.lon]], [data.name]));
      } else {
        dispatch(failGeoCoding("zipCode Not Found"));  
      }
      
    }).catch((error : Error)=>{

      if(isJsonString(error.message)){
        let msgData = JSON.parse(error.message);
        if(msgData.hasOwnProperty("message")){
          dispatch(failGeoCoding(msgData.message));
        } else {
          dispatch(failGeoCoding("Failure in service to check data"));
        }
        
      } else {
        if(error.message === "Failed to fetch"){
          dispatch({ type: "FAILED_FETCH" });
        } else {
          dispatch(failGeoCoding(error.message));
        }
      }
      
    })
  };
};

export const getReverseGeoCoding: getReverseGeoCoding = latlon => {
  return (dispatch, getState , WeatherAPI ) => {
    let latlonArr = latlon.split(",");
    WeatherAPI.getLocation({coordinates:{lat: parseFloat(latlonArr[0]), lon: parseFloat(latlonArr[1])}}).then((data : GeoCodingResponse | null | Array<GeoCodingResponse>)=>{
      if(data && typeof data === "object"){
        if(Array.isArray(data) === false && Object.prototype.toString.call(data) !== '[object Array]'){
          let dataObject : GeoCodingResponse = data as GeoCodingResponse;
     
          dispatch(setGeoCoding([[dataObject.lat, dataObject.lon]], [dataObject.name]));
        } else {
          let dataArray : GeoCodingResponse[] = data as GeoCodingResponse[];
            dispatch(setGeoCoding([[dataArray[0].lat, dataArray[0].lon]], [dataArray[0].name]));
          

        }
         
      } else {
        dispatch(failGeoCoding("Coordinate Not Found"));  
      } 
    }).catch((error : Error)=>{
      console.log(error);
      if(isJsonString(error.message)){
        let msgData = JSON.parse(error.message);
        if(msgData.hasOwnProperty("message")){
          dispatch(failGeoCoding(msgData.message));
        } else {
          dispatch(failGeoCoding("Failure in service to check data"));
        }
        
      } else {
        if(error.message === "Failed to fetch"){
          dispatch({ type: "FAILED_FETCH" });
        } else {
          dispatch(failGeoCoding(error.message));
        }
      }
    })
  };
};


const failGeoCoding : failGeoCoding = (error)=>{
  return {
    type: 'FAILURE_GEOCODING',
    payload: error,
    meta: {
      offline: {
        // the network action to execute:
        effect: { url: 'https://api.openweathermap.org/geo/1.0/reverse?lat=-8.68352&lon=115.1762432&limit=1&appid=f7846c170ced9a2f7f8737378b21bb25', method: "GET",},
        // action to dispatch when effect succeeds:
        commit: { type: 'RESTART_APP', meta: {  } },
        // action to dispatch if network action fails permanently:
        rollback: { type: 'ROLLBACK_APP', meta: {  } }
      }
    }
  }
} 
const setGeoCoding : setGeoCoding = (ArrayLatLon : number[][], ArrayNames : string[])=>{
   return {
     type: 'SET_GEOCODING_LIST',
     payload: { LatLonList : ArrayLatLon, NameList : ArrayNames},
     meta: {
       offline: {
         // the network action to execute:
         effect: { url: 'https://api.openweathermap.org/geo/1.0/reverse?lat=-8.68352&lon=115.1762432&limit=1&appid=f7846c170ced9a2f7f8737378b21bb25', method: "GET", },
         // action to dispatch when effect succeeds:
         commit: { type: 'RESTART_APP', meta: {  } },
         // action to dispatch if network action fails permanently:
         rollback: { type: 'ROLLBACK_APP', meta: {  } }
       }
     }
   }
} 

export const getWeatherData: getWeatherData = index => {
  return (dispatch, getState , WeatherAPI ) => {
    let latlon : number[] | undefined = getState().latlon.at(index);
    if(latlon && typeof latlon === "object" && Array.isArray(latlon) === true){
      WeatherAPI.setLocationByCoordinates(latlon[0], latlon[1]);
      WeatherAPI.getCurrent().then((data : WeatherResponse)=>{
        if(data){
          dispatch(setWeatherData(data, index));
        } else {
          dispatch(failWeatherData("Current forecast Not Found"));  
        }
      }).catch((error : Error)=>{
        if(isJsonString(error.message)){
          let msgData = JSON.parse(error.message);
          if(msgData.hasOwnProperty("message")){
            dispatch(failWeatherData(msgData.message));
          } else {
            dispatch(failWeatherData("Failure in service to check data"));
          }
          
        } else {
          if(error.message === "Failed to fetch"){
            dispatch({ type: "FAILED_FETCH" });
          } else {
            dispatch(failWeatherData(error.message));
          }
        }
      });
    } else {
      dispatch(failWeatherData("Failure in service to find current location"));
    }
  };
};

const failWeatherData : failWeatherData = (error)=>{
  return {
    type: 'FAILURE_WEATHERDATA',
    payload: error,
    meta: {
      offline: {
        // the network action to execute:
        effect: { url: 'https://api.openweathermap.org/geo/1.0/reverse?lat=-8.68352&lon=115.1762432&limit=1&appid=f7846c170ced9a2f7f8737378b21bb25', method: "GET",},
        // action to dispatch when effect succeeds:
        commit: { type: 'RESTART_APP', meta: {  } },
        // action to dispatch if network action fails permanently:
        rollback: { type: 'ROLLBACK_APP', meta: {  } }
      }
    }
  }
} 
const setWeatherData : setWeatherData = (data : WeatherResponse, index : number)=>{
   return {
     type: 'SET_WEATHERDATA_LIST',
     payload: {weatherData : {...data,
      dt : data.dt.toISOString(),  
      astronomical:{
        ...data.astronomical,
        sunrise: data.astronomical.sunrise.toISOString(),
        sunset : data.astronomical.sunset.toISOString(),
      }
    }, index : index},
     meta: {
       offline: {
         // the network action to execute:
         effect: { url: 'https://api.openweathermap.org/geo/1.0/reverse?lat=-8.68352&lon=115.1762432&limit=1&appid=f7846c170ced9a2f7f8737378b21bb25', method: "GET",},
         // action to dispatch when effect succeeds:
         commit: { type: 'RESTART_APP', meta: {  } },
         // action to dispatch if network action fails permanently:
         rollback: { type: 'ROLLBACK_APP', meta: {  } }
       }
     }
   }
} 
