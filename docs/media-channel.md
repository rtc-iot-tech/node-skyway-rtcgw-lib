<a name="MediaChannel"></a>

## MediaChannel ⇐ <code>EventEmiiter</code>
**Kind**: global class  
**Extends**: <code>EventEmiiter</code>  

* [MediaChannel](#MediaChannel) ⇐ <code>EventEmiiter</code>
    * [new MediaChannel(props)](#new_MediaChannel_new)
    * [.answer(stream, redirect_params)](#MediaChannel+answer) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.getLocalStream()](#MediaChannel+getLocalStream) ⇒ <code>object</code>
    * [.getRemoteStream()](#MediaChannel+getRemoteStream) ⇒ <code>object</code>
    * [.status()](#MediaChannel+status) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.close()](#MediaChannel+close) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="new_MediaChannel_new"></a>

### new MediaChannel(props)
Media Channel class


| Param | Type | Description |
| --- | --- | --- |
| props | <code>object</code> |  |
| props.call_params | <code>object</code> |  |
| props.call_params.media_connection_id | <code>string</code> | media connection id |

<a name="MediaChannel+answer"></a>

### mediaChannel.answer(stream, redirect_params) ⇒ <code>Promise.&lt;void&gt;</code>
answer

**Kind**: instance method of [<code>MediaChannel</code>](#MediaChannel)  

| Param | Type | Description |
| --- | --- | --- |
| stream | <code>object</code> | stream object |
| redirect_params | <code>object</code> |  |
| redirect_params.video | <code>object</code> |  |
| redirect_params.video.ip_v4 | <code>string</code> |  |
| redirect_params.video.port | <code>number</code> |  |
| redirect_params.audio | <code>object</code> |  |
| redirect_params.audio.ip_v4 | <code>string</code> |  |
| redirect_params.audio.port | <code>number</code> |  |

**Example**  
```js
call.answer( stream, {
  video: {
    ip_v4: '127.0.0.1',
    port: 60001
  },
  audio: {
    ip_v4: '127.0.0.1',
    port: 60002
  }
} )
```
<a name="MediaChannel+getLocalStream"></a>

### mediaChannel.getLocalStream() ⇒ <code>object</code>
get local stream

**Kind**: instance method of [<code>MediaChannel</code>](#MediaChannel)  
**Example**  
```js
call.getLocalStream()
#=> { video: { ip_v4, port, video_id }, audio: { ip_v4, port, audio_id } }
```
<a name="MediaChannel+getRemoteStream"></a>

### mediaChannel.getRemoteStream() ⇒ <code>object</code>
get remote stream

**Kind**: instance method of [<code>MediaChannel</code>](#MediaChannel)  
**Example**  
```js
call.getRemoteStream()
#=> { video: { ip_v4, port, video_id }, audio: { ip_v4, port, audio_id } }
```
<a name="MediaChannel+status"></a>

### mediaChannel.status() ⇒ <code>Promise.&lt;Object&gt;</code>
get status

**Kind**: instance method of [<code>MediaChannel</code>](#MediaChannel)  
<a name="MediaChannel+close"></a>

### mediaChannel.close() ⇒ <code>Promise.&lt;void&gt;</code>
close media channel

**Kind**: instance method of [<code>MediaChannel</code>](#MediaChannel)  
