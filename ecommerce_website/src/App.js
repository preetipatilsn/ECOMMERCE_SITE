import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import './App.css';

import Header from './components/header/Header';
import Home from './components/pages/Home';
import Store from './components/pages/Store';
import About from './components/pages/About';
import Footer from './components/footer/Footer';
import ContactUs from './components/pages/ContactUs';

import { ShowCartContextProvider } from './components/store/showCart-Context';

function App() {
  const productsArr = [
    {
      title: 'Colors',
      price: 100,
      imageUrl:'https://prasadyash2411.github.io/ecom-website/img/Album%201.png',
    },

    {
      title: 'Black and white Colors',
      price: 50,
      imageUrl:'https://prasadyash2411.github.io/ecom-website/img/Album%202.png',
    },

    {
      title: 'Yellow and Black Colors',
      price: 70,
      imageUrl:'https://prasadyash2411.github.io/ecom-website/img/Album%203.png',
    },

    {
      title: 'Blue Color',
      price: 100,
      imageUrl:'https://prasadyash2411.github.io/ecom-website/img/Album%204.png',
    },
  ];

  return (
    <React.Fragment>
      <ShowCartContextProvider>
        <Header />
      </ShowCartContextProvider>

      <Route path=''>
        <Redirect to='/home' />
      </Route>

      <Route path='/home'>
        <Home />
      </Route>

      <ShowCartContextProvider>
        <Route path='/store'>
          <Store productList={productsArr} />
        </Route>
      </ShowCartContextProvider>

      <Route path='/about'>
        <About />
      </Route>

      <Route path='/contact'>
        <ContactUs />
      </Route>
      
      <Footer />
    </React.Fragment>
  );
}

export default App;






