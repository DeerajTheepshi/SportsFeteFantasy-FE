import React, { useEffect, useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import APIService from "../../apiservice";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import Checkbox from "@material-ui/core/Checkbox";
import Switch from "@material-ui/core/Switch";
import Loader from "react-loader-spinner";

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    textAlign: "center",
  },
  pos: {
    marginBottom: 12,
  },
  formInputs : {
    display : "flex",
    justifyContent : "space-around",
    alignItems : "baseline",
  },
  selector : {
    width: "30%",
    margin: "10px",
  },
  name : {
    height : "80%",
    width: "30%",
    margin: "10px",
  },
  button : {
    width: "20%",
    margin: "10px auto",
    display: "flex"
  },
  success : {
    textAlign: "center",
    color:"green"
  },
  error : {
    textAlign: "center",
    color:"red"
  },
  teamsBox : {
    width: "100%",
    height: "420px",
    display: "flex",
    justifyContent: "space-between"
  },
  homeBox : {
    height: "100%",
    width: "48%",
    margin: "10px",
  },
  awayBox : {
    height: "100%",
    width: "48%",
    margin: "10px",
  },
  table : {
    overflowY : "scroll",
    minWidth: 275,
  },
  matchNo : {
    display : "flex",
    justifyContent :"center",
    alignItems: "center",
    marginBottom: "10px"
  }
}));


