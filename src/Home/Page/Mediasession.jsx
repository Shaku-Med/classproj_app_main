const MediaSession = () => { 
    if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: "Class Project",
          artist: "Mohamed Amara - Medzy",
          album: "Test Video Calls",
          artwork: [
            {
              src: "../favicon.ico",
              sizes: "96x96",
              type: "image/png",
            },
            {
              src: "../favicon.ico",
              sizes: "128x128",
              type: "image/png",
            },
            {
              src: "../favicon.ico",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "../favicon.ico",
              sizes: "256x256",
              type: "image/png",
            },
            {
              src: "../favicon.ico",
              sizes: "384x384",
              type: "image/png",
            },
            {
              src: "../favicon.ico",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        });
    }
}

export default MediaSession