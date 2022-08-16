class OAuthModel {
    constructor() {
      this.access_token;
      this.expires_in;
      this.user_id;
    }
    static fromJson(json) {
      return Object.assign(new OAuthModel(), json);
    }
  }
  
  class UserModel {
    constructor() {
      this.id;
      this.first_name;
      this.last_name;
      this.bdate;
      this.sex;
      this.online;
      this.photo_max_orig;
      this.counters = 0;
    }
    static fromJson(json) {
      return Object.assign(new UserModel(), json);
    }
  }
  
  export { OAuthModel, UserModel};