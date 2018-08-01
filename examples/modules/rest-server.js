const express = require('express')
const cors = require('cors')
const EventEmitter = require('events')

const https = require('https')
const fs = require('fs')

const { port, secure_port } = { port: 9000, secure_port: 9001 }

const key = fs.readFileSync(__dirname + '/../cert/server.key')
const cert = fs.readFileSync(__dirname + '/../cert/server.crt')
const ca = fs.readFileSync(__dirname + '/../cert/server.csr')

class RestServer extends EventEmitter {
  constructor(props) {
    super( props )

    this.app = express();
    this.app.use(cors())
    this.app.use('/', express.static(__dirname + '/../public'))

    this.port = port;
    this.secure_port = secure_port;
    this.peer_id = null

    this.server = null

    this.result = []

    this.setHandler()
    this.start()
  }

  /**
   * set local peer id
   *
   * @param {string} id - local peer id
   */
  setPeerId(id) {
    this.peer_id = id;
  }

  /**
   * set face detection result
   *
   * @param {string} client_id - peer_id of remote client
   * @param {object} obj - face detection result
   */
  setResult(id, obj) {
    this.result[id] = obj
  }

  setHandler() {
    // return local peer id
    this.app.get('/peer_id', ( req, res ) => {
      res.json( { peer_id: this.peer_id } );
    });

    // return face detection result
    this.app.get('/result/:id', ( req, res ) => {
      const id = req.params.id
      const result = this.result[id] || {}

      res.json( { id, result } );
    });
  }

  start() {
    this.server = https.createServer( { key, cert, ca }, this.app )
      .listen( this.secure_port, () => {
        console.log(`https rest server start listening on port ${this.secure_port}`);
      })
    this.app.listen( this.port, () => {
      console.log(`rest server start listening on port ${this.port}`);
    })
  }

  stop() {
    if( this.server ) {
      this.server.close();
      this.server = null;
    }
  }
}

module.exports = RestServer
