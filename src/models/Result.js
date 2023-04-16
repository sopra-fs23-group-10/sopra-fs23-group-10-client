class Result {
    constructor(data = {}) {
        this.gameId = null;
        this.invitingPlayerId = null;
        this.invitingPlayerResult = null;
        this.invitedPlayerId = null;
        this.invitedPlayerResult = null;
         Object.assign(this, data);
    }
  }
  export default Result;
  