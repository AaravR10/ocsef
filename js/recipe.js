// Get DOM Elements
const apiKeyInput = document.getElementById('api-key-input');
const ingredientsInput = document.getElementById('ingredients-input');
const generateButton = document.getElementById('generate-button');
const loadingIndicator = document.getElementById('loading-indicator');
const recipeResultDiv = document.getElementById('recipe-result');

// Define API Key Cookie Name (same as analyzer.js if sharing the key)
const API_KEY_COOKIE_NAME = 'geminiApiKey';

// --- Cookie Helper Functions (Copied from analyzer.js) ---
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// --- Basic Markdown to HTML Converter (Copied from analyzer.js) ---
function simpleMarkdownToHtml(markdownText) {
    if (!markdownText) return '';
    let html = markdownText;
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Lists (* or -)
    const lines = html.split('\n');
    let inList = false;
    const processedLines = lines.map(line => {
        const trimmedLine = line.trim();
        if (/^(\*|-)\s+(.*)/.test(trimmedLine)) {
            const listItemContent = trimmedLine.replace(/^(\*|-)\s+/, '');
            let listTag = '<li>' + listItemContent + '</li>';
            if (!inList) { listTag = '<ul>' + listTag; inList = true; }
            return listTag;
        } else {
            let lineContent = line;
            if (inList) { lineContent = '</ul>' + lineContent; inList = false; }
            // Add paragraph tags for non-list, non-empty lines for basic structure
            // if (trimmedLine.length > 0 && !/^<[a-z]/.test(trimmedLine.toLowerCase())) {
            //    lineContent = '<p>' + lineContent + '</p>';
            // } // This can be too aggressive, rely on pre-wrap for now.
            return lineContent;
        }
    });
    if (inList) { processedLines.push('</ul>'); }
    html = processedLines.join('\n');
    return html;
}

// --- Event Listener for Ingredients Input ---
ingredientsInput.addEventListener('input', checkEnableButton);

// --- Event Listener for API Key Input ---
apiKeyInput.addEventListener('input', () => {
    const apiKey = apiKeyInput.value.trim();
    setCookie(API_KEY_COOKIE_NAME, apiKey, 30); // Save for 30 days
    checkEnableButton();
});

// --- Function to Enable/Disable Generate Button ---
function checkEnableButton() {
     const apiKey = apiKeyInput.value.trim();
     const ingredients = ingredientsInput.value.trim();
     generateButton.disabled = !(apiKey && ingredients); // Enable only if both fields have content
}

// --- Event Listener for Generate Button ---
generateButton.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    const ingredients = ingredientsInput.value.trim();
    recipeResultDiv.style.display = 'none'; // Clear previous results
    recipeResultDiv.innerHTML = ''; // Clear content completely

    if (!apiKey) { alert("Please enter your Google AI API Key."); return; } // Use alert for simplicity
    if (!ingredients) { alert("Please enter some ingredients."); return; }

    loadingIndicator.style.display = 'block';
    generateButton.disabled = true;

    // ** !!! ATTEMPTING DIRECT API CALL - HIGHLY INSECURE & MAY FAIL DUE TO CORS !!! **
    callRecipeGeneratorApi(apiKey, ingredients);
});


// --- Function to Call Google Gemini API for Recipes (Insecure) ---
async function callRecipeGeneratorApi(apiKey, ingredientsList) {
    // ** WARNING: Using API Key in client-side is insecure! **
    // Use a text generation model like gemini-pro or gemini-1.5-flash
    const model = "gemini-1.5-flash"; // Or "gemini-pro"
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    // Construct a detailed prompt
    const prompt = `Based on the following ingredients, create a healthy and sustainable recipe suggestion.
Prioritize using the listed ingredients. Suggest simple substitutions if key components are missing.
Think about minimizing waste (e.g., using vegetable scraps for stock if appropriate).
Provide a clear title, a list of ingredients (including quantities if reasonable to estimate), step-by-step instructions, and maybe a brief sustainability tip related to the recipe.
Format the entire response using simple Markdown (e.g., **bold** for headings/titles, * item for lists).

Ingredients provided:
${ingredientsList}`;

    const requestBody = {
        contents: [{ parts: [{ text: prompt }] }]
        // Optional: Add generationConfig if needed (e.g., temperature, max output tokens)
        // generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
    };

    console.log("Attempting fetch to:", apiUrl);

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(requestBody),
        });

        console.log("Response Status:", response.status);

        if (!response.ok) {
            let errorData; try { errorData = await response.json(); console.error("API Error Response:", errorData); } catch (e) { errorData = { error: { message: `HTTP error! Status: ${response.status}` } }; }
            const error = new Error(errorData?.error?.message || `HTTP error! Status: ${response.status}`); error.response = errorData; throw error;
        }

        const data = await response.json();
        console.log("API Success Response:", data);

        let recipeText = "Could not extract recipe from response.";
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
             recipeText = data.candidates[0].content.parts[0].text;
        } else {
            console.warn("Could not find expected text in API response structure.");
            recipeText = `Raw Response (extraction failed):\n${JSON.stringify(data, null, 2)}`;
        }

        handleRecipeSuccess(recipeText);

    } catch (error) {
        console.error("Error during fetch or recipe generation:", error);
        let message = `Error: ${error.message}. `;
        if (error.message.toLowerCase().includes('failed to fetch') || error.message.toLowerCase().includes('networkerror')) { message += "This might be a CORS issue. Direct browser calls are often blocked. Check console (F12). A backend proxy is recommended."; } else if (error.response?.error?.message) { message += `API Error: ${error.response.error.message}`; }
        handleRecipeError(message);
    }
}

// --- Function to Handle Successful Recipe Generation ---
function handleRecipeSuccess(recipeText) {
    loadingIndicator.style.display = 'none';
    const recipeHtml = simpleMarkdownToHtml(recipeText);
    recipeResultDiv.innerHTML = `<h3>Generated Recipe:</h3>${recipeHtml}`; // Set innerHTML
    recipeResultDiv.style.display = 'block';
    recipeResultDiv.style.backgroundColor = '#f8f9fa'; // Reset style
    recipeResultDiv.style.borderColor = '#dee2e6';
    generateButton.disabled = false; // Re-enable button
}

// --- Function to Handle Recipe Generation Errors ---
function handleRecipeError(message) {
    loadingIndicator.style.display = 'none';
    recipeResultDiv.innerHTML = `<h3>Recipe Generation Failed</h3><p class="error-message">${message}</p>`; // Show error inside result div
    recipeResultDiv.style.display = 'block';
    recipeResultDiv.style.backgroundColor = '#f8d7da'; // Error background
    recipeResultDiv.style.borderColor = '#f5c6cb';
    generateButton.disabled = false; // Re-enable button
}

// --- Code to Run On Page Load ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded. Checking for API key cookie...");
    const savedApiKey = getCookie(API_KEY_COOKIE_NAME);
    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
        console.log("API Key loaded from cookie.");
    } else {
        console.log("No API key found in cookie.");
    }
    checkEnableButton(); // Check button state after potentially loading key
});

console.log("Recipe script loaded (User API Key + Cookie Version).");

// Initial check for button state
checkEnableButton();