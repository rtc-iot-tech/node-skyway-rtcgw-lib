/* index.js */
const {
  open
} = require('./libs/rtcgw')

const {
  getUserMedia,
  releaseUserMedia
} = require('./libs/rtcgw/navigator')

/**
 * open connection to WebRTC GW
 *
 * @param {object} params
 * @param {string} key - api key of skyway
 * @param {string} [domain=localhost] - permitted domain for the api key
 * @param {boolean} [trun=true] - use skyway TURN
 * @return {Promise<skwRtcGw>} - WebRTC GW connector instance
 * @method open
 *
 * @example
 * const rtcgw = await open( { key: 'YOUR_API_KEY' } )
 */

/**
 * get user media
 *
 * @param {object} params
 * @param {boolean} video - use video
 * @param {boolean} audio - use audio
 * @return {Promise<object>} - stream object
 * @method getUserMedia
 *
 * @example
 * const localStream = await getUserMedia( { video: true, audio: true } )
 */

/**
 * release user media
 *
 * @param {object} stream - stream object
 * @return {Promise<void>}
 * @method releaseUserMedia
 *
 * @example
 * await releaseUserMedia( localStream )
 */

module.exports = {
  open,
  getUserMedia,
  releaseUserMedia
}
