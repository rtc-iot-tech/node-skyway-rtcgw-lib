const EventEmitter = require('events')
const gstreamer = require('gstreamer-superficial')

/**
 * @class GstreamerHelper
 *
 */
class GstHelper extends EventEmitter {
  constructor(props) {
    super(props);

    this.pipeline = null
    this.appsink = null
    this.terminated = false
  }

  /**
   * start gstreamer script
   * when script includes `appsink` and name equal `sink`, this instance will emit `data`
   * event with chunk data
   *
   * @params {string} script - gstreamer pipeline script
   *
   * @method GstHelper#start
   *
   * @example
   *
   * gst_helper.start('udpsrc port=6000 ! appsink max-buffers=1 name=sink')
   * gst_helper.on('data', data => { ... })
   */
  start( script ) {
    this.pipeline = new gstreamer.Pipeline(script)
    this.appsink = this.pipeline.findChild('sink')


    this.pipeline.play()
    if( this.appsink && typeof this.appsink.pull === 'function' )
      this.appsink.pull( this._handlePull.bind(this) )
  }

  /**
   * stop gstreamer
   *
   * @method GstHelper#stop
   * @example
   *
   * gst_helper.stop()
   */
  stop() {
    this.terminated = true
    this.pipeline.stop()

    this.appsink = null;
    this.pipeline = null;
  }

  /**
   * handle chunkdata from appsink
   * it will emit 'data' event
   *
   * @param {binary} buf
   * @private
   */
  _handlePull( buf ) {
    if(buf) {
      this.emit('data', buf)

      if( this.terminated ) return

      this.appsink.pull(this._handlePull.bind(this))
    } else {
      console.warn("handlePull - buf is null, restart pull after 250 msec when not terminated")
      setTimeout( () => {
        if( ! this.terminated ) {
          this.appsink.pull(this._handlePull.bind(this))
        }
      }, 250)
    }
  }

  /**
   * @event GstHelper#data
   * @type {binary}
   *
   */
}

module.exports=GstHelper
