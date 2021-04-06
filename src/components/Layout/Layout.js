import React from "react";
import {
  Route,
  Switch,
  Redirect,
  withRouter,
} from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// components
import Header from "../Header";
import Sidebar from "../Sidebar";

// context
import { useLayoutState } from "../../context/LayoutContext";
import { AddPlayer } from "../../pages/AddPlayer/AddPlayer";
import { AddMatch } from "../../pages/CreateMatch/CreateMatch";
import { Matches } from "../../pages/Matches/Matches";
import { CreateTeam } from "../../pages/CreateTeam/CreateTeam";
import { PickTeam } from "../../pages/PickTeam/PickTeam";
import { ScoreBoard } from "../../pages/Scoreboard/Scoreboard";
import Typography from "@material-ui/core/Typography";

function Layout(props) {
  var classes = useStyles();
  var userData = props.userData;

  // global
  var layoutState = useLayoutState();

  return (
    <div className={classes.root}>
        <>
          <Header history={props.history} />
          <Sidebar isAdmin={userData.isAdmin}/>
          <div
            className={classnames(classes.content, {
              [classes.contentShift]: layoutState.isSidebarOpened,
            })}
          >
            <div className={classes.fakeToolbar} />
            <Switch>
              <AdminRoute path="/app/AddPlayer" component={AddPlayer}/>
              <AdminRoute path="/app/AddMatch" component={AddMatch}/>
              <Route path="/app/Matches" render = {(props) =>  <Matches userData={userData}/>}/>
              <AdminRoute path="/app/AddTeam" component={CreateTeam}/>
              <Route path="/app/SetTeam" render={(props) => <PickTeam userData={userData}/>}/>
              <Route path="/app/scoreboard" component={ScoreBoard}/>
            </Switch>
          </div>
        </>
    </div>
  );

  function AdminRoute({ component, prop, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          userData.isAdmin ? (
            React.createElement(component, prop)
          ) : (
            <Redirect
              to={{
                pathname: "/",
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
}



export default withRouter(Layout);
