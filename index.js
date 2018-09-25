const line = require('@line/bot-sdk')
const express = require('express')
const app = express()

const config = {
    channelAccessToken: 'ocuYlBdMIOMfYbxSnbP6qYs7YNYXAj5/vWG9EAdFMIWOgSsWxVNjkyYDKvlvtAJ00iH96Fmi3iH8SRlbSyHPyqEUNhdldBoVsDLw8VVhwOmGJuixjjhxh8EPThxskovXIz/gDH6gEdxIgQ6jfQaTuQdB04t89/1O/w1cDnyilFU=',
    channelSecret: '75801100259a2f750b5b78eb39f460c4',
}
const client = new line.Client(config)


app.post('/callback', line.middleware(config), (req, res) => {
    Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
})

function handleEvent(event) {
    if(event.type !== 'message' || event.message.type !== 'text'){
        return Promise.resolve(null)
    }
    console.log(event)
    // const replyToken = event.replyToken
    const userId = event.source.userId
    // console.log('replyToken', replyToken)
    const message = { 
        type: 'text',
        text: event.message.text
     }
    return client.pushMessage(userId, message)
    // client.replyMessage(replyToken, message).catch((err) => {
    //     console.log(err)
    // })
}




const port = 3000
app.listen(port, () => {
    console.log(`Run on PORT: ${port}`)
})