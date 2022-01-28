import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
// import MarketingApp from './components/marketingApp'
// import Authapp from './components/authApp'
import {createBrowserHistory} from 'history'
import Progress from './components/Progress'
import Header from './components/Header'
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles';

const MarketingApp = lazy(() => import('./components/marketingApp'))
const Authapp = lazy(() => import('./components/authApp'))
const Dashboardapp = lazy(() => import('./components/dashboardApp'))


const generateClassName = createGenerateClassName({
  productionPrefix: 'co',

})

const history = createBrowserHistory()

export default () => {
  const [isSignedIn, setIsSignIn] = useState(false)

  useEffect(() => {
    if(isSignedIn) {
      history.push('/dashboard')
    }
  }, [isSignedIn])
  return (
    <Router history={history}>
      <StylesProvider generateClassName={generateClassName}>
        <div>
          <Header onSignOut={() => setIsSignIn(false)} isSignedIn={isSignedIn}/>
          <Suspense fallback={<Progress/>}>
            <Switch>
              <Route path='/auth'>
                <Authapp onSignIn={() => setIsSignIn(true)} />
              </Route>
              <Route path='/dashboard'>
                {!isSignedIn && <Redirect to='/'/>}
                <Dashboardapp/>
                </Route>
              <Route path='/' component={MarketingApp} />
            </Switch>
          </Suspense>
        </div>
      </StylesProvider>
    </Router>
  );
};
