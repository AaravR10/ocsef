const moduleContentArea = document.getElementById('module-content-area');

const moduleData = {
    "food-waste": {
        title: "Reducing Food Waste (Interactive Lesson)", // Updated title for clarity
        type: "genially", // Identifier for Genially modules
        url: "https://view.genially.com/680d18dfec7b9bf3a2871fe5/presentation-reducing-food-waste" // URL of the Genially presentation
    },
    "food-labels": {
        title: "Understanding Food Labels",
        type: "video1",
        url: "https://youtu.be/yZoJnj9irUg",
        // This module still uses the 'content' property for static HTML/quiz
        content: `
            <h3>Interactive Quiz: Test Your Knowledge!</h3>
            <div class="quiz-container">
                <div class="quiz-question">
                    <p>1. What does the serving size on a nutrition label represent?</p>
                    <div class="quiz-options">
                        <label><input type="radio" name="q1" value="a"> The recommended amount of food for one person per day</label>
                        <label><input type="radio" name="q1" value="b"> The total amount of food in the package</label>
                        <label><input type="radio" name="q1" value="c"> The quantity of food the nutritional values are based on</label>
                        <label><input type="radio" name="q1" value="d"> The number of servings in the package</label>
                    </div>
                    <button onclick="checkQuizAnswer('q1', 'c')">Check Answer</button>
                    <div class="quiz-feedback" id="feedback-q1"></div>
                </div>
                <div class="quiz-question">
                    <p>2. If a serving size is 100g and you eat 200g, what happens to the calorie and nutrient intake?</p>
                     <div class="quiz-options">
                        <label><input type="radio" name="q2" value="a"> It stays the same</label>
                        <label><input type="radio" name="q2" value="b"> It is cut in half</label>
                        <label><input type="radio" name="q2" value="c"> It is multiplied by 1.5</label>
                        <label><input type="radio" name="q2" value="d"> It doubles</label>
                    </div>
                     <button onclick="checkQuizAnswer('q2', 'd')">Check Answer</button>
                     <div class="quiz-feedback" id="feedback-q2"></div>
                </div>
                <div class="quiz-question">
                    <p>3. Which of the following nutrients should you try to limit in your diet?</p>
                    <div class="quiz-options">
                        <label><input type="radio" name="q3" value="a"> Dietary fiber and protein</label>
                        <label><input type="radio" name="q3" value="b"> Saturated fats and trans fats</label>
                        <label><input type="radio" name="q3" value="c"> Calcium and iron</label>
                        <label><input type="radio" name="q3" value="d"> Potassium and Vitamin D</label>
                    </div>
                    <button onclick="checkQuizAnswer('q3', 'b')">Check Answer</button>
                    <div class="quiz-feedback" id="feedback-q3"></div>
                </div>
                <div class="quiz-question">
                    <p>4. What does a % Daily Value (%DV) of 20% or more indicate?</p>
                    <div class="quiz-options">
                        <label><input type="radio" name="q4" value="a"> The nutrient is absent in the food</label>
                        <label><input type="radio" name="q4" value="b"> The food is low in that nutrient</label>
                        <label><input type="radio" name="q4" value="c"> The food is high in that nutrient</label>
                        <label><input type="radio" name="q4" value="d"> You have exceeded your daily limit</label>
                    </div>
                    <button onclick="checkQuizAnswer('q4', 'c')">Check Answer</button>
                    <div class="quiz-feedback" id="feedback-q4"></div>
                </div>
                <div class="quiz-question">
                    <p>5. Why is the ingredient list ordered the way it is?</p>
                    <div class="quiz-options">
                        <label><input type="radio" name="q5" value="a"> Ingredients are listed in alphabetical order</label>
                        <label><input type="radio" name="q5" value="b"> Ingredients are grouped by food type</label>
                        <label><input type="radio" name="q5" value="c"> Ingredients are listed by how much they weigh, from most to least</label>
                        <label><input type="radio" name="q5" value="d"> Ingredients are listed by how healthy they are</label>
                    </div>
                    <button onclick="checkQuizAnswer('q5', 'c')">Check Answer</button>
                    <div class="quiz-feedback" id="feedback-q5"></div>
                </div>
            </div>
             <a href="#" class="btn-secondary disabled">Download Label Guide (PDF Coming Soon)</a>
        `
    },
    "renewable-energy": {
        title: "Introduction to Renewable Energy",
        type: "genially",
        url: "https://view.genially.com/680d5942a9d5399ccf5f03f7/interactive-content-types-of-renewable-energy"
    },
    "renewability": {
        title: "Understanding Renewable Energy Sources",
        type: "video2",
        url: "https://youtu.be/s54ls3Y3By4"
    },
    "sustainable-clothing": {
        title: "Sustainable Clothing Choices",
        type: "genially",
        url: "https://view.genially.com/680d3f26ec7b9bf3a2a9240e/guide-sustainable-clothing"
    },
    "government-policies": {
        title: "Government Policies",
        type: "video3"
    }
};

