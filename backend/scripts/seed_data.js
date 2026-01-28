const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

const Template = require('../src/models/Template');
const Draft = require('../src/models/Draft');

const sampleTemplates = [
    {
        name: 'Road Repair Request',
        description: 'For inquiring about pending road repairs and contractor details.',
        department: 'Municipal Corporation',
        language: 'en',
        category: 'Infrastructure',
        content: `To,
The Public Information Officer,
{{department}}

Subject: Information regarding status of road repair work at {{location}}

Sir/Madam,

I am a resident of {{location}}. The road condition in our area has been deplorable for the past 6 months.
Please provide the following information under RTI Act 2005:

1. Name and contact details of the contractor responsible for road maintenance in {{location}}.
2. Copy of the work order issued for repairs in the last 2 years.
3. The deadline for completion of repair work as per the contract.
4. Reason for delay in the work, if any.

I am attaching the application fee of Rs. 10/-.

Yours faithfully,
{{applicantName}}`
    },
    {
        name: 'Exam Answer Sheet Copy',
        description: 'Request copy of answer sheet for competitive exams.',
        department: 'Education',
        language: 'en',
        category: 'Education',
        content: `To,
The Public Information Officer,
{{department}}

Subject: Request for certified copy of Answer Sheet under RTI Act 2005

Respected Sir,

I appeared for the {{examName}} held on {{examDate}}. My Roll Number is {{rollNumber}}.
Kindly provide me with:

1. A certified copy of my OMR Answer Sheet.
2. The official Answer Key used for evaluation.
3. Details of marks obtained in each section.

I am ready to pay additional photocopying charges as per rules.

Thanking you,
{{applicantName}}`
    },
    {
        name: 'Street Light Installation',
        description: 'Inquire about street light installation in your area.',
        department: 'Municipal Corporation',
        language: 'en',
        category: 'Infrastructure',
        content: `To,
The Public Information Officer,
{{department}}

Subject: Status of Street Light Installation in {{location}}

Sir,

There are no functional street lights in {{location}}, causing safety issues at night.
Please provide details:

1. Has any tender been passed for street lights in this area?
2. If yes, what is the expected date of installation?
3. If no, what is the procedure to apply for new street lights?

Yours truly,
{{applicantName}}`
    },
    // Hindi Templates
    {
        name: 'सड़क मरम्मत हेतु आवेदन',
        description: 'टूटी हुई सड़क की मरम्मत और ठेकेदार की जानकारी के लिए।',
        department: 'नगर निगम',
        language: 'hi',
        category: 'Infrastructure',
        content: `सेवा में,
जन सूचना अधिकारी,
{{department}}

विषय: {{location}} में सड़क मरम्मत कार्य की स्थिति के संबंध में सूचना

महोदय,

मैं {{location}} का निवासी हूँ। पिछले ६ माह से हमारे क्षेत्र की सड़क की स्थिति अत्यंत दयनीय है।
कृपया आरटीआई अधिनियम २००५ के तहत निम्नलिखित जानकारी प्रदान करें:

१. {{location}} में सड़क रखरखाव के लिए जिम्मेदार ठेकेदार का नाम और संपर्क विवरण।
२. पिछले २ वर्षों में मरम्मत के लिए जारी किए गए कार्य आदेश की प्रति।
३. अनुबंध के अनुसार कार्य पूरा करने की समय सीमा।
४. यदि कार्य में कोई देरी हुई है, तो उसका कारण।

मैं १० रुपये का आवेदन शुल्क संलग्न कर रहा हूँ।

भवदीय,
{{applicantName}}`
    },
    {
        name: 'राशन कार्ड स्थिति',
        description: 'राशन कार्ड न बनने या देरी होने पर सवाल।',
        department: 'खाद्य एवं आपूर्ति विभाग',
        language: 'hi',
        category: 'Social Welfare',
        content: `सेवा में,
जन सूचना अधिकारी,
{{department}}

विषय: राशन कार्ड आवेदन की स्थिति - आवेदन संख्या {{applicationNumber}}

महोदय,

मैंने दिनांक {{date}} को नए राशन कार्ड के लिए आवेदन किया था (संख्या: {{applicationNumber}})।
कृपया जानकारी दें:

१. मेरे आवेदन की वर्तमान स्थिति क्या है?
२. राशन कार्ड जारी करने की निर्धारित समय सीमा क्या है?
३. यदि आवेदन रोक दिया गया है, तो उसका कारण और संबंधित अधिकारी का नाम बताएं।

धन्यवाद,
{{applicantName}}`
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('🔌 Connected to MongoDB');

        // Clear existing
        await Template.deleteMany({});
        console.log('🧹 Cleared Templates');

        // Insert new
        await Template.insertMany(sampleTemplates);
        console.log('✅ Added 5 Sample Templates (English & Hindi)');

        // Seed a sample draft
        /*
        const draft = new Draft({
             user: ... // skip for now as we don't have user IDs handy without auth
        });
        */

        console.log('🎉 Seeding Complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
};

seedDB();
