/*************** CONFIG ***************/
const APP_URL = "https://script.google.com/macros/s/AKfycbxwyFM79hWt6pHbd0JPBoe6TBIl4Lz9B2vrDwRKgsy-62qKeRhA2NsYn3p_vwx-SN86og/exec"; // replace with deployed URL

// ✅ Teacher login
if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    if (user === "1" && pass === "1") {
      window.location.href = "attendance.html";
    } else {
      document.getElementById("loginMsg").innerText = "Invalid credentials";
    }
  });
}

// ✅ Register student
if (document.getElementById("registerForm")) {
  document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const student = {
      firstName: document.getElementById("firstName").value,
      middleName: document.getElementById("middleName").value,
      lastName: document.getElementById("lastName").value,
      gradeSection: document.getElementById("gradeSection").value,
      adviser: document.getElementById("adviser").value
    };

    const res = await fetch(APP_URL, {
      method: "POST",
      body: JSON.stringify({ action: "register", student }),
    });

    const data = await res.json();
    document.getElementById("qrResult").innerHTML = "<h3>QR Code:</h3>";
    new QRCode(document.getElementById("qrResult"), student.firstName + "|" + student.lastName);
  });
}

// ✅ Attendance scanner
if (document.getElementById("preview")) {
  const html5QrCode = new Html5Qrcode("preview");
  Html5Qrcode.getCameras().then(devices => {
    if (devices && devices.length) {
      html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          document.getElementById("scanResult").innerText = "Scanned: " + decodedText;

          await fetch(APP_URL, {
            method: "POST",
            body: JSON.stringify({ action: "attendance", studentId: decodedText })
          });
        }
      );
    }
  });
}
