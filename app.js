// // Initialize the PeerJS object
// const peer = new Peer({
//   key: "peerjs",
//   debug: 3,
// });

// // Get DOM elements
// const fileInput = document.getElementById("fileInput");
// const peerIdInput = document.getElementById("peerIdInput");
// const connectButton = document.getElementById("connectButton");
// const peerIdDisplay = document.getElementById("peerIdDisplay");
// const statusDisplay = document.getElementById("statusDisplay");
// const downloadLink = document.getElementById("downloadLink");
// const peerConnectionSection = document.getElementById("peerConnectionSection");
// const copyButton = document.getElementById("copyButton");
// const qrCode = document.getElementById("qrCode"); // QR code image
// const scannerDiv = document.getElementById("scanner"); // QR code scanner div
// const scanQRButton = document.getElementById("scanQRButton"); // Button to trigger QR code scanning

// // Connection variable
// let conn;

// // Handle peer connection
// peer.on("open", (id) => {
//   console.log("My peer ID is: " + id);
//   peerIdDisplay.textContent = id;
//   updateStatus("Ready to connect");
//   generateQRCode(id); // Generate QR code with the peer ID
// });

// peer.on("connection", (connection) => {
//   conn = connection;
//   updateStatus("Connected");

//   // Hide peer ID input section after connection
//   peerConnectionSection.classList.add("hidden");

//   connection.on("data", (data) => {
//     if (data.file) {
//       const blob = new Blob([data.file.content], { type: data.file.type });
//       const url = URL.createObjectURL(blob);
//       downloadLink.href = url;
//       downloadLink.download = data.file.name; // Set the filename from metadata
//       downloadLink.textContent = `Download ${data.file.name}`; // Update the link text to the file name
//       downloadLink.classList.remove("hidden"); // Show the download link
//       downloadLink.removeAttribute("disabled"); // Enable the download link
//       updateStatus("File received");

//       // Clear the file after 10 seconds
//       setTimeout(() => {
//         downloadLink.classList.add("hidden"); // Hide the download link
//         downloadLink.href = "#"; // Reset the href
//         downloadLink.removeAttribute("download"); // Remove the download attribute
//         updateStatus("File cleared");
//       }, 10000);
//     }
//   });

//   connection.on("close", () => {
//     updateStatus("Disconnected");
//   });

//   connection.on("error", (err) => {
//     console.error("Connection error: ", err);
//     updateStatus("Connection error");
//   });
// });

// peer.on("disconnected", () => {
//   updateStatus("Disconnected");
// });

// peer.on("error", (err) => {
//   console.error(err);
//   updateStatus("Error: " + err.message);
// });

// // Automatically send the file after selection
// fileInput.addEventListener("change", () => {
//   if (conn) {
//     const file = fileInput.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = function (event) {
//         const fileData = {
//           name: file.name,
//           type: file.type,
//           content: event.target.result,
//         };
//         conn.send({ file: fileData });
//         updateStatus("Sending file...");

//         // Wait for an acknowledgment of file reception
//         conn.on("data", (data) => {
//           if (data.status === "received") {
//             updateStatus("File sent successfully");
//           }
//         });
//       };
//       reader.readAsArrayBuffer(file);
//     }
//   } else {
//     updateStatus("No connection established");
//   }
// });

// // Handle connecting to another peer
// connectButton.addEventListener("click", () => {
//   const peerId = peerIdInput.value;
//   if (peerId) {
//     conn = peer.connect(peerId);

//     conn.on("open", () => {
//       updateStatus("Connected to peer: " + peerId);

//       // Hide peer ID input section after connection
//       peerConnectionSection.classList.add("hidden");
//     });

//     conn.on("data", (data) => {
//       if (data.file) {
//         const blob = new Blob([data.file.content], { type: data.file.type });
//         const url = URL.createObjectURL(blob);
//         downloadLink.href = url;
//         downloadLink.download = data.file.name; // Set the filename from metadata
//         downloadLink.textContent = `Download ${data.file.name}`; // Update the link text to the file name
//         downloadLink.classList.remove("hidden"); // Show the download link
//         downloadLink.removeAttribute("disabled"); // Enable the download link
//         updateStatus("File received");

