/**
 * Department Constants
 * Predefined departments with keywords for intent detection
 */

const DEPARTMENTS = {
  MUNICIPAL: {
    name: 'Municipal',
    displayName: 'Municipal Corporation',
    keywords: ['road', 'water', 'construction', 'drainage', 'sanitation', 'street', 'light', 'garbage', 'sewage', 'park', 'footpath', 'gutter'],
    description: 'Handles civic amenities and urban infrastructure'
  },
  POLICE: {
    name: 'Police',
    displayName: 'Police Department',
    keywords: ['crime', 'fir', 'complaint', 'investigation', 'theft', 'accident', 'traffic', 'security', 'law', 'order', 'chargesheet'],
    description: 'Handles law enforcement and public safety'
  },
  EDUCATION: {
    name: 'Education',
    displayName: 'Department of Education',
    keywords: ['school', 'college', 'teacher', 'student', 'exam', 'admission', 'scholarship', 'education', 'university', 'degree'],
    description: 'Handles educational institutions and policies'
  },
  HEALTH: {
    name: 'Health',
    displayName: 'Department of Health',
    keywords: ['hospital', 'doctor', 'medicine', 'health', 'disease', 'vaccination', 'clinic', 'medical', 'treatment', 'patient'],
    description: 'Handles healthcare services and policies'
  },
  REVENUE: {
    name: 'Revenue',
    displayName: 'Revenue Department',
    keywords: ['land', 'property', 'tax', 'registry', 'mutation', 'revenue', 'ownership', 'deed', 'stamp', 'khata', 'khasra'],
    description: 'Handles land records and property matters'
  },
  TRANSPORT: {
    name: 'Transport',
    displayName: 'Transport Department',
    keywords: ['license', 'vehicle', 'registration', 'permit', 'transport', 'bus', 'driving', 'rto', 'challan'],
    description: 'Handles vehicle registration and transport permits'
  },
  ELECTRICITY: {
    name: 'Electricity',
    displayName: 'Electricity Board',
    keywords: ['electricity', 'power', 'bill', 'meter', 'connection', 'supply', 'outage', 'transformer', 'load'],
    description: 'Handles electricity supply and billing'
  },
  PWD: {
    name: 'PWD',
    displayName: 'Public Works Department',
    keywords: ['building', 'bridge', 'highway', 'construction', 'tender', 'contractor', 'infrastructure', 'government building'],
    description: 'Handles public infrastructure projects'
  },
  PANCHAYAT: {
    name: 'Panchayat',
    displayName: 'Panchayati Raj',
    keywords: ['village', 'gram', 'sarpanch', 'rural', 'panchayat', 'block', 'district'],
    description: 'Handles rural local governance'
  },
  SOCIAL_WELFARE: {
    name: 'Social Welfare',
    displayName: 'Social Welfare Department',
    keywords: ['pension', 'widow', 'disabled', 'welfare', 'bpl', 'ration', 'subsidy', 'scheme'],
    description: 'Handles social welfare schemes'
  }
};

/**
 * Stop words to filter from user input
 */
const STOP_WORDS = [
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
  'would', 'could', 'should', 'may', 'might', 'must', 'shall',
  'can', 'need', 'dare', 'ought', 'used', 'to', 'of', 'in',
  'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into',
  'through', 'during', 'before', 'after', 'above', 'below',
  'between', 'under', 'again', 'further', 'then', 'once',
  'here', 'there', 'when', 'where', 'why', 'how', 'all',
  'each', 'few', 'more', 'most', 'other', 'some', 'such',
  'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than',
  'too', 'very', 'just', 'and', 'but', 'if', 'or', 'because',
  'until', 'while', 'about', 'against', 'i', 'me', 'my', 'we',
  'our', 'you', 'your', 'he', 'him', 'his', 'she', 'her',
  'it', 'its', 'they', 'them', 'their', 'what', 'which', 'who',
  'want', 'know', 'get', 'information', 'details', 'please', 'kindly'
];

/**
 * Question categories with keywords
 */
const QUESTION_CATEGORIES = {
  BUDGET: {
    id: 'budget',
    name: 'Budget & Finance',
    keywords: ['budget', 'money', 'fund', 'expense', 'cost', 'expenditure', 'allocation', 'financial', 'amount', 'payment']
  },
  CONTRACTOR: {
    id: 'contractor',
    name: 'Contractors & Tenders',
    keywords: ['contractor', 'tender', 'contract', 'bid', 'vendor', 'supplier', 'construction', 'work order']
  },
  TIMELINE: {
    id: 'timeline',
    name: 'Timeline & Progress',
    keywords: ['delay', 'timeline', 'deadline', 'schedule', 'completion', 'progress', 'status', 'date', 'when']
  },
  DOCUMENTS: {
    id: 'documents',
    name: 'Documents & Records',
    keywords: ['document', 'file', 'record', 'report', 'copy', 'paper', 'certificate', 'letter', 'order']
  },
  PERSONNEL: {
    id: 'personnel',
    name: 'Personnel & Officials',
    keywords: ['officer', 'official', 'staff', 'employee', 'authority', 'department', 'responsible', 'incharge']
  }
};

/**
 * Supported languages
 */
const LANGUAGES = {
  ENGLISH: { code: 'en', name: 'English' },
  HINDI: { code: 'hi', name: 'Hindi' }
};

module.exports = {
  DEPARTMENTS,
  STOP_WORDS,
  QUESTION_CATEGORIES,
  LANGUAGES
};
