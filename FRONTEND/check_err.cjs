const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => {
        console.log('BROWSER CONSOLE:', msg.text());
    });
    page.on('pageerror', err => {
        console.error('BROWSER PAGE ERROR:', err.message);
    });

    try {
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

        const userStr = JSON.stringify({
            id: 'u_123456',
            username: 'neon_runner',
            biometrics: { height: 180, weight: 75, shoulderWidth: 46, waist: 82 },
            savedOutfits: []
        });

        await page.evaluate((val) => {
            localStorage.setItem('styleforge_user', val);
        }, userStr);

        console.log("Set biometrics in styleforge_user. Reloading try-on page.");
        await page.goto('http://localhost:5173/try-on?productId=1', { waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 6000));
        await page.screenshot({ path: 'check_final2.png' });
        console.log("Screenshot check_final2.png taken");

    } catch (err) {
        console.error(err);
    }
    await browser.close();
})();
