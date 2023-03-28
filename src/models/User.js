/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.username = null;
    this.status = null;
    this.creationDate = null;
    this.birthdayDate = null;
    Object.assign(this, data);
  }
}
export default User;
