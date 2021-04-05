import React from "react";
import {
  Route,
  Switch,
  Redirect,
  withRouter,
} from "react-router-dom";
import classnames from "classnames";
import {Box, IconButton, Link} from '@material-ui/core'
import Icon from '@mdi/react'

//icons
import {
  mdiFacebook as FacebookIcon,
  mdiTwitter as TwitterIcon,
  mdiGithub as GithubIcon,
} from '@mdi/js'

// styles
import useStyles from "./styles";

// components
import Header from "../Header";
import Sidebar from "../Sidebar";

// pages
import Dashboard from "../../pages/dashboard";
import Typography from "../../pages/typography";
import Notifications from "../../pages/notifications";
import Maps from "../../pages/maps";
import Tables from "../../pages/tables";
import Icons from "../../pages/icons";
import Charts from "../../pages/charts";

// context
import { useLayoutState } from "../../context/LayoutContext";
import { AddPlayer } from "../../pages/AddPlayer/AddPlayer";
import { AddMatch } from "../../pages/CreateMatch/CreateMatch";
import { Matches } from "../../pages/Matches/Matches";
import { CreateTeam } from "../../pages/CreateTeam/CreateTeam";
import { PickTeam } from "../../pages/PickTeam/PickTeam";
import { ScoreBoard } from "../../pages/Scoreboard/Scoreboard";

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
              <Route path="/app/AddPlayer" component={AddPlayer}/>
              <Route path="/app/AddMatch" component={AddMatch}/>
              <Route path="/app/Matches" component={Matches}/>
              <Route path="/app/AddTeam" component={CreateTeam}/>
              <Route path="/app/SetTeam" render={(props) => <PickTeam userData={userData}/>}/>
              <Route path="/app/scoreboard" component={ScoreBoard}/>
            </Switch>
          </div>
        </>
    </div>
  );
}

export default withRouter(Layout);
