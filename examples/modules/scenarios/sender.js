const VideoSender = require('../video-sender')
const dgram = require('dgram');
const mqtt = require('mqtt');

const client = dgram.createSocket('udp4');

/**
 * send udp data
 *
 * @param { string } host - destination host
 * @param { number } port - destination port
 * @param { Buffer } data
 */
const udpSend = function( host, port, data ) {
  client.send(data, 0, data.length, port, host, function(err, bytes) {
    if (err) console.warn( err.message );
  });
}

class Scenario {
  constructor(){
    this.destinations = []
  }

  async start( { localStream, remoteStream, meta, server } ) {

    this.mqtt = mqtt.connect('mqtt://localhost')

    this.mqtt.on('connect', () => {
      console.log('connected to mqtt broaker');
      this.mqtt.subscribe(meta.peer_id, function (err) {
        if (!err) {
          console.log(`subscribe topic - ${meta.peer_id}`)
        } else {
          console.warn(`failed to subscribe - ${meta.peer_id}`);
        }
      })

      this.mqtt.on('message', ( topic, data ) => {
        const req = JSON.parse( data.toString() )
        this.destinations.push( req )
        console.log(`${JSON.stringify(req)} is added to destinations`);
      });
    })
    this.videoSender = VideoSender.deploy( {
      inPort: remoteStream.video.port,
    } );

    console.log( localStream.video )

    this.videoSender.on('data', (data, caps) => {
      this.destinations.forEach( dest => {
        udpSend( dest.host, dest.port, data );
      })
    })
  }

  async stop() {
    try {
      this.videoSender.stop();
      this.destinations.length = 0;
      console.log('stopeed')
    } catch(err) {
      this.destinations.length = 0;
      console.warn(err)
      throw err
    }
  }
}

module.exports = Scenario
