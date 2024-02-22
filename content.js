console.log("content.js is loaded...");

// Function to extract and send data to background script
function extractData() {
    console.log("Extracting data...");
    let data = {
        notes: document.getElementsByName('notes')[0].value,
        vehicleId: document.getElementsByName('vehicleId')[0].value,
        guestName: document.getElementById('guestName').innerText,
        gsa: document.getElementById('headerUserNameMenu').innerText,
        guestId: document.getElementById('reservationConfirmationNumber').innerText

    };

    console.log("Extracted data:", data);
    return data;
}

chrome.runtime.sendMessage({ data: extractData() }, (response) => {
    console.log("Background received the message: ", response.received);
});
