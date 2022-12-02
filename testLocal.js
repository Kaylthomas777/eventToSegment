const app = require('./index');
const event1 = require('./__tests__/resources/test1.json')
const event2 = require('./__tests__/resources/test2.json')
const event3 = require('./__tests__/resources/test3.json')
const event4 = require('./__tests__/resources/test4.json');
//const event5 = require('./__tests__/resources/test5.json');

app.handler(event1).then(() => {
  console.log('Done with event 1')
  app.handler(event2).then(() => {
    console.log('Done with event 2')
    app.handler(event3).then(() => {
      console.log('Done with event 3')
      app.handler(event4).then(() => {
        console.log('Done with event 4')
        process.exit(0)
      })
    })
  })
})

// app.handler(event5).then(() => {
//     console.log('Done');
//     process.exit;
// });
