import * as Koa from "koa"
import { get, post, middlewares } from "../utils/docors"
const users = [{
  name: "小明",
  age: 8
}]

@middlewares([
  async (ctx: Koa.Context, next: () => Promise<any>) => {
    if (ctx.header.token) {
      await next()
    } else {
      throw { status: 412, message: "请登录" }
    }
  }
])
export default class User {
  @get("/user")
  public list(ctx: Koa.Context) {
    ctx.body = { ok: 1, data: users }
  }

  @post("/user", {
    middlewares: [
      async (ctx: Koa.Context, next: () => Promise<any>) => {
        const name = ctx.request.body.name
        if (!name) {
          throw { status: 400, message: "请输入用户名" }
        }
        await next()
      }
    ]
  })
  public add(ctx: Koa.Context) {
    users.push(ctx.request.body)
    ctx.body = { ok: 1 }
  }
}