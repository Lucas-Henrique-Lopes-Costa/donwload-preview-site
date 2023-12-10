const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

function extractDomain(url) {
    const domain = url.match(/:\/\/(.[^/]+)/)[1];
    return domain.replace(/\.[^/.]+$/, '').replace(/\./g, '');
}

async function captureScreenshot(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });

    const domain = extractDomain(url);
    const filePath = path.join(__dirname, 'sites', `${domain}.png`);
    await page.screenshot({ path: filePath, fullPage: true });
    await browser.close();
}

if (!fs.existsSync('sites')) {
    fs.mkdirSync('sites');
}

// Ler URLs do arquivo 'sites.txt' e capturar screenshots
fs.readFile('sites.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Erro ao ler o arquivo:', err);
        return;
    }
    const sites = data.split('\n').filter(line => line.trim() !== '');
    sites.forEach(url => captureScreenshot(url));
});
