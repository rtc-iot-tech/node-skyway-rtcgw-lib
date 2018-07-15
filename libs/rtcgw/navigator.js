const {
  do_post,
  do_delete
} = require('../util')

/**
 *
 * get user media
 *
 * @param {object} params
 * @param {boolean} params.video
 * @param {boolean} params.audio
 * @return {Promise<Object>} - {video: { media_id, port, ip_v4, ip_v6}, audio: { media_id, port, ip_v4, ip_v6 } }
 */
async function getUserMedia( params ) {
  let video = null, audio = null;

  if( params.video ) {
    video = await do_post('/media', {is_video: true})
  }

  if( params.audio ) {
    audio = await do_post('/media', {is_video: false})
  }

  const tmp = { video, audio }

  const constraints = Object
    .keys( tmp )
    .reduce( (accum, key) => {
      if( key === 'video' && tmp['video'] ) {
        return Object.assign( {}, accum, {
          video: true,
          videoReceiveEnabled: true,
          video_params: {
            band_width: 0,
            codec: 'H264',
            media_id: tmp['video'].media_id,
            payload_type: 100,
            sampling_rate: 90000
          }
        });
      } else if( key === 'audio' && tmp['audio'] ) {
        return Object.assign( {}, accum, {
          audio: true,
          audioReceiveEnabled: true,
          audio_params: {
            band_width: 0,
            codec: 'OPUS',
            media_id: tmp['audio'].media_id,
            payload_type: 111,
            encoding_parameters: [ 2 ],
            sampling_rate: 48000
          }
        });
      } else {
        return Object.assign( {}, accu, { [key]: false } );
      }
    }, {});


  return Object.assign( {}, tmp, { constraints });
}

/**
 * release user media
 *
 * @param {object} stream
 * @param {object} stream.video
 * @param {object} stream.audio
 * @return {Promise<void>}
 */
async function releaseUserMedia( stream ) {
  if( stream.video )  {
    const video = await do_delete(`/media/${stream.video.media_id}`)
  }

  if( stream.audio ) {
    const audio = await do_delete(`/media/${stream.audio.media_id}`)
  }

  return null;
}

module.exports = {
  getUserMedia,
  releaseUserMedia
};
