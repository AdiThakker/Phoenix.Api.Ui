import { HttpClient } from "aurelia-fetch-client";
import { UserAuthorization } from "../user-authorization/user-authorization";
import { inject } from "aurelia-framework";

@inject(UserAuthorization)
export class Webapi {

    constructor(private userAuthorization : UserAuthorization) {

    }

    public getUserDetails(): Promise<any> {
        return new HttpClient()
                    .configure({ cache:"reload" })
                    .configure(config => {
                        config.withInterceptor(this.userAuthorization.getAuthenticationInterceptor());
                    })
                    // tslint:disable-next-line:max-line-length
            .fetch("https://*/api/signin"); 

    }

    public getValues(): Promise<any> {
        return new HttpClient()
            .configure({ cache: "reload" })
            .configure(config => {
                config.withInterceptor(this.userAuthorization.getAuthenticationInterceptor());
            })
            // tslint:disable-next-line:max-line-length
            .fetch("https://*/api/values");
    }

}