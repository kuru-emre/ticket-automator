const { PDFDocument, degrees } = PDFLib;
const CONVERSION = 0.665;
const PDF = {
    height: document.getElementById("ticket").clientHeight * CONVERSION, // convert to points from pixels
    width: document.getElementById("ticket").clientWidth * CONVERSION, // convert to points from pixels
    templatePath: "./template_fillable_big.pdf"
}

function updateTable(data) {
    let tbody = document.querySelector("tbody"); // Get the tbody element

    // Create table data cells and set their content
    Object.entries(data).forEach(([key, value]) => {
        let tr = document.createElement("tr"); // Create a new table row
        let th = document.createElement("th");
        let td = document.createElement("td");

        th.textContent = key;
        td.textContent = value;
        td.className = "text-muted";

        tr.appendChild(th);
        tr.appendChild(td);
        tbody.appendChild(tr); // Append the new row to the tbody
    });

}

function filterAllData(data) {
    return {
        ...filterDatesAndLot(data.notes),
        "license": data.vehicleId,
        "gsa": filterGSA(data.gsa),
        "guest": data.guestName,
        "id": data.guestId
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

async function createPDF(template, data) {
    const pdfBytes = await fetch(template).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const form = pdfDoc.getForm()
    const page = pdfDoc.getPage(0);

    Object.entries(data).forEach(([key, value]) => {
        const textField = form.getTextField(key);
        textField.setText(value)
    });

    page.scaleContent(0, 0);
    page.setRotation(degrees(180))
    pdfDoc.removePage(0);
    pdfDoc.addPage(page)


    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
    document.getElementById('ticket').src = pdfDataUri;
}


chrome.storage.local.get("data", (result) => {
    let data = filterAllData(result.data);
    updateTable(data);
    createPDF(PDF.templatePath, data)

});