const parse = require('csv-parse');
const fs = require('fs');
const { markUserOptIn } = require('../services/whatsappService');

const bulkOptIn = () => fs
  .createReadStream(`assets/usersDetails.csv`)
  .pipe(parse({
    delimiter: ',',
    columns: true
  }, async (_, records) => {
    const optedInUsers = [];
    const nonOptedInUsers = [];

    for(const user of records) {
      const response = await markUserOptIn(user.mobileNumber);
      if (response.status === 202) {
        optedInUsers.push(user);
      } else {
        nonOptedInUsers.push(user);
      }
    };

    fs.writeFile('results/bulkOptInResult.json', JSON.stringify({
      optedInUsersCount: optedInUsers.length,
      nonOptedInUsersCount: nonOptedInUsers.length,
      optedInUsers,
      nonOptedInUsers
    }, null, 2), (err) => {
      if (err) {
        console.error(err);
      } else {
        console.info('results written in the file');
      }
    });
  }));

bulkOptIn();

module.exports = {
  bulkOptIn
};
