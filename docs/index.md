## Functions

<dl>
<dt><a href="#open">open(params, key, [domain], [trun])</a> ⇒ <code>Promise.&lt;skwRtcGw&gt;</code></dt>
<dd><p>open connection to WebRTC GW</p>
</dd>
<dt><a href="#getUserMedia">getUserMedia(params, video, audio)</a> ⇒ <code>Promise.&lt;object&gt;</code></dt>
<dd><p>get user media</p>
</dd>
<dt><a href="#releaseUserMedia">releaseUserMedia(stream)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>release user media</p>
</dd>
</dl>

<a name="open"></a>

## open(params, key, [domain], [trun]) ⇒ <code>Promise.&lt;skwRtcGw&gt;</code>
open connection to WebRTC GW

**Kind**: global function  
**Returns**: <code>Promise.&lt;skwRtcGw&gt;</code> - - WebRTC GW connector instance  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| params | <code>object</code> |  |  |
| key | <code>string</code> |  | api key of skyway |
| [domain] | <code>string</code> | <code>&quot;localhost&quot;</code> | permitted domain for the api key |
| [trun] | <code>boolean</code> | <code>true</code> | use skyway TURN |

**Example**  
```js
const rtcgw = await open( { key: 'YOUR_API_KEY' } )
```
<a name="getUserMedia"></a>

## getUserMedia(params, video, audio) ⇒ <code>Promise.&lt;object&gt;</code>
get user media

**Kind**: global function  
**Returns**: <code>Promise.&lt;object&gt;</code> - - stream object  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> |  |
| video | <code>boolean</code> | use video |
| audio | <code>boolean</code> | use audio |

**Example**  
```js
const localStream = await getUserMedia( { video: true, audio: true } )
```
<a name="releaseUserMedia"></a>

## releaseUserMedia(stream) ⇒ <code>Promise.&lt;void&gt;</code>
release user media

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| stream | <code>object</code> | stream object |

**Example**  
```js
await releaseUserMedia( localStream )
```
