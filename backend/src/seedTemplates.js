const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Template = require('./models/Template');
const connectDB = require('./config/db');

dotenv.config();

const templates = [
    {
        name: "Road Works Information",
        department: "Municipal",
        language: "en",
        version: "1.0",
        variables: ["department", "location", "wardNumber", "year", "applicantName"],
        metadata: {
            tags: ["road", "construction", "budget", "repair"],
            description: "Get details about road construction, repairs, and budget allocation in your area."
        },
        content: `To,
The Public Information Officer,
{{department}},
{{location}}

Subject: Request for Information under Right to Information Act, 2005

Respected Sir/Madam,

I am a citizen of India and I request the following information regarding road works in Ward No. {{wardNumber}}:

1. Please provide the details of funds allocated for road construction and repairs in Ward No. {{wardNumber}} during the financial year {{year}}.
2. Please provide the list of all road works sanctioned, started, or completed in this ward during the mentioned period.
3. For each work, please provide:
   a) Name of the contractor
   b) Estimated cost
   c) Actual cost incurred
   d) Start date and completion date (or expected completion date)
   e) Copy of the work order and completion certificate (if applicable)

I am attaching the application fee of Rs. 10/- via Postal Order/Court Fee Stamp.

Yours faithfully,

{{applicantName}}
Address: {{location}}`
    },
    {
        name: "FIR Status Information",
        department: "Police",
        language: "en",
        version: "1.0",
        variables: ["department", "location", "firNumber", "policeStation", "applicantName"],
        metadata: {
            tags: ["fir", "police", "investigation", "status"],
            description: "Track the status of an FIR and investigation progress."
        },
        content: `To,
The Public Information Officer,
{{department}},
{{location}}

Subject: Request for Information under RTI Act, 2005 - Status of FIR No. {{firNumber}}

Respected Sir/Madam,

I request the following information regarding FIR No. {{firNumber}} registered at {{policeStation}} Police Station:

1. Please provide the current status of the investigation for the above-mentioned FIR.
2. Has the charge sheet been filed in the relevant court? If yes, please provide the Charge Sheet Number and Date.
3. If the investigation is still pending, please provide the reasons for the delay (as per Section 24 of the Police Act).
4. Please provide the names and designations of the officers who have investigated this case so far.

I am attaching the application fee of Rs. 10/-.

Yours faithfully,

{{applicantName}}`
    },
    {
        name: "School Budget & Facilities",
        department: "Education",
        language: "en",
        version: "1.1",
        variables: ["department", "location", "schoolName", "year", "applicantName"],
        metadata: {
            tags: ["school", "education", "budget", "facilities", "funds"],
            description: "Inquire about school funds, facilities, and teacher attendance."
        },
        content: `To,
The Public Information Officer,
{{department}},
{{location}}

Subject: Information regarding {{schoolName}} under RTI Act, 2005

Respected Sir/Madam,

I request the following information regarding {{schoolName}} located in {{location}}:

1. Total budget allocated to the school for the year {{year}} under various heads (Maintenance, Mid-day Meal, Library, etc.).
2. Details of expenditure incurred against these allocations.
3. Total number of sanctioned teaching posts and number of vacancies as on date.
4. Copy of the attendance register of teachers for the last 3 months.
5. Details of drinking water and toilet facilities available for students.

I am attaching the application fee of Rs. 10/-.

Yours faithfully,

{{applicantName}}`
    }
];

const seedDB = async () => {
    try {
        await connectDB();
        console.log('✅ Connected to MongoDB');

        // Clear existing templates to avoid duplicates
        await Template.deleteMany({});
        console.log('🗑️  Cleared existing templates');

        // Insert new templates
        await Template.insertMany(templates);
        console.log('✨ Seeded ' + templates.length + ' templates successfully');

        process.exit();
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedDB();
