require('./lib/config')
const express = require('express')
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express()
app.set('json spaces', 4)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT =  process.env.SERVER_PORT || 3000
app.listen(PORT, async () => {
console.log('App running on port', PORT)
})
const { runtime, formatSize, getIPAddress } = require('./lib/helper.js');

//====== DB KANG ======//

const _ = require("lodash");
const low = require("./lib/lowdb/")
const { Low, JSONFile } = low;
const mongoDB = require('./lib/mongoDB');

global.db = new Low(new mongoDB(mongoUrl));
global.DATABASE = global.db;
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ)
    return new Promise((resolve) =>
      setInterval(function () {
        !global.db.READ
          ? (Interval(this),
            resolve(
              global.db.data == null ? global.loadDatabase() : global.db.data
            ))
          : null;
      }, 1 * 1000)
    );
if (global.db.data !== null) return;
  global.db.READ = true;
  await global.db.read();
  global.db.READ = false;
  global.db.data = {
    users: {},
    config: [
  {
    botName: '',
    authorNumber: ['306943953276'],
    myweb: '',
    pairingNumber: 62858103573990,
    botPrefix: '.',
    isPublic: true
  },
  {
    storeName: '',
    paydisini: '',
    profit: { user: 1.025, vip: 1, agen: 1.0115 },
    togar: '',
    tokopay: {
      merchantId: '',
      secretKey: ''
    }
  }
],
    ...(global.db.data || {}),
  };
  global.db.chain = _.chain(global.db.data);
};
loadDatabase();

setInterval(async () => {
   if (global.db.data) {
    await global.db.write()
    console.log('data saved')
   }
}, 30 * 1000)
//====================//
const bytes = require('bytes')
const os = require('os')
const obj = {}
const used = process.memoryUsage()
for (let key in used) obj[key] = formatSize(used[key])
const totalmem = os.totalmem()
const freemem = os.freemem()
obj.memoryUsage = `${formatSize(totalmem - freemem)} / ${formatSize(totalmem)}`

app.get('/', async (req, res) => {
    res.json({
    		success: true,
    		ip: await getIPAddress(),
    		uptime: runtime(os.uptime()),
    		database: db.data ? 'Connected' : 'Disconnected,
    		status: obj
    })
})

app.get('/data/:data', async (req, res) => {
    if (db.data[req.params.data]) {
        res.json({
        		success: true,
        		data: db.data[req.params.data]
        })
    } else {
        res.json({
        		success: true,
        		data: "Data not found"
        })
    }
})


app.all('/api/:objective', async (req, res) => {
  const { method, params, body } = req;
  try {
    const axiosResponse = await axios({
      url: 'https://vip-reseller.co.id/api/' + params.objective,
      method: 'POST',
      data: new URLSearchParams(
                Object.entries(body)
              )
    });
    res.status(axiosResponse.status).json(axiosResponse.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data || null,
    });
  }
});

