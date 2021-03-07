import * as Koa from "koa"
import * as bodify from "koa-body"
import * as serve from "koa-static"
import { load } from "./utils/docors"
import { resolve } from "path"

const app = new Koa()
app.use(serve(`${__dirname}/public`))

app.use(
  bodify({
    multipart: true,
    //非严格模式允许delete
    strict: false
  })
)

// 引用错误捕捉的中间件
app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
  try {
    await next()
  } catch (err) {
    const code = err.status || 500
    const message = err.message
    ctx.body = {
      code,
      message
    }
    ctx.status = code // 200
  }
})

const router = load(resolve(__dirname, "./routes"))
app.use(router.routes())
// app.use((ctx: Koa.Context) => {
//   ctx.body = "hello koa"
// })

app.listen(3000, () => {
  console.log("http://localhost:3000")
})