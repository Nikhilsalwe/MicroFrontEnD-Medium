import React from 'react';
import ReactDOM  from 'react-dom';
import {createMemoryHistory,  createBrowserHistory} from 'history';
import App from './App';

//Mount function to startup app

const mount = (el, {onSignIn, onNavigate, defaultHistory, initialPath}) => {
    const history = defaultHistory || createMemoryHistory({
        initialEntries: [initialPath]
    });

    if(onNavigate) {
        history.listen(onNavigate)
    }
    ReactDOM.render(
        <App onSignIn={onSignIn} history={history}/>,
        el
    )

    /**
     * This is help to keep track from child to container app
     */
    return {
        onParentNavigate({pathname: nextPathname}) {

            const {pathname} = history.location; // this is current path in browser

            if (pathname !== nextPathname) {
                history.push(nextPathname)
            }
        }
    }
}



//If we are in development or isolocation call mount immediatly
if(process.env.NODE_ENV == 'development') {
    const devRoot = document.querySelector('#_auth-dev-root')

    /**
     * To run in isolation is browser history
     */
    if(devRoot) {
        mount(devRoot, {defaultHistory: createBrowserHistory()})
    }
}

//If we running through container export mount
export {mount}