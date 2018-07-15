const AudioDecorder = require('../audio-decorder')
const VideoDecorder = require('../video-decorder')
const FileWriter    = require('../file-writer')
const FaceDetector  = require('../face-detector')

class Scenario {
  constructor(){
    this.audioDecorder = null;
    this.fileWriter = null;
    this.last = parseInt( Date.now() / 1000 );
  }

  async start( remoteStream, meta, server ) {
    this.audioDecorder = AudioDecorder.deploy( { port: remoteStream.audio.port } );
    this.videoDecorder = VideoDecorder.deploy( { port: remoteStream.video.port } );

    const filename = `${meta.peer_id}.wav`
    this.fileWriter = await FileWriter.deploy( __dirname + `/../../public/recorded/${filename}`)

    // audio recording
    this.audioDecorder.on('data', data => {
      this.fileWriter.write( data )
    });

    // data is jpeg binary
    this.videoDecorder.on('data', async data => {
      const curr = parseInt( Date.now() / 1000 );

      // every 1 seconds
      if( this.last < curr ) {
        this.last = curr
        const result = await FaceDetector.detect(data)
        server.setResult( meta.peer_id, result )
      }
    });
  }

  async stop() {
    try {
      this.audioDecorder.stop();
      this.videoDecorder.stop();
      await this.fileWriter.close();
    } catch(err) {
      console.warn(err)
      throw err
    }
  }
}

module.exports = Scenario
