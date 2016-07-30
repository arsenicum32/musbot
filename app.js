var TelegramBot = require('node-telegram-bot-api');
var request = require('request');

var token = '258430059:AAHiaYOV93Z3xNyqW4W_Mvjm2YwJtgT2qWM';

var bot = new TelegramBot(token, {
  polling: true
});

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
      keyboard: args
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
        bot.sendMessage(chatId, 'нравится?', genkeys('да',['нет']))
        //bot.forwardMessage(chatId, chatId, messageId);
      });
}

bot.on('location', function(msg){
  var lon = msg.location.longitude,
      lat = msg.location.latitude,
      time = msg.date;
  //console.log( JSON.stringify(msg, null, '\t') );
  bot.sendMessage( msg.chat.id , 'Отлично вы поделились своей геолокацией ' + lon + ' ' + lat , {
    reply_markup: JSON.stringify({
      keyboard: [
        ['хочу послушать музыку места'],
        ['хочу добавить музыку']]
    })
  });
});

bot.on('voice', function(msg){
  console.log( JSON.stringify(msg, null, '\t') );
})

// Matches /love
// bot.onText(/\/love/, function (msg) {
//   var chatId = msg.chat.id;
//   var opts = {
//       reply_to_message_id: msg.message_id,
//       reply_markup: JSON.stringify({
//         keyboard: [
//           ['Yes, you are the bot of my life ❤'],
//           ['No, sorry there is another one...']]
//       })
//     };
//     bot.sendMessage(chatId, 'Do you love me?', opts);
// });

bot.on('text', function (msg) {
  console.log( JSON.stringify(msg, null, '\t') );
  var chatId = msg.chat.id;

  if(msg.text === 'хочу послушать музыку места'){
    sendAudio(msg)
  }else if(msg.text === 'хочу добавить музыку'){

  }else{
    bot.sendMessage(chatId , 'я не понимаю тебя...');
  }

  // bot.sendMessage(chatId, msg.text, {
  //   reply_markup: JSON.stringify({
  //     keyboard: [
  //       [ (Math.random().toString()) ]
  //     ]
  //   })
  // });
});
