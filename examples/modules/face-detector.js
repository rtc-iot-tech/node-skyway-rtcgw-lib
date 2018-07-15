/* face-detector */

const cv = require('opencv')

/**
 * face detector using opencv
 *
 * @params {Binary} jpeg
 * @return {Promise<Object>}
 *
 */
function detect(jpeg) {
  return new Promise( (resolve, reject) => {
    try {
      cv.readImage(jpeg, (err, im) => {
        if( !err ) {
          const size = im.size()
          const width = size[1], height = size[0]
          im.detectObject(cv['FACE_CASCADE'], {}, (err, res) => {
            if(!err) resolve({
              size: { width, height },
              rectangles: res
            })
            else reject(err)
          });
        } else {
          reject(err)
        }
      })
    } catch(err) {
      reject(err);
    }
  });
}

module.exports = {
  detect
}

