const puppeteer = require('puppeteer');

const url = 'https://yash-dedhia.vercel.app/';

async function runSEOAudit() {
    console.log(`Starting SEO audit for ${url}...`);
    
    // Dynamic import for Lighthouse (ESM)
    const { default: lighthouse } = await import('lighthouse');
    
    // Launch Puppeteer
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const port = new URL(browser.wsEndpoint()).port;

    const options = {
        logLevel: 'info',
        output: 'json',
        onlyCategories: ['seo'],
        port: port
    };

    try {
        // Run Lighthouse
        const runnerResult = await lighthouse(url, options);

        // Calculate and format the score
        const seoScore = runnerResult.lhr.categories.seo.score * 100;
        console.log('\n======================================');
        console.log(`SEO Score: ${seoScore}/100`);
        console.log('======================================\n');

        // Extract and display audits
        const audits = runnerResult.lhr.audits;
        
        console.log('--- Actionable Recommendations ---');
        let hasRecommendations = false;

        for (const [auditId, audit] of Object.entries(audits)) {
            // Only show SEO audits that failed or need attention
            if (audit.score !== 1 && audit.score !== null) {
                console.log(`\n❌ Issue: ${audit.title}`);
                console.log(`   Description: ${audit.description}`);
                if (audit.displayValue) {
                    console.log(`   Value: ${audit.displayValue}`);
                }
                hasRecommendations = true;
            }
        }

        if (!hasRecommendations) {
            console.log('\n✅ Outstanding! No major SEO issues found.');
        }

    } catch (error) {
        console.error('\nError running Lighthouse audit:', error.message);
    } finally {
        await browser.close();
    }
}

runSEOAudit();
