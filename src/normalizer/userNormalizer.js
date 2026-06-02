
class UserNormalizer {
  async get(user) {
   const { status, name, email } = user;
   return {status,name,email};
  }
}

export default new UserNormalizer();

    


