const {
  open
} = require('./index')

const {
  getUserMedia,
  releaseUserMedia
} = require('./navigator')

describe('open()', () => {
  test('open() test', async () => {

    const localStream = await getUserMedia({video: true, audio: true });

    const skyway = await open({
      'key': "3a712cac-8d9c-4ea7-b25c-e566473d152e"
    })

    const status = await skyway.status()

    skyway.on('error', err => {
      console.warn(err);
    });

    await releaseUserMedia( localStream )
    await skyway.destroy();

  });
});

