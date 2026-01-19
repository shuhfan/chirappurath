/**
 * LibreTranslate Utility
 * Translates Malayalam to English using LibreTranslate public API
 * Uses Node.js built-in fetch (Node 18+)
 */

const LIBRETRANSLATE_API = 'https://libretranslate.com/translate';

/**
 * Translate Malayalam text to English
 * @param {string} text - Malayalam text to translate
 * @returns {Promise<string>} - English translation or original text on error
 */
async function translateToEnglish(text) {
  console.log('[TRANSLATE] Called with text length:', text ? text.length : 0);

  // Return empty string if no text
  if (!text || text.trim() === '') {
    console.log('[TRANSLATE] Empty text, returning empty string');
    return '';
  }

  // Return original if too long (API limitations)
  if (text.length > 400) {
    console.warn('[TRANSLATE] Text too long (>400 chars), returning original');
    return text;
  }

  try {
    console.log('[TRANSLATE] Calling LibreTranslate API...');
    
    // Use Node.js built-in fetch (available in Node 18+)
    const response = await fetch(LIBRETRANSLATE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: text,
        source: 'ml',      // Malayalam
        target: 'en'       // English
      })
    });

    if (!response.ok) {
      console.error('[TRANSLATE] API returned status:', response.status);
      console.log('[TRANSLATE] Returning original text due to API error');
      return text;
    }

    const data = await response.json();
    
    if (data.translatedText) {
      console.log('[TRANSLATE] Translation successful');
      return data.translatedText;
    }

    console.warn('[TRANSLATE] No translatedText in response:', data);
    return text;
  } catch (error) {
    console.error('[TRANSLATE] Error:', error.message);
    console.log('[TRANSLATE] Returning original text due to error');
    return text;
  }
}

module.exports = {
  translateToEnglish
};
