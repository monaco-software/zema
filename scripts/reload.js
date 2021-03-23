// этот скрипт вставляется в
// документ для перезагрузки

document.addEventListener('DOMContentLoaded', () => {
  const checkConnection = () => {
    setTimeout(() => {
      if (!window.hotReloadSocket || window.hotReloadSocket.readyState !== WebSocket.OPEN) {
        window.hotReloadSocket = new WebSocket('ws://localhost:54321');

        window.hotReloadSocket.addEventListener('open', () => {
          const hello = 'Hello, WS Server!'
          hotReloadSocket.send(hello);
          console.log(`📯 sending '${hello}'`);
        });

        window.hotReloadSocket.addEventListener('message', (event) => {
          console.log(event.data);
          if (event.data === 'reload') {
            window.hotReloadSocket.close();
            window.location.reload();
          }
        });
      }
      checkConnection();
    }, 5 * 1000);
  }
  checkConnection();
});
