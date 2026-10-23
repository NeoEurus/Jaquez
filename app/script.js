let qrCodeInstance = null;
let currentShape = 'circle';
let hasLogo = false;

const shapeNames = {
    circle: 'Círculo',
    square: 'Cuadrado',
    rounded: 'Redondeado',
    triangle: 'Triángulo',
    hexagon: 'Hexágono',
    rhombus: 'Rombo',
    star: 'Estrella',
    shield: 'Escudo',
    heart: 'Corazón',
    octagon: 'Octágono'
};

function updateQR(urlText, colorDark, colorLight) {
    const container = document.getElementById("qrcode");
    if (!container) return;
    container.innerHTML = "";
    const validUrl = urlText && urlText.trim() !== "" ? urlText : "https://ejemplo.com";
    qrCodeInstance = new QRCode(container, {
        text: validUrl,
        width: 180,
        height: 180,
        colorDark: colorDark || "#6366f1",
        colorLight: colorLight || "#0f172a",
        correctLevel: QRCode.CorrectLevel.H
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const urlInput = document.getElementById('url');
    const colorDarkInput = document.getElementById('color-dark');
    const colorLightInput = document.getElementById('color-light');
    const logoInput = document.getElementById('logo');
    const logoPreview = document.getElementById('logo-preview');
    const logoContainer = document.getElementById('logo-container');
    const removeLogoBtn = document.getElementById('remove-logo-btn');
    const infoUrl = document.getElementById('info-url-text');
    const infoShape = document.getElementById('info-shape-text');
    const downloadBtn = document.getElementById('download-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');
    const shapeButtons = document.querySelectorAll('.shape-btn');

    updateQR("https://ejemplo.com", colorDarkInput.value, colorLightInput.value);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            if (isLight) {
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
                if (colorLightInput.value.toLowerCase() === '#0f172a') {
                    colorLightInput.value = '#ffffff';
                    updateQR(urlInput.value || "https://ejemplo.com", colorDarkInput.value, colorLightInput.value);
                }
            } else {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
                if (colorLightInput.value.toLowerCase() === '#ffffff') {
                    colorLightInput.value = '#0f172a';
                    updateQR(urlInput.value || "https://ejemplo.com", colorDarkInput.value, colorLightInput.value);
                }
            }
        });
    }

    if (urlInput) {
        urlInput.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            infoUrl.textContent = val || "https://ejemplo.com";
            updateQR(val, colorDarkInput.value, colorLightInput.value);
        });
    }

    if (colorDarkInput && colorLightInput) {
        const handleColorChange = () => {
            updateQR(urlInput.value.trim() || "https://ejemplo.com", colorDarkInput.value, colorLightInput.value);
        };
        colorDarkInput.addEventListener('input', handleColorChange);
        colorLightInput.addEventListener('input', handleColorChange);
    }

    shapeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            shapeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentShape = btn.getAttribute('data-shape');
            infoShape.textContent = shapeNames[currentShape] || 'Círculo';

            logoContainer.className = `logo-overlay-container shape-${currentShape}`;
        });
    });

    if (logoInput) {
        logoInput.addEventListener('change', (e) => {
            const file = e.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (logoPreview) {
                        logoPreview.src = event.target.result;
                        logoContainer.style.display = 'flex';
                        hasLogo = true;
                        if (removeLogoBtn) removeLogoBtn.style.display = 'inline-block';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (removeLogoBtn) {
        removeLogoBtn.addEventListener('click', () => {
            hasLogo = false;
            logoContainer.style.display = 'none';
            if (logoPreview) logoPreview.src = '';
            if (logoInput) logoInput.value = '';
            removeLogoBtn.style.display = 'none';
        });
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const qrImg = document.querySelector('#qrcode img');
            if (qrImg) {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 400;
                canvas.height = 400;

                ctx.fillStyle = colorLightInput.value;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => {
                    ctx.drawImage(img, 40, 40, 320, 320);

                    if (hasLogo && logoPreview && logoPreview.src) {
                        const logo = new Image();
                        logo.crossOrigin = "anonymous";
                        logo.onload = () => {
                            const logoSize = 80;
                            const center = canvas.width / 2;

                            ctx.save();
                            ctx.translate(center, center);

                            if (currentShape === 'circle') {
                                ctx.beginPath();
                                ctx.arc(0, 0, logoSize / 2 + 4, 0, Math.PI * 2);
                                ctx.fillStyle = colorLightInput.value;
                                ctx.fill();
                                ctx.lineWidth = 3;
                                ctx.strokeStyle = colorDarkInput.value;
                                ctx.stroke();

                                ctx.beginPath();
                                ctx.arc(0, 0, logoSize / 2, 0, Math.PI * 2);
                                ctx.clip();
                                ctx.drawImage(logo, -logoSize / 2, -logoSize / 2, logoSize, logoSize);
                            } else {
                                ctx.beginPath();
                                ctx.rect(-logoSize / 2 - 4, -logoSize / 2 - 4, logoSize + 8, logoSize + 8);
                                ctx.fillStyle = colorLightInput.value;
                                ctx.fill();
                                ctx.lineWidth = 3;
                                ctx.strokeStyle = colorDarkInput.value;
                                ctx.stroke();

                                ctx.beginPath();
                                ctx.rect(-logoSize / 2, -logoSize / 2, logoSize, logoSize);
                                ctx.clip();
                                ctx.drawImage(logo, -logoSize / 2, -logoSize / 2, logoSize, logoSize);
                            }

                            ctx.restore();

                            const link = document.createElement('a');
                            link.download = 'jaquez-qr.png';
                            link.href = canvas.toDataURL('image/png');
                            link.click();
                        };
                        logo.src = logoPreview.src;
                    } else {
                        const link = document.createElement('a');
                        link.download = 'jaquez-qr.png';
                        link.href = canvas.toDataURL('image/png');
                        link.click();
                    }
                };
                img.src = qrImg.src;
            }
        });
    }
});