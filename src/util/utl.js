import Lodash from 'lodash'

const strJwtToken = 'jwtToken'
const strBearer = 'Bearer'

export default class Utl {

  static cloneDeepLodash(obj) {
    const clone = Lodash.cloneDeep(obj)
    return clone
  }

  static cloneDeepPostMessage(obj) {
    const channel = new MessageChannel()
    const inPort = channel.port1
    const outPort = channel.port2

    return new Promise(resolve => {
        inPort.onmessage = data => {
            resolve(data.data)
        }
        outPort.postMessage(obj)
    })
  }

  static cloneDeep2(obj) {
    let r = {}
    for (var name in obj) {
      if ( Utl.isObject(obj[name])) {
        r[name] = Utl.cloneDeep2(obj[name])
      }
      else {
        r[name] = obj[name]
      }
    }
    return r
  }

  static isObject(val) {
    return val instanceof Object;
  }

}

export { strJwtToken, strBearer,};
