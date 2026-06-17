const AZURE_KEY = import.meta.env.VITE_AZURE_TRANSLATOR_KEY;
const AZURE_REGION = import.meta.env.VITE_AZURE_TRANSLATOR_REGION;
const AZURE_ENDPOINT =
  "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0";

export const translateText = async (text, fromLang, toLang) => {
  if (!text) return "";
  if (fromLang === toLang) return text;

  if (!AZURE_KEY) {
    console.error("Azure Translator key is missing!");
    return "Error: API Key missing. Check your .env file.";
  }

  // Azure uses standard language codes (e.g., 'en', 'hi', 'bn', 'ne')
  try {
    const url = `${AZURE_ENDPOINT}&from=${fromLang}&to=${toLang}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": AZURE_KEY,
        "Ocp-Apim-Subscription-Region": AZURE_REGION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ text: text }]),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Azure API Error details:", errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data[0].translations[0].text;
  } catch (error) {
    console.error("Translation error:", error);
    return "Translation failed. Please check your network or API keys.";
  }
};
