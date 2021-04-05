import React, { useState } from "react";
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
  },
  matchNo : {
    display : "flex",
    justifyContent :"center",
    alignItems: "center",
    marginBottom: "10px"
  }
}));


export function AddMatch () {
  const classes = useStyles();
  const [homeTeamName, setHomeTeamName] = useState("");
  const [awayTeamName, setAwayTeamName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [homeSquad, setHomeSquad] = useState([]);
  const [awaySquad, setAwaySquad] = useState([]);
  const [away11s, setAway11s] = useState([]);
  const [home11s, setHome11s] = useState([]);
  const [matchNo, setMatchNo] = useState(0);

  const handleAwayTeam = async (teamName) => {
    let res = await APIService.getTeamSquad(teamName);
    if(res.data.status !== 200) {
      setError(res.data.message);
      return
    }
    setAwaySquad(res.data.data);
    setAwayTeamName(teamName);
  };

  const handleHomeTeam = async (teamName) => {
    let res = await APIService.getTeamSquad(teamName);
    if(res.data.status !== 200) {
      setError(res.data.message);
      return
    }
    setHomeSquad(res.data.data);
    setHomeTeamName(teamName);
  };

  const handleCreateMatch = async () => {
    let res = await APIService.createMatch(homeTeamName, awayTeamName, matchNo, home11s, away11s);
    if(res.data.status !== 200) {
      setError(res.data.message);
      return
    }
    setSuccess(res.data.message);
  };

  const selectAwayPlayer = async (playerId) => {
    let away11Changed = [...away11s];
    if(away11Changed.includes(playerId)){
      away11Changed = away11Changed.filter((value) => {
        return value !== playerId;
      })
    } else {
      away11Changed.push(playerId);
    }
    setAway11s(away11Changed);
  };

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


  return (
    <>
      <Card className={classes.root}>
        <CardContent>
          <Typography variant={'h1'} className={classes.title}>
            Create Match
          </Typography>
          <br/>
          {error.length !== 0 &&
          <Typography variant={'h6'} className={classes.error}>
            {error}
          </Typography>
          }
          <div className={classes.matchNo}>
          <TextField id="outlined-basic" label="Match No"
                     className={classes.name} onChange={(e)=>{setMatchNo(e.target.value)}}/>
          </div>
          <div className={classes.formInputs}>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              onChange={(e)=>{handleHomeTeam(e.target.value)}}
              label="Home Team"
              className={classes.selector}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"CSK"}>CSK</MenuItem>
              <MenuItem value={"RCB"}>RCB</MenuItem>
              <MenuItem value={"MI"}>MI</MenuItem>
              <MenuItem value={"KKR"}>KKR</MenuItem>
              <MenuItem value={"SRH"}>SRH</MenuItem>
              <MenuItem value={"DC"}>DC</MenuItem>
              <MenuItem value={"RR"}>RR</MenuItem>
              <MenuItem value={"KXIP"}>KXIP</MenuItem>
            </Select>

            <Typography variant={'h1'} className={classes.title}>
              V S
            </Typography>

            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              onChange={(e)=>{handleAwayTeam(e.target.value)}}
              label="Away Team"
              className={classes.selector}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"CSK"}>CSK</MenuItem>
              <MenuItem value={"RCB"}>RCB</MenuItem>
              <MenuItem value={"MI"}>MI</MenuItem>
              <MenuItem value={"KKR"}>KKR</MenuItem>
              <MenuItem value={"SRH"}>SRH</MenuItem>
              <MenuItem value={"DC"}>DC</MenuItem>
              <MenuItem value={"RR"}>RR</MenuItem>
              <MenuItem value={"KXIP"}>KXIP</MenuItem>
            </Select>
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
                      <StyledTableCell>Total Points</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody stripedRows>
                    {homeSquad.map((player) => (
                      <StyledTableRow key={player.name}>
                        <StyledTableCell component="th" scope="row">
                          {player.name}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Checkbox
                            color="primary" onChange={()=>selectHomePlayer(player._id)}/>
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
                    {awaySquad.map((player) => (
                      <StyledTableRow key={player.name}>
                        <StyledTableCell component="th" scope="row">
                          {player.name}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Checkbox
                            color="primary" onChange={()=>selectAwayPlayer(player._id)}/>
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
      <Button disabled={isLoading} onClick={handleCreateMatch} className={classes.button} variant={"contained"} color="primary">ADD</Button>
    </>
  )
}