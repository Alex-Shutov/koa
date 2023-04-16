import Koa from "koa";
import Router from "@koa/router";
import {RouterFuncType} from "./interfaces/getRoutesFunc.js";

export class RoutesController{
    app:Koa;
    mainRouter:Router

    constructor(app:Koa,router:Router) {
        this.app = app;
        this.mainRouter = router;
    }

        getRoutes(routerFunc:RouterFuncType) {

        routerFunc().then((router:Router)=>{
            this.mainRouter.use(router.routes())
            this.mainRouter.use(router.allowedMethods())
        })
        return this
    }



}
