 export default class User {
     constructor(id, name, code, email, status, role) {
         this.id = id;
         this.name = name;
         this.code = code;
         this.email = email;
         this.status = status;
         this.role = role;
     }
 }
 export const createUser = ({
     id,
     name,
     code,
     email,
     status,
     role
 }) => new User(id, name, code, email, status, role);
