export enum Authorizationaction {login = 1, logout = 2 }

export class Authorizationmessage {
    constructor(private action: Authorizationaction, private message: any) {
    }
}