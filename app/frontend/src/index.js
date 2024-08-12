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
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

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
            <div style={{ textAlign: "center", paddingBottom: "20px" }}>


              <IconButton onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </div>
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
