import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Reader from './pages/Reader'
import ActivateAccount from './pages/ActivateAccount'
import Home from './pages/Home'


import HorizontalMenu from './Components/Menu/Horizontal'

export default function Routes(){
    return (
       <div className='routes-container'>
        
        <BrowserRouter>
            
            <Switch>
                <Route path="/reader" exact component ={Reader}/>
                <Route path="/" exact component ={Home}/>
                <Route path="/activateaccount" exact component ={ActivateAccount}/>
            </Switch>
          
        <HorizontalMenu/>
        </BrowserRouter>
       </div>
       
    );
}