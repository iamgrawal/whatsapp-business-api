const parse = require('csv-parse');
const fs = require('fs');
const { markUserOptIn, markBulkOptIn, sendTemplateMessage } = require('../services/whatsappService');

const template = '3aade583-7acb-4a8f-b919-c88cafb05caf';
const image = 'https://raw.githubusercontent.com/DevFest-India/website-data-2021/main/DevFestIndia2021.jpg';

const combinedBulkSendTemplate = (templateId, imageUrl) => {
  fs
  .createReadStream(`assets/usersDetails.csv`)
  .pipe(parse({
    delimiter: ',',
    columns: true
  }, async (_, records) => {
    const requestParams = {
      type: 'image',
      image: {
        link: imageUrl
      }
    };

    const optedInUsers = [];
    const nonOptedInUsers = [];
    const successfulMessagedUsers = [];
    const unsuccessfulMessagedUsers = [];
    
    const users = records.map(record => record.mobileNumber);
    const optInResponse = await markBulkOptIn(users);
    
    for(const user of records) {
      // const optInResponse = await markUserOptIn(user.mobileNumber);
      // if (optInResponse.status === 202) {
      //   optedInUsers.push(user);
        // const templateResponse = await sendTemplateMessage(user.mobileNumber, templateId, [user.name], requestParams);
        
        // if (templateResponse.status === 200) {
        //   successfulMessagedUsers.push(user);
        // } else {
        //   unsuccessfulMessagedUsers.push(user);
        // }
      // } else {
      //   nonOptedInUsers.push(user);
      // }
      await setTimeout(() => {
        sendTemplateMessage(user.mobileNumber, templateId, [user.name], requestParams);
      }, 1000);
    };

    fs.writeFile('results/combinedSendTemplate.json', JSON.stringify({
      optedInUsersCount: optedInUsers.length,
      nonOptedInUsersCount: nonOptedInUsers.length,
      optedInUsers,
      nonOptedInUsers,
      successRate: successfulMessagedUsers.length,
      unsuccessfulRate: unsuccessfulMessagedUsers.length,
      successfulMessagedUsers,
      unsuccessfulMessagedUsers
    }, null, 2), (err) => {
      if (err) {
        console.error(err);
      } else {
        console.info('results written in the file');
      }
    });
  }));
};


combinedBulkSendTemplate(template, image);

module.exports = {
  combinedBulkSendTemplate
};