const GstHelper = require('./base/gst-helper.js')

/**
 * deploy audio-decorder
 *
 * @param {object} params
 * @param {number} params.port - udp port to receive rtp opus stream
 * @return {GstHelper}
 *
 * @example
 * const dec = AudioDecorder.deploy({ port: 60000 })
 * dec.on('data', data => { ... });
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
     'application/x-rtp',
     'media=(string)audio',
     'clock-rate=(int)48000',
     'encoding-name=(string)X-GST-OPUS-DRAFT-SPITTKA-00'
  ].join(',');

  const script = [
    `udpsrc port=${port} caps=${caps}`,
    'queue',
    'rtpopusdepay',
    'opusdec',
    'wavenc',
    'appsink max-buffers=1 name=sink'
  ].join(" ! ");

  return script
}

module.exports = {
  deploy
}
