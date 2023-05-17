import "../src/store/actions";
import {ThunkDispatch} from "redux-thunk";
import {ActionCreator, Action, AnyAction} from "redux";
import {RootState} from "../src/store/index";
import {OpenWeatherAPI, Location, CurrentWeather} from "openweather-api-node";
//import {pa} from "@redux-offline/redux-offline"
declare module "../src/store/actions" {
    export interface SetSearchIndex {
       (index : number) : AnyAction; 
    }
    export interface getGeoCoding {
        (query : string) : (dispatch : ThunkDispatch<RootState,{}, AnyAction>, getState : ()=> RootState, WeatherAPI : OpenWeatherAPI) => void;
      }
      export interface getGeoCodingByZip {
        (zipCode : string) : (dispatch : ThunkDispatch<RootState,{}, AnyAction>, getState : ()=> RootState, WeatherAPI : OpenWeatherAPI) => void;
      }
      export interface getReverseGeoCoding {
        (latlon : string) : (dispatch : ThunkDispatch<RootState,{}, AnyAction>, getState : ()=> RootState, WeatherAPI : OpenWeatherAPI) => void;
      }

    export type GeoCodingResponse = Location;
    interface GeoCodingPayload {
      type: string,
      payload: any,
      meta: {
        offline: {
          // the network action to execute:
          effect: { url: string },
          // action to dispatch when effect succeeds:
          commit: { type: string, meta: object },
          // action to dispatch if network action fails permanently:
          rollback: { type: string, meta: object }
        }
      }
    }
  
    export interface failGeoCoding {
      (error : string) : GeoCodingPayload
    }
    export interface setGeoCoding {
      (LatLon : number[][], Names : string[]) : GeoCodingPayload 
    }

    export type WeatherResponse = CurrentWeather;
    export interface getWeatherData {
      (index : number) : (dispatch : ThunkDispatch<RootState,{}, AnyAction>, getState : ()=> RootState, WeatherAPI : OpenWeatherAPI) => void;
    }

    interface WeatherDataPayload {
      type: string,
      payload: any,
      meta: {
        offline: {
          // the network action to execute:
          effect: { url: string},
          // action to dispatch when effect succeeds:
          commit: { type: string, meta: object },
          // action to dispatch if network action fails permanently:
          rollback: { type: string, meta: object }
        }
      }
    }
  
    export interface failWeatherData {
      (error: string) : WeatherDataPayload
    }
    export interface setWeatherData {
      (data : WeatherResponse, index : number) : WeatherDataPayload 
    }
}