require('dotenv').config();
const mongoose = require('mongoose');
const News = require('./models/News');

// Sample news data with Malayalam content
const sampleNews = [
  {
    title_ml: 'കുടുംബയോഗം 2026 സെപ്റ്റംബറിൽ',
    title_en: 'Family Meeting September 2026',
    excerpt_ml: 'ചിറപ്പുറത്ത് കുടുംബയോഗം 2026 സെപ്റ്റംബർ മാസം തിരുവല്ലയിൽ നടക്കുന്നതാണ്.',
    excerpt_en: 'Chirappurath family meeting to be held in Tiruvalla in September 2026.',
    content_ml: 'ചിറപ്പുറത്ത് കുടുംബത്തിന്റെ വാർഷിക കുടുംബയോഗം 2026 സെപ്റ്റംബർ മാസം തിരുവല്ലയിൽ നടക്കുന്നതാണ്. എല്ലാ കുടുംബാംഗങ്ങളും പങ്കെടുക്കണമെന്ന് അഭ്യർത്ഥിക്കുന്നു. കൂടുതൽ വിശദാംശങ്ങൾ ഉടൻ പ്രഖ്യാപിക്കും.',
    content_en: 'The annual Chirappurath family meeting will be held in Tiruvalla in September 2026. All family members are requested to attend. More details will be announced soon.',
    category: 'event',
    status: 'published',
    date: new Date('2026-01-15'),
    eventDate: new Date('2026-09-15')
  },
  {
    title_ml: 'കുടുംബ വെബ്സൈറ്റ് ലോഞ്ച് ചെയ്തു',
    title_en: 'Family Website Launched',
    excerpt_ml: 'ചിറപ്പുറത്ത് കുടുംബത്തിന്റെ ഔദ്യോഗിക വെബ്സൈറ്റ് പ്രവർത്തനക്ഷമമായി.',
    excerpt_en: 'The official Chirappurath family website is now live.',
    content_ml: 'കുടുംബ യോഗത്തിന്റെ നവതി വർഷത്തോടനുബന്ധിച്ച് 2026 ൽ ആരംഭിച്ച ഈ വെബ്സൈറ്റ്, കുടുംബ ബന്ധങ്ങൾ സുദൃഢമാക്കുന്നതിനും പരസ്പരം കൂടുതൽ മനസ്സിലാക്കുന്നതിനും സഹായിക്കും. വെബ്സൈറ്റിൽ കുടുംബ ചരിത്രം, ശാഖകൾ, ഗാലറി, വാർത്തകൾ എന്നിവ ഉൾപ്പെടുന്നു.',
    content_en: 'Launched in 2026 to commemorate the 90th anniversary of family meetings, this website will help strengthen family bonds and mutual understanding. The website includes family history, branches, gallery, and news.',
    category: 'news',
    status: 'published',
    date: new Date('2026-01-20')
  },
  {
    title_ml: 'സ്ത്രീകളുടെ യോഗം ഫെബ്രുവരി 5ന്',
    title_en: 'Women\'s Meeting on February 5',
    excerpt_ml: 'ചിറപ്പുറത്ത് സ്ത്രീകളുടെ യോഗം ഫെബ്രുവരി 5ന് തോട്ടയ്ക്കാട്ടിൽ നടക്കും.',
    excerpt_en: 'Chirappurath women\'s meeting will be held on February 5 at Thottaykkad.',
    content_ml: 'ചിറപ്പുറത്ത് കുടുംബത്തിലെ എല്ലാ സ്ത്രീകളെയും ഫെബ്രുവരി 5, 2026 ന് രാവിലെ 10 മണിക്ക് തോട്ടയ്ക്കാട് കമ്മ്യൂണിറ്റി ഹാളിൽ നടക്കുന്ന സ്ത്രീകളുടെ യോഗത്തിന് ക്ഷണിക്കുന്നു. കുടുംബ വിഷയങ്ങളും വരാനിരിക്കുന്ന പരിപാടികളും ചർച്ച ചെയ്യും.',
    content_en: 'All women of the Chirappurath family are invited to the women\'s meeting on February 5, 2026 at 10 AM at Thottaykkad Community Hall. Family matters and upcoming programs will be discussed.',
    category: 'event',
    status: 'published',
    date: new Date('2026-01-18'),
    eventDate: new Date('2026-02-05')
  },
  {
    title_ml: 'പുതിയ കമ്മിറ്റി അംഗങ്ങളെ തിരഞ്ഞെടുത്തു',
    title_en: 'New Committee Members Elected',
    excerpt_ml: 'കുടുംബ കമ്മിറ്റിയിലേക്ക് പുതിയ അംഗങ്ങളെ തിരഞ്ഞെടുത്തു.',
    excerpt_en: 'New members elected to the family committee.',
    content_ml: 'അടുത്ത മൂന്ന് വർഷത്തേക്കുള്ള കുടുംബ കമ്മിറ്റി അംഗങ്ങളെ തിരഞ്ഞെടുത്തു. പുതിയ കമ്മിറ്റി കുടുംബത്തിന്റെ വികസനത്തിനും ഐക്യത്തിനും വേണ്ടി പ്രവർത്തിക്കും. അംഗങ്ങളുടെ പൂർണ്ണ പട്ടിക ഉടൻ പ്രസിദ്ധീകരിക്കും.',
    content_en: 'Family committee members for the next three years have been elected. The new committee will work towards the development and unity of the family. The complete list of members will be published soon.',
    category: 'announcement',
    status: 'published',
    date: new Date('2026-01-10')
  },
  {
    title_ml: 'കുടുംബ പിക്നിക് മാർച്ച് 20ന്',
    title_en: 'Family Picnic on March 20',
    excerpt_ml: 'കുടുംബ പിക്നിക് മാർച്ച് 20, 2026 ന് കുമളിയിൽ സംഘടിപ്പിക്കുന്നു.',
    excerpt_en: 'Family picnic organized on March 20, 2026 at Kumily.',
    content_ml: 'എല്ലാ കുടുംബാംഗങ്ങൾക്കുമായി മാർച്ച് 20, 2026 ന് കുമളിയിൽ ഒരു ദിവസത്തെ കുടുംബ പിക്നിക് സംഘടിപ്പിക്കുന്നു. കുട്ടികൾക്കും മുതിർന്നവർക്കും വേണ്ടി രസകരമായ പരിപാടികൾ ആസൂത്രണം ചെയ്തിട്ടുണ്ട്. രജിസ്ട്രേഷൻ ഉടൻ ആരംഭിക്കും.',
    content_en: 'A one-day family picnic is organized on March 20, 2026 at Kumily for all family members. Fun activities have been planned for both children and adults. Registration will start soon.',
    category: 'event',
    status: 'published',
    date: new Date('2026-01-12'),
    eventDate: new Date('2026-03-20')
  }
];

async function seedNews() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ Connected to MongoDB');

    // Clear existing news
    await News.deleteMany({});
    console.log('✓ Cleared existing news');

    // Insert sample news
    await News.insertMany(sampleNews);
    console.log(`✓ Inserted ${sampleNews.length} news articles`);

    console.log('\n✓ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Seeding error:', error);
    process.exit(1);
  }
}

seedNews();
