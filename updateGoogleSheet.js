// const { google } = require('googleapis');
// const mongoose = require('mongoose');
// const cron = require('node-cron');
// const path = require('path');
// require('dotenv').config();
// const MONGO_URI = process.env.MONGO_URI;

// // Import the Participant model
// const Participant = require('./models/Participant');

// mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('Connected to MongoDB'))
//     .catch((error) => console.error('Error connecting to MongoDB:', error));

// const auth = new google.auth.GoogleAuth({
//     keyFile: path.join(__dirname, './sheet_cred.json'),
//     scopes: ['https://www.googleapis.com/auth/spreadsheets'],
// });

// const sheets = google.sheets({ version: 'v4', auth });

// // Google Sheets ID and Range
// const SPREADSHEET_ID = '1h5iQxupeLZKuXBOG9EcXYWKNmuCU-vX6YszTvjw2FOY'; 
// const RANGE = 'Sheet1!A1'; // Replace with your desired range

// // Function to append data to Google Sheet
// async function appendToSheet(data) {
//     const rows = data.map((participant) => [
//         participant.name,
//         participant.email,
//         participant.competition,
//         participant.registeredAt,
//     ]);

//     try {
//         await sheets.spreadsheets.values.append({
//             spreadsheetId: SPREADSHEET_ID,
//             range: RANGE,
//             valueInputOption: 'USER_ENTERED',
//             resource: {
//                 values: rows,
//             },
//         });
//         console.log('Data appended to Google Sheets');
//     } catch (error) {
//         console.error('Error appending data to Google Sheets:', error);
//     }
// }

// // Function to fetch new participants and update Google Sheets
// const updateSheetWithNewParticipants = async () => {
//     try {
//         // Fetch participants with competition 'Hackathon'
//         const participants = await Participant.find({ competition: 'Hackathon' });

//         if (participants.length > 0) {
//             // Append participants to Google Sheet
//             await appendToSheet(participants);
//         } else {
//             console.log('No new participants to append.');
//         }
//     } catch (error) {
//         console.error('Error fetching participants from MongoDB:', error);
//     } finally {
//         mongoose.connection.close();
//     }
// };

// // Schedule the task to run every hour
// cron.schedule('0 * * * *', () => {
//     console.log('Running scheduled task to update Google Sheets with new participants...');
//     updateSheetWithNewParticipants();
// });

// // Optionally, run the update immediately on startup
// updateSheetWithNewParticipants();






const { google } = require('googleapis');
const mongoose = require('mongoose');
const cron = require('node-cron');
const path = require('path');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
const SPREADSHEET_ID = process.env.SPREADSHEET_ID; 
const RANGE = process.env.SHEET_RANGE; // Use the environment variable for the range

// Parse the credentials JSON from the environment variable
const GOOGLE_SHEET_CRED = JSON.parse(process.env.GOOGLE_SHEET_CRED);

// Import the Participant model
const Participant = require('./models/Participant');

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

const auth = new google.auth.GoogleAuth({
    credentials: GOOGLE_SHEET_CRED, // Use the parsed credentials
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Function to append data to Google Sheet
async function appendToSheet(data) {
    const rows = data.map((participant) => [
        participant.name,
        participant.email,
        participant.competition,
        participant.registeredAt,
    ]);

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: RANGE,
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: rows,
            },
        });
        console.log('Data appended to Google Sheets');
    } catch (error) {
        console.error('Error appending data to Google Sheets:', error);
    }
}

// Function to fetch new participants and update Google Sheets
const updateSheetWithNewParticipants = async () => {
    try {
        // Fetch participants with competition 'Hackathon'
        const participants = await Participant.find({ competition: 'Hackathon' });

        if (participants.length > 0) {
            // Append participants to Google Sheet
            await appendToSheet(participants);
        } else {
            console.log('No new participants to append.');
        }
    } catch (error) {
        console.error('Error fetching participants from MongoDB:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Schedule the task to run every hour
cron.schedule('0 * * * *', () => {
    console.log('Running scheduled task to update Google Sheets with new participants...');
    updateSheetWithNewParticipants();
});

// Optionally, run the update immediately on startup
updateSheetWithNewParticipants();
