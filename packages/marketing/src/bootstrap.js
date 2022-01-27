import React from 'react';
import ReactDOM  from 'react-dom';
import App from './App';

//Mount function to startup app

const mount = (el) => {
    ReactDOM.render(
        <App/>,
        el
    )
}



//If we are in development or isolocation call mount immediatly
if(process.env.NODE_ENV == 'development') {
    const devRoot = document.querySelector('#_marketing-dev-root')

    if(devRoot) {
        mount(devRoot)
    }
}

//If we running through container export mount
export {mount}