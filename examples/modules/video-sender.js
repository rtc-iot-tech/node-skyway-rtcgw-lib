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

  const sink = [
    'sink_0::xpos=0     sink_0::ypos=0 sink_0::alpha=1 sink_0::zorder=0',
    'sink_1::xpos=540 sink_1::ypos=340 sink_1::alpha=1 sink_1::zorder=1'
  ].join(" ")

  const mixer = [
    `videomixer background=1 name=mix ${sink}`,
    'videoscale',
    'video/x-raw,width=720,height=480',
    'videoconvert',
    'x264enc aud=false key-int-max=1 tune=zerolatency intra-refresh=true',
    'video/x-h264,profile=constrained-baseline,level=(string)3.1',
    'rtph264pay pt=96',
    'application/x-rtp,profile-level-id=(string)42c01f',
    'appsink name=sink'
  ].join(" ! ")

  const src1 = [
    `udpsrc port=${inPort} caps=${caps}`,
    'rtpjitterbuffer',
    'queue',
    'rtph264depay',
    'avdec_h264',
    'videoscale',
    'video/x-raw,width=160,height=120',
    'mix.sink_1'
  ].join(" ! ")

  const src0 = [
    'filesrc location=/home/ubuntu/sp.mov',
    'qtdemux',
    'avdec_h264',
    'videoscale',
    'video/x-raw,width=720,height=480',
    'videoconvert',
    'mix.sink_0'
   ].join(" ! ");

  const script = [
    mixer, src0, src1
  ].join(" ")

  console.log( script );


  return script
}

module.exports = {
  deploy
}
