import Koa from "koa";
import Router from "@koa/router";
import moment from "moment";

const isLocalhost = !process.env.NODE_ENV;

const app = new Koa();
const router = new Router();
const port = 3500

app.use(async (ctx,next) => {
    try {
        await next();
    }
    catch (err){
        ctx.status = err.status ?? 500
        ctx.body = {
            error:{
                message : err.message ? err.message : 'Произошла ошибка сервера'
            }
        }
        ctx.app.emit('error',err,ctx);
    }
})

router.get('/', async ctx => {

    ctx.body = "Я сервер"
})

router.get("/hello",async ctx => {
    throw new Error('text');
    ctx.body = "Привет";
    ctx.status = 418;
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
