require('dotenv').config()
const line = require('@line/bot-sdk')
const dialogflow = require('dialogflow')
const express = require('express')
const app = express()
const projectId = 'assistant-d11a3'
const sessionId = 'HelloTon'
const languageCode = 'th-TH'
const sessionClient = new dialogflow.SessionsClient()
const sessionPath = sessionClient.sessionPath(projectId, sessionId)

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
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: event.message.text,
                languageCode: languageCode,
            }
        }
    }

    sessionClient.detectIntent(request)
        .then(respons => {
            const text = respons[0].queryResult.fulfillmentMessages[0].text.text[0]
            console.dir(respons, {depth:null})
            console.log('text', text)

            const replyToken = event.replyToken
            const message = { 
                type: 'text',
                text: text
             }
            return client.replyMessage(replyToken, message).catch((err) => {
                console.log(err)
            })

        })


    
}

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Run on PORT: ${port}`)
})