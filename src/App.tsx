import React, { useState,ReactNode} from 'react';

import { Navbar } from 'react-bootstrap';
import Toast from 'react-bootstrap/Toast';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import AsyncSearchBar from "./components/AsyncTypeAhead";
import {useAppSelector} from "./helpers/hooks"
import WeatherWidget from "./components/WeatherWidget";
import './App.css';

interface Props {
  children?: ReactNode
  // any props that come into the component
}


const App = () => {
  const isOffline = useAppSelector((state)=>state.filters.isOffline);
  const isWarning = useAppSelector((state)=>state.filters.isWarning);
  const isDanger = useAppSelector((state)=>state.filters.isDanger);
  const failureMessage = useAppSelector((state)=>state.filters.failureMessage);
  
  return (
  <>
  <Navbar>
  <Container>
    <Navbar.Brand href="#home">WeatherApps</Navbar.Brand>
    <Navbar.Toggle />
    <Navbar.Collapse className="justify-content-end">
      <Navbar.Text>
        Status: { isOffline == false ? <small className='text-success'>Online</small> : <small className='text-danger'>Offline</small>}
      </Navbar.Text>
    </Navbar.Collapse>
  </Container>
</Navbar>
  <Container className="p-3">

      <h6 className="header">Welcome,</h6>
      <p className="description">Use Location to find latest Weather Update</p>
      <AsyncSearchBar/>
      {failureMessage != null ? 
      (<Alert className='mt-4' key={isWarning == true ? "warning" : isDanger == true ? "danger" : "primary"} variant={isWarning == true ? "warning" : isDanger == true ? "danger" : "primary"}>
         {failureMessage}
        </Alert>) : (<WeatherWidget/>) }
  </Container>
  </>
)};

export default App;
