let puppeteer = require("puppeteer");
let pageName = process.argv[2];

let url="https://www.indiatoday.in";;

    

(async function () {
	try {		
		// launch puppeteer API
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		// content of PDF file 
		await page.setContent ('WELCOME TO GOOGLE PUPPETEER API');
		await page.emulateMedia ('screen');
		await page.pdf ({
			// name of your pdf file in directory
			path: 'pdfs/testpdf.pdf', 
			//  specifies the format
			format: 'A4', 
			// print background property
			printBackground: true
		});
		// console message when conversion  is complete!
		console.log ('done');
		await browser.close();
		process.exit();
	} catch (e) {
		console.log ('our error', e);
	}
} ) () ;  