export function Matches ({userData}) {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [matches, setMatches] = useState([]);
  const [success, setSuccess] = useState("");
  const [isScoring, setIsScoring] = useState(false);
  const [match, setMatch] = useState({});
  const [home11s, setHome11s] = useState([]);
  const [away11s, setAway11s] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [isAdmin, setIsAdmin] = useState(userData.isAdmin);
  const [home11Scores, setHome11Scores] = useState({});
  const [away11Scores, setAway11Scores] = useState({});
  let homePts = [];
  let awayPts = [];

  const fetchMatches = async () => {
    let res = await APIService.getAllMatches();
    return res;
  };

  const fetchLiveStatus = async () => {
    let res = await APIService.getLiveStatus();
    return res;
  };

  useEffect(() => {
    fetchMatches().then((res) => {
      if (res.data.status !== 200) {
        setError(res.data.message);
        setIsLoading(false);
        return
      }
      setMatches(res.data.matches);
    }).catch(e=>{
      setError("Something Went Wrong");
      setIsLoading(false);
    });

    setIsLoading(false);
  }, [isScoring]);

  const toggleLive = async (match) => {
    setIsLoading(true);
    try {
      let res = await APIService.toggleLive(match._id);
      if (res.data.status !== 200) {
        setError(res.data.message);
        setTimeout(() => {
          setError("")
        }, 5000);
        setIsLoading(false);
        return
      }
      setSuccess(res.data.message);
      fetchMatches().then((res) => {
        if (res.data.status !== 200) {
          setError(res.data.message);
          setTimeout(() => {
            setError("")}, 5000);
          setIsLoading(false);
          return
        }
        setMatches(res.data.matches);
        setTimeout(()=>{setSuccess("")}, 5000);
        setIsLoading(false);
      }).catch(e=>{
        setError("Something Went Wrong");
        setIsLoading(false);
      });
    } catch (e) {
      setError("Something Went Wrong");
      setTimeout(() => {setError("")}, 5000);
      setIsLoading(false);
    }
  };

  const gotToScoring = async (match) => {
    setIsLoading(true);
    try {
      let res = await APIService.getTeamPlayers(match.homeTeam);
      if (res.data.status !== 200) {
        setError(res.data.message);
        setTimeout(() => {
          setError("")
        }, 5000);
        setIsLoading(false);
        return
      }
      setHome11s(res.data.data);
      homePts = new Array(res.data.data.length).fill(0);

      res = await APIService.getTeamPlayers(match.awayTeam);
      if (res.data.status !== 200) {
        setError(res.data.message);
        setTimeout(() => {
          setError("")
        }, 5000);
        setIsLoading(false);
        return
      }
      setIsScoring(true);
      setAway11s(res.data.data);
      awayPts = new Array(res.data.data.length).fill(0);

      setMatch(match);

      res = await APIService.getMatchScores(match._id, match.homeTeam, match.awayTeam);
      if (res.data.status !== 200) {
        setError(res.data.message);
        setTimeout(() => {
          setError("")
        }, 5000);
        setIsLoading(false);
        return
      }
      setHome11Scores(res.data.homePts);
      setAway11Scores(res.data.awayPts);
      setIsLoading(false);
    } catch (e) {
      setError("Something Went Wrong");
      setTimeout(() => {setError("")}, 5000);
      setIsLoading(false);
    }
  };

  const simulate = async (match) => {
    setIsLoading(true);
    try {
      let res = await APIService.simulate(match._id);
      if (res.data.status !== 200) {
        setError(res.data.message);
        setTimeout(() => {
          setError("")
        }, 5000);
        setIsLoading(false);
        return
      }
      setSuccess(res.data.message);
      setTimeout(()=>{setSuccess("")}, 5000);

      fetchMatches().then((res) => {
        if (res.data.status !== 200) {
          setError(res.data.message);
          setIsLoading(false);
          return
        }
        setMatches(res.data.matches);
        setIsLoading(false);
      }).catch(e => {
        setError("Something Went Wrong");
        setTimeout(() => {setError("")}, 5000);
        setIsLoading(false);
      });
    } catch (e) {
      setError("Something Went Wrong");
      setTimeout(() => {setError("")}, 5000);
      setIsLoading(false);
    }
  };

  const undoSimulate = async (match) => {
    setIsLoading(true);
    try {
      let res = await APIService.undoSimulate(match._id);
      if (res.data.status !== 200) {
        setError(res.data.message);
        setTimeout(() => {
          setError("")
        }, 5000);
        setIsLoading(false);
        return
      }
      setSuccess(res.data.message);
      setTimeout(()=>{setSuccess("")}, 5000);

      fetchMatches().then((res) => {
        if (res.data.status !== 200) {
          setError(res.data.message);
          setTimeout(() => {setError("")}, 5000);
          setIsLoading(false);
          return
        }
        setMatches(res.data.matches);
      }).catch(e => {
        setError("Something Went Wrong");
        setTimeout(() => {setError("")}, 5000);
        setIsLoading(false);
      });
      setIsLoading(false);
    } catch (e) {
      setError("Something Went Wrong");
      setTimeout(() => {setError("")}, 5000);
      setIsLoading(false);
    }
  };

  const addScoreForMatch = async () => {
    let players = [... home11s, ...away11s];
    let pts = [...homePts, ...awayPts];
    setIsLoading(true);
    try {
      let res = await APIService.updateMatchScores(match._id, players, pts);
      if (res.data.status !== 200) {
        setError(res.data.message);
        setTimeout(() => {
          setError("")
        }, 5000);
        return
      }
      setSuccess(res.data.message);
      setIsScoring(false);
      setTimeout(() => {
        setSuccess("")
      }, 5000);
      setIsLoading(false)
    } catch(e) {
      setError("Something Went Wrong");
      setTimeout(() => {setError("")}, 5000);
      setIsLoading(false)
    }
  };


  return (
    !isScoring ?
      <>
        <Card className={classes.table}>
          <CardContent>
            <Typography variant={'h1'} className={classes.title}>
              Matches
            </Typography>
            <br/>
            {error.length !== 0 &&
            <Typography variant={'h6'} className={classes.error}>
              {error}
            </Typography>
            }

            {success.length !== 0 &&
            <Typography variant={'h6'} className={classes.success} >
              {success}
            </Typography>
            }

            {isLoading && <div style={{width: "100%", height:"100%", display: "flex",
              justifyContent: "center", alignItems : "center"
            }}><Loader
              type="ThreeDots"
              color="#536DFE"
              height={50}
              width={50}/></div>}

            <br/><br/><br/>

            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>MatchNo</StyledTableCell>
                    <StyledTableCell>Home</StyledTableCell>
                    <StyledTableCell>Away</StyledTableCell>
                    {isAdmin ? <>
                    <StyledTableCell>SetLive</StyledTableCell>
                    <StyledTableCell>AddScore</StyledTableCell>
                    <StyledTableCell>Simulate</StyledTableCell>
                    </> :  <StyledTableCell>View Score</StyledTableCell>
                    }
                  </StyledTableRow>
                </TableHead>
                <TableBody stripedRows>
                  {matches.map((match) => (
                    <StyledTableRow key={match.match._id}>
                      <StyledTableCell component="th" scope="row">
                        {match.match.matchNo}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {match.match.homeTeam}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {match.match.awayTeam}
                      </StyledTableCell>

                      {isAdmin ? <>
                        <StyledTableCell align="center">
                          <Switch
                            checked={match.match.isLive}
                            onChange={() => toggleLive(match.match)}
                            color="primary"
                          />
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Button disabled={!match.match.isLive || match.match.isSimulated} variant={"contained"}
                                  onClick={() => gotToScoring(match.match)} color="primary">
                            {match.scored && "Edit Scores"}
                            {!match.scored && "Add Scores"}
                          </Button>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Button disabled={!match.scored} variant={"contained"}
                                  onClick={!match.match.isSimulated ?
                                    () => simulate(match.match) : () => undoSimulate(match.match)
                                  } color="primary">
                            {!match.match.isSimulated && "Simulate"}
                            {match.match.isSimulated && "Undo Simulation"}
                          </Button>
                        </StyledTableCell>
                      </> : <StyledTableCell align="center">
                        <Button disabled={!match.scored} variant={"contained"}
                                onClick={() => gotToScoring(match.match)} color="primary">
                          View Scores
                        </Button>
                      </StyledTableCell>
                      }
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </> :
      <>
        <Card className={classes.root}>
          <CardContent>
            <Typography variant={'h1'} className={classes.title}>
              ScoreCard for Match No {match.matchNo}
            </Typography>
            <br/>
            {error.length !== 0 &&
            <Typography variant={'h6'} className={classes.error}>
              {error}
            </Typography>
            }
            <div className={classes.formInputs}>
              <Typography variant={'h1'} className={classes.title}>
                {match.homeTeam}
              </Typography>
              <Typography variant={'h1'} className={classes.title}>
                V S
              </Typography>
              <Typography variant={'h1'} className={classes.title}>
                {match.awayTeam}
              </Typography>
            </div>
            {success.length !== 0 &&
            <Typography variant={'h6'} className={classes.success} >
              {success}
            </Typography>
            }
          </CardContent>
        </Card>

        <br/><br/><br/>
        <Card className={classes.table}>
          <CardContent>
            <div className={classes.teamsBox}>
              <div className={classes.homeBox}>
                <TableContainer component={Paper}>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <StyledTableRow>
                        <StyledTableCell>Player Name</StyledTableCell>
                        <StyledTableCell>Points</StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody stripedRows>
                      {home11s.map((player,key) => (
                        <StyledTableRow key={player.name}>
                          <StyledTableCell component="th" scope="row">
                            {player.name}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {isAdmin ?
                              <TextField id="outlined-basic" label="Points"
                                         onChange={e => {
                                           homePts[key] = e.target.value;
                                         }}
                                         className={classes.name}/> :
                              home11Scores[player._id]
                            }
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              <div className={classes.awayBox}>
                <TableContainer component={Paper}>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <StyledTableRow>
                        <StyledTableCell>Player Name</StyledTableCell>
                        <StyledTableCell>Total Points</StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody stripedRows>
                      {away11s.map((player, key) => (
                        <StyledTableRow key={player.name}>
                          <StyledTableCell component="th" scope="row">
                            {player.name}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {isAdmin ?
                              <TextField id="outlined-basic" label="Points"
                                         onChange={e => {
                                           awayPts[key] = e.target.value;
                                         }}
                                         className={classes.name}/> :
                              away11Scores[player._id]
                            }
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </CardContent>
        </Card>
        {isAdmin && <Button disabled={isLoading} onClick={() => addScoreForMatch()} className={classes.button} variant={"contained"} color="primary">ADD</Button>}

      </>
  )}

