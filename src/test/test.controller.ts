import Koa from "koa"
import Router from '@koa/router'
const routerOpts: Router.RouterOptions = {
    prefix:'/test'
}


const router: Router = new Router(routerOpts)
export async function getRoutes() {
    router.get('/hello',async (ctx:Koa.Context) =>{
        ctx.body='Привет'
    })
    return router;
}

