import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
    en: {
        translation: {
            "app": {
                "title": "RTI-Gen",
                "subtitle": "AI DRAFTER",
                "nav": {
                    "generator": "Generator",
                    "templates": "Templates",
                    "insights": "Insights"
                }
            },
            "hero": {
                "badge": "AI-Powered Citizen Rights",
                "title_prefix": "Democratizing Public",
                "title_highlight": "Information Access",
                "subtitle": "Draft professional Right to Information applications in seconds. Our AI suggests precise questions and identifies the correct department for you."
            },
            "steps": {
                "describe": "Describe",
                "select": "Select",
                "review": "Review"
            },
            "form": {
                "describe_placeholder": "E.g., The street lights in Sector 4 have been broken for 2 weeks...",
                "analyzing": "Analyzing your request...",
                "suggest_button": "Get Smart Suggestions"
            },
            "preview": {
                "header": "Your Draft",
                "ready": "Ready to submit",
                "editing": "Editing mode",
                "download_pdf": "Download PDF",
                "download_txt": "Download Text"
            }
        }
    },
    hi: {
        translation: {
            "app": {
                "title": "आरटीआई-जेन",
                "subtitle": "एआई ड्राफ्टर",
                "nav": {
                    "generator": "जनरेटर",
                    "templates": "टेम्पलेट्स",
                    "insights": "अंतर्दृष्टि"
                }
            },
            "hero": {
                "badge": "एआई-संचालित नागरिक अधिकार",
                "title_prefix": "सार्वजनिक जानकारी तक",
                "title_highlight": "पहुंच का लोकतंत्रीकरण",
                "subtitle": "सेकंड में पेशेवर सूचना का अधिकार आवेदन तैयार करें। हमारा एआई सटीक प्रश्नों का सुझाव देता है और आपके लिए सही विभाग की पहचान करता है।"
            },
            "steps": {
                "describe": "वर्णन करें",
                "select": "चुनें",
                "review": "समीक्षा"
            },
            "form": {
                "describe_placeholder": "उदाहरण के लिए, सेक्टर 4 में स्ट्रीट लाइट 2 सप्ताह से खराब हैं...",
                "analyzing": "आपके अनुरोध का विश्लेषण किया जा रहा है...",
                "suggest_button": "स्मार्ट सुझाव प्राप्त करें"
            },
            "preview": {
                "header": "आपका मसौदा",
                "ready": "जमा करने के लिए तैयार",
                "editing": "संपादन मोड",
                "download_pdf": "PDF डाउनलोड करें",
                "download_txt": "टेक्स्ट डाउनलोड करें"
            }
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", // default language
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
