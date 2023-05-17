import "../src/store/reducer";
import {CurrentWeather} from "openweather-api-node";
//import {pa} from "@redux-offline/redux-offline"
declare module "../src/store/reducer" {

  export interface State {
    names: string[],
    latlon : number[][],
    // end
    weatherData :CurrentWeather | null,
    filters: {
      currentIndex : number | null,
      failureMessage : string | null,
      isOffline : boolean,
      isWarning : boolean,
      isDanger : boolean,
    },
  }
}