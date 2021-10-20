const parse = require('csv-parse');
const fs = require('fs');
const { sendTextMessage, sendMediaImageMessage } = require('../services/whatsappService');

const imageUrl = 'https://www.buildquickbots.com/whatsapp/media/sample/jpg/sample02.jpg';
const message = (username) => `
Hi ${username},

~Sorry to bother you again~, 
Testing the bulk sending image script. 😬

I hope this is working properly.

Thanks,
*Gaurav*
`;

const bulkSend = () => fs
  .createReadStream(`assets/usersDetails.csv`)
  .pipe(parse({
    delimiter: ',',
    columns: true
  }, async (_, records) => {
    const successfulMessagedUsers = [];
    const unsuccessfulMessagedUsers = [];
    
    for(const user of records) {
      const response = await sendMediaImageMessage(user.mobileNumber, imageUrl, message(user.name));
      // const response = await sendTextMessage(user.mobileNumber, message(user.name));
      if (response.status === 200) {
        successfulMessagedUsers.push(user);
      } else {
        unsuccessfulMessagedUsers.push(user);
      }
    };
    
    fs.writeFile('results/bulkSendResults.json', JSON.stringify({
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

bulkSend();

module.exports = {
  bulkSend
};