import { fnBrowserDetect } from './lib/utils.js';

/**
 * @type {import('socket.io').Socket}
 */
const socket = io({
  forceNew: true
});

socket.on('reload-page', () => {
  location.reload();
})

getIPs().then((ips) => {
  socket.emit('handshake', {
    path: location.pathname.slice(1),
    platform: window.navigator.userAgentData.platform,
    isMobile: window.navigator.userAgentData.mobile,
    browser: fnBrowserDetect(),
    ips,
  })
})

export { socket }
