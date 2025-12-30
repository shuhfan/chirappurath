const cache = {};

async function translateMLtoEN(text) {
  if (!text) return "";
  if (cache[text]) return cache[text];

  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=ml&tl=en&dt=t&q=" +
    encodeURIComponent(text);

  const res = await fetch(url);

  // ❗ check response type
  const contentType = res.headers.get("content-type");

  if (!contentType || !contentType.includes("application/json")) {
    const html = await res.text(); // read HTML
    console.error("Not JSON response:", html.substring(0, 200));
    return text; // fallback
  }

  const data = await res.json();
  const translated = data[0].map(i => i[0]).join("");

  cache[text] = translated;
  return translated;
}

module.exports = translateMLtoEN;
