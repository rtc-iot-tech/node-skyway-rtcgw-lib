const Peer = require('./skw-rtc-gw')

/**
 * open connection with skyway signaling server
 *
 * @params {Object} params
 * @params {string} params.key    - api key of skyway
 * @params {string} [params.domain=localhost] - permitted domain for the api key
 * @params {boolean} [params.turn=true] - flag for using skyway turn
 * @return {Promise<Peer>}
 *
 * @example
 * const rtcgw = await RtcGw.open( { key: 'YOUR_API_KEY', domain: 'localhost' } )
 *
 */
function open( params ) {
  // validation for params SHOULD be done at new Peer().
  // So, we will not do any validation procedure here.
  const defaultParams = {
    domain: 'localhost',
    turn: true
  }
  const _params = Object.assign({}, defaultParams, params);

  return new Promise((resolve, reject) => {
    try {
      const peer = new Peer( _params );

      const errListener = ( err ) => {
        reject(err)
      }

      peer.on('open', id => {
        peer.removeListener( 'error', errListener )
        resolve( peer );
      })

      peer.on('error', errListener )
    } catch(err) {
      reject(err)
    }
  });
}

module.exports = {
  open
}
