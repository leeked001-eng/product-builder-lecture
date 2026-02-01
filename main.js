document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const lottoNumbersContainer = document.querySelector('.lotto-numbers');

    const generateAndDisplayNumbers = () => {
        // Clear previous numbers and reset animation
        lottoNumbersContainer.innerHTML = '';

        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }

        const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

        sortedNumbers.forEach((number, index) => {
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
