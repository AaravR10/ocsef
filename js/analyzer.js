// Get DOM Elements
const imageUploadInput = document.getElementById('label-upload');
const useCameraButton = document.getElementById('use-camera-button');
const cameraContainer = document.getElementById('camera-container');
const videoFeed = document.getElementById('video-feed');
const photoCanvas = document.getElementById('photo-canvas');
const captureButton = document.getElementById('capture-button');
const cancelCameraButton = document.getElementById('cancel-camera-button');
const imagePreview = document.getElementById('image-preview');
const previewLabel = document.getElementById('preview-label');
const analyzeButton = document.getElementById('analyze-button');
const loadingIndicator = document.getElementById('loading-indicator');
const analysisResultDiv = document.getElementById('analysis-result');
// Get the container for the result text, not just the <p> tag inside
const resultTextContainer = document.getElementById('result-text').parentNode; // Get the parent div
const errorMessageP = document.getElementById('error-message');

let imageDataUrl = null;
let currentStream = null;



// --- Basic Markdown to HTML Converter ---
/**
 * Converts simple Markdown (bold, lists) to HTML.
 * @param {string} markdownText - The text possibly containing Markdown.
 * @returns {string} - HTML formatted string.
 */
function simpleMarkdownToHtml(markdownText) {
    if (!markdownText) return '';

    let html = markdownText;

    // Handle Bold (**text**) -> <strong>text</strong>
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Handle Bullet Points (* text or - text)
    // Split into lines, process lines, then rejoin
    const lines = html.split('\n');
    let inList = false;
    const processedLines = lines.map(line => {
        const trimmedLine = line.trim();
        // Check for list item start (* or - followed by space)
        if (/^(\*|-)\s+(.*)/.test(trimmedLine)) {
            const listItemContent = trimmedLine.replace(/^(\*|-)\s+/, '');
            let listTag = '<li>' + listItemContent + '</li>'; // Wrap content in <li>
            if (!inList) {
                listTag = '<ul>' + listTag; // Start <ul> if not already in one
                inList = true;
            }
            return listTag;
        } else {
            // If the line is not a list item, close the list if we were in one
            let lineContent = line; // Keep original line (maybe empty)
            if (inList) {
                lineContent = '</ul>' + lineContent; // Close previous list
                inList = false;
            }
            return lineContent;
        }
    });

    // If the last line was a list item, close the list
    if (inList) {
        processedLines.push('</ul>');
    }

    html = processedLines.join('\n'); // Rejoin lines (browser will handle line breaks in HTML)

    // Simple paragraph handling (wrap blocks of text not in lists/headings)
    // This is very basic: wraps the whole thing if no other block elements were added
    // More robust paragraph handling requires more complex parsing.
    // For now, we rely on CSS white-space: pre-wrap and let line breaks work.

    // Replace newline characters with <br> for display within pre-wrap context if needed,
    // but lists handle breaks better naturally. Let's skip explicit <br> for now.
    // html = html.replace(/\n/g, '<br>'); // Optional: force line breaks

    return html;
}


// --- Event Listener for File Input ---
imageUploadInput.addEventListener('change', (event) => {
    stopCameraStream();
    cameraContainer.style.display = 'none';
    errorMessageP.textContent = '';
    analysisResultDiv.style.display = 'none';
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imageDataUrl = e.target.result;
            imagePreview.src = imageDataUrl;
            imagePreview.style.display = 'block';
            previewLabel.style.display = 'block';
            checkEnableButton();
        }
        reader.readAsDataURL(file);
    } else { resetImageState(); }
});


// --- Function to Enable/Disable Analyze Button ---
function checkEnableButton() {
     analyzeButton.disabled = !(imageDataUrl); // Simplified check
}

// --- Camera Control Event Listeners ---
useCameraButton.addEventListener('click', startCamera);
captureButton.addEventListener('click', takePhoto);
cancelCameraButton.addEventListener('click', () => {
     stopCameraStream();
     cameraContainer.style.display = 'none';
});

// --- Function to Start Camera ---
async function startCamera() {
    resetImageState();
    errorMessageP.textContent = '';
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
            const constraints = { video: { facingMode: 'environment' } };
            currentStream = await navigator.mediaDevices.getUserMedia(constraints);
            videoFeed.srcObject = currentStream;
            videoFeed.style.display = 'block';
            cameraContainer.style.display = 'block';
        } catch (error) {
            console.error("Error accessing rear camera:", error);
            try {
                 const constraints = { video: true };
                 currentStream = await navigator.mediaDevices.getUserMedia(constraints);
                 videoFeed.srcObject = currentStream;
                 videoFeed.style.display = 'block';
                 cameraContainer.style.display = 'block';
            } catch (fallbackError) {
                 console.error("Error accessing fallback camera:", fallbackError);
                 errorMessageP.textContent = `Could not access camera. Error: ${fallbackError.name}. Ensure permission and HTTPS/localhost.`;
                 cameraContainer.style.display = 'none';
            }
        }
    } else { errorMessageP.textContent = "Camera access (getUserMedia) is not supported."; }
}

// --- Function to Stop Camera Stream ---
function stopCameraStream() {
    if (currentStream) { currentStream.getTracks().forEach(track => track.stop()); }
    videoFeed.srcObject = null; currentStream = null;
}

