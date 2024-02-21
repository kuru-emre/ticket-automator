console.log("popup.js is loaded...");

function updateTable(data) {
    let tbody = document.querySelector("tbody"); // Get the tbody element

    // Clear existing rows
    tbody.innerHTML = "";

    let tr = document.createElement("tr"); // Create a new table row
    tr.className = "text-center align-middle"

    // Create table data cells and set their content
    Object.entries(data).forEach(([key, value]) => {
        let td = document.createElement("td");
        td.textContent = value;
        td.id = key
        tr.appendChild(td);
    });

    tbody.appendChild(tr); // Append the new row to the tbody

}

function filterAllData(data) {
    return {
        ...filterDatesAndLot(data.notes),
        "vehicleId": data.vehicleId,
        "gsa": filterGSA(data.gsa),
        "guestName" : data.guestName,
        "guestID" : data.guestId

    }
}


function filterDatesAndLot(data) {
    const regex = /(\w{3} \d{1,2}) - (\w{3} \d{1,2}) (\w+)(?=\s|$)/;

    const match = data.match(regex);

    return {
        "issue": match ? match[1] : 'not found',
        "arrival": match ? match[2] : 'not found',
        "lot": match ? match[3] : 'not found'
    }
}

function filterGSA(gsa) {
    return gsa.substring(0, 2);

}


document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get("data", (result) => {
        let unfilteredData = result.data; // Retrieve the value from the result object
        console.log("Retrieved data from storage", unfilteredData);
        updateTable(filterAllData(unfilteredData));

    });
});