class Invitation {
    constructor(data = {}) {
      this.id = null;
      this.invitedUserId = null;
      this.invitingUserId = null;
      this.modeType = null;
      this.quizType = null;
      Object.assign(this, data);
    }
  }
  export default Invitation;