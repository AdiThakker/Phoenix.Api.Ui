import { Aurelia, PLATFORM, inject } from "aurelia-framework";
import { RouterConfiguration, Router } from "aurelia-router";

export class App {
     router: Router;

    configureRouter(config: RouterConfiguration, router: Router): void {
        config.title = "Phoenix Api";
        config.map(
            [
                // tslint:disable-next-line:max-line-length
               { route: [ "", "home" ], name: "home", settings: { icon: "home" }, moduleId: PLATFORM.moduleName("../home/home"), nav: true, title: "Home" },
                // tslint:disable-next-line:max-line-length
               { route: "User", name: "User", settings: { icon: "glyphicon glyphicon-user" }, moduleId: PLATFORM.moduleName("../user/user"), nav: true, title: "User" }
            ]);

       this.router = router;
    }
}