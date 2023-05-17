import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container'
import ProgressBar from 'react-bootstrap/ProgressBar';
import {useAppDispatch, useAppSelector} from "../helpers/hooks"
import {CloudFill, CloudFogFill,CloudLightningRainFill, CloudRainFill, CloudRainHeavyFill, CloudSnowFill,CloudSunFill, CloudsFill, CloudyFill} from 'react-bootstrap-icons';
import {SunFill, Sunrise, Wind, Water} from 'react-bootstrap-icons';
import {Thermometer, ThermometerHalf, ThermometerLow, ThermometerHigh, ThermometerSnow, ThermometerSun} from "react-bootstrap-icons";

export default function WeatherWidget(props : WeatherProps) {
  const WeatherData = useAppSelector((state)=>state.weatherData);
  const Index = useAppSelector((state)=>state.filters.currentIndex);
  const NamesArray = useAppSelector((state)=>state.names);
  const LatLonArray = useAppSelector((state)=>state.latlon);


  let CloudIcon = CloudFill;
  let ThermometerIcon = Thermometer;
  let ThermometerColor = "red";
  let Names: string | undefined ="";
  let latlon : number[] | undefined = [];
  if(typeof Index === "number" && Index >= 0 && NamesArray.some((val, index)=> index === Index) == true && LatLonArray.some((val, index)=> index === Index) == true){
    Names = NamesArray.at(Index);
    latlon = LatLonArray.at(Index);
  }

  switch (WeatherData?.weather.icon.raw) {
    case "01d":
      CloudIcon = SunFill;
      break;
      case "02d":
        CloudIcon = CloudSunFill;
        break;
        case "03d":
          CloudIcon = CloudyFill;
          break;
          case "04d":
            CloudIcon = CloudsFill;
            break;
            case "09d":
              CloudIcon = CloudRainHeavyFill;
              break;
              case "10d":
                CloudIcon = CloudRainFill;
                break;
                case "11d":
                  CloudIcon = CloudLightningRainFill;
                  break;
                  case "13d":
                    CloudIcon = CloudSnowFill;
                    break;
                    case "50d":
                      CloudIcon = CloudFogFill;
                      break;
    default:
      break;
  }

  if(WeatherData?.weather.temp && WeatherData?.weather.temp.cur){
    if(WeatherData?.weather.temp.cur > 325){
      ThermometerIcon = ThermometerHigh;
      ThermometerColor = "red";
    } if(WeatherData?.weather.temp.cur > 310){
      ThermometerIcon = ThermometerSun;
      ThermometerColor = "orange";
    } else if(WeatherData?.weather.temp.cur > 298){
      ThermometerIcon = ThermometerHalf;
      ThermometerColor = "white";
    } else if(WeatherData?.weather.temp.cur < 298 && WeatherData?.weather.temp.cur > 285){
      ThermometerIcon = ThermometerSnow;
      ThermometerColor = "grey";
    } else if(WeatherData?.weather.temp.cur < 285 ){
      ThermometerIcon = ThermometerLow;
      ThermometerColor = "grey";
    }
  }

    return (
      <Card 
      bg="primary"
      key="Primary"
      text="white"
      style={{ width: '65%' }} className="mx-2 mt-5">
        <Card.Header> 
        <Container className="d-sm-flex flex-row">
            <Container className="d-lg-flex flex-row mb-3 mt-2">
            <CloudIcon color="white" size={96} className="d-flex flex-column"/>
              <Container className="d-flex flex-column mx-lg-3  mt-2">
              <Card.Title>{WeatherData?.weather.main}</Card.Title>
              <Card.Text>{WeatherData?.weather.description}</Card.Text>
           
              { WeatherData && WeatherData?.weather.conditionId < 600 ? (
              <Card.Text><small>{`Rain Vol. ${WeatherData?.weather.rain ?? "0"} mm`}</small></Card.Text>) : 
              WeatherData && WeatherData?.weather.conditionId < 700  ?(
              <Card.Text><small>{`Snow Vol. ${WeatherData?.weather.snow ?? "0"} mm`}</small>
              </Card.Text>) : (<Card.Text>
              <small>{`Wind Speed ${WeatherData?.weather.wind.speed ?? "0"} m/s`}</small><br/>
              <small>{`Wind Gust ${WeatherData?.weather.wind.gust ?? "0"} m/s`}</small><br/>
              <small>{`Wind Deg ${WeatherData?.weather.wind.deg ?? "0"} \u00b0deg`}</small><br/>
              </Card.Text>) }
           
              
              </Container>
            </Container>
            <Container className="d-lg-flex flex-row mb-3 mt-2">
            <ThermometerIcon color={ThermometerColor} size={96} className="d-flex flex-column" />
              <Container className="d-flex flex-column mx-lg-3 mt-2">
              <Card.Title>{`${WeatherData?.weather.temp.cur} ${ WeatherData ? "Kelvin (" + (WeatherData?.weather.temp.cur -273.15).toFixed(0) + "\u00b0C)" : ""}`}</Card.Title>
              <Container className='d-flex flex-row'>
              <Water color='blue' size={26}/>
                <Card.Text className='px-2'>{`${WeatherData?.weather.humidity} %`}</Card.Text>
              </Container>
              <Container className='d-flex flex-row'>
              <Wind color='white' size={26}/>
                <Card.Text className='px-2'>{`${WeatherData?.weather.pressure} hPa`}</Card.Text>
              </Container>
 
              </Container>
            </Container>
        </Container>
        </Card.Header>
        <Card.Body>
          <Card.Title>{Names}</Card.Title>
          <Card.Text>
            {latlon !== undefined ? `Your current location is :${latlon[0]},${latlon[1]}` : `No location found`}
          </Card.Text>
        </Card.Body>
      </Card>
    );
  };