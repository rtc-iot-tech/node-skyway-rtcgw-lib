const fetch = require('node-fetch')
const EventEmitter = require('events')

const { config } = require('../config')

class LongPolling extends EventEmitter {
  /**
   * @param {Object} props
   * @param {string} url - url of endpoint
   */
  constructor( props ) {
    super( props );

    this.loop = true
    this.path  = props.path
    this.params  = Object.assign({}, props.params)
  }

  async start() {
    while(this.loop) {
      const data = await do_get( this.path, this.params);
      this.emit('data', data)
    }
  }

  stop() {
    this.loop = false;
  }
}

/**
 * @params {string} path - e.g. /peers
 * @params {object} params - json body
 */
const do_post = async ( path, params ) => {
  try {
    const res = await _fetch(path, 'POST', params)

    return res
  } catch(err) {
    throw err
  }
}

/**
 * @params {string} path - e.g. /peers
 * @params {object} params - json body
 */
const do_delete = async ( path, params ) => {
  try {
    const queryString = Object.keys( params || {} )
      .map( key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) )
      .join('&')

    const _path = `${path}?${queryString}`
    const res = await _fetch(_path, 'DELETE', params)

    return res
  } catch(err) {
    throw err
  }
}


/**
 * @params {string} path - e.g. /peers
 * @params {object} params - json body
 */
const do_get = async ( path, params ) => {
  try {
    const queryString = Object.keys( params || {} ).map( key => {
      return `${key}=${params[key]}`
    }) .join('&')
    const _path = `${path}?${queryString}`

    return await _fetch(_path, 'GET')
  } catch(err) {
    throw err
  }
}

/**
 * @params {string} path
 * @params {string} method - GET, POST or DELETE
 * @params {object} params
 */
const _fetch = async ( path, method, params ) => {
  try {
    const url = `http://${config.host}:${config.port}${path}`
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    const body = ( typeof params === 'object' && params ) ? JSON.stringify( params ) : null

    const res = await fetch( url, { method, headers, body } )

    let json
    try {
      json = await res.json()
    } catch(err) {
      json = null
    }

    return json
  } catch(err) {
    throw err
  }
}

/**
 * get current time in sec order
 *
 * @return {number} - current time in sec order
 */
const get_current_sectime = () => {
  return parseInt( Date.now() / 1000 )
}

module.exports = {
  LongPolling,
  do_post,
  do_delete,
  do_get,
  get_current_sectime
}
