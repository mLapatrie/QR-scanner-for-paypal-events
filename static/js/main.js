
var htmlContent;

var moreInfoButton = document.getElementById('moreInfo');
var nextScanButton = document.getElementById('nextScan');

document.addEventListener('DOMContentLoaded', function() {
    function onScanSuccess(decodedText, decodedResult) {
        // Send the decodedText (URL) to the Flask server
        fetch('/fetch-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: decodedText })
        })
        .then(response => response.json())
        .then(data => {
            // Display the fetched content
            var scan = document.getElementById('qr-scanner');
            var contentDisplay = document.getElementById('content-display');
            scan.classList.add("hidden");

            htmlContent = data.content

            answerText = ""

            console.log(data.ticket_scanned)

            if (data.ticket_scanned == "No") {
                answerText = "<h2 style='background-color: greenyellow;'>Correct</h2>" + data.tickets_type + "</br>";
            }
            else {
                answerText = "<h2 style='background-color: red;'>Incorrect</h2>"
            }

            contentDisplay.innerHTML = answerText;
        })
        .catch(error => console.error('Error fetching URL:', error));
    }

    function onScanFailure(error) {
        // Handle scan failure, usually better to ignore and keep scanning.
        //console.warn(`QR error = ${error}`);
    }

    let html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-scanner", { fps: 10, qrbox: 500 });
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
});


function moreInfo() {
    var contentDisplay = document.getElementById('content-display');
    contentDisplay.innerHTML = htmlContent;
}


function nextScan() {
    document.getElementById('qr-scanner').classList.remove("hidden");
    document.getElementById('content-display').innerHTML = '';
}
