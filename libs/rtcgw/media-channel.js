const EventEmiiter = require('events')

const {
  do_get,
  do_post,
  do_delete,
  LongPolling
} = require('../util')

/**
  * Media Channel class
  *
  * @class
  *
  * @param {object} props
  * @param {object} props.call_params
  * @param {string} props.call_params.media_connection_id - media connection id
  *
  * @constructor MediaChannel
  *
  * @extends EventEmiiter
  */
class MediaChannel extends EventEmiiter {
  constructor(props) {
    super(props);

    this.media_connection_id = props.call_params.media_connection_id
    this.localStream = null
    this.constraints = null
    this.redirect_params = null
    this.remoteStream = null
  }

  /**
   * answer
   *
   * @param {object} stream - stream object
   * @param {object} redirect_params
   * @param {object} redirect_params.video
   * @param {string} redirect_params.video.ip_v4
   * @param {number} redirect_params.video.port
   * @param {object} redirect_params.audio
   * @param {string} redirect_params.audio.ip_v4
   * @param {number} redirect_params.audio.port
   *
   * @return {Promise<void>}
   * @method MediaChannel#answer
   *
   * @example
   * call.answer( stream, {
   *   video: {
   *     ip_v4: '127.0.0.1',
   *     port: 60001
   *   },
   *   audio: {
   *     ip_v4: '127.0.0.1',
   *     port: 60002
   *   }
   * } )
   */
  async answer( stream, redirect_params ) {
    const { constraints } = stream;
    this.localStream = stream
    this.constraints = constraints
    this.redirect_params = redirect_params

    this.eventLp = new LongPolling( { path: `/media/connections/${this.media_connection_id}/events` });
    this.eventLp.start();
    this.eventLp.on('data', data => this._handleEventData(data));

    const obj = Object.assign( {}, { constraints, redirect_params });

    this.remoteStream = await do_post(`/media/connections/${this.media_connection_id}/answer`, obj)
  }

  /**
   * get local stream
   *
   * @return {object}
   * @method MediaChannel#getLocalStream
   *
   * @example
   * call.getLocalStream()
   * #=> { video: { ip_v4, port, video_id }, audio: { ip_v4, port, audio_id } }
   */
  getLocalStream() {
    return Object.assign({}, { video: this.localStream.video, audio: this.localStream.audio });
  }

  /**
   * get remote stream
   *
   * @return {object}
   * @method MediaChannel#getRemoteStream
   *
   * @example
   * call.getRemoteStream()
   * #=> { video: { ip_v4, port, video_id }, audio: { ip_v4, port, audio_id } }
   */
  getRemoteStream() {
    return Object.assign( {}, {
      video : Object.assign( {}, this.redirect_params.video, { video_id : this.remoteStream.params.video_id } ),
      audio : Object.assign( {}, this.redirect_params.audio, { video_id : this.remoteStream.params.audio_id } )
    })
  }

  /**
   * get status
   *
   * @return {Promise<Object>}
   * @method MediaChannel#status
   *
   */
  async status() {
    const status = await do_get(`/media/connections/${this.media_connection_id}/status`)
    return status;
  }

  /**
   * close media channel
   *
   * @return {Promise<void>}
   * @method MediaChannel#close
   *
   */
  async close() {
    await do_delete(`/media/connections/${this.media_connection_id}`)
    if(this.eventLp) {
      this.eventLp.removeAllListeners( ['data'] );
      this.eventLp.stop();
      this.eventLp = null
    }
  }

  /**
   * handle event data
   *
   * @param {object} data
   * @private
   *
   */
  _handleEventData( data ) {
    const targets = ['STREAM', 'CLOSE', 'ERROR'];
    const idx = targets.indexOf(data.event)

    if( idx !== -1 ) {
      const name = targets[idx].toLowerCase();

      this.emit(name, data);
    }
  }

  /**
   * @event MediaChannel#stream
   * @type {object}
   */

  /**
   * @event MediaChannel#close
   * @type {object}
   */

  /**
   * @event MediaChannel#error
   * @type {object}
   */
}

module.exports = MediaChannel
