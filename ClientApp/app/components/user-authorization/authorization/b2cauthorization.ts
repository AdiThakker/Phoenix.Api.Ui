import { IAuthorization, IAuthorizationEvent } from "./authorization";
import * as Hello from "hellojs";

const tenantName:string     = "";
// tslint:disable-next-line:max-line-length
const clientId:string       =  ""; 
const policyName:string     = "B2C_1_SignUpInPolicy";
const redirectUrl: string = "";
const scopeUrl:string       = "";

export class B2CAuthorization<TArgs> implements IAuthorization, IAuthorizationEvent<TArgs> {

    // tslint:disable-next-line:no-empty
    notify(args: TArgs): void {
    }

    // default handler
    static notificationHandler: (args: any) => void = (args) => { console.log("No notification handler attached: " + args); };

    constructor(fn: (args:TArgs) => void) {

        B2CAuthorization.notificationHandler = fn;
        // this.notify = fn;

        // configure OAuth details
        Hello.init({
            azureAD: {
                oauth: {
                    version: 2,
                    auth: this.getAuthUrl(tenantName, policyName) + "authorize",
                    grant: this.getAuthUrl(tenantName, policyName) + "token",
                },
                scope_delim: " ",
                logout: () => {
                    // tslint:disable-next-line:max-line-length
                    Hello.utils.store("azureAD", null);
                    location.assign(this.getLogoutUrl(tenantName, policyName, redirectUrl));
                    return true;
                }
            }
        });

        // configure application details
        Hello.init({ azureAD: clientId, response_type: "token id_token", redirect_uri: redirectUrl, display: "page" });

        // attach event handlers
        Hello.on("auth.login", this.handleAuthenticationResponse);
        Hello.on("auth.logout", this.handleAuthenticationResponse);

    }

    public login(): void {
        Hello.login("azureAD" , { display: "page", scope: "openid " + scopeUrl });
    }

    public logout(): void {
        Hello.logout("azureAD", { force: true });
    }

    public getAuthenticationResponse(): (() => any) {
        return () => Hello("azureAD").getAuthResponse();
    }

    public handleAuthenticationResponse(): any {
        const response: any = Hello("azureAD").getAuthResponse();
        if (B2CAuthorization.notificationHandler != null) {
            B2CAuthorization.notificationHandler(response);
        }
    }

    private getAuthUrl(tenant:string, policy:string): string {
        return `https://login.microsoftonline.com/te/${tenant}/${policy}/oauth2/v2.0/`;
    }

    private getLogoutUrl(tenant:string, policy:string, redirectUrl:string): string {
        return this.getAuthUrl(tenant, policy) + "/logout?post_logout_redirect_uri=" + encodeURI(redirectUrl);
    }
}