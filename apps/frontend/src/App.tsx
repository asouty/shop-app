import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import AccountMenu from "./component/AccountMenu.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Authentication, { AuthMode } from "./component/Authentication.tsx";
import { useState } from "react";
import { isAuthenticated, setToken } from "./hook/Authentication.tsx";
import { routeDefault } from "./hook/Route.tsx";

function App() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [displayedComponent, setDisplayedComponent] = useState(routeDefault());
  const setAuthenticatedW = (token: string) => {
    setToken(token);
    setAuthenticated(isAuthenticated());
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <AccountMenu
                isLoggedIn={authenticated}
                setAuthenticated={setAuthenticatedW}
                setDisplayedComponent={setDisplayedComponent}
              ></AccountMenu>
              {displayedComponent}
            </>
          }
        />
        <Route
          path={AuthMode.signing}
          element={
            <Authentication
              authMode={AuthMode.signing}
              setAuthenticated={setAuthenticatedW}
            />
          }
        />
        <Route
          path={AuthMode.signup}
          element={
            <Authentication
              authMode={AuthMode.signup}
              setAuthenticated={setAuthenticatedW}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
