<a name="skwRtcGw"></a>

## skwRtcGw ⇐ <code>EventEmiiter</code>
**Kind**: global class  
**Extends**: <code>EventEmiiter</code>  

* [skwRtcGw](#skwRtcGw) ⇐ <code>EventEmiiter</code>
    * [new skwRtcGw(props)](#new_skwRtcGw_new)
    * [.getPeerId()](#skwRtcGw+getPeerId) ⇒ <code>string</code>
    * [.status()](#skwRtcGw+status) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.destroy()](#skwRtcGw+destroy) ⇒ <code>Promise.&lt;NULL&gt;</code>

<a name="new_skwRtcGw_new"></a>

### new skwRtcGw(props)
SDK for skyway RTC GW


| Param | Type | Description |
| --- | --- | --- |
| props | <code>object</code> |  |
| props.key | <code>string</code> | skyway api key |
| props.domain | <code>string</code> | permitted domain name for the api key |
| props.turn | <code>boolean</code> | a flag for using turn |

**Example**  
```js
const rtcgw = new skwRtcGw({
 key: 'YOUR_API_KEY',
 domain: 'localhost',
 turn: true
})
```
<a name="skwRtcGw+getPeerId"></a>

### skwRtcGw.getPeerId() ⇒ <code>string</code>
get peer id

**Kind**: instance method of [<code>skwRtcGw</code>](#skwRtcGw)  
**Returns**: <code>string</code> - - return peer_id  
**Example**  
```js
const peer_id = rtcgw.getPeerId()
```
<a name="skwRtcGw+status"></a>

### skwRtcGw.status() ⇒ <code>Promise.&lt;object&gt;</code>
get status

**Kind**: instance method of [<code>skwRtcGw</code>](#skwRtcGw)  
**Returns**: <code>Promise.&lt;object&gt;</code> - - resolve status object  
**Example**  
```js
const status = await rtcgw.status()
```
<a name="skwRtcGw+destroy"></a>

### skwRtcGw.destroy() ⇒ <code>Promise.&lt;NULL&gt;</code>
destroy

**Kind**: instance method of [<code>skwRtcGw</code>](#skwRtcGw)  
**Example**  
```js
await rtcgw.destroy()
```
