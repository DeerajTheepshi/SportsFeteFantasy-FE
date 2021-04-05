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
  const [match, setMatch] = useState({});

  const fetchSquadPlayers = async () => {
    let res = APIService.getPlayers(props.userData.squad);
    return res;
  };

  const fetchNotLiveMatches = async () => {
    let res = APIService.getAllNotLiveMatches();
    return res;
  };

  const fetchLiveStatus = async () => {
    let res = await APIService.getLiveStatus();
    return res;
  };

  const fetchAlreadyPicked = async () => {
    let res = await APIService.getPickedPlayersForMatch();
    return res;
  };

  useEffect(() => {
    fetchAlreadyPicked().then(res => {
      if(res.data.status !== 200) {
        setError(res.data.message);
        setTimeout(()=>{setError("")}, 5000);
        return
      }
      let squadIds = res.data.data;
      let cHome11 = [...home11s];
      for (let i=0;i<squad.length;i++) {
        if(squadIds.includes(squad[i]._id)){
          squad[i].selected = 1;
          cHome11.push(squad[i]._id);
        } else  squad[i].selected = 0;
      }
      setHome11s(cHome11);
    }). catch(e => {
      setError("Something Went Wrong");
      setTimeout(()=>{setError("")}, 5000);
    });
  }, [match]);

  useEffect(()=>{
    fetchSquadPlayers().then(res => {
      if(res.data.status !== 200) {
        setError(res.data.message);
        setTimeout(()=>{setError("")}, 5000);
        return
      }
      setSquad(res.data.data);
    }). catch(e => {
      setError("Something Went Wrong");
      setTimeout(()=>{setError("")}, 5000);
    });

    fetchLiveStatus().then((res) => {
      if (res.data.status !== 200) {
        setError(res.data.message);
        return
      }
      setIsLive(res.data.data);
    }).catch(e=>{
      setError("Something Went Wrong");
    });

    fetchNotLiveMatches().then((res) => {
      if (res.data.status !== 200) {
        setError(res.data.message);
        return
      }
      setMatches(res.data.data);
    }).catch(e=>{
      setError("Something Went Wrong");
    });
  },[]);

  const selectHomePlayer = async (playerId) => {
    let home11Changed = [...home11s];
    if(home11Changed.includes(playerId)){
      home11Changed = home11Changed.filter((value) => {
        return value !== playerId;
      })
    } else {
      home11Changed.push(playerId);
    }
    setHome11s(home11Changed);
  };

  const setPlayersForMatch = async () => {
    if(home11s.length > 3) {
      setError("You can select only less than 4 Players");
      setTimeout(()=>{setError("")}, 5000);
      return;
    }
    let res = await APIService.setPlayersForMatch(home11s);
    if(res.data.status !== 200){
      setError(res.data.message);
      setTimeout(()=>{setError("")}, 5000);
      return
    }
    setSuccess(res.data.message);
    setTimeout(()=>{setSuccess("")}, 5000);
  };

  return (
    <>
      <Card className={classes.root}>
        <CardContent>
          <Typography variant={'h1'} className={classes.title}>
            Pick Team
          </Typography>

          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            onChange={(e)=>{setTeamName(e.target.value)}}
            label="Select Match"
            className={classes.selector}
          >
            {matches.map((match, key) => {
              return (
                <MenuItem value={match._id} onClick={() => setMatch(match)}>
                  {match.matchNo + " " + match.homeTeam + " vs " + match.awayTeam}
                </MenuItem>
              )
            })}

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
                    <StyledTableCell>Player Name</StyledTableCell>
                    <StyledTableCell>Player Team</StyledTableCell>
                    <StyledTableCell>Select Player</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody stripedRows>
                  {squad.map((player) => (
                    <StyledTableRow key={player.name}>
                      <StyledTableCell component="th" scope="row">
                        {player.name}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {player.teamName}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Checkbox
                          color="primary" onChange={() => selectHomePlayer(player._id)}/>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      }
      {!isLive &&<Button disabled={isLoading} onClick={setPlayersForMatch} className={classes.button} variant={"contained"} color="primary">ADD</Button>}
    </>
  )
}