import "../src/components/WeatherWidget";
import {FunctionComponent,ReactElement} from "react";
//import {pa} from "@redux-offline/redux-offline"
declare module "../src/components/WeatherWidget" {
    export interface WeatherProps {
        
    }
  export default interface WeatherWidget<FunctionComponent> {
    (props: WeatherProps, context?: any): ReactElement<any, any> | null;
  }
}