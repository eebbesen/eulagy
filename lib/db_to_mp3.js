'use strict'

const app = require('../app');

function() {
  const records = app
    .getAllRecords()
    .then(rs => {
      rs.forEach(r => {
        let counter = 0;
        const chunks = r.content.match(/[\s\S]{1,3000}/g);
        chunks.forEach(c => {
          app.createMp3(c, `output/${r.company}.${r.version}.${counter++}`);
        });
      });
    })
}();
