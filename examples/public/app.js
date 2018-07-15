async function start(remoteID) {
  let local_id;
  const apikey = '3a712cac-8d9c-4ea7-b25c-e566473d152e' // APIKEY SHOULD BE CHANGED
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true})

  $("#local-video video").get(0).srcObject = stream

  const peer = new Peer({ key: apikey, debug: 3 })
  peer.on('error', err => {
    console.warn(err);
  })
  peer.on('open', id => {
    local_id = id
    $("#local-id").text(local_id)
    $("#recorded-file").attr({ "href": `/recorded/${local_id}.wav` });


    const call = peer.call( remoteID, stream, {
      metadata: {
        peer_id: local_id
      }
    } )

    call.on('stream', stream => {
      const fd_api = `/result/${local_id}`

      // draw rectanble by face detection result
      setInterval( ev => {
        fetch(fd_api)
          .then( res => res.json())
          .then( json => {
            drawRectangle(json.result.rectangles, json.result.size)
          })
      }, 1000);
    });
  })
}

/**
 *
 * @param {Object[]} squares
 * @param {number} suares[].x
 * @param {number} suares[].y
 * @param {number} suares[].width
 * @param {number} suares[].height
 * @param {object} size
 * @param {number} width
 * @param {number} height
 *
 */
function drawRectangle(squares, size) {
  if( !(squares instanceof Array) ) return

  const video = document.querySelector('#local-video video')

  const cvs = document.querySelector('#local-video canvas')
  cvs.width = video.videoWidth
  cvs.height = video.videoHeight

  const ctx = cvs.getContext('2d')

  ctx.beginPath()
  ctx.strokeStyle = 'cyan'
  ctx.lineWidth = 2
  squares.forEach( s => {
    const ratio_x = cvs.width / size.width
    const ratio_y = cvs.height / size.height
    ctx.strokeRect(
      s.x * ratio_x,
      s.y * ratio_y,
      s.width * ratio_x,
      s.height * ratio_y
    )
  })
}




$("form").on("submit", ev => {
  ev.preventDefault();

  const remoteID = $("#remote-id").val()

  start(remoteID);
})

async function getRemotePeerId() {
  const res = await fetch('/peer_id')
  const obj = await res.json()
  $("#remote-id").val(obj.peer_id)
}

getRemotePeerId();