//         // Clear the file after 10 seconds
//         setTimeout(() => {
//           downloadLink.classList.add("hidden"); // Hide the download link
//           downloadLink.href = "#"; // Reset the href
//           downloadLink.removeAttribute("download"); // Remove the download attribute
//           updateStatus("File cleared");
//         }, 10000);

//         // Send acknowledgment of file reception
//         conn.send({ status: "received" });
//       }
//     });

//     conn.on("close", () => {
//       updateStatus("Disconnected");
//     });

//     conn.on("error", (err) => {
//       console.error("Connection error: ", err);
//       updateStatus("Connection error");
//     });
//   } else {
//     updateStatus("Please enter a valid Peer ID");
//   }
// });

// // Copy Peer ID to clipboard
// copyButton.addEventListener("click", () => {
//   const peerId = peerIdDisplay.textContent;
//   if (peerId !== "Not available") {
//     navigator.clipboard
//       .writeText(peerId)
//       .then(() => {
//         updateStatus("Peer ID copied to clipboard");
//       })
//       .catch((err) => {
//         console.error("Failed to copy text: ", err);
//         updateStatus("Failed to copy Peer ID");
//       });
//   }
// });

// // Generate QR code
// function generateQRCode(peerId) {
//   QRCode.toDataURL(peerId, { width: 128 }, (err, url) => {
//     if (err) {
//       console.error("Failed to generate QR code: ", err);
//       return;
//     }
//     qrCode.src = url; // Set the QR code image source to the data URL
//   });
// }

// // Function to update status display
// function updateStatus(message) {
//   statusDisplay.textContent = message;
// }

// // Scan QR code and connect automatically
// scanQRButton.addEventListener("click", () => {
//   scannerDiv.classList.remove("hidden"); // Show the scanner div

//   // Initialize the QR code scanner
//   const qrScanner = new Html5Qrcode("scanner");

//   // Start the QR code scanner
//   qrScanner
//     .start(
//       { facingMode: "environment" }, // Use the rear camera
//       {
//         fps: 10, // Frame rate
//       },
//       (decodedText) => {
//         // Stop the scanner
//         qrScanner
//           .stop()
//           .then(() => {
//             scannerDiv.classList.add("hidden"); // Hide the scanner div
//             peerIdInput.value = decodedText; // Set the decoded text to the input field
//             connectButton.click(); // Trigger the connect button click event
//           })
//           .catch((err) => {
//             console.error("Failed to stop scanner: ", err);
//           });
//       },
//       (errorMessage) => {
//         console.error("QR code scan error: ", errorMessage);
//       }
//     )
//     .catch((err) => {
//       console.error("Failed to start scanner: ", err);
//     });
// });

// // <!-- Popup Image Container -->
// // Function to open the image in full-screen
// function openImage(imgElement) {
//   const popup = document.getElementById("imagePopup");
//   const popupImage = document.getElementById("popupImage");

//   popupImage.src = imgElement.src;
//   popup.style.display = "flex";
// }

// // Function to close the image popup
// function closeImage() {
//   const popup = document.getElementById("imagePopup");
//   popup.style.display = "none";
// }

// let isZoomed = false;

// // Function to open the image in full-screen
// function openImage(imgElement) {
//   const popup = document.getElementById("imagePopup");
//   const popupImage = document.getElementById("popupImage");

//   popupImage.src = imgElement.src;
//   popup.style.display = "flex";
// }

// // Function to close the image popup
// function closeImage() {
//   const popup = document.getElementById("imagePopup");
//   popup.style.display = "none";
//   isZoomed = false; // Reset zoom state
//   document.getElementById("popupImage").style.transform = "scale(1)"; // Reset scale
// }

// // Function to zoom the image on click
// function zoomImage(event) {
//   event.stopPropagation(); // Prevent triggering the popup close when clicking on the image
//   const popupImage = document.getElementById("popupImage");