// --- Function to Capture Photo from Video ---
function takePhoto() {
    if (!currentStream) return;
    errorMessageP.textContent = '';
    const context = photoCanvas.getContext('2d');
    photoCanvas.width = videoFeed.videoWidth; photoCanvas.height = videoFeed.videoHeight;
    context.drawImage(videoFeed, 0, 0, photoCanvas.width, photoCanvas.height);
    try {
        imageDataUrl = photoCanvas.toDataURL('image/jpeg');
        imagePreview.src = imageDataUrl; imagePreview.style.display = 'block';
        previewLabel.style.display = 'block';
        stopCameraStream(); cameraContainer.style.display = 'none';
        checkEnableButton();
    } catch (error) {
        console.error("Error creating data URL:", error);
        errorMessageP.textContent = "Could not capture photo.";
        resetImageState();
    }
}

// --- Event Listener for Analyze Button ---
analyzeButton.addEventListener('click', () => {
    const apiKey = 'AIzaSyBlT8qRsgiJyVTvi15ViNHgepSDA-BH1uI'
    errorMessageP.textContent = '';
    if (!imageDataUrl) { errorMessageP.textContent = "Please select or capture an image first."; return; }
    loadingIndicator.style.display = 'block'; analysisResultDiv.style.display = 'none';
    analyzeButton.disabled = true;
    callRealGeminiApi(apiKey, imageDataUrl);
});

// --- Function to Call Google Gemini API (Insecure - same core logic) ---
async function callRealGeminiApi(apiKey, imageBase64) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBlT8qRsgiJyVTvi15ViNHgepSDA-BH1uI`;
    const match = imageBase64.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) { handleAnalysisError("Invalid image data format."); return; }
    const mimeType = match[1]; const base64Data = match[2];
    const requestBody = {
        contents: [{ parts: [
            { text: "Analyze this food label image. Provide a concise summary focusing on: 1. Healthiness (key positive/negative nutrients like sugar, sodium, fat, fiber; level of processing). 2. Sustainability (packaging observed, presence/absence of certifications like Organic/Fair Trade, mention common concerns like palm oil if identifiable). Format the response using Markdown (e.g., **bold**, * item)." }, // Request Markdown
            { inline_data: { mime_type: mimeType, data: base64Data } }
        ]}]
    };
    try {
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(requestBody), });
        if (!response.ok) {
            let errorData; try { errorData = await response.json(); } catch (e) { errorData = { error: { message: `HTTP error! Status: ${response.status}` } }; }
            const error = new Error(errorData?.error?.message || `HTTP error! Status: ${response.status}`); error.response = errorData; throw error;
        }
        const data = await response.json();
        let analysisText = "Could not extract analysis from response.";
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) { analysisText = data.candidates[0].content.parts[0].text; }
        else { analysisText = JSON.stringify(data, null, 2); } // Fallback
        handleAnalysisSuccess(analysisText);
    } catch (error) {
        console.error("Error during fetch or analysis:", error);
        let message = `Error: ${error.message}. `;
        if (error.message.toLowerCase().includes('failed to fetch') || error.message.toLowerCase().includes('networkerror')) { message += "This might be a CORS issue. Direct browser calls are often blocked. Check console (F12). A backend proxy is recommended."; } else if (error.response?.error?.message) { message += `API Error: ${error.response.error.message}`; }
        handleAnalysisError(message);
    }
}

// --- Function to Handle Successful Analysis ---
function handleAnalysisSuccess(analysisText) {
    loadingIndicator.style.display = 'none';
    errorMessageP.textContent = '';

    // Convert Markdown to HTML before displaying
    const analysisHtml = simpleMarkdownToHtml(analysisText);

    // Set the HTML content of the results container
    // Clear previous content first (including the default <p> tag if desired)
    resultTextContainer.innerHTML = `<h3>Analysis:</h3>${analysisHtml}`; // Overwrite container's content

    analysisResultDiv.style.display = 'block';
    analysisResultDiv.style.backgroundColor = '#f8f9fa';
    analysisResultDiv.style.borderColor = '#dee2e6';
    // analysisResultDiv.querySelector('h3').textContent = 'Analysis:'; // Already set in innerHTML
    analyzeButton.disabled = false;
}

// --- Function to Handle Analysis Errors ---
function handleAnalysisError(message) {
    loadingIndicator.style.display = 'none';
    // Clear previous results and show error message
    resultTextContainer.innerHTML = `<h3>Analysis Failed</h3><p class="error-message">${message}</p>`; // Use innerHTML to place error message

    // Style the main result div for error indication
    analysisResultDiv.style.display = 'block';
    analysisResultDiv.style.backgroundColor = '#f8d7da';
    analysisResultDiv.style.borderColor = '#f5c6cb';
    analyzeButton.disabled = false;
}

// --- Function to reset image state ---
function resetImageState() {
     imageDataUrl = null;
     imagePreview.src = "#";
     imagePreview.style.display = 'none';
     previewLabel.style.display = 'none';
     imageUploadInput.value = '';
     checkEnableButton();
     analysisResultDiv.style.display = 'none';
}

// --- Code to Run On Page Load ---
document.addEventListener('DOMContentLoaded', () => {
    const savedApiKey = getCookie(API_KEY_COOKIE_NAME);
    if (savedApiKey) { apiKeyInput.value = savedApiKey; }
    checkEnableButton();
});

console.log("Analyzer script loaded (User API Key + Cookie + Camera + Formatting Version).");

// Initial check for button state
checkEnableButton();