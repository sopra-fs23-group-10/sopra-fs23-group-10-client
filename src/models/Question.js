class Question {
    constructor(data = {}) {
        this.gameId = null;
        this.category = null;
        this.id = null;
        this.correctAnswer = null;
        this.incorrectAnswers = null;
        this.allAnswers = null;
        this.question = null;
        Object.assign(this, data);
    }
  }
  export default Question;
  