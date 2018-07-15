const GstHelper = require('./base/gst-helper.js')

/**
 * deploy video-decorder
 * This function will deploy H.264 decorder it will emit JPEG data
 *
 * @param {object} params
 * @param {number} params.port - udp port to receive rtp H.264 stream
 * @return {GstHelper}
 *
 * @example
 * const dec = VideoDecorder.deploy({ port: 60000 })
 * dec.on('data', data => { // jpeg data });
 * ...
 * dec.stop();
 */
const deploy = ( params ) => {
  const { port } = params;

  const script = _createScript( { port } );

  const gstHelper = new GstHelper()
  gstHelper.start( script )

  return gstHelper
}

/**
 * create gstreamer script for opus to wav decorder
 *
 * @param {object} params
 * @param {number} params.port
 * @return {string} - script
 *
 * @private
 */
const _createScript = ( params ) => {
  const { port } = params;
  const caps= [
    "application/x-rtp",
    "media=(string)video",
    "clock-rate=(int)90000",
    "encoding-name=(string)H264"
  ].join(',');

  const script = [
    `udpsrc port=${port} caps=${caps}`,
    'queue',
    'rtph264depay',
    'avdec_h264',
    'videoconvert',
    'jpegenc',
    'appsink max-buffers=1 name=sink'
  ].join(" ! ");


  return script
}

module.exports = {
  deploy
}
