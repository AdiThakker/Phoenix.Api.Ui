import { Authorizationmessage, Authorizationaction } from "./../messages/authorizationmessage";
import { B2CAuthorization } from "./authorization/b2cauthorization";
import { computedFrom, inject } from "aurelia-framework";
import { Interceptor } from "aurelia-fetch-client";
import { EventAggregator } from "aurelia-event-aggregator";

@inject(EventAggregator)
export class UserAuthorization extends B2CAuthorization<any> {

    private isAuthenticatedInternal: boolean = false;

    static getResponse = (): any => { return "";};

    constructor(private eventAggregator : EventAggregator) {
        super((args) => {
            this.authorizationEventHandler(args);
        });
        UserAuthorization.getResponse = super.getAuthenticationResponse();
    }

    @computedFrom("userNameInternal")
    public get userName(): string {
        return "";
    }

    @computedFrom("isAuthenticatedInternal")
    public get isAuthenticated(): boolean {
        return this.isAuthenticatedInternal;
    }

    created(): void {
        // check if already authenticated
        super.handleAuthenticationResponse();
    }

    public login(): void {
        super.login();
    }

    public logout(): void {
        super.logout();
    }

    public authorizationEventHandler(data: any): void {
        // parse data and update the binding
        if (!data || !("access_token" in data) || !data.access_token || (data.expires < (new Date()).getTime() / 1000)) {
            this.isAuthenticatedInternal = false;
            this.eventAggregator.publish(new Authorizationmessage(Authorizationaction.logout, data));
            return;
        }

        this.isAuthenticatedInternal = true;
        this.eventAggregator.publish(new Authorizationmessage(Authorizationaction.login, data));
    }

    public getAuthenticationInterceptor(): Interceptor {
        return {
            request(request: Request) {
                const authResponse: any = UserAuthorization.getResponse();
                if (authResponse && authResponse.access_token) {
                    request.headers.append("Authorization",
                        `Bearer ${authResponse.access_token}`);
                        console.log("Token added to header: " + authResponse.access_token);
                }
                return request;
            },
        };
    }
}