const URL = "https://teachablemachine.withgoogle.com/models/LLx3kzFVp/";

let model, webcam, labelContainer, maxPredictions;
let isWebcamActive = false;
let animationFrameId;

async function setup() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Create result bars for each class
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        const className = model.getClassLabels()[i];
        const resultItem = document.createElement("div");
        resultItem.classList.add("result-item");

        const label = document.createElement("div");
        label.classList.add("result-label");
        // BUG FIX: Use the correct class name from the model
        label.innerHTML = className === '강아지' ? '강아지상' : '고양이상';

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
    
    document.getElementById('toggle-camera-btn').addEventListener('click', toggleWebcam);
    
    // Set initial state
    stopWebcam();
}

async function startWebcam() {
    const flip = true;
    webcam = new tmImage.Webcam(400, 400, flip);
    await webcam.setup();
    await webcam.play();
    isWebcamActive = true;
    const webcamContainer = document.getElementById("webcam-container");
    webcamContainer.innerHTML = ''; // Clear placeholder
    webcamContainer.appendChild(webcam.canvas);
    document.getElementById('toggle-camera-btn').textContent = '카메라 끄기';
    animationFrameId = window.requestAnimationFrame(loop);
}

function stopWebcam() {
    if (webcam && webcam.stream) {
        webcam.stop();
    }
    isWebcamActive = false;
    if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
    }
    const webcamContainer = document.getElementById("webcam-container");
    webcamContainer.innerHTML = '<div class="webcam-placeholder">카메라가 꺼져 있습니다</div>';
    document.getElementById('toggle-camera-btn').textContent = '카메라 켜기';
}

async function toggleWebcam() {
    const btn = document.getElementById('toggle-camera-btn');
    btn.disabled = true;
    if (isWebcamActive) {
        stopWebcam();
    } else {
        await startWebcam();
    }
    btn.disabled = false;
}

async function loop() {
    if (!isWebcamActive) return;
    webcam.update();
    await predict();
    animationFrameId = window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const percent = prediction[i].probability * 100;
        const classPrediction = percent.toFixed(1) + "%";
        const resultBar = document.getElementById(`result-bar-${i}`);
        resultBar.style.width = classPrediction;
        resultBar.innerHTML = classPrediction;
    }
}

// Initial setup
setup();
