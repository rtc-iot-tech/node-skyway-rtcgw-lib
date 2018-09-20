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
    this.appsrc  = null
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
    try {
      this.pipeline = new gstreamer.Pipeline(script)
      this.appsink = this.pipeline.findChild('sink')
      this.appsrc  = this.pipeline.findChild('src')

      this.pipeline.play()

      if( this.appsink && typeof this.appsink.pull === 'function' )
        this.appsink.pull( this._handlePull.bind(this) )
    } catch(err) {
      console.warn(err)
    }
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

    delete this.appsink
    delete this.appsrc
    delete this.pipeline
  }

  /**
   * push binary data to appsrc if exists
   *
   * @param {binary} data
   * @param {object} caps
   * @method GstHelper#push
   * @example
   *
   * gst_helper.push(data, caps)
   */
  push( data, caps ) {
    if(!this.terminated && this.appsrc && typeof this.appsrc.push === 'function' ) {
      this.appsrc.push(data)
    }
  }

  /**
   * handle chunkdata from appsink
   * it will emit 'data' event
   *
   * @param {binary} buf
   * @private
   */
  _handlePull( buf, caps ) {
    if(buf) {
      this.emit('data', buf, caps)

      if( this.terminated ) return

      this.appsink.pull(this._handlePull.bind(this))
    } else {
      console.warn("handlePull - buf is null, restart pull after 15 msec when not terminated")
      setTimeout( () => {
        if( ! this.terminated ) {
          this.appsink.pull(this._handlePull.bind(this))
        }
      }, 15)
    }
  }

  /**
   * @event GstHelper#data
   * @type {binary}
   *
   */
}

module.exports=GstHelper
