import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect, useHistory } from "react-router-dom";

// components
import Layout from "./Layout";

// pages
import Error from "../pages/error";
import Login from "../pages/login";

import api from "../apiservice"

// context

export default function App() {
  // global
  var session = localStorage.getItem("session");
  var [isAuthenticated, setIsAuthenticated] = useState(false);
  var [userData, setUserData] = useState({});
  var [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  const getSession = async () => {
    let res = undefined;
    if(session)
      res = await api.getUserData();
    return res;
  };

  useEffect( () => {
    let res = getSession().then(res => {
      if(res && res.data.user) {
        setIsAuthenticated(true);
        setUserData(res.data.user);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setIsAuthenticated(false);
      }
    }).catch(e => {
      setIsAuthenticated(false);
      setIsLoading(false);
    });
  }, []);

  console.log("hi");
  return (
    isLoading ? <div>Loading</div> :
    <Router>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/app/scoreboard" />} />
        <Route
          exact
          path="/app"
          render={() => <Redirect to="/app/Scoreboard" />}
        />
        <PrivateRoute path="/app" component={Layout} prop={{userData: userData}}/>
        <PublicRoute path="/login" component={Login} prop={{historyData :history}}/>
        <Route component={Error} />
      </Switch>
    </Router>
  );

  // #######################################################################

  function PrivateRoute({ component, prop, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            React.createElement(component, prop)
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: {
                  from: props.location,
                },
              }}
            />
          )
        }
      />
    );
  }

  function PublicRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            <Redirect
              to={{
                pathname: "/",
              }}
            />
          ) : (
            React.createElement(component, props)
          )
        }
      />
    );
  }
}
