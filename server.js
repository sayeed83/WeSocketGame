const WebSocket = require('ws');
const words = require('./words/words');
const webSocketServer = new WebSocket.Server({ port: 8081 });
let sendData = {
  'index':'',
  'word': '',
  'time': 10,
  'left': 0,
  'score': 0,
  'referesh': 0
}
webSocketServer.on('connection', (webSocket) => {
  webSocket.on('message', (message) => {
    console.log(" message ", JSON.parse(message))
    const randIndex = Math.floor(Math.random() * words.length);
    let objMsg = JSON.parse(message);
    sendData.word = words[randIndex];
    if(objMsg.first === 1){
      console.log(' if ')
      sendData.index = randIndex;
      sendData.word = words[randIndex];
      sendData.referesh = 0;
      sendData.score = 0;
      broadcast(sendData);
    } else {
      if(objMsg.word === '') {
        sendData.left = sendData.left+1;
        sendData.index = randIndex;
        sendData.word = words[randIndex];
        broadcast(sendData);
      } else {
        if(words[objMsg.index] === objMsg.word) {
          sendData.score = sendData.score+1;
        } else {
          sendData.score = sendData.score-1;
        }
        sendData.index = randIndex;
        sendData.word = words[randIndex];
        broadcast(sendData);
      }
      if(sendData.left >= 3 || sendData.score === -2 || sendData.score >=10) {
        broadcast(sendData);
        sendData = {
          'index':'',
          'word': '',
          'time': 10,
          'left': 0,
          'score': 0,
          'referesh': 1
        }
      }
    }
    
  });
});

function broadcast(data) {
  webSocketServer.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}