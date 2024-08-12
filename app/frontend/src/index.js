import React, { useState } from "react";
import ReactDOM from "react-dom";
import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
// import configureStore from "./store";
import store from './store';
import { darkTheme, lightTheme } from "./theme/theme";
import messages from "./locales/messages.json"
import { CssBaseline, ThemeProvider } from "@mui/material";
import Button from '@mui/material/Button'; // For demonstration purposes

// const store = configureStore();


const Main = () => {
  const [locale, setLocale] = useState("en");
  const [mode, setMode] = useState('light');

  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <BrowserRouter>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App setLocale={setLocale} locale={locale} />
            <Button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>Toggle Theme</Button>
          </ThemeProvider>
        </Provider>
      </BrowserRouter>
    </IntlProvider>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById("root")
);