function loadModule(moduleId) {
    if (!moduleContentArea) {
        console.error("Module content area not found!");
        return;
    }
    if (moduleData[moduleId]) {
        const data = moduleData[moduleId];
        let contentHTML = ''; // Variable to hold the final HTML to be inserted

        if (data.type === 'genially' && data.url) {
            // Construct the responsive iframe HTML if it's a Genially module
            contentHTML = `
                <div style="position: relative; padding-bottom: 56.25%; /* 16:9 aspect ratio */ height: 0; overflow: hidden; max-width: 100%;">
                    <iframe
                        src="${data.url}"  /* Use the URL from the data object */
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
                        frameborder="0"
                        allowfullscreen="true"
                        title="${data.title}" /* Use title from data object for accessibility */ >
                    </iframe>
                </div>`;
        } else if (data.type === 'video1' && data.content) {
            // Use the static content if the 'content' property exists
            contentHTML = `
                <h2>${data.title}</h2>
                <iframe width="853" height="480" src="https://www.youtube.com/embed/yZoJnj9irUg" title="Video Lesson: Understanding Nutritional labels" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                ${data.content}`; // Append the static content (quiz) after the video
        } else if (data.type === 'video2' && data.content) {
            // Use the static content if the 'content' property exists
            contentHTML = `
                <h2>${data.title}</h2>
                <iframe width="853" height="480" src="https://www.youtube.com/embed/s54ls3Y3By4" title="Video Lesson: Understanding Renewable Energy Sources" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                ${data.content}`; // Append the static content (quiz) after the video
        } else if (data.content) {
            // Use the static content if the 'content' property exists
            contentHTML = data.content;
        } else {
            // Fallback if neither type/url nor content is found
            contentHTML = `<p>Content not available for this module.</p>`;
        }

        // *** THIS IS THE CORRECTED LINE: Use contentHTML, not data.content ***
        moduleContentArea.innerHTML = `<h2>${data.title}</h2>${contentHTML}`;

        // Scroll to the content area after loading
        moduleContentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } else {
        moduleContentArea.innerHTML = `<p>Sorry, content for module ID "${moduleId}" could not be found.</p>`;
    }
}

// Quiz function remains the same, only relevant for modules with 'content' property containing quiz HTML
function checkQuizAnswer(questionName, correctAnswerValue) {
    const options = document.querySelectorAll(`input[name="${questionName}"]`);
    const feedbackDiv = document.getElementById(`feedback-${questionName}`);
    let selectedValue = null;

    options.forEach(option => {
        if (option.checked) {
            selectedValue = option.value;
        }
    });

    if (!feedbackDiv) return; // Exit if feedback div not found

    if (selectedValue === null) {
        feedbackDiv.textContent = "Please select an answer.";
        feedbackDiv.className = 'quiz-feedback'; // Reset class
    } else if (selectedValue === correctAnswerValue) {
        feedbackDiv.textContent = "Correct!";
        feedbackDiv.className = 'quiz-feedback correct';
    } else {
        feedbackDiv.textContent = "Incorrect. Try again or review the material.";
        feedbackDiv.className = 'quiz-feedback incorrect';
    }
}


console.log("Modules script loaded.");