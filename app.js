var TelegramBot = require('node-telegram-bot-api');

var token = '258430059:AAHiaYOV93Z3xNyqW4W_Mvjm2YwJtgT2qWM';

var bot = new TelegramBot(token, {
  polling: true
});

bot.getMe().then(function(me){
    console.log('Hello! My name is %s!', me.first_name);
    console.log('My id is %s.', me.id);
    console.log('And my username is @%s.', me.username);
});

bot.on('text', function(msg){
    var messageChatId = msg.chat.id,
      messageText = msg.text,
      messageDate = msg.date,
      messageUsr = msg.from.username;

    if (messageText === '/say') {
        sendMessageByBot(messageChatId, 'Hello World!');
    }
    console.log(msg);
});

function sendMessageByBot(aChatId, aMessage){
    bot.sendMessage(aChatId, aMessage, { caption: 'I\'m a cute bot!' });
}
