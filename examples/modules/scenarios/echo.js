const VideoEcho = require('../video-echo')

class Scenario {
  constructor(){
  }

  async start( { localStream, remoteStream, meta, server } ) {
    this.videoEcho = VideoEcho.deploy( {
      inPort: remoteStream.video.port,
      outPort: localStream.video.port
    } );

    this.videoEcho.on('data', (data, caps) => {
      // console.log( data.length );
    })
  }

  async stop() {
    try {
      this.videoEcho.stop();
      console.log('stopeed')
    } catch(err) {
      console.warn(err)
      throw err
    }
  }
}

module.exports = Scenario
