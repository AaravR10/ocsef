const moduleContentArea = document.getElementById('module-content-area');

const moduleData = {
    "food-waste": {
        title: "Reducing Food Waste",
        content: `
            <h3>Understanding the Impact</h3>
            <p>Food waste has significant environmental, social, and economic costs. When food rots in landfills, it produces methane, a potent greenhouse gas...</p>
            <img src="images/food_waste_infographic.png" alt="Food Waste Infographic" style="max-width: 80%; margin: 15px auto; display: block;">
            <h3>Practical Tips for Home</h3>
            <ul>
                <li>Plan your meals and make shopping lists.</li>
                <li>Understand date labels ('Use By' vs 'Best Before').</li>
                <li>Store food properly to extend its life.</li>
                <li>Get creative with leftovers.</li>
                <li>Compost food scraps if possible.</li>
            </ul>
            <a href="#" class="btn-secondary disabled">Download Guide (PDF Coming Soon)</a>
        `
    },
    "food-labels": {
        title: "Understanding Food Labels",
        content: `
            <h3>Decoding Common Labels</h3>
            <p>Labels like 'Organic', 'Fair Trade', 'Rainforest Alliance Certified', and expiration dates tell different stories about sustainability and safety.</p>
             <img src="images/food_label_example.png" alt="Example food labels" style="max-width: 70%; margin: 15px auto; display: block;">
            <h3>Interactive Quiz: Test Your Knowledge!</h3>
            <div class="quiz-container">
                <div class="quiz-question">
                    <p>1. What does the 'Use By' date typically indicate?</p>
                    <div class="quiz-options">
                        <label><input type="radio" name="q1" value="a"> The last day the product is at peak quality.</label>
                        <label><input type="radio" name="q1" value="b"> The last day the product is considered safe to eat.</label>
                        <label><input type="radio" name="q1" value="c"> The date the product was packaged.</label>
                    </div>
                    <button onclick="checkQuizAnswer('q1', 'b')">Check Answer</button>
                    <div class="quiz-feedback" id="feedback-q1"></div>
                </div>
                <div class="quiz-question">
                    <p>2. Which label often indicates better environmental practices and biodiversity protection?</p>
                     <div class="quiz-options">
                        <label><input type="radio" name="q2" value="a"> Gluten-Free</label>
                        <label><input type="radio" name="q2" value="b"> Non-GMO Project Verified</label>
                        <label><input type="radio" name="q2" value="c"> Rainforest Alliance Certified</label>
                    </div>
                     <button onclick="checkQuizAnswer('q2', 'c')">Check Answer</button>
                     <div class="quiz-feedback" id="feedback-q2"></div>
                </div>
                 <!-- Add more questions -->
            </div>
             <a href="#" class="btn-secondary disabled">Download Label Guide (PDF Coming Soon)</a>
        `
    },
    "circular-economy": {
        title: "Introduction to Circular Economy",
        content: `
            <h3>Linear vs. Circular</h3>
            <p>The traditional linear economy model is 'take-make-dispose'. A circular economy aims to keep resources in use for as long as possible, extracting maximum value, then recovering and regenerating products and materials.</p>
            <img src="images/circular_economy_diagram.png" alt="Circular Economy Diagram" style="max-width: 80%; margin: 15px auto; display: block;">
            <h3>Key Principles (The 3 R's and more!)</h3>
            <ul>
                <li><strong>Reduce:</strong> Minimize resource consumption.</li>
                <li><strong>Reuse:</strong> Use products multiple times for their original purpose.</li>
                <li><strong>Recycle:</strong> Process materials to make new products.</li>
                <li><strong>Repair:</strong> Fix broken items instead of replacing them.</li>
                <li><strong>Remanufacture/Refurbish:</strong> Restore products to a like-new condition.</li>
            </ul>
            <p>Learn how these principles apply to electronics, fashion, packaging, and more.</p>
        `
    }
    // Add more module data objects here
};

function loadModule(moduleId) {
    if (!moduleContentArea) {
        console.error("Module content area not found!");
        return;
    }
    if (moduleData[moduleId]) {
        const data = moduleData[moduleId];
        moduleContentArea.innerHTML = `<h2>${data.title}</h2>${data.content}`;
         // Scroll to the content area after loading
        moduleContentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        moduleContentArea.innerHTML = `<p>Sorry, content for module ID "${moduleId}" could not be found.</p>`;
    }
}

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