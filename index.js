require('dotenv').config()
const line = require('@line/bot-sdk')
const express = require('express')
const app = express()

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
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

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Run on PORT: ${port}`)
})