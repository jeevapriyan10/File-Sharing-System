const fileInput = document.getElementById("fileInput");
const statusText = document.getElementById("status");
const fileLinkContainer = document.getElementById("fileLink");
const timerText = document.getElementById("timer");

async function uploadFile() {
    if (fileInput.files.length === 0) {
        statusText.textContent = "Please select a file first!";
        statusText.style.color = "red";
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);

    statusText.textContent = "Uploading...";
    statusText.style.color = "yellow";

    try {
        const response = await fetch("/upload", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            const fileUrl = window.location.origin + "/file/" + result.fileId;
            fileLinkContainer.innerHTML = `<p>File Link: <a href="${fileUrl}" target="_blank">${fileUrl}</a></p>`;
            statusText.textContent = "File uploaded successfully!";
            statusText.style.color = "green";

            startTimer();
        } else {
            throw new Error(result.message || "Upload failed");
        }
    } catch (error) {
        statusText.textContent = "Error: " + error.message;
        statusText.style.color = "red";
    }
}

function startTimer() {
    let timeLeft = 600; // 10 minutes (600 seconds)
    updateTimerText(timeLeft);

    const timerInterval = setInterval(() => {
        timeLeft -= 1;
        updateTimerText(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerText.textContent = "Link expired!";
            fileLinkContainer.innerHTML = "";
        }
    }, 1000);
}

function updateTimerText(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerText.textContent = `Link expires in: ${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
