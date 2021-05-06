
export class SignedInUser {

    private _username: string;
    private _password: string;

    constructor(username: string, password: string) {
        this._username = username;
        this._password = password;
    }

    get username() {
        return this._username;
    }
    set username(username: string) {
        this._username = username;
    }
    
    get password() {
        return this._password;
    }
    set password(password: string) {
        this._password = password;
    }
}