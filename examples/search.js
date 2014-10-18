var legendastv = require('../');

legendastv.search('game of thrones S04E08', function(err, results) {
  if (err) {
    console.log(err);
  } else {
    console.log(results);
  }
});