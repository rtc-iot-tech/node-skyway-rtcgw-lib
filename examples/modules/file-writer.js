const fs = require('fs')
const { exec } = require('child_process');

/**
 * deploy file writer
 *
 * @param {string} path - path to write file
 * @return {Pormise<FileWriter>}
 *
 * @example
 * const writer = await FileWriter.deploy( _dirname + '/recorded/test.wav' )
 * writer.write( buf );
 * ...
 * writer.close()
 */
const deploy = ( path ) => {
  return new Promise( (resolve, reject) => {
    fs.open( path, 'wx', (err, fd) =>  {
      if( err ) {
        reject(err)
      } else {
        const writer = new FileWriter( fd, path )
        resolve(writer)
      }
    });
  });
}


/**
 * FileWriter
 *
 * @class
 *
 * @constructor
 *
 * @param {number} fd - file descriptor
 * @param {string} path - file path
 */
class FileWriter {
  constructor( fd, path ) {
    this.fd = fd
    this.path = path
  }

  /**
   * write data
   *
   * @param {binary} data - data to write
   * @return {Promise<object>}
   * @method FileWriter#write
   * @example
   * const { bytesWritten, buffer } = await writer.write(data)
   */
  write( data ) {
    return new Promise( (resolve, reject) => {
      fs.write( this.fd, data, ( err, bytesWritten, buffer ) => {
        if (err) {
          console.warn(err)
          reject(err);
        } else {
          resolve( bytesWritten, buffer );
        }
      });
    })
  }

  /**
   * close writer
   *
   * @return {Promise<void>
   *
   * @example
   * await writer.close()
   *
   */
  close() {
    return new Promise((resolve, reject) => {
      fs.close( this.fd, err => {
        exec(`rm ${this.path}`);

        if (err) {
          reject(err);
        } else {
          this.fd = undefined;
          this.path = undefined;
          resolve();
        }
      })
    })
  }
}

module.exports = {
  deploy
}
