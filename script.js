document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Contact Form Validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
                e.preventDefault();
                alert('Please fill out all fields.');
            } else {
                alert('Thank you for your message! We will get back to you soon.');
            }
        });
    }

    // Quiz Functionality
    const startQuizBtns = document.querySelectorAll('.start-quiz-btn');
    const quizContainer = document.getElementById('quiz-container');
    const quizForm = document.getElementById('quiz-form');
    const submitQuizBtn = document.getElementById('submit-quiz-btn');

    const quizQuestions = [
        {
            question: "Which of these is a renewable energy source?",
            options: ["Coal", "Natural Gas", "Solar Power", "Petroleum"],
            correctAnswer: "Solar Power"
        },
        {
            question: "What does 'Reduce' in the 3 Rs stand for?",
            options: ["Reduce waste production", "Reduce your spending", "Reduce the number of landfills", "Reduce carbon emissions"],
            correctAnswer: "Reduce waste production"
        },
        {
            question: "How long does a plastic bottle take to decompose?",
            options: ["10 years", "100 years", "450 years", "2000 years"],
            correctAnswer: "450 years"
        },
        {
            question: "Which gas is a major contributor to the greenhouse effect?",
            options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
            correctAnswer: "Carbon Dioxide"
        },
        {
            question: "What is the primary benefit of recycling?",
            options: ["It saves money", "It saves energy and natural resources", "It creates more jobs", "It makes products look better"],
            correctAnswer: "It saves energy and natural resources"
        },
        {
            question: "What is a 'carbon footprint'?",
            options: ["The amount of CO2 a person produces", "The size of your shoe print on the ground", "The carbon content in your food", "The total amount of carbon in a car"],
            correctAnswer: "The amount of CO2 a person produces"
        },
        {
            question: "Which of these is a good way to save water?",
            options: ["Taking long showers", "Leaving the tap running while brushing your teeth", "Fixing leaky faucets", "Watering your garden in the middle of the day"],
            correctAnswer: "Fixing leaky faucets"
        },
        {
            question: "What does 'sustainable' mean?",
            options: ["Something that is easy to do", "Something that can be used once", "Meeting our own needs without compromising the ability of future generations to meet their own needs", "Something that lasts forever"],
            correctAnswer: "Meeting our own needs without compromising the ability of future generations to meet their own needs"
        },
        {
            question: "Which of the following is a result of climate change?",
            options: ["Lower sea levels", "Decreased global temperatures", "More frequent and intense extreme weather events", "Increased biodiversity"],
            correctAnswer: "More frequent and intense extreme weather events"
        },
        {
            question: "What is compost made from?",
            options: ["Plastic and glass", "Metal and wood", "Food scraps and yard waste", "Chemicals"],
            correctAnswer: "Food scraps and yard waste"
        }
    ];
    
    // Add a single event listener for all start quiz buttons
    if (startQuizBtns.length > 0) {
        startQuizBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                quizContainer.classList.remove('hidden-quiz');
                quizForm.innerHTML = '';
                quizQuestions.forEach((q, index) => {
                    const questionDiv = document.createElement('div');
                    questionDiv.classList.add('form-group');
                    
                    const questionLabel = document.createElement('label');
                    questionLabel.textContent = `${index + 1}. ${q.question}`;
                    questionDiv.appendChild(questionLabel);

                    q.options.forEach(option => {
                        const optionDiv = document.createElement('div');
                        const input = document.createElement('input');
                        input.type = 'radio';
                        input.name = `question${index}`;
                        input.value = option;
                        input.id = `q${index}-option${option.replace(/\s+/g, '')}`;

                        const label = document.createElement('label');
                        label.textContent = option;
                        label.htmlFor = input.id;
                        
                        optionDiv.appendChild(input);
                        optionDiv.appendChild(label);
                        questionDiv.appendChild(optionDiv);
                    });
                    quizForm.appendChild(questionDiv);
                });
                submitQuizBtn.classList.remove('hidden-quiz');
                
                // Scroll to the quiz section
                quizContainer.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    if (submitQuizBtn) {
        submitQuizBtn.addEventListener('click', (e) => {
            e.preventDefault();
            let score = 0;
            quizQuestions.forEach((q, index) => {
                const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
                if (selectedOption && selectedOption.value === q.correctAnswer) {
                    score += 10;
                }
            });

            const userName = prompt(`Quiz Complete! You scored ${score} points out of ${quizQuestions.length * 10}. Please enter your name to save your score:`);
            if (userName) {
                updateLeaderboard(userName, score);
            } else {
                alert("Score not saved. You need to enter a name to be on the leaderboard.");
                // Hide quiz after submission
                quizContainer.classList.add('hidden-quiz');
            }
        });
    }

    // Leaderboard Functions
    function getLeaderboard() {
        const leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];
        return leaderboardData;
    }

    function saveLeaderboard(data) {
        localStorage.setItem('leaderboard', JSON.stringify(data));
    }

    function updateLeaderboard(name, score) {
        const leaderboard = getLeaderboard();
        leaderboard.push({ name: name, score: score, timestamp: new Date().getTime() });
        
        // Sort by score in descending order
        leaderboard.sort((a, b) => b.score - a.score);
        
        // Keep top 10 players
        const topPlayers = leaderboard.slice(0, 10);
        
        saveLeaderboard(topPlayers);
        
        // Redirect to leaderboard page to show updated results
        window.location.href = 'leaderboard.html';
    }

    function renderLeaderboard() {
        const leaderboardBody = document.getElementById('leaderboard-body');
        if (!leaderboardBody) return;

        const leaderboardData = getLeaderboard();
        leaderboardBody.innerHTML = ''; // Clear existing rows

        if (leaderboardData.length === 0) {
            leaderboardBody.innerHTML = '<tr><td colspan="3" style="text-align: center;">No scores yet. Take the quiz!</td></tr>';
        } else {
            leaderboardData.forEach((player, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${player.name}</td>
                    <td>${player.score}</td>
                `;
                leaderboardBody.appendChild(row);
            });
        }
    }
    
    // Call renderLeaderboard when the leaderboard page loads
    if (document.getElementById('leaderboard-section')) {
        renderLeaderboard();
    }
});