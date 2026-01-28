const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Template = require('../models/Template');

// Load env vars
dotenv.config();

const templates = [
    {
        name: "General RTI Application",
        department: "General",
        language: "en",
        content: `APPLICATION UNDER RIGHT TO INFORMATION ACT, 2005
═══════════════════════════════════════════════════════════════

To,
The Public Information Officer,
{{department}}
{{#if location}}{{location}}{{/if}}

Subject: Request for Information under RTI Act, 2005

Respected Sir/Madam,

I, the undersigned, hereby request the following information under the RTI Act, 2005:

{{#if applicantName}}Applicant Name: {{applicantName}}{{/if}}
{{#if applicantAddress}}Address: {{applicantAddress}}{{/if}}

───────────────────────────────────────────────────────────────
INFORMATION REQUESTED:
───────────────────────────────────────────────────────────────

{{#each questions}}
{{addOne @index}}. {{this}}
{{/each}}

I am willing to pay the prescribed fee. Please provide information within 30 days.

Date: {{date}}

Signature:
{{applicantName}}`,
        isActive: true,
        metadata: {
            description: "Standard template suitable for most queries.",
            tags: ["general", "standard"]
        }
    },
    {
        name: "Electricity Outage Complaint",
        department: "Electricity Board",
        language: "en",
        content: `To,
The Public Information Officer,
{{department}}
{{#if location}}{{location}}{{/if}}

Subject: Information regarding frequent power outages in {{location}}

Respected Sir/Madam,

I am a resident of {{location}} and we are facing severe power cuts. Please provide:

1. Reasons for power cuts in {{location}} during the last 3 months.
2. Details of maintenance work carried out in this area.
3. Log of complaints received regarding outages.

{{#each questions}}
{{addOne @index}}. {{this}}
{{/each}}

Applicant:
{{applicantName}}
{{applicantAddress}}
Date: {{date}}`,
        isActive: true,
        metadata: {
            description: "Template specifically for electricity and power related queries.",
            tags: ["electricity", "power", "outage"]
        }
    },
    {
        name: "Municipal Road Repair",
        department: "Municipal Corporation",
        language: "en",
        content: `To,
The Public Information Officer,
{{department}}
{{#if location}}{{location}}{{/if}}

Subject: Status of Road Repairs in Ward No. {{wardNumber}}

Sir,

Please provide details regarding road maintenance in {{location}}:

1. Date of last repair work sanctioned for this road.
2. Name of the contractor and copy of the work order.
3. Guarantee period of the road construction.

{{#each questions}}
{{addOne @index}}. {{this}}
{{/each}}

Sincerely,
{{applicantName}}
Date: {{date}}`,
        isActive: true,
        metadata: {
            description: "For queries regarding road construction, potholes, and municipal works.",
            tags: ["municipal", "road", "construction"]
        }
    },
    {
        name: "Hindi General Template",
        department: "General",
        language: "hi",
        content: `सेवा में,
जन सूचना अधिकारी,
{{department}}
{{location}}

विषय: सूचना का अधिकार अधिनियम, 2005 के तहत आवेदन

महोदय,

मैं, {{applicantName}}, निम्नलिखित सूचना का अनुरोध करता हूँ:

{{#each questions}}
{{addOne @index}}. {{this}}
{{/each}}

मैं निर्धारित शुल्क का भुगतान करने को तैयार हूँ।

दिनांक: {{date}}
हस्ताक्षर
{{applicantName}}`,
        isActive: true,
        metadata: {
            description: "General template in Hindi.",
            tags: ["hindi", "general"]
        }
    }
];

const seedDB = async () => {
    try {
        console.log("Loading .env...");
        // Ensure we look for .env in current directory
        dotenv.config({ path: './.env' });

        let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/rti-gen';

        // Ensure we are using the 'rti-gen' database if it's an Atlas string ending in /
        if (uri.endsWith('/') || uri.includes('mongodb.net') && !uri.split('/').pop()) {
            // It might be 'mongodb.net/' or 'mongodb.net/?...'
            if (uri.includes('?')) {
                uri = uri.replace('?', 'rti-gen?');
            } else if (uri.endsWith('/')) {
                uri += 'rti-gen';
            } else {
                uri += '/rti-gen';
            }
        }

        console.log(`Connecting to MongoDB at: ${uri.replace(/:([^:@]+)@/, ':****@')} ...`); // Mask password

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected');

        // Clear existing
        await Template.deleteMany({});
        console.log('Cleared existing templates');

        // Insert new
        await Template.insertMany(templates);
        console.log('Templates seeded successfully');

        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
