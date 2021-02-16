import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import rootReducer from "./reducers";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { BrowserRouter as Router } from "react-router-dom";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
const enhancer = composeWithDevTools();
const store = createStore(rootReducer, enhancer);

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
