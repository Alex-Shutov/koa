import Koa from "koa";
import Router from "@koa/router";
import moment from "moment";
import {RoutesController} from "./utils.js";
import {getRoutes as getAlgosRoutes} from './algorythms/algorythms.controller.js'
import {getRoutes as getTestRoutes} from './test/test.controller.js'
import serve from 'koa-static'
import path from 'path';
import { fileURLToPath } from 'url';

const isLocalhost = !process.env.NODE_ENV;

const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);

const staticDirPath = path.join(__dirname, 'public');

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

router.get("/", async(ctx, next) =>
    serve(`${__dirname}/public`)({...ctx,...{path:'index.html'}}, next)
);

app.use(serve(staticDirPath))

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
