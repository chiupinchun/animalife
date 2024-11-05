import { RequestCtx } from "../types/request";
import { getModel } from "../connection";

const userModel = getModel('users')

const userController = {
  addUser({ body = {} }: RequestCtx) {
    const defaultUser = {
      name: '小處'
    }
    return userModel.add(Object.assign(defaultUser, body))
  },
  getUser({ params }: RequestCtx) {
    if (params.id) {
      return userModel.get(Number(params.id))
    }
    return null
  }
}

export default userController
