const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');
const questionController = require('./src/controllers/question.controller');

// Mock Request and Response
const req = {
    body: {
        description: "Problem regarding sewage",
        department: "Municipal Corporation",
        maxQuestions: 5
    }
};

const res = {
    status: (code) => ({
        json: (data) => console.log(`Response [${code}]:`, JSON.stringify(data, null, 2))
    })
};

const next = (err) => {
    console.error('ERROR CAUGHT IN CONTROLLER:', err);
    process.exit(1);
};

async function test() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('DB Connected');

        await questionController.suggest(req, res, next);

        setTimeout(() => {
            mongoose.disconnect();
            console.log('Done');
        }, 2000);
    } catch (e) {
        console.error('Test Script Error:', e);
    }
}

test();
