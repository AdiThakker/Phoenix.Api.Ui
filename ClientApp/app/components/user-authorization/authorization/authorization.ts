export interface IAuthorizationEvent<TArgs> {
    notify(args: TArgs): void;
}

export interface IAuthorization {
    login(): void;
    logout(): void;
}