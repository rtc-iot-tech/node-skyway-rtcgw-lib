/* examples/index.js */
const {
  open,
  getUserMedia,
  releaseUserMedia
} = require('../index')

const RestServer = require('./modules/rest-server')
const Scenario   = require('./modules/scenarios/record-facedetection')

const APIKEY = "3a712cac-8d9c-4ea7-b25c-e566473d152e"
const MIN_PORT = 60000;
const MAX_PORT = 61000;

//////////////////////////////////////////////
// port management for each module
let curr_port = MIN_PORT;

function getPort() {
  if ( curr_port < MAX_PORT ) {
    curr_port++
  } else {
    curr_port = MIN_PORT
  }

  return curr_port
}

//////////////////////////////////////////////
// main functions
let rtcgw, server

async function start() {
  // start REST server (for obtaining peerid, face detection, recorded file and static contents);
  server = new RestServer()

  rtcgw = await open({
    'key': APIKEY
  })


  const local_id = rtcgw.getPeerId();
  server.setPeerId(local_id);

  console.log(`setup completed with WebRTC GW. your peer id is ${local_id}`)

  rtcgw.on('call', async call => {
    ///////////////////////////////////////
    // make answer
    const localStream = await getUserMedia( {video: true, audio: true} )

    const redirect_params = {
      video: { ip_v4: "127.0.0.1", port: getPort() },
      audio: { ip_v4: "127.0.0.1", port: getPort() }
    }
    await call.answer( localStream, redirect_params );

    ///////////////////////////////////////
    // execute scenario, session by session
    const remoteStream = call.getRemoteStream()

    const status = await call.status()
    // meta includes client peer_id as token property.
    const meta = JSON.parse( status.metadata );

    const scenario = new Scenario()
    await scenario.start( remoteStream, meta, server );


    ///////////////////////////////////////
    // for close and error processing
    call.on('close', async ev => {
      console.log('call closed');
      await scenario.stop();
      await releaseUserMedia( localStream )
      call.close();
    });

    call.on('error', async ev => {
      await scenario.stop();
      await releaseUserMedia( localStream )
      call.close();
    });
  });

  rtcgw.on('error', err => {
    console.warn(err);
  });
}


/////////////////////////////////////////////////
// clean up process when process will exit

process.on('cleanup', async (exit_id) => {
  console.log('clean up process');
  try {
    console.log('released')
    await rtcgw.destroy();
    console.log('destroyed')
    server.stop();
    console.log('rest server stopped');
    process.exit( exit_id );
  } catch(err) {
    console.warn(err);
  }
});

process.on('SIGTERM', () => {
  process.emit('cleanup', 0);
});

// catch ctrl+c event and exit normally
process.on('SIGINT', () => {
  console.log('Ctrl-C...');
  process.emit('cleanup', 2);
});

//catch uncaught exceptions, trace, then exit normally
process.on('uncaughtException', e => {
  console.log('Uncaught Exception...');
  console.log(e.stack);
  process.emit('cleanup', 99);
});

//////////////////////////////////////////////////
// start process
start()
