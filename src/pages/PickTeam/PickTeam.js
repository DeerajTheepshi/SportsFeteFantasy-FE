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
import InputLabel from "@material-ui/core/InputLabel";

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
    height: "50vh"
  },
  matchNo : {
    display : "flex",
    justifyContent :"center",
    alignItems: "center",
    marginBottom: "10px"
  }
}));


export function PickTeam (props) {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [home11s, setHome11s] = useState([]);
  const [userId, setUserId] = useState("");
  const [matches, setMatches] = useState([]);
  const [squad, setSquad] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [users, setUsers] = useState([]);
  const [match, setMatch] = useState({});
  const [matchPlayers, setMatchPlayers] = useState([]);
  const [starPlayer, setStarPlayer] = useState("");

  const fetchSquadPlayers = async () => {
    let res = await APIService.getPlayers(props.userData.squad);
    return res;
  };

  const fetchUsers = async () => {
    let res = await APIService.getAllUsers(true);
    return res;
  };


  const fetchNotLiveMatches = async () => {
    let res = await APIService.getAllNotLiveMatches();
    return res;
  };

  const fetchAllMatches = async () => {
    let res = await APIService.getAllMatches();
    return res;
  };

  const fetchAlreadyPicked = async () => {
    let res = await APIService.getPickedPlayersForMatch(match._id);
    return res;
  };

  const fetchPickedPlayersForUser = async () => {
    let res = await APIService.getPickedPlayersForMatchForUser(match._id, userId);
    return res;
  };

  useEffect(() => {
    if(props.viewSelectedTeam && userId !== "" && match){
      fetchPickedPlayersForUser().then(res => {
        if (res.data.status !== 200) {
          setError(res.data.message);
          setTimeout(() => {
            setError("")
          }, 5000);
          return
        }
        setMatchPlayers(res.data.data);
        setStarPlayer(res.data.starPlayer);
      }).catch(e => {
        setError("Something Went Wrong");
        setTimeout(() => {
          setError("")
        }, 5000);
      });
    }
  }, [userId, match]);

  useEffect(() => {
    if(!props.userData.isAdmin) {
      fetchAlreadyPicked().then(res => {
        if (res.data.status !== 200) {
          setError(res.data.message);
          setTimeout(() => {
            setError("")
          }, 5000);
          return
        }
        let squadIds = res.data.data;
        let cHome11 = [];
        let cSquad = [...squad];
        setStarPlayer(res.data.starPlayer);
        for (let i = 0; i < cSquad.length; i++) {
          if (squadIds.includes(cSquad[i]._id)) {
            cSquad[i].selected = 1;
            cHome11.push(cSquad[i]._id);
          } else cSquad[i].selected = 0;
        }
        let matchPlayersData = cSquad.filter((player) => {
          return (player.teamName === match.homeTeam || player.teamName === match.awayTeam)
        });
        setMatchPlayers(matchPlayersData);
        setHome11s(cHome11);
        setSquad(cSquad);
      }).catch(e => {
        setError("Something Went Wrong");
        setTimeout(() => {
          setError("")
        }, 5000);
      });
    }
  }, [match]);

  useEffect(()=>{
    if(!props.userData.isAdmin) {
      fetchSquadPlayers().then(res => {
        if (res.data.status !== 200) {
          setError(res.data.message);
          setTimeout(() => {
            setError("")
          }, 5000);
          return
        }
        let data = res.data.data;
        for (let i = 0; i < data.length; i++) {
          data[i].selected = 0;
        }
        setSquad(data);
      }).catch(e => {
        setError("Something Went Wrong");
        setTimeout(() => {
          setError("")
        }, 5000);
      });

      fetchNotLiveMatches().then((res) => {
        if (res.data.status !== 200) {
          setError(res.data.message);
          return
        }
        setMatches(res.data.data);
      }).catch(e => {
        setError("Something Went Wrong");
      });
    } else if (!props.viewSelectedTeam) {
      fetchUsers().then(res => {
        if(res.data.status !== 200) {
          setError(res.data.message);
          setTimeout(()=>{setError("")}, 5000);
          return
        }
        let sortedUsers = res.data.data;
        setUsers(sortedUsers);
        setIsLoading(false);
      }). catch(e => {
        setError("Something Went Wrong");
        setTimeout(()=>{setError("")}, 5000);
      });
    } else {
      fetchAllMatches().then((res) => {
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

      fetchUsers().then(res => {
        if(res.data.status !== 200) {
          setError(res.data.message);
          setTimeout(()=>{setError("")}, 5000);
          return
        }
        let sortedUsers = res.data.data;
        setUsers(sortedUsers);
        setIsLoading(false);
      }). catch(e => {
        setError("Something Went Wrong");
        setTimeout(()=>{setError("")}, 5000);
      });

      setIsLoading(false);
    }
  },[]);

  const selectHomePlayer = async (playerId) => {
    if(starPlayer === playerId) {
      setStarPlayer("");
    }
    let home11Changed = [...home11s];
    if(home11Changed.includes(playerId)){
      home11Changed = home11Changed.filter((value) => {
        return value !== playerId;
      })
    } else {
      home11Changed.push(playerId);
    }
    setHome11s(home11Changed);


    let cSquad = [...squad];
    for (let i=0;i<cSquad.length;i++) {
      if(home11Changed.includes(cSquad[i]._id)){
        cSquad[i].selected = 1;
      } else  cSquad[i].selected = 0;
    }
    setSquad(cSquad);
  };

  const selectStarPlayer = async (playerId) => {
    if(playerId === starPlayer){
      setStarPlayer("");
      return
    }
    if(home11s.includes(playerId))
      setStarPlayer(playerId);
    else {
      setError("Player Not Selected for Match");
      setTimeout(()=>{setError("")}, 5000);
    }


  };

  const setPlayersForMatch = async () => {
    if(!match._id) {
      setError("No Match Selected");
      setTimeout(()=>{setError("")}, 5000);
      return;
    }
    if(home11s.length > 3) {
      setError("You can select only less than 4 Players");
      setTimeout(()=>{setError("")}, 5000);
      return;
    }
    let res = await APIService.setPlayersForMatch(home11s, match._id, starPlayer);
    if(res.data.status !== 200){
      setError(res.data.message);
      setTimeout(()=>{setError("")}, 5000);
      return
    }
    setSuccess(res.data.message);
    setTimeout(()=>{setSuccess("")}, 5000);
  };

  const setUser = async (key) => {
    setIsLoading(true);
    try {
      let user = users[key];
      let res = await APIService.getPlayers(user.squad);
      setMatchPlayers(res.data.data);
      setSquad(res.data.data);
    } catch (e) {
      setError("Something went Wrong");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className={classes.root}>
        <CardContent>
          <Typography variant={'h1'} className={classes.title}>
            {props.userData.isAdmin? "View Team" : "Pick Team"}<br/>
            <Typography variant={'h5'}>{(props.viewSelectedTeam || !props.userData.isAdmin)?"Select Match":"Select User"}
              <Select
                id="demo-simple-select-outlined"
                className={classes.selector}
              >
                {(props.viewSelectedTeam || !props.userData.isAdmin) ?
                  matches.map((match, key) => {
                    return (
                      props.viewSelectedTeam ?
                        <MenuItem value={match.match._id} onClick={() => setMatch(match.match)}>
                          {match.match.matchNo + ". " + match.match.homeTeam + " vs " + match.match.awayTeam}
                        </MenuItem> :
                        <MenuItem value={match._id} onClick={() => setMatch(match)}>
                          {match.matchNo + ". " + match.homeTeam + " vs " + match.awayTeam}
                        </MenuItem>

                    )
                  }) :
                  users.map((user, key) => {
                    return (
                      <MenuItem value={key} onClick={() => setUser(key)}>
                        {user.teamName}
                      </MenuItem>
                    )
                  })
                }

              </Select>
              {props.viewSelectedTeam &&
              <Select
                id="demo-simple-select-outlined"
                className={classes.selector}
              >
                {users.map((user,key) => {
                  return (
                    <MenuItem value={key} onClick={() => setUserId(user._id)}>
                      {user.email}
                    </MenuItem>
                  )
                })}
              </Select>
              }
            </Typography>
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
        </CardContent>
      </Card>

      <br/><br/><br/>
      {isLive ?
        <Typography variant={'h3'} className={classes.title}>
          Cannot Pick Team When Match Is Live
        </Typography> :
        <Card className={classes.table}>
          <CardContent>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>No. </StyledTableCell>
                    <StyledTableCell>Player Name</StyledTableCell>
                    <StyledTableCell>Player Team</StyledTableCell>
                    {!props.userData.isAdmin &&
                    <StyledTableCell>Select Player</StyledTableCell>
                    }
                    {!props.userData.isAdmin &&
                    <StyledTableCell>Star Player</StyledTableCell>
                    }
                  </StyledTableRow>
                </TableHead>
                <TableBody stripedRows>
                  {matchPlayers.map((player, key) => (
                    <StyledTableRow key={player.name}>
                      <StyledTableCell component="th" scope="row">
                        {key+1}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {(props.viewSelectedTeam && player._id === starPlayer)?
                          <b>{player.name}</b>
                          :
                          player.name
                        }
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {player.teamName}
                      </StyledTableCell>
                      {!props.userData.isAdmin &&
                      <StyledTableCell align="center">
                        <Checkbox checked={player.selected}
                                  color="primary" onChange={() => {
                                    selectHomePlayer(player._id);
                                    setSuccess("");
                                    setError("");
                        }}/>
                      </StyledTableCell>
                      }
                      {!props.userData.isAdmin &&
                      <StyledTableCell align="center">
                        <Checkbox checked={player._id === starPlayer}
                                  color="primary" onChange={() => {
                                    selectStarPlayer(player._id);
                                    setSuccess("");
                                    setError("");
                        }}/>
                      </StyledTableCell>
                      }
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      }
      <Button disabled={isLoading} onClick={setPlayersForMatch} className={classes.button} variant={"contained"} color="primary">ADD</Button>
    </>
  )
}