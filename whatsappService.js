const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const {
  API_KEY,
  APP_NAME,
  SOURCE_MOBILE_NUMBER
} = process.env;

const url = {
  getTemplatesList: `https://api.gupshup.io/sm/api/v1/template/list/${APP_NAME}`,
  optInUser: `https://api.gupshup.io/sm/api/v1/app/opt/in/${APP_NAME}`,
  sendTextMessage: 'https://api.gupshup.io/sm/api/v1/msg',
  sendTemplateMessage: 'http://api.gupshup.io/sm/api/v1/template/msg'
};

const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    apiKey: API_KEY
  }
};

const getUrlEncodedData = (data) => {
  const resultantData = new URLSearchParams();
  Object.keys(data).forEach(key => {
    resultantData.append(key, typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key]);
  });
  return resultantData;
};

const getTemplatesList = async () => {
  return await axios.get(url.getTemplatesList, config);
};

const markUserOptIn = async (userMobileNumber) => {
  const params = getUrlEncodedData({
    user: userMobileNumber
  });

  return await axios.post(url.optInUser, params, config);
};

const sendMediaImageMessage = async (userMobileNumber, imageUrl, caption) => {
  const params = getUrlEncodedData({
    channel: 'whatsapp',
    source: SOURCE_MOBILE_NUMBER,
    destination: userMobileNumber,
    message: {
      type: 'image',
      originalUrl: imageUrl,
      previewUrl: imageUrl,
      caption
    },
    'src.name': APP_NAME
  });

  return await axios.post(url.sendTextMessage, params, config);
};

const sendMediaVideoMessage = async (userMobileNumber, videoUrl, caption) => {
  const params = getUrlEncodedData({
    channel: 'whatsapp',
    source: SOURCE_MOBILE_NUMBER,
    destination: userMobileNumber,
    message: {
      type: 'image',
      url: videoUrl,
      caption
    },
    'src.name': APP_NAME
  });

  return await axios.post(url.sendTextMessage, params, config);
};

const sendTextMessage = async (userMobileNumber, message) => {
  const params = getUrlEncodedData({
    channel: 'whatsapp',
    source: SOURCE_MOBILE_NUMBER,
    destination: userMobileNumber,
    message: {
      type: 'text',
      text: message
    },
    'src.name': APP_NAME,
    disablePreview: false
  });

  return await axios.post(url.sendTextMessage, params, config);
};

const sendTemplateMessage = async (userMobileNumber, templateId, templateParams, mediaMessage) => {
  const params = getUrlEncodedData({
    source: SOURCE_MOBILE_NUMBER,
    destination: userMobileNumber,
    template: {
      id: templateId,
      params: templateParams
    },
    message: mediaMessage
  });

  return await axios.post(url.sendTemplateMessage, params, config);
};

module.exports = {
  getTemplatesList,
  markUserOptIn,
  sendMediaImageMessage,
  sendMediaVideoMessage,
  sendTextMessage,
  sendTemplateMessage
};
