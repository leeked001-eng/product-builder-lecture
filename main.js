// Teachable Machine model URL
const URL = "https://teachablemachine.withgoogle.com/models/LLx3kzFVp/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Setup webcam
    const flip = true; // Flips the webcam feed
    webcam = new tmImage.Webcam(400, 400, flip); // width, height, flip
    await webcam.setup(); // Request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // Append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    
    // Create result bars for each class
    for (let i = 0; i < maxPredictions; i++) {
        const className = model.getClassLabels()[i];
        const resultItem = document.createElement("div");
        resultItem.classList.add("result-item");

        const label = document.createElement("div");
        label.classList.add("result-label");
        label.innerHTML = className === 'Dog' ? '강아지상' : '고양이상';

        const barContainer = document.createElement("div");
        barContainer.classList.add("result-bar-container");

        const bar = document.createElement("div");
        bar.classList.add("result-bar");
        bar.id = `result-bar-${i}`;

        barContainer.appendChild(bar);
        resultItem.appendChild(label);
        resultItem.appendChild(barContainer);
        labelContainer.appendChild(resultItem);
    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = (prediction[i].probability * 100).toFixed(1) + "%";
        const resultBar = document.getElementById(`result-bar-${i}`);
        resultBar.style.width = classPrediction;
        resultBar.innerHTML = classPrediction;
    }
}

// Initialize the application
init();
