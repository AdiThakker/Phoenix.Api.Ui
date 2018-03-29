import { EventAggregator } from 'aurelia-event-aggregator';
import { inject, computedFrom } from "aurelia-framework";
import { Webapi } from "../webapi/webapi";

@inject(Webapi)
export class User {
    busyInternal: boolean;

    private userDetailsInternal: string = "";
    private valuesInternal: string = "";

    constructor(private api : Webapi, private eventAggregator: EventAggregator) {
    }

    @computedFrom("busyInternal")
    public get busy(): boolean {
        return this.busyInternal;
    }
    public getDetails(): void {
        this.busyInternal = true;
       this.api.getUserDetails()
        .then(response => { console.log(response); return response.json(); })
        .then(details => { this.userDetailsInternal = JSON.stringify(details, undefined, 4); this.busyInternal = false;})
        .catch(err => { this.userDetailsInternal = err; console.error(err); this.busyInternal = false;});
    }
    public getValues(): void {
        this.busyInternal = true;
        this.api.getValues()
            .then(response => { console.log(response); return response.json(); })
            .then(details => { this.valuesInternal = JSON.stringify(details, undefined, 4); this.busyInternal = false; })
            .catch(err => { this.valuesInternal = err; console.error(err); this.busyInternal = false; });
    }

    @computedFrom("userDetailsInternal")
    public get UserDetails(): string {
        return this.userDetailsInternal;
    }

    @computedFrom("valuesInternal")
    public get Values(): string {
        return this.valuesInternal;
    }
}