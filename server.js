const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Function to generate Facebook Appstate
app.post('/generateAppstate', async (req, res) => {
    const { email, password } = req.body;

    let browser;
    try {
        // Launch Puppeteer with necessary configurations
        browser = await puppeteer.launch({ 
            headless: true, 
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // Set a realistic user agent to prevent detection
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        // Navigate to Facebook login page
        await page.goto('https://www.facebook.com/', { waitUntil: 'networkidle2' });

        // Type in email and password
        await page.type('#email', email, { delay: 100 });
        await page.type('#pass', password, { delay: 100 });

        // Click the login button and wait for navigation
        await page.click('button[name="login"]');
        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        // Check for login errors
        const loginError = await page.evaluate(() => {
            const errorElement = document.querySelector('#error_box');
            return errorElement ? errorElement.innerText : null;
        });

        if (loginError) {
            console.log('Login error detected:', loginError);
            throw new Error(loginError);
        }

        // Extract the AppState
        const appState = await page.evaluate(() => {
            const localStorageData = JSON.stringify(localStorage);
            return localStorageData;
        });

        // Send back the AppState as the response
        res.json({ success: true, appstate: appState });

    } catch (error) {
        console.error('Error generating AppState:', error.message);
        res.json({ success: false, message: error.message });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

// Start server

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});