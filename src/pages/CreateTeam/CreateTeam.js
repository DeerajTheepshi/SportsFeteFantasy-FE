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
    height: "80vh"
  },
  matchNo : {
    display : "flex",
    justifyContent :"center",
    alignItems: "center",
    marginBottom: "10px"
  }
}));


export function CreateTeam () {
  const classes = useStyles();
  const [teamName, setTeamName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [home11s, setHome11s] = useState([]);
  const [users, setUsers] = useState([]);
  const [players, setPlayers] = useState([]);
  const [email1, setEmail1] = useState("");
  const [email2, setEmail2] = useState("");
  const [email3, setEmail3] = useState("");

  useEffect(() => {
    setIsLoading(true);
    let data = [...players];
    for(let i=0;i<data.length;i++){
      if(home11s.includes(data[i]._id)) {
        data[i].selected = 1;
      } else data[i].selected = 0;
    }
    setPlayers(data);
    setIsLoading(false);
  }, [home11s]);

  const getAllPlayers = async () => {
    let res = await APIService.getTeamSquad("CSK");
    return res;
  };

  const getTeamPlayers = async (teamName) => {
    let res = await APIService.getTeamSquad(teamName);
    let data = res.data.data;
    for(let i=0;i<data.length;i++){
      if(home11s.includes(data[i]._id)) {
        data[i].selected = 1;
      } else data[i].selected = 0;
    }
    setPlayers(data);
  };

  useEffect(()=> {
    setIsLoading(true);
    getAllPlayers().then(res => {
      if(res.data.status !== 200) {
        setError(res.data.message);
        setTimeout(()=>{setError("")}, 5000);
        setIsLoading(false);
        return
      }
      let data = res.data.data;
      for(let i=0;i<data.length;i++){
        if(home11s.includes(data[i]._id)) {
          data[i].selected = 1;
        } else data[i].selected = 0;
      }
      setPlayers(data);
      setIsLoading(false);
    }). catch(e => {
      setError("Something Went Wrong");
      setTimeout(()=>{setError("")}, 5000);
      setIsLoading(false);
    });
  }, [success]);

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

  const addTeam = async () => {
    setIsLoading(true);
    try {
      let res = await APIService.createUsersWithTeam([email1, email2, email3], teamName, home11s);
      if (res.data.status !== 200) {
        setError(res.data.message);
        setTimeout(() => {
          setError("")
        }, 5000);
        setIsLoading(false);
        return
      }
      setSuccess(res.data.message);
      setTimeout(() => {
        setSuccess("")
      }, 5000);
      setIsLoading(false);
    } catch (e) {
      setError("Something Went Wrong");
      setTimeout(() => {
        setError("")
      }, 5000);
      setIsLoading(false);
    }
  };



  // const handleAddPlayer = async () => {
  //   setIsLoading(true);
  //   try {
  //     let res = await APIService.addPlayer(playerName, teamName);
  //     if(res.data.status !== 200){
  //       setError(res.data.message);
  //       setIsLoading(false);
  //       setTimeout(()=>{setError("")}, 5000);
  //       return
  //     }
  //     setSuccess(res.data.message);
  //     setIsLoading(false);
  //     setTimeout(()=>{setSuccess("")}, 5000);
  //   } catch (e) {
  //     console.log(e);
  //     setError("Something Went Wrong");
  //     setTimeout(()=>{setError("")}, 5000);
  //   }
  // };

  return (
    <>
      <Card className={classes.root}>
        <CardContent>
          <Typography variant={'h1'} className={classes.title}>
            Create Team
          </Typography>
          <br/>
          {error.length !== 0 &&
          <Typography variant={'h6'} className={classes.error}>
            {error}
          </Typography>
          }
          <div className={classes.formInputs}>
            <TextField id="outlined-basic" label="Email 1"
                       className={classes.name} onChange={(e)=>{setEmail1(e.target.value)}}/>
            <TextField id="outlined-basic" label="Email 2"
                       className={classes.name} onChange={(e)=>{setEmail2(e.target.value)}}/>
            <TextField id="outlined-basic" label="Email 3"
                       className={classes.name} onChange={(e)=>{setEmail3(e.target.value)}}/>
            <TextField id="outlined-basic" label="Team Name"
                       className={classes.name} onChange={(e)=>{setTeamName(e.target.value)}}/>
          </div>
          {success.length !== 0 &&
          <Typography variant={'h6'} className={classes.success}>
            {success}
          </Typography>
          }
          <Typography variant={'h6'} className={classes.success} >
            {`You have selected ${home11s.length} Players`}
          </Typography>
          {isLoading && <div style={{width: "100%", height:"100%", display: "flex",
            justifyContent: "center", alignItems : "center"
          }}><Loader
            type="ThreeDots"
            color="#536DFE"
            height={50}
            width={50}/></div>}
        </CardContent>
      </Card>

      <br/><br/><br/>
      <Card className={classes.table}>
        <CardContent>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>Player Name</StyledTableCell>
                  <StyledTableCell>
                    Player Team
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      onChange={(e)=>{getTeamPlayers(e.target.value)}}
                      label="Team"
                      className={classes.selector}
                    >
                      <MenuItem value={"CSK"}>CSK</MenuItem>
                      <MenuItem value={"RCB"}>RCB</MenuItem>
                      <MenuItem value={"MI"}>MI</MenuItem>
                      <MenuItem value={"KKR"}>KKR</MenuItem>
                      <MenuItem value={"SRH"}>SRH</MenuItem>
                      <MenuItem value={"DC"}>DC</MenuItem>
                      <MenuItem value={"RR"}>RR</MenuItem>
                      <MenuItem value={"PBKS"}>PBKS</MenuItem>
                    </Select>
                  </StyledTableCell>
                  <StyledTableCell>Select Player</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody stripedRows>
                {players.map((player) => (
                  <StyledTableRow key={player.name}>
                    <StyledTableCell component="th" scope="row">
                      {player.name}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {player.teamName}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Checkbox
                        checked={player.selected}
                        color="primary" onChange={()=>selectHomePlayer(player._id)}/>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      <Button disabled={isLoading} onClick={addTeam} className={classes.button} variant={"contained"} color="primary">ADD</Button>
    </>
  )
}