async function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    if (!fileInput.files.length) {
        alert("Please select a file first!");
        return;
    }

    let formData = new FormData();
    formData.append("file", fileInput.files[0]);

    document.getElementById("status").innerText = "Uploading...";

    try {
        let response = await fetch("http://localhost:3000/upload", {
            method: "POST",
            body: formData
        });

        let result = await response.json();

        if (result.success) {
            document.getElementById("status").innerText = "Upload successful!";
            document.getElementById("fileLink").innerHTML =
                `<a href="${result.fileUrl}" target="_blank">Download File</a>`;

            startCountdown(5 * 60); // 5-minute countdown
        } else {
            document.getElementById("status").innerText = "Upload failed!";
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("status").innerText = "Upload error!";
    }
}

function startCountdown(seconds) {
    const timerElement = document.getElementById("timer");

    function updateTimer() {
        let minutes = Math.floor(seconds / 60);
        let secs = seconds % 60;
        timerElement.innerText = `Link expires in: ${minutes}:${secs < 10 ? "0" : ""}${secs}`;

        if (seconds > 0) {
            seconds--;
            setTimeout(updateTimer, 1000);
        } else {
            timerElement.innerText = "Link expired!";
            document.getElementById("fileLink").innerHTML = ""; // Remove download link
        }
    }

    updateTimer();
}