//   if (isZoomed) {
//     popupImage.style.transform = "scale(1)";
//     popupImage.style.cursor = "zoom-in";
//   } else {
//     popupImage.style.transform = "scale(2)"; // Adjust the scale value for more or less zoom
//     popupImage.style.cursor = "zoom-out";
//   }
//   isZoomed = !isZoomed;
// }


// Initialize the PeerJS object
const peer = new Peer({
  key: "peerjs",
  debug: 3,
});

// Get DOM elements
const fileInput = document.getElementById("fileInput");
const peerIdInput = document.getElementById("peerIdInput");
const connectButton = document.getElementById("connectButton");
const peerIdDisplay = document.getElementById("peerIdDisplay");
const statusDisplay = document.getElementById("statusDisplay");
const downloadLink = document.getElementById("downloadLink");
const peerConnectionSection = document.getElementById("peerConnectionSection");
const copyButton = document.getElementById("copyButton");
const qrCode = document.getElementById("qrCode"); // QR code image
const scannerDiv = document.getElementById("scanner"); // QR code scanner div
const scanQRButton = document.getElementById("scanQRButton"); // Button to trigger QR code scanning

// Connection variable
let conn;

// Handle peer connection
peer.on("open", (id) => {
  console.log("My peer ID is: " + id);
  peerIdDisplay.textContent = id;
  updateStatus("Ready to connect");
  generateQRCode(id); // Generate QR code with the peer ID
});

peer.on("connection", (connection) => {
  conn = connection;
  updateStatus("Connected");

  // Hide peer ID input section after connection
  peerConnectionSection.classList.add("hidden");

  connection.on("data", (data) => {
    if (data.file) {
      const blob = new Blob([data.file.content], { type: data.file.type });
      const url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = data.file.name; // Set the filename from metadata
      downloadLink.textContent = `Download ${data.file.name}`; // Update the link text to the file name
      downloadLink.classList.remove("hidden"); // Show the download link
      downloadLink.removeAttribute("disabled"); // Enable the download link
      updateStatus("File received");

      // Clear the file after 10 seconds
      setTimeout(() => {
        downloadLink.classList.add("hidden"); // Hide the download link
        downloadLink.href = "#"; // Reset the href
        downloadLink.removeAttribute("download"); // Remove the download attribute
        URL.revokeObjectURL(url); // Release the object URL
        updateStatus("File cleared");
      }, 10000);

      // Send acknowledgment of file reception
      conn.send({ status: "received" });
    }
  });

  connection.on("close", () => {
    updateStatus("Disconnected");
  });

  connection.on("error", (err) => {
    console.error("Connection error: ", err);
    updateStatus("Connection error");
  });
});

peer.on("disconnected", () => {
  updateStatus("Disconnected");
});

peer.on("error", (err) => {
  console.error(err);
  updateStatus("Error: " + err.message);
});

// Automatically send the file after selection in chunks
fileInput.addEventListener("change", () => {
  if (conn) {
    const file = fileInput.files[0];
    if (file) {
      const chunkSize = 16 * 1024; // 16 KB
      const totalChunks = Math.ceil(file.size / chunkSize);
      let currentChunk = 0;

      const sendChunk = () => {
        if (currentChunk < totalChunks) {
          const start = currentChunk * chunkSize;
          const end = Math.min(start + chunkSize, file.size);
          const chunk = file.slice(start, end);

          const reader = new FileReader();
          reader.onload = function (event) {
            const fileData = {
              name: file.name,
              type: file.type,
              content: event.target.result,
              index: currentChunk,
              totalChunks: totalChunks,
            };
            conn.send({ file: fileData });
            updateStatus(`Sending chunk ${currentChunk + 1} of ${totalChunks}...`);

            // Wait for acknowledgment of chunk reception
            conn.on("data", (data) => {
              if (data.status === "chunkReceived") {
                currentChunk++;
                sendChunk(); // Send the next chunk
              }
            });
          };
          reader.readAsArrayBuffer(chunk);
        } else {
          updateStatus("File sent successfully");
        }
      };

      sendChunk(); // Start sending the first chunk
    }
  } else {
    updateStatus("No connection established");
  }
});

