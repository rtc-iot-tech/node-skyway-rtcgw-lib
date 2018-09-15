const GstHelper = require('./base/gst-helper.js')
const gstHelper = new GstHelper()

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
  const { inPort, outPort } = params;

  const script = _createScript( { inPort, outPort } );

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
  const { inPort } = params;
  const caps= [
    "application/x-rtp",
    "media=(string)video",
    "clock-rate=(int)90000",
    "encoding-name=(string)H264"
  ].join(',');

  const script = [
    `udpsrc port=${inPort} caps=${caps}`,
    'rtpjitterbuffer',
    'queue',
    'rtph264depay',
    'avdec_h264',
    'videoconvert',
    'timeoverlay',
    'x264enc aud=false key-int-max=1 tune=zerolatency intra-refresh=true',
    'video/x-h264,profile=constrained-baseline,level=(string)3.1',
    'rtph264pay pt=96',
    'application/x-rtp,profile-level-id=(string)42c01f',
    'appsink name=sink'
  ].join(" ! ");

  console.log( script );


  return script
}

module.exports = {
  deploy
}
