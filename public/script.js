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
        } else {
            document.getElementById("status").innerText = "Upload failed!";
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("status").innerText = "Upload error!";
    }
}