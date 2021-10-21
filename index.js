const express = require('express');
const {
  getTemplatesList,
  markBulkOptIn,
  markUserOptIn,
  sendMediaImageMessage,
  sendMediaVideoMessage,
  sendTextMessage,
  sendTemplateMessage
} = require('./services/whatsappService');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '100mb' }));

app.get('/getTemplatesList', async (req, res) => {
  const { status, data } = await getTemplatesList();
  return res.status(status).send(data);
});

app.get('/optInUser', async (req, res) => {
  const { mobileNumber } = req.body;
  const { status, data } = await markUserOptIn(mobileNumber);
  return res.status(status).send(data);
});

app.get('/bulkOptIn', async (req, res) => {
  const { mobileNumbers } = req.body;
  const { status, data } = await markBulkOptIn(mobileNumbers);
  return res.status(status).send(data);
});

app.get('/sendMediaImageMessage', async (req, res) => {
  const { mobileNumber, imageUrl, caption } = req.body;
  const { status, data } = await sendMediaImageMessage(mobileNumber, imageUrl, caption);
  return res.status(status).send(data);
});

app.get('/sendMediaVideoMessage', async (req, res) => {
  const { mobileNumber, videoUrl, caption } = req.body;
  const { status, data } = await sendMediaVideoMessage(mobileNumber, videoUrl, caption);
  return res.status(status).send(data);
});

app.get('/sendTextMessage', async (req, res) => {
  const { mobileNumber, message } = req.body;
  const { status, data } = await sendTextMessage(mobileNumber, message);
  return res.status(status).send(data);
});

app.get('/sendTemplate', async (req, res) => {
  const { mobileNumber, templateId, templateParams, mediaMessage } = req.body;
  const { status, data } = await sendTemplateMessage(mobileNumber, templateId, templateParams, mediaMessage);
  return res.status(status).send(data);
});

app.get('/callback', async (req, res) => {
  console.log('request callback', req.body);
  return res.status(200).send('received');
});

app.listen(port, ()=> {
  console.log("Server is up on port " + port);
})