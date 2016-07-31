var TelegramBot = require('node-telegram-bot-api');
var request = require('request');

var token = '258430059:AAHiaYOV93Z3xNyqW4W_Mvjm2YwJtgT2qWM';

var bot = new TelegramBot(token, {
  polling: true
});

var pos = {
  lon: false,
  lat: false
}

bot.getMe().then(function(me){
    console.log('Hello! My name is %s!', me.first_name);
    console.log('My id is %s.', me.id);
    console.log('And my username is @%s.', me.username);
});

bot.onText(/\/start/, function (msg) {
  var chatId = msg.chat.id;
  // From file
  var photo = __dirname+'/test.jpg';
  bot.sendPhoto(chatId, photo, {
    caption: "Привет я музыкальный фланёрный бот отправь мне свою геолокацию..."
  });
});

function genkeys(){
  var args = []; for(var i in arguments){
    args.push( typeof arguments[i] === typeof [] ? arguments[i] : [ arguments[i].toString() ] )
  }
  return {
    reply_markup: JSON.stringify({
      keyboard: args,
      "one_time_keyboard": true
    })
  };
}


function sendAudio(msg) {
  var chatId = msg.chat.id;
  var url = 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg';
    // From HTTP request!
    var audio = request(url);
    bot.sendAudio(chatId, audio)
      .then(function (resp) {
        var messageId = resp.message_id;
        bot.sendMessage(chatId, 'нравится?', genkeys('отлично, посмотреть записку','да','нет'))
        //bot.forwardMessage(chatId, chatId, messageId);
      });
}

bot.on('location', function(msg){
  pos.lon = msg.location.longitude,
  pos.lat = msg.location.latitude,
  var time = msg.date;
  //console.log( JSON.stringify(msg, null, '\t') );
  bot.sendMessage( msg.chat.id , 'Отлично вы поделились своей геолокацией!', genkeys('хочу послушать музыку места','хочу добавить музыку') );
});

bot.on('audio', function(msg){
  console.log( JSON.stringify(msg, null, '\t') );
  bot.sendMessage( msg.chat.id , 'ваша музыка сохранена и привязанна', genkeys('добавить описание') );
})

bot.on('voice', function(msg){
  console.log( JSON.stringify(msg, null, '\t') );
  bot.sendMessage( msg.chat.id , 'ваша музыка сохранена и привязанна', genkeys('добавить описание') );
})

bot.on('text', function (msg) {
  console.log( JSON.stringify(msg, null, '\t') );
  var chatId = msg.chat.id;

  switch (msg.text) {
    case 'хочу послушать музыку места':
      sendAudio(msg)
      break;
    case 'хочу добавить музыку':
      bot.sendMessage(chatId , 'добавьте аудио-файл или запишите');
      break;
    case 'да':
      bot.sendMessage(chatId , 'ваш голос учтён :c');
      break;
    case 'нет':
      bot.sendMessage(chatId , 'ваш голос учтён (:');
      break;
    case 'отлично, посмотреть записку':
      bot.sendMessage(chatId , 'иду такой вижу дерево и так я счастлив...');
      break;
    default:
      bot.sendMessage(chatId , 'я не понимаю тебя...');
  }
});
