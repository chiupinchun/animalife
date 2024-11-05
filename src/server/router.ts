import userController from "./controllers/user"
import { RequestCtx } from "./types/request"

type routeHandler = (ctx: RequestCtx) => unknown | Promise<unknown>

class Router {
  routes: Record<string, {
    GET?: routeHandler
    POST?: routeHandler
    PATCH?: routeHandler
    DELETE?: routeHandler
  }> = {}

  get(path: string, fn: routeHandler) {
    if (!this.routes[path]) {
      this.routes[path] = {}
    }
    this.routes[path].GET = fn
  }
  post(path: string, fn: routeHandler) {
    if (!this.routes[path]) {
      this.routes[path] = {}
    }
    this.routes[path].POST = fn
  }
  patch(path: string, fn: routeHandler) {
    if (!this.routes[path]) {
      this.routes[path] = {}
    }
    this.routes[path].PATCH = fn
  }
  delete(path: string, fn: routeHandler) {
    if (!this.routes[path]) {
      this.routes[path] = {}
    }
    this.routes[path].DELETE = fn
  }

  response(
    fullPath: string,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
    ctx: Partial<RequestCtx> = {}
  ) {
    const [path, searchParams] = fullPath.split('?')

    if (searchParams) {
      ctx.query = searchParams.split('&').reduce((result, item) => {
        const [key, value] = item.split('=')
        if (result[key]) {
          if (Array.isArray(result[key])) {
            result[key].push(value)
          } else {
            const existedValue = result[key]
            result[key] = [existedValue, value]
          }
        } else {
          result[key] = value
        }
        return result
      }, {} as Record<string, string | string[]>)
    }

    const [route, params] = this.findRoute(path)

    const fn = route?.[method]
    if (!fn) { throw new Error(`api route not found: (${method})${fullPath}`) }

    ctx.params = params

    return Promise.resolve(fn({
      query: {},
      params: {},
      body: {},
      ...ctx
    }))
  }

  findRoute(path: string) {
    const splitedPath = path.replace(/^\//, '').split('/')
    let params: Record<string, string> = {}

    const entry = Object.entries(this.routes).find(([key]) => {
      const splitedKey = key.replace(/^\//, '').split('/')
      if (splitedPath.length !== splitedKey.length) { return false }
      for (let i = 0; i < splitedPath.length; i++) {
        params = {}
        if (splitedKey[i][0] === ':') {
          params[splitedKey[i].slice(1)] = splitedPath[i]
        } else if (splitedKey[i] !== splitedPath[i]) {
          return false
        }
      }
      return true
    })

    return [
      entry?.[1],
      params
    ] as const
  }
}

const router = new Router()
router.post('/user', userController.addUser)
router.get('/user/:id', userController.getUser)

export default router
