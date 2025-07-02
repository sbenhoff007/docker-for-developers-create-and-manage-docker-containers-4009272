const express = require('express');
const bodyParser = require('body-parser');
const { getMessage, setMessage, initDB } = require('./db');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  const message = await getMessage();
  res.send(`
    <html>
      <body>
        <h1>${message}</h1>
        <form method="POST" action="/update">
          <input type="text" name="message" placeholder="New message" />
          <button type="submit">Update</button>
        </form>
      </body>
    </html>
  `);
});

app.post('/update', async (req, res) => {
  await setMessage(req.body.message);
  res.redirect('/');
});

initDB()
  .then(() => {
    app.listen(3000, () => {
      console.log('Server listening on port 3000');
    });
  })
  .catch(err => {
    console.error('Database initialization failed:', err);
    process.exit(1);
  });