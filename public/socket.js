import { fnBrowserDetect } from './lib/utils.js';

/**
 * @type {import('socket.io').Socket}
 */
const socket = io();

socket.on('reload-page', () => {
  location.reload();
})

getIPs().then((ips) => {
  socket.emit('handshake', {
    platform: window.navigator.userAgentData.platform,
    isMobile: window.navigator.userAgentData.mobile,
    browser: fnBrowserDetect(),
    ips,
  })
})

export { socket }
