import decode from 'jwt-decode';

class AuthService {

    logout(){
        // clear user token from localStorage
        localStorage.removeItem('id_token');

    }
}