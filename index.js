const btnEl = document.getElementById("btn");
const birthdayEl = document.getElementById("birthday");
const resultEl = document.getElementById("result");
const errorMessageEl = document.getElementById("error-message");
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = themeToggle.querySelector(".icon");

// Load last birthday and theme from localStorage
const savedBirthday = localStorage.getItem("lastBirthday");
if (savedBirthday) {
    birthdayEl.value = savedBirthday;
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeIcon.textContent = "☀️";
}

// Theme toggle
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeIcon.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

function calculateAge() {
    const birthdayValue = birthdayEl.value;
    if (!birthdayValue) {
        showError("Please enter your birthday");
        return;
    }

    const birthdayDate = new Date(birthdayValue);
    const currentDate = new Date();

    if (birthdayDate > currentDate) {
        showError("Birthday cannot be in the future");
        return;
    }

    btnEl.disabled = true;
    btnEl.classList.add("loading");
    errorMessageEl.style.display = "none";
    birthdayEl.classList.remove("error");

    localStorage.setItem("lastBirthday", birthdayValue);

    setTimeout(() => {
        const ageDetails = getAgeDetails(birthdayValue);
        resultEl.innerHTML = `
            <div class="age-breakdown">
                <div class="age-card" data-aos="zoom-in" data-aos-delay="100">
                    <h3>${ageDetails.years}</h3>
                    <p>Years</p>
                </div>
                <div class="age-card" data-aos="zoom-in" data-aos-delay="200">
                    <h3>${ageDetails.months}</h3>
                    <p>Months</p>
                </div>
                <div class="age-card" data-aos="zoom-in" data-aos-delay="300">
                    <h3>${ageDetails.days}</h3>
                    <p>Days</p>
                </div>
                <div class="age-card" data-aos="zoom-in" data-aos-delay="400">
                    <h3>${ageDetails.hours}</h3>
                    <p>Hours</p>
                </div>
                <div class="age-card" data-aos="zoom-in" data-aos-delay="500">
                    <h3>${ageDetails.minutes}</h3>
                    <p>Minutes</p>
                </div>
            </div>
            <button class="share-btn" onclick="shareResult(${JSON.stringify(ageDetails)})">
                Share Result
                <span class="tooltip" style="top: -50px; left: 50%; transform: translateX(-50%);">Share your age!</span>
            </button>
        `;
        AOS.init({ once: true, duration: 800 });
        resultEl.classList.add("show");
        btnEl.disabled = false;
        btnEl.classList.remove("loading");
        launchConfetti();
    }, 1000);
}

function getAgeDetails(birthdayValue) {
    const currentDate = new Date();
    const birthdayDate = new Date(birthdayValue);
    const diffMs = currentDate - birthdayDate;

    const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor((diffMs % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.42));
    const days = Math.floor((diffMs % (1000 * 60 * 60 * 24 * 30.42)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return { years, months, days, hours, minutes };
}

function showError(message) {
    errorMessageEl.textContent = message;
    errorMessageEl.style.display = "block";
    birthdayEl.classList.add("error");
}

function launchConfetti() {
    confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ce79'],
        shapes: ['circle', 'square', 'triangle'],
        scalar: 1.2
    });
}

function shareResult(ageDetails) {
    const shareText = `I'm ${ageDetails.years} years, ${ageDetails.months} months, and ${ageDetails.days} days old! Calculate your age at: [Your Website URL]`;
    if (navigator.share) {
        navigator.share({
            title: 'My Age Calculation',
            text: shareText,
        }).catch(err => console.error('Share failed:', err));
    } else {
        navigator.clipboard.write(shareText)
            .then(() => alert('Result copied to clipboard!'))
            .catch(err => console.error('Copy failed:', err));
    }
}

birthdayEl.addEventListener("input", () => {
    errorMessageEl.style.display = "none";
    birthdayEl.classList.remove("error");
});

btnEl.addEventListener("click", calculateAge);

// Keyboard accessibility
birthdayEl.addEventListener("keypress", (e) => {
    if (e.key === "Enter") calculateAge();
});