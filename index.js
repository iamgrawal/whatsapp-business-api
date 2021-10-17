const express = require('express');
const {
  getTemplatesList,
  markUserOptIn,
  sendMediaImageMessage,
  sendMediaVideoMessage,
  sendTextMessage,
  sendTemplateMessage
} = require('./whatsappService');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '100mb' }));

app.get('/getTemplatesList', async (req, res) => {
  const { status, data } = await getTemplatesList();
  return res.status(status).send(data);
});

app.get('/optInUsers', async (req, res) => {
  const { mobileNumber } = req.body;
  const { status, data } = await markUserOptIn(mobileNumber);
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

app.listen(port, ()=> {
  console.log("Server is up on port " + port);
})