import Koa from "koa";
import Router from "@koa/router";
import moment from "moment";
import {RoutesController} from "./utils.js";
import {getRoutes as getAlgosRoutes} from './algorythms/algorythms.controller.js'
import {getRoutes as getTestRoutes} from './test/test.controller.js'

const isLocalhost = !process.env.NODE_ENV;

const app:Koa = new Koa();
const router = new Router();
const port = 3500

app.use(async (ctx:Koa.Context,next:()=>Promise<any>) =>{
    await new RoutesController(app, router)
        .getRoutes(getAlgosRoutes)
        .getRoutes(getTestRoutes)
    await next()
})

app.use(async (ctx:Koa.Context,next:()=>Promise<any>) => {
    try {
        await next();
    }
    catch (err:any){
        ctx.status = err.status ?? 500
        ctx.body = {
            error:{
                message : err.message ? err.message : 'Произошла ошибка сервера'
            }
        }

        ctx.app.emit('error',err,ctx);
    }
})

router.get('/', async (ctx:Koa.Context) => {

    ctx.body = "Я сервер"
})


app.use(router.routes());
app.use(router.allowedMethods());

app.on('error', (err, ctx) => {
    console.log(err, ctx.status)
    if (ctx.status !== 302) {
        console.log(`ERROR: ${moment().format('DD.MM.YYYY hh:mm:ss')} ${ctx.status} ${ctx.request.url}`);
        console.log(err);
    }
});


app.listen(port,()=>{
    isLocalhost ? console.log(
        `Сервер запущен по ссылке\n http://localhost:${port}`
    ) : null;
})
