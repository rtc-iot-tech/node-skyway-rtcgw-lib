const EventEmiiter = require('events')

const MediaChannel = require('./media-channel')
const {
  do_get,
  do_post,
  do_delete,
  LongPolling
} = require('../util')

/**
  * SDK for skyway RTC GW
  *
  * @class
  *
  * @param {object} props
  * @param {string} props.key - skyway api key
  * @param {string} props.domain - permitted domain name for the api key
  * @param {boolean} props.turn - a flag for using turn
  *
  * @constructor skwRtcGw
  *
  * @extends EventEmiiter
  *
  * @example
  * const rtcgw = new skwRtcGw({
  *  key: 'YOUR_API_KEY',
  *  domain: 'localhost',
  *  turn: true
  * })
  */
class skwRtcGw extends EventEmiiter {
  constructor( props ) {
    super( props );
    this.props = props

    this.engine = null
    this.peer = null

    this.ports = [];

    this.eventLp = null;
    this.statusLp = null;

    this._create();
  }

  /**
   *
   * create connection
   *
   * @private
   */
  async _create() {
    try {
      // const engine_res = await do_post('/engines/libwebrtc', {plugins: []})
      // this.engine = engine_res.params

      const peers_res = await do_post('/peers', { key: this.props.key, domain: this.props.domain, turn: true })
      this.peer = peers_res.params

      this.emit('open', this.peer.peer_id );

      this.eventLp = new LongPolling( {
        path: `/peers/${this.peer.peer_id}/events`,
        params: this.peer
      } )
      this.eventLp.start();
      this.eventLp.on('data', data => {
        this._handleEventData(data);
      })
    } catch (err) {
      this.emit('error', err.message)
      await this.destroy();
      throw err
    }
  }

  /**
   * handle event data
   *
   * @param {Object} data
   *
   * @private
   */
  _handleEventData(data) {
    const targets = ['OPEN', 'CONNECTION', 'CALL', 'STREAM', 'CLOSE', 'ERROR']
    const idx = targets.indexOf(data.event)

    if( idx !== -1) {
      const name = targets[idx].toLowerCase();

      switch(name) {
      case 'call':
        const call = new MediaChannel(data);
        this.emit( name, call );
        break;
      default:
        this.emit( name, data );
      }
    }
  }

  /**
   * get peer id
   *
   * @return {string} - return peer_id
   * @method skwRtcGw#getPeerId
   *
   * @example
   * const peer_id = rtcgw.getPeerId()
   */
  getPeerId() {
    return this.peer.peer_id
  }

  /**
   * get status
   *
   * @return {Promise<object>} - resolve status object
   * @method skwRtcGw#status
   *
   * @example
   * const status = await rtcgw.status()
   */
  async status() {
    return await do_get(`/peers/${this.peer.peer_id}/status`, this.peer)
  }

  /**
   * destroy
   *
   * @return {Promise<NULL>}
   * @method skwRtcGw#destroy
   *
   * @example
   * await rtcgw.destroy()
   */
  async destroy() {
    try {
      const res = await do_delete( `/peers/${this.peer.peer_id}`, { token: this.peer.token } );

      if(this.eventLp) {
        this.eventLp.removeAllListeners( ['data'] );
        this.eventLp.stop();
        this.eventLp = null
      }
      return null
    } catch(err) {
      throw err
    }
  }

  /**
   * open
   *
   * @event skwRtc#open
   * @type {object}
   */

  /**
   * @event skwRtcGw#connection
   * @type {object}
   */

  /**
   * @event skwRtcGw#call
   * @type {MediaConnection}
   */

  /**
   * @event skwRtcGw#stream
   * @type {object}
   */

  /**
   * @event skwRtcGw#close
   * @type {object}
   */

  /**
   * @event skwRtcGw#error
   * @type {object}
   */
}

module.exports = skwRtcGw
