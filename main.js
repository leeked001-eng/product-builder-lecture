document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.getElementById('checkbox');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.body.setAttribute('data-theme', currentTheme);

        if (currentTheme === 'dark') {
            themeSwitch.checked = true;
        }
    }

    function switchTheme(e) {
        if (e.target.checked) {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }

    themeSwitch.addEventListener('change', switchTheme, false);

    const generateBtn = document.getElementById('generate-btn');
    const lottoNumbersContainer = document.querySelector('.lotto-numbers');

    const generateAndDisplayNumbers = () => {
        console.log("generateAndDisplayNumbers called");
        // Clear previous numbers and reset animation
        lottoNumbersContainer.innerHTML = '';

        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }
        console.log("Generated numbers:", numbers);

        const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
        console.log("Sorted numbers:", sortedNumbers);

        sortedNumbers.forEach((number, index) => {
            console.log(`Creating span for number ${number}`);
            const span = document.createElement('span');
            span.textContent = number;
            // Apply a staggered delay to the animation
            span.style.animationDelay = `${index * 100}ms`;
            lottoNumbersContainer.appendChild(span);
        });
    };

    // Generate numbers on page load
    generateAndDisplayNumbers();

    // Generate numbers on button click
    generateBtn.addEventListener('click', generateAndDisplayNumbers);
});
