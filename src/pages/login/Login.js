import React, { useState } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  Fade,
} from "@material-ui/core";
import { Redirect, withRouter } from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// logo
import logo from "./logo.svg";
import google from "../../images/google.svg";

// context

import api from "../../apiservice"
import APIService from "../../apiservice";
import { useHistory } from "react-router-dom";


function Login(props) {
  var classes = useStyles();


  // global

  // local
  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(null);
  var [activeTabId, setActiveTabId] = useState(0);
  var [nameValue, setNameValue] = useState("");
  var [loginValue, setLoginValue] = useState("");
  var [passwordValue, setPasswordValue] = useState("");
  var [rollValue, setRollValue] = useState("");
  var [contactValue, setContactValue] = useState("");
  var [errorMessage, setErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let res = await api.login(loginValue, passwordValue);
      let user = res.data.user;
      if(!user){
        setError(true);
        setErrorMessage(res.data.message);
        setIsLoading(false);
      }
      localStorage.setItem("session", user.session);
      setIsLoading(false);
      setIsLoggedIn(true);
      window.location.href = "/";
    } catch (e) {
      setError(true);
      setErrorMessage("Something Went Wrong");
      setIsLoading(false);
      setIsLoggedIn(false);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      let res = await api.register(loginValue, passwordValue, contactValue, nameValue, rollValue);
      if(res.status === 200){
        setActiveTabId(0);
        setIsLoading(false);
        setError(true);
        setErrorMessage(res.data.message);
      }
    } catch (e) {
      setError(true);
      setErrorMessage("Something Went Wrong");
      setIsLoading(false);
    }
  };

  return (
    <Grid container className={classes.container}>
      <div className={classes.formContainer}>
        <img src={"/sportsfetelogo.png"} alt={"logo"} className={classes.logotypeImage}/>
        <div className={classes.form}>
          <Tabs
            value={activeTabId}
            onChange={(e, id) => {setActiveTabId(id); setError(false)}}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Login" classes={{ root: classes.tab }} />
            <Tab label="Register" classes={{ root: classes.tab }} />
          </Tabs>
          {activeTabId === 0 && (
            <React.Fragment>
              <Fade in={error}>
                <Typography color="secondary" className={classes.errorMessage}>
                  {errorMessage}
                </Typography>
              </Fade>
              <TextField
                id="email"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={loginValue}
                onChange={e => setLoginValue(e.target.value)}
                margin="normal"
                placeholder="Email Adress"
                type="email"
                fullWidth
              />
              <TextField
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={passwordValue}
                onChange={e => setPasswordValue(e.target.value)}
                margin="normal"
                placeholder="Password"
                type="password"
                fullWidth
              />
              <div className={classes.formButtons}>
                {isLoading ? (
                  <CircularProgress size={26} className={classes.loginLoader} />
                ) : (
                  <Button
                    disabled={
                      loginValue.length === 0 || passwordValue.length === 0
                    }
                    onClick={(e) =>
                      handleLogin(e)
                    }
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                  >
                    Login
                  </Button>
                )}
              </div>
            </React.Fragment>
          )}
          {activeTabId === 1 && (
            <React.Fragment>
              <Fade in={error}>
                <Typography color="secondary" className={classes.errorMessage}>
                  {errorMessage}
                </Typography>
              </Fade>
              <TextField
                id="name"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={nameValue}
                onChange={e => setNameValue(e.target.value)}
                margin="normal"
                placeholder="Full Name"
                type="text"
                fullWidth
              />
              <TextField
                id="email"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={loginValue}
                onChange={e => setLoginValue(e.target.value)}
                margin="normal"
                placeholder="Email Adress"
                type="email"
                fullWidth
              />
              <TextField
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={passwordValue}
                onChange={e => setPasswordValue(e.target.value)}
                margin="normal"
                placeholder="Password"
                type="password"
                fullWidth
              />
              <TextField
                id="rollNumber"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={rollValue}
                onChange={e => setRollValue(e.target.value)}
                margin="normal"
                placeholder="Roll Number"
                type="text"
                fullWidth
              />
              <TextField
                id="contactNumber"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={contactValue}
                onChange={e => setContactValue(e.target.value)}
                margin="normal"
                placeholder="Contact"
                type="text"
                fullWidth
              />
              <div className={classes.creatingButtonContainer}>
                {isLoading ? (
                  <CircularProgress size={26} />
                ) : (
                  <Button
                    onClick={() =>
                      handleRegister()
                    }
                    disabled={
                      loginValue.length === 0 ||
                      passwordValue.length === 0 ||
                      nameValue.length === 0
                    }
                    size="large"
                    variant="contained"
                    color="primary"
                    fullWidth
                    className={classes.createAccountButton}
                  >
                    Create your account
                  </Button>
                )}
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </Grid>
  );
}

export default withRouter(Login);
