import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MarketingApp from './components/marketingApp'
import Header from './components/Header'
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles';


const generateClassName = createGenerateClassName({
  productionPrefix: 'co', 

})

export default () => {
  return (
    <BrowserRouter>
    <StylesProvider generateClassName={generateClassName}>
      <div>
        <Header />
        <MarketingApp />
      </div>
      </StylesProvider>
    </BrowserRouter>
  );
};
