# node-skyway-rtcgw-lib

A sample node library for [SkyWay WebRTC GW](https://github.com/skyway/skyway-webrtc-gateway)

## library entrypoint

```
index.js
```

node8.x or larger is required.

### sample snipet

```js
async function start() {
  const localStream = await getUserMedia( {video: true, audio: true} )
  const rtcgw = await open({
    'key': "YOUR_API_KEY"
  })

  const local_id = rtcgw.getPeerId();
  console.log(`setup completed with WebRTC GW. your peer id is ${local_id}`)
  server.setPeerId(local_id);


  rtcgw.on('call', async call => {
    const redirect_params = {
      video: { ip_v4: "127.0.0.1", port: 60000 },
      audio: { ip_v4: "127.0.0.1", port: 60001 }
    }
    // execute media processing functions here. For more detail, please check our example code
    // https://github.com/rtc-iot-tech/node-skyway-rtcgw-lib/blob/master/examples/index.js
    await call.answer( localStream, redirect_params );

    call.on('stream', async stream => {
      // In this timing, video and audio will be streamed to specific port numbers,
      // utilizing RTP/udp

      console.log('stream', stream);
    });

    call.on('close', ev => {
      console.log('call closed');
      call.close();
    });

    call.on('error', ev => {
      call.close();
    });
  });


  rtcgw.on('error', err => {
    console.warn(err);
  });
}
```

### API document

* open, getUserMedia, releaseUserMedia

  - [API doc](./docs/index.md)

* skwRtcGw

  - [API doc](./docs/skw-rtc-gw.md)

* MediaChannel

  - [API doc](./docs/media-channel.md)



# how to setup

## pre-clone

* install dependency libraries

Below will install dependency libraries not only for this library but also example app.

```bash
sudo apt-get update
sudo apt-get -y upgrade
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential
sudo npm -g i yarn

sudo apt-get install -y gstreamer1.0 gstreamer1.0-libav libgstreamer-plugins-base1.0-dev libopencv-dev yasm
```

* download `WebRTC GW`

Download binary for linux from [project site](https://github.com/skyway/skyway-webrtc-gateway#x86)
Then put it in your arbitrary directory and give it executable permission.

```
chmod +x gateway_linux
```

## install

After cloning this repository

```
yarn install
```

## run webrtc gw

* run webrtc GW

```
$ ./gateway_linux
```

# run example app

note : You may need to update APIKEY setting in both `examples/index.js` and `examples/public/app.js`

```
$ node examples/index.js
```

HTTP server will start on port 9000 for development and local communication among modules.
HTTPS server will start on port 9001 for global access.


# links

* SkyWay
  * https://webrtc.ecl.ntt.com/
* WebRTC GW project repository
  * https://github.com/skyway/skyway-webrtc-gateway
* How to get SkyWay API KEY
  * https://webrtc.ecl.ntt.com/en/login.html

# license

MIT

# disclaimer

This repository is not official [skyway](https://webrtc.ecl.ntt.com/) repository. This is just a sample project to utilize SkyWay WebRTC GW, personally.
