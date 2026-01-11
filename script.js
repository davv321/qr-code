let qrColor = "#0f172a";

function toggleDark() {
  document.body.classList.toggle("dark");
}

function setColor(color) {
  qrColor = color;
}

function generateQR() {
  const text = qrText.value.trim();
  const size = qrSize.value;
  const qrResult = document.getElementById("qrResult");
  const logoPreview = document.getElementById("logoPreview");
  const downloadBtn = document.getElementById("downloadBtn");

  qrResult.innerHTML = "";
  downloadBtn.style.display = "none";

  if (!text) {
    alert("Masukkan teks atau URL");
    return;
  }

  new QRCode(qrResult, {
    text,
    width: size,
    height: size,
    colorDark: qrColor,
    colorLight: "#ffffff"
  });

  const file = logoInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      logoPreview.src = reader.result;
      logoPreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    logoPreview.style.display = "none";
  }

  setTimeout(() => exportWithLogo(size), 400);
}

function exportWithLogo(size) {
  const qrImg = document.querySelector("#qrResult img");
  const logoImg = document.getElementById("logoPreview");
  const downloadBtn = document.getElementById("downloadBtn");

  if (!qrImg) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = size;
  canvas.height = size;

  const qrImage = new Image();
  qrImage.src = qrImg.src;

  qrImage.onload = () => {
    ctx.drawImage(qrImage, 0, 0, size, size);

    if (logoImg.src && logoImg.style.display !== "none") {
      const logo = new Image();
      logo.src = logoImg.src;

      logo.onload = () => {
        const logoSize = size * 0.25;
        const x = (size - logoSize) / 2;
        const y = (size - logoSize) / 2;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x - 6, y - 6, logoSize + 12, logoSize + 12);
        ctx.drawImage(logo, x, y, logoSize, logoSize);

        finish(canvas);
      };
    } else {
      finish(canvas);
    }
  };

  function finish(canvas) {
    downloadBtn.href = canvas.toDataURL("image/png");
    downloadBtn.style.display = "inline-block";
  }
}