// Handle connecting to another peer
connectButton.addEventListener("click", () => {
  const peerId = peerIdInput.value;
  if (peerId) {
    conn = peer.connect(peerId);

    conn.on("open", () => {
      updateStatus("Connected to peer: " + peerId);

      // Hide peer ID input section after connection
      peerConnectionSection.classList.add("hidden");
    });

    conn.on("data", (data) => {
      if (data.file) {
        const blob = new Blob([data.file.content], { type: data.file.type });
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = data.file.name; // Set the filename from metadata
        downloadLink.textContent = `Download ${data.file.name}`; // Update the link text to the file name
        downloadLink.classList.remove("hidden"); // Show the download link
        downloadLink.removeAttribute("disabled"); // Enable the download link
        updateStatus("File received");

        // Clear the file after 10 seconds
        setTimeout(() => {
          downloadLink.classList.add("hidden"); // Hide the download link
          downloadLink.href = "#"; // Reset the href
          downloadLink.removeAttribute("download"); // Remove the download attribute
          URL.revokeObjectURL(url); // Release the object URL
          updateStatus("File cleared");
        }, 10000);

        // Send acknowledgment of file reception
        conn.send({ status: "chunkReceived" });
      }
    });

    conn.on("close", () => {
      updateStatus("Disconnected");
    });

    conn.on("error", (err) => {
      console.error("Connection error: ", err);
      updateStatus("Connection error");
    });
  } else {
    updateStatus("Please enter a valid Peer ID");
  }
});

// Copy Peer ID to clipboard
copyButton.addEventListener("click", () => {
  const peerId = peerIdDisplay.textContent;
  if (peerId !== "Not available") {
    navigator.clipboard
      .writeText(peerId)
      .then(() => {
        updateStatus("Peer ID copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        updateStatus("Failed to copy Peer ID");
      });
  }
});

// Generate QR code
function generateQRCode(peerId) {
  QRCode.toDataURL(peerId, { width: 128 }, (err, url) => {
    if (err) {
      console.error("Failed to generate QR code: ", err);
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
scanQRButton.addEventListener("click", () => {
  scannerDiv.classList.remove("hidden"); // Show the scanner div

  // Initialize the QR code scanner
  const qrScanner = new Html5Qrcode("scanner");

  // Start the QR code scanner
  qrScanner
    .start(
      { facingMode: "environment" }, // Use the rear camera
      {
        fps: 10, // Frame rate
      },
      (decodedText) => {
        // Stop the scanner
        qrScanner
          .stop()
          .then(() => {
            scannerDiv.classList.add("hidden"); // Hide the scanner div
            peerIdInput.value = decodedText; // Set the decoded text to the input field
            connectButton.click(); // Trigger the connect button click event
          })
          .catch((err) => {
            console.error("Failed to stop scanner: ", err);
          });
      },
      (errorMessage) => {
        console.error("QR code scan error: ", errorMessage);
      }
    )
    .catch((err) => {
      console.error("Failed to start scanner: ", err);
    });
});

// Popup Image Container Functions
function openImage(imgElement) {
  const popup = document.getElementById("imagePopup");
  const popupImage = document.getElementById("popupImage");

  popupImage.src = imgElement.src;
  popup.style.display = "flex";
}

function closeImage() {
  const popup = document.getElementById("imagePopup");
  popup.style.display = "none";
  isZoomed = false; // Reset zoom state
  document.getElementById("popupImage").style.transform = "scale(1)"; // Reset scale
}

let isZoomed = false;

// Function to zoom the image on click
function zoomImage(event) {
  event.stopPropagation(); // Prevent triggering the popup close when clicking on the image
  const popupImage = document.getElementById("popupImage");

  if (isZoomed) {
    popupImage.style.transform = "scale(1)";
    popupImage.style.cursor = "zoom-in";
    isZoomed = false; // Reset zoom state
  } else {
    popupImage.style.transform = "scale(2)"; // Zoom in
    popupImage.style.cursor = "zoom-out";
    isZoomed = true; // Set zoom state to true
  }
}

// Event listener for the popup image close
document.getElementById("imagePopup").addEventListener("click", closeImage);
document.getElementById("popupImage").addEventListener("click", zoomImage);
