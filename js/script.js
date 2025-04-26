// General script for small interactive elements, maybe mobile menu toggle later

// Example: Smooth scrolling for anchor links (if you add any)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Check if it's just a placeholder link or for a different page
        if (this.getAttribute('href') === '#' || this.getAttribute('href').indexOf('.html') !== -1) {
            return;
        }
        e.preventDefault();
        try {
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        } catch (error) {
            console.warn("Smooth scroll target not found:", this.getAttribute('href'));
        }
    });
});

// --- Functions for Energy Page ---
function showSolarExplanation() {
    const explanationDiv = document.getElementById('solar-explanation');
    if (explanationDiv) {
        explanationDiv.style.display = 'block';
    }
}

function hideSolarExplanation() {
     const explanationDiv = document.getElementById('solar-explanation');
    if (explanationDiv) {
        explanationDiv.style.display = 'none';
    }
}


// --- Functions for Community Page (Forum Demo) ---
function addForumPost() {
    const titleInput = document.getElementById('forum-title');
    const messageInput = document.getElementById('forum-message');
    const threadsContainer = document.getElementById('forum-threads');

    const title = titleInput.value.trim();
    const message = messageInput.value.trim();

    if (!title || !message) {
        alert('Please enter both a title and a message.');
        return;
    }

    // Create new post element (won't be saved)
    const newPost = document.createElement('div');
    newPost.classList.add('forum-thread');
    newPost.innerHTML = `
        <h4>${escapeHTML(title)}</h4>
        <p>User "DemoUser": ${escapeHTML(message)}</p>
        <small>Posted just now (Demo)</small>
    `;

    // Add to the top of the list (or bottom)
    threadsContainer.insertBefore(newPost, threadsContainer.children[1]); // Insert after the H3

    // Clear the form
    titleInput.value = '';
    messageInput.value = '';

     console.log("Demo post added visually. No data saved.");
}

// Simple HTML escaping function to prevent XSS in demo
function escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}


console.log("General script loaded.");