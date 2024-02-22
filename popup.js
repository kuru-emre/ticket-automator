const { PDFDocument, degrees } = PDFLib;
const CONVERSION = 0.665;
const PDF = {
    height: document.getElementById("ticket").clientHeight * CONVERSION, // convert to points from pixels
    width: document.getElementById("ticket").clientWidth * CONVERSION, // convert to points from pixels
    templatePath: "./template_fillable.pdf"
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

async function pdfTemplate(template, data) {
    const pdfBytes = await fetch(template).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const form = pdfDoc.getForm()

    Object.entries(data).forEach(([key, value]) => {
        form.getTextField(key).setText(value)
    });

    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
    document.getElementById('ticket').src = pdfDataUri;



}


async function createPdf(template) {
    const pdfBytes = await fetch(template).then(res => res.arrayBuffer());
    const pdfTemplate = await PDFDocument.load(pdfBytes);
    const pdfDoc = await PDFDocument.create();

    const copiedPages = await pdfDoc.copyPages(pdfTemplate, [0]); // Change the page number as per your requirement

    copiedPages.forEach((page) => {
        pdfDoc.addPage(page, [PDF.width, PDF.height])
    });




    // const page = pdfDoc.addPage([pdf.width, pdf.height]);
    // page.moveTo(110, 200);
    // page.drawText('Hello World!');


    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
    document.getElementById('ticket').src = pdfDataUri;

}



chrome.storage.local.get("data", (result) => {
    let data = filterAllData(result.data);
    updateTable(data);


    document.getElementById('printBtn'); addEventListener('click', async function () {
        await pdfTemplate(PDF.templatePath, data);
    });

});