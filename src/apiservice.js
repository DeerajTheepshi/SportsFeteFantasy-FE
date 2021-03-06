let axios = require('axios');
let qs = require('qs');
let config = require('./config');
const APIService = {
    login: (email, password) => {
        return axios.default.post(config.BASE_URL + 'login', qs.stringify({ email: email, password: password }));
    },
    register: (email, password, contact, username, roll) => {
        return axios.default.post(config.BASE_URL + 'register', qs.stringify({
            email: email,
            password: password,
            name: username,
            contact: contact,
        }))
    },
    getUserData: () => {
        return axios.default.post(config.BASE_URL + 'user/getUserData', qs.stringify(
            {session: localStorage.getItem("session")}
            ))
    },
    addPlayer: (playerName, playerTeam) => {
        return axios.default.post(config.BASE_URL + 'player/addPlayer', qs.stringify({
            session: localStorage.getItem("session"),
            playerName: playerName,
            playerTeam: playerTeam
        }))
    },
    getPlayers : (playerIds) => {
        return axios.default.post(config.BASE_URL + 'player/getPlayers', qs.stringify({
            session: localStorage.getItem("session"),
            playerIds: playerIds
        }))
    },
    getTeamPlayers: (teamName) => {
        return axios.default.post(config.BASE_URL + 'player/getTeamPlayers', qs.stringify({
            session: localStorage.getItem("session"),
            teamName: teamName
        }))
    },
    getTeamSquad: (teamName) => {
        return axios.default.post(config.BASE_URL + 'player/getTeamSquad', qs.stringify({
            teamName: teamName,
            session : localStorage.getItem('session'),
        }))
    },
    createMatch: (homeTeamName, awayTeamName, matchNo, home11s, away11s) => {
        return axios.default.post(config.BASE_URL + 'match/createMatch', qs.stringify({
            homeTeamName: homeTeamName,
            awayTeamName: awayTeamName,
            home11s: home11s,
            away11s: away11s,
            matchNo: matchNo,
            session : localStorage.getItem('session'),
        }))
    },
    getAllMatches: () => {
        return axios.default.post(config.BASE_URL + 'match/getAllMatches', qs.stringify({
            session: localStorage.getItem("session")
        }))
    },
    getAllNotLiveMatches: () => {
        return axios.default.post(config.BASE_URL + 'match/getNotLiveMatches', qs.stringify({
            session: localStorage.getItem("session")
        }))
    },
    toggleLive: (matchID) => {
        return axios.default.post(config.BASE_URL + 'match/toggleLive', qs.stringify({
            session: localStorage.getItem("session"),
            matchID: matchID
        }))
    },
    updateMatchScores : (matchId, playerDetails, ptsDetails) => {
        return axios.default.post(config.BASE_URL + 'match/updateScoresForMatch', qs.stringify({
            session: localStorage.getItem("session"),
            matchId: matchId,
            playerDetails:playerDetails,
            ptsDetails: ptsDetails
        }))
    },
    getMatchScores : (matchId, homeTeam, awayTeam) => {
        return axios.default.post(config.BASE_URL + 'match/getMatchScorecard', qs.stringify({
            session: localStorage.getItem("session"),
            matchId: matchId,
            homeTeam:homeTeam,
            awayTeam: awayTeam
        }))
    },
    getAllPlayers : () => {
        return axios.default.post(config.BASE_URL + 'player/getAllPlayers', qs.stringify({
            session: localStorage.getItem("session"),
        }))
    },
    getAllUsers : (withTeam) => {
        return axios.default.post(config.BASE_URL + 'user/getAllUsers', qs.stringify({
            session: localStorage.getItem("session"),
            withTeam: withTeam,
        }))
    },
    addTeam : (squad) => {
        return axios.default.post(config.BASE_URL + 'user/setTeam', qs.stringify({
            session: localStorage.getItem("session"),
            squad: squad,
        }))
    },
    setPlayersForMatch : (selectedPlayers, matchId, starPlayer) => {
        return axios.default.post(config.BASE_URL + 'user/setPlayersForMatch', qs.stringify({
            session: localStorage.getItem("session"),
            selectedPlayers: selectedPlayers,
            matchId: matchId,
            starPlayer: starPlayer,
        }))
    },
    simulate : (matchId) => {
        return axios.default.post(config.BASE_URL + 'match/simulate', qs.stringify({
            session: localStorage.getItem("session"),
            matchId: matchId
        }))
    },
    undoSimulate : (matchId) => {
        return axios.default.post(config.BASE_URL + 'match/undoSimulation', qs.stringify({
            session: localStorage.getItem("session"),
            matchId: matchId
        }))
    },
    createUsersWithTeam : (rollNos, teamName, squad) => {
        return axios.default.post(config.BASE_URL + 'createUsers', qs.stringify({
            session: localStorage.getItem("session"),
            emails: rollNos,
            teamName: teamName,
            squad: squad,
        }))
    },
    getLiveStatus : () => {
        return axios.default.post(config.BASE_URL + 'isLive', qs.stringify({
            session: localStorage.getItem("session"),
        }))
    },
    setLiveStatus : () => {
        return axios.default.post(config.BASE_URL + 'setLive', qs.stringify({
            session: localStorage.getItem("session"),
        }))
    },
    getPickedPlayersForMatch : (matchId) => {
        return axios.default.post(config.BASE_URL + 'user/getPlayersForMatch', qs.stringify({
            session: localStorage.getItem("session"),
            matchId: matchId
        }))
    },
    getPickedPlayersForMatchForUser : (matchId, userId) => {
        return axios.default.post(config.BASE_URL + 'user/getSquadForUserMatch', qs.stringify({
            session: localStorage.getItem("session"),
            matchId: matchId,
            userId: userId,
        }))
    },
    getPosition : () => {
        return axios.default.post(config.BASE_URL + 'user/getPosition', qs.stringify({
            session: localStorage.getItem("session"),
        }))
    }

};

export default APIService;