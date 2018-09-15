const GstHelper = require('./base/gst-helper.js')

/**
 * deploy video-decorder
 * This function will deploy H.264 decorder it will emit JPEG data
 *
 * @param {object} params
 * @param {number} params.port - udp port to send rtp H.264 stream
 * @return {GstHelper}
 *
 * @example
 * const reenc = VideoReencoder.deploy({ port: 60000 })
 * dec.on('data', data => { recenc.push( data ) });
 * ...
 * reenc.stop();
 */
const deploy = ( params ) => {
  const { port } = params;

  const script = _createScript( { port } );

  const gstHelper = new GstHelper()
  gstHelper.start( script )

  return gstHelper
}

/**
 * create gstreamer script for jpeg stream to H.264
 *
 * @param {object} params
 * @param {number} params.port
 * @return {string} - script
 *
 * @private
 */
const _createScript = ( params ) => {
  const { port } = params;

  const script = [
    'appsrc name=src is-live=true',
    // 'videotestsrc is-live=true',
    // 'image/jpeg,width=640,height=480,framerate=30/1',
    'video/x-raw,width=640,height=480,framerate=30/1',
    // 'jpegdec',
    // 'timeoverlay',
    'x264enc aud=false key-int-max=1 tune=zerolatency intra-refresh=true',
    'video/x-h264,profile=constrained-baseline,level=(string)3.1',
    'rtph264pay pt=96',
    'application/x-rtp,profile-level-id=(string)42c01f',
    `udpsink host=127.0.0.1 port=${port}`
  ].join(" ! ");


  return script
}

module.exports = {
  deploy
}
