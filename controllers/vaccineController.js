'use strict'
const firebase = require('../db')
const firestore = firebase.firestore()
const axios = require('axios'); 
const notifier = require('../mailer');



// async function checkAvailability(pin,age,email) {

//     let datesArray = await fetchNext10Days();
//     datesArray.forEach(date => {
//         getSlotsForDate(date,pin,age,email);
//     })
// }

function getSlotsForDate(DATE,ID,PIN,Age,email) {
    let config = {
        method: 'get',
        url: 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=' + PIN + '&date=' + DATE,
        headers: {
            'accept': 'application/json',
            'Accept-Language': 'hi_IN'
        }
    };

    axios(config)
        .then(function (slots) {
            let sessions = slots.data.sessions;
            let validSlots = sessions.filter(slot => slot.min_age_limit <= Age &&  slot.available_capacity > 0)
            console.log({date:DATE, validSlots: validSlots.length})
            if(validSlots.length > 0) {
                notifyMe(validSlots,email);
                deleteData(ID);
            } 
        })
        .catch(function (error) {
            console.log(error);
        });
}

async function

notifyMe(validSlots,email){
    let slotDetails = JSON.stringify(validSlots, null, '\t');
    notifier.sendEmail(email, 'VACCINE AVAILABLE', slotDetails, (err, result) => {
        if(err) {
            console.error({err});
        }
    })
};

// async function fetchNext10Days(){
//     let dates = [];
//     let today = moment();
//     for(let i = 0 ; i < 5 ; i ++ ){
//         let dateString = today.format('DD-MM-YYYY')
//         dates.push(dateString);
//         today.add(1, 'day');
//     }
//     return dates;
// }

const ChangeFormateDate=(oldDate)=>
{
   return(oldDate.toString().split("-").reverse().join("-"));
}

const getAllData = async (req,res,next) =>{
    try {
        const users = await firestore.collection('corona');
        const data = await users.get();
        if(data.empty) {
            console.log('No collection record found');
        } else {
                data.forEach(doc=>{
                    getSlotsForDate(ChangeFormateDate(doc.data().date),doc.id,doc.data().pin,doc.data().age,doc.data().email);
                });
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
}


const deleteData = async (Id)=>{
    try {
        const id = Id;
        await firestore.collection('corona').doc(id).delete();
        console.log('Record deleted successfully')
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    getAllData,
    deleteData
}