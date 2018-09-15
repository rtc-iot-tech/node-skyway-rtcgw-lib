async function start(remoteID, sourceID) {
  let local_id;
  const apikey = '3a712cac-8d9c-4ea7-b25c-e566473d152e' // APIKEY SHOULD BE CHANGED


  const peer = new Peer({ key: apikey, debug: 3 })
  peer.on('error', err => {
    console.warn(err);
  })
  peer.on('open', id => {
    local_id = id
    $("#local-id").text(local_id)

    const call = peer.call( remoteID, null, {
      metadata: {
        peer_id: local_id,
        source_peer_id: sourceID,
        mode: 'receive'
      }
    } )

    call.on('stream', stream => {
      console.log( stream );
      $("#remote-video video").get(0).srcObject = stream
    });
  })
}




$("form").on("submit", ev => {
  ev.preventDefault();

  const remoteID = $("#remote-id").val()
  const sourceID = $("#source-id").val()

  start(remoteID, sourceID)
})

async function getRemotePeerId() {
  const res = await fetch('/peer_id')
  const obj = await res.json()
  $("#remote-id").val(obj.peer_id)
}

getRemotePeerId();
