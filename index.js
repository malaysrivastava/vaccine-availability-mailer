'use strict';
const express = require('express');
const cron = require('node-cron');
const cors = require('cors')
const bodyParser = require('body-parser')
const config = require('./config')
const studentRoutes = require('./routes/student-route')
const {getAllData} = require('./controllers/vaccineController')


const app = express()

app.use(express.json())
app.use(cors())
app.use(bodyParser.json())

app.use('/api',studentRoutes.routes);

async function main(){
    try {
        cron.schedule('* * * * *', async () => {
             await getAllData();
        });
    } catch (e) {
        console.log('an error occured: ' + JSON.stringify(e, null, 2));
        throw e;
    }
}

app.listen(config.port, ()=>{
    console.log("App started on "+config.port)
      main()
     .then(() => {console.log('Vaccine availability checker started.');});
    //getAllData();

})