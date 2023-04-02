/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.username = null;
    this.status = null;
    this.points = null;
    this.profilePicture = null;
    Object.assign(this, data);
  }
}
export default User;
