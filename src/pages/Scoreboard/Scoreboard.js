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
    height: "50vh"
  },
  matchNo : {
    display : "flex",
    justifyContent :"center",
    alignItems: "center",
    marginBottom: "10px"
  },
  row : {
    height: "10px",
  }
}));


export function ScoreBoard (props) {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [home11s, setHome11s] = useState([]);
  const [userId, setUserId] = useState("");
  const [matches, setMatches] = useState([]);
  const [users, setUsers] = useState([]);

  const compare = ( a, b ) => {
    if ( a.points > b.points ){
      return -1;
    }
    return 1;
  };

  const fetchUsers = async () => {
    let res = APIService.getAllUsers(true);
    return res;
  };

  useEffect(()=>{
    fetchUsers().then(res => {
      if(res.data.status !== 200) {
        setError(res.data.message);
        setTimeout(()=>{setError("")}, 5000);
        return
      }
      let sortedUsers = res.data.data.sort(compare);
      setUsers(sortedUsers);
      setIsLoading(false);
    }). catch(e => {
      setError("Something Went Wrong");
      setTimeout(()=>{setError("")}, 5000);
    });
  },[]);

  return (
    <>
      {isLoading ? <div style={{
        width: "100vw", height: "100vh", display: "flex",
        justifyContent: "center", alignItems: "center"
      }}>
        <Loader
          type="ThreeDots"
          color="#536DFE"
          height={100}
          width={100}/>
      </div> : <>
        <Card className={classes.root}>
          <CardContent>
            <Typography variant={'h1'} className={classes.title}>
              Scoreboard
            </Typography>
            <br/>
            {error.length !== 0 &&
            <Typography variant={'h6'} className={classes.error}>
              {error}
            </Typography>
            }
            {success.length !== 0 &&
            <Typography variant={'h6'} className={classes.success}>
              {success}
            </Typography>
            }
          </CardContent>
        </Card>

        <br/><br/><br/>
        <Card className={classes.table}>
          <CardContent>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>Pos</StyledTableCell>
                    <StyledTableCell>User Name</StyledTableCell>
                    <StyledTableCell>Points</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody stripedRows>
                  {users.map((user, key) => (
                    <StyledTableRow key={user.name}>
                      <StyledTableCell component="th" scope="row">
                        {key + 1}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {user.name}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {user.points}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </>
      }
    </>
  )
}