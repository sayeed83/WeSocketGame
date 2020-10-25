const connection = new WebSocket('ws://localhost:8081');

connection.onopen = () => {
  connection.send(JSON.stringify({
    'first':1
  }));
};

connection.onclose = () => {
  console.error('disconnected');
};

connection.onerror = (error) => {
  console.error('failed to connect', error);
};
let index = 0;
connection.onmessage = (event) => {
  for(i=0; i<10000; i++){
    window.clearInterval(i);
  }
  let obj = JSON.parse(event.data);
  if(obj.referesh === 0) {
    document.getElementById('typableText').innerHTML = obj.word;
    document.getElementById('totlatime').innerHTML = obj.time +' seconds  ';
    document.getElementById('score').innerHTML = obj.score;
    displayTime(obj.time);
    counter(obj.time);
  } else {
    document.getElementById('typableText').innerHTML = '';
    document.getElementById('time').innerHTML = '';
    document.getElementById('gameOver').innerHTML = 'Game Over Referesh to start again';
  }
  index = obj.index;
};


function displayTime(time) {
  let displayTime = 1;
  setInterval(function(){ 
    document.getElementById('time').innerHTML = displayTime++;
  }, 1000);
}

function counter(time) {
  setInterval(function(){ 
    connection.send(JSON.stringify({
      'first':0,
      'index':index,
      'word': ''
    }));
    document.getElementById('time').innerHTML = '';
  }, time*1000);
}
document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
  let message = document.querySelector('#message').value;
  connection.send(JSON.stringify({
    'first':0,
    'index':index,
    'word': message,
    'left': 1
  }));
  document.querySelector('#message').value = '';
}); 