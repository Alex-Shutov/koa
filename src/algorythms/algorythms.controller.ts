import Koa from "koa"
import Router from '@koa/router'

const routerOpts: Router.RouterOptions = {
    prefix:'/algos'
}

const router: Router = new Router(routerOpts)
export async function getRoutes() {


    router.get('/', async (ctx: Koa.Context) => {
        ctx.body = 'Алгоритмы'
    })

    router.get('/recursive/:number', async (ctx: Koa.Context) => {
        console.log(ctx.request)
    })

    router.get('/rec_tail/:number', async (ctx: Koa.Context) => {
        console.log(ctx.request)
    })

    return router;
}

