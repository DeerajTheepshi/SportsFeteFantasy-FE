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
    marginLeft: "10px !important"
  },
  success : {
    textAlign: "center",
    color:"green"
  },
  error : {
    textAlign: "center",
    color:"red"
  }
}));


export function AddPlayer () {
  const classes = useStyles();
  const [playerName, setPlayerName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAddPlayer = async () => {
    setIsLoading(true);
    try {
      let res = await APIService.addPlayer(playerName, teamName);
      if(res.data.status !== 200){
        setError(res.data.message);
        setIsLoading(false);
        setTimeout(()=>{setError("")}, 5000);
        return
      }
      setSuccess(res.data.message);
      setIsLoading(false);
      setTimeout(()=>{setSuccess("")}, 5000);
    } catch (e) {
      console.log(e);
      setError("Something Went Wrong");
      setTimeout(()=>{setError("")}, 5000);
    }
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant={'h1'} className={classes.title}>
          Add Player
        </Typography>
        <br/>
        {error.length !== 0 &&
        <Typography variant={'h6'} className={classes.error}>
          {error}
        </Typography>
        }
        <div className={classes.formInputs}>
          <TextField id="outlined-basic" label="Player Name"
          className={classes.name} onChange={(e)=>{setPlayerName(e.target.value)}}/>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            onChange={(e)=>{setTeamName(e.target.value)}}
            label="Team Name"
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
          <Button disabled={isLoading} onClick={handleAddPlayer} className={"button"} variant={"contained"} color="primary">ADD</Button>
        </div>
        {success.length !== 0 &&
        <Typography variant={'h6'} className={classes.success} >
          {success}
        </Typography>
        }
      </CardContent>
    </Card>
  )
}