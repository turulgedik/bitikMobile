import React from 'react';
import {Provider} from 'react-redux'
import store from './src/redux/store'
import MyRouter from './src/MyRouter'

export default function App() {
  return (
    <Provider store={store}>
      <MyRouter />
    </Provider>
  );
}
