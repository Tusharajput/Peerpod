// Initialize the PeerJS object
const peer = new Peer({
    key: 'peerjs',
    debug: 3
});

// Get DOM elements
const fileInput = document.getElementById('fileInput');
const peerIdInput = document.getElementById('peerIdInput');
const connectButton = document.getElementById('connectButton');
const peerIdDisplay = document.getElementById('peerIdDisplay');
const statusDisplay = document.getElementById('statusDisplay');
const downloadLink = document.getElementById('downloadLink');
const peerConnectionSection = document.getElementById('peerConnectionSection');
const copyButton = document.getElementById('copyButton');
const qrCode = document.getElementById('qrCode'); // QR code image
const scannerDiv = document.getElementById('scanner'); // QR code scanner div
const scanQRButton = document.getElementById('scanQRButton'); // Button to trigger QR code scanning

// Connection variable
let conn;

// Handle peer connection
peer.on('open', id => {
    console.log('My peer ID is: ' + id);
    peerIdDisplay.textContent = id;
    updateStatus('Ready to connect');
    generateQRCode(id); // Generate QR code with the peer ID
});

peer.on('connection', connection => {
    conn = connection;
    updateStatus('Connected');

    // Hide peer ID input section after connection
    peerConnectionSection.classList.add('hidden');

    connection.on('data', data => {
        if (data.file) {
            const blob = new Blob([data.file.content], { type: data.file.type });
            const url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = data.file.name; // Set the filename from metadata
            downloadLink.textContent = `Download ${data.file.name}`; // Update the link text to the file name
            downloadLink.classList.remove('hidden'); // Show the download link
            downloadLink.removeAttribute('disabled'); // Enable the download link
            updateStatus('File received');

            // Clear the file after 10 seconds
            setTimeout(() => {
                downloadLink.classList.add('hidden'); // Hide the download link
                downloadLink.href = '#'; // Reset the href
                downloadLink.removeAttribute('download'); // Remove the download attribute
                updateStatus('File cleared');
            }, 10000);
        }
    });

    connection.on('close', () => {
        updateStatus('Disconnected');
    });
});

peer.on('disconnected', () => {
    updateStatus('Disconnected');
});

peer.on('error', err => {
    console.error(err);
    updateStatus('Error: ' + err.message);
});

// Automatically send the file after selection
fileInput.addEventListener('change', () => {
    if (conn) {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const fileData = {
                    name: file.name,
                    type: file.type,
                    content: event.target.result
                };
                conn.send({ file: fileData });
                updateStatus('Sending file...');
                
                // Wait for an acknowledgment of file reception
                conn.on('data', (data) => {
                    if (data.status === 'received') {
                        updateStatus('File sent successfully');
                    }
                });
            };
            reader.readAsArrayBuffer(file);
        }
    } else {
        updateStatus('No connection established');
    }
});

// Handle connecting to another peer
connectButton.addEventListener('click', () => {
    const peerId = peerIdInput.value;
    if (peerId) {
        conn = peer.connect(peerId);

        conn.on('open', () => {
            updateStatus('Connected to peer: ' + peerId);

            // Hide peer ID input section after connection
            peerConnectionSection.classList.add('hidden');
        });

        conn.on('data', data => {
            if (data.file) {
                const blob = new Blob([data.file.content], { type: data.file.type });
                const url = URL.createObjectURL(blob);
                downloadLink.href = url;
                downloadLink.download = data.file.name; // Set the filename from metadata
                downloadLink.textContent = `Download ${data.file.name}`; // Update the link text to the file name
                downloadLink.classList.remove('hidden'); // Show the download link
                downloadLink.removeAttribute('disabled'); // Enable the download link
                updateStatus('File received');

                // Clear the file after 10 seconds
                setTimeout(() => {
                    downloadLink.classList.add('hidden'); // Hide the download link
                    downloadLink.href = '#'; // Reset the href
                    downloadLink.removeAttribute('download'); // Remove the download attribute
                    updateStatus('File cleared');
                }, 10000);

                // Send acknowledgment of file reception
                conn.send({ status: 'received' });
            }
        });

        conn.on('close', () => {
            updateStatus('Disconnected');
        });
    }
});

// Copy Peer ID to clipboard
copyButton.addEventListener('click', () => {
    const peerId = peerIdDisplay.textContent;
    if (peerId !== 'Not available') {
        navigator.clipboard.writeText(peerId).then(() => {
            updateStatus('Peer ID copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            updateStatus('Failed to copy Peer ID');
        });
    }
});

// Generate QR code
function generateQRCode(peerId) {
    QRCode.toDataURL(peerId, { width: 128 }, (err, url) => {
        if (err) {
            console.error('Failed to generate QR code: ', err);
            return;
        }
        qrCode.src = url; // Set the QR code image source to the data URL
    });
}

// Function to update status display
function updateStatus(message) {
    statusDisplay.textContent = message;
}

// Scan QR code and connect automatically
scanQRButton.addEventListener('click', () => {
    scannerDiv.classList.remove('hidden'); // Show the scanner div

    // Initialize the QR code scanner
    const qrScanner = new Html5Qrcode("scanner");

    // Start the QR code scanner
    qrScanner.start(
        { facingMode: "environment" }, // Use the rear camera
        {
            fps: 10, // Frame rate
        },
        (decodedText, decodedResult) => {
            console.log(`Decoded Text: ${decodedText}`);
            
            // Hide the scanner div
            scannerDiv.classList.add('hidden');
            
            // Stop the scanner
            qrScanner.stop();
            
            // Process the decoded text (e.g., authenticate/ connect to peer)
            authenticatePeer(decodedText);
        },
        (errorMessage) => {
            console.error(`QR code scanning error: ${errorMessage}`);
        }
    ).catch(err => {
        console.error(`QR code scanner initialization error: ${err}`);
    });
});

// Function to handle authentication or peer connection
function authenticatePeer(peerId) {
    conn = peer.connect(peerId);
    
    conn.on('open', () => {
        updateStatus('Connected to peer: ' + peerId);

        // Hide peer ID input section after connection
        peerConnectionSection.classList.add('hidden');
    });

    conn.on('data', data => {
        if (data.file) {
            const blob = new Blob([data.file.content], { type: data.file.type });
            const url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = data.file.name; // Set the filename from metadata
            downloadLink.textContent = `Download ${data.file.name}`; // Update the link text to the file name
            downloadLink.classList.remove('hidden'); // Show the download link
            downloadLink.removeAttribute('disabled'); // Enable the download link
            updateStatus('File received');

            // Clear the file after 10 seconds
            setTimeout(() => {
                downloadLink.classList.add('hidden'); // Hide the download link
                downloadLink.href = '#'; // Reset the href
                downloadLink.removeAttribute('download'); // Remove the download attribute
                updateStatus('File cleared');
            }, 10000);

            // Send acknowledgment of file reception
            conn.send({ status: 'received' });
        }
    });

    conn.on('close', () => {
        updateStatus('Disconnected');
    });
}
