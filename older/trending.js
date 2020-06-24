let request=require("request");
let fs=require("fs");
let cheerio=require("cheerio");
let puppeteer = require("puppeteer");
//let path=require('path');
let toBeSearched="US news"
let url="https://www.indiatoday.in/trending-news";

console.log("work Start")
let credentialsFile = process.argv[2];
let turl,pwd,email;
let topName=[];

request(url,function(err,response,data)
{
    console.log("come back later")
   // console.log(response);
    if(err==null && response.statusCode===200){
       
            fs.writeFileSync("khabari.html",data);
            parseHtml(data); 
           // let $ = cheerio.load("body");

       } 
    else if(response.statusCode=== 404)
        console.log("Page not found");
     else{

            console.log(err);
            console.log(res.statusCode)
        }
    
})

function parseHtml(data)
{
    //page =>cheerio
    let $ = cheerio.load(data);
    //page=>selector
    
    let text= $("title").text();
    console.log(text); 
    let AllTitles=$("div.detail");
    

    for(let i=0;i<10;i++)
    {
        topName[i]=$(AllTitles[i]).find("h2").text();
        
    }
    console.log(topName);
    
    fs.writeFileSync("tr.html",topName);
}
//array has been made now tweet

(async function () {
    try{

    let data = await fs.promises.readFile(credentialsFile, "utf-8");
    let credentials = JSON.parse(data);
    turl = credentials.turl;
    email = credentials.email;
    pwd = credentials.pwd;  
    // starts browser
    let browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized","--disable-notifications"],
        slowMo: 250
    });
    let numberofPages=await browser.pages();
    let tab=numberofPages[0];
    await tab.goto(turl,{waitUntil:"networkidle2"});
    await tab.click("div.css-1dbjc4n.r-16y2uox>a[role='button']>.css-901oao.r-13gxpu9.r-16y2uox.r-1777fci.r-18u37iz.r-1awozwy.r-1qd0xha.r-6koalj.r-a023e6.r-bcqeeo.r-dnmrzs.r-eljoum.r-q4m81j.r-qvutc0.r-vw2c0b");
    await tab.waitForSelector("div.css-901oao.r-13qz1uu.r-16dba41.r-1awozwy.r-1b6yd1w.r-1qd0xha.r-6koalj.r-ad9z0x.r-bcqeeo.r-hkyrab.r-k200y.r-qvutc0 > input[name='session[username_or_email]']");
    await tab.type("div.css-901oao.r-13qz1uu.r-16dba41.r-1awozwy.r-1b6yd1w.r-1qd0xha.r-6koalj.r-ad9z0x.r-bcqeeo.r-hkyrab.r-k200y.r-qvutc0 > input[name='session[username_or_email]']",email,{delay : 200});
    await tab.waitForSelector("div.css-901oao.r-13qz1uu.r-16dba41.r-1awozwy.r-1b6yd1w.r-1qd0xha.r-6koalj.r-ad9z0x.r-bcqeeo.r-hkyrab.r-k200y.r-qvutc0 > input[name='session[password]']");
    await tab.type("div.css-901oao.r-13qz1uu.r-16dba41.r-1awozwy.r-1b6yd1w.r-1qd0xha.r-6koalj.r-ad9z0x.r-bcqeeo.r-hkyrab.r-k200y.r-qvutc0 > input[name='session[password]']",pwd,{delay : 200})
    await tab.click("div main[role='main'] form[method='post'] div[role='button'] > .css-901oao.r-16y2uox.r-1777fci.r-18u37iz.r-1awozwy.r-1qd0xha.r-6koalj.r-a023e6.r-bcqeeo.r-dnmrzs.r-eljoum.r-jwli3a.r-q4m81j.r-qvutc0.r-vw2c0b")
    console.log("logged in");

    //await Promise.all([await tab.click("div.css-1dbjc4n.r-1awozwy.r-jw8lkh.r-e7q0ms span.css-901oao.css-16my406.css-bfa6kz.r-1qd0xha.r-ad9z0x.r-bcqeeo.r-qvutc0"),tab.waitForNavigation({ waitUntil:"networkidle2"})])

    await tab.click("a[role='button']>div.css-901oao.r-16y2uox.r-1777fci.r-18u37iz.r-1awozwy.r-1qd0xha.r-6koalj.r-a023e6.r-bcqeeo.r-dnmrzs.r-eljoum.r-jwli3a.r-q4m81j.r-qvutc0.r-vw2c0b");
    console.log("tweeet button clicked");
    
    console.log("tweeet type button is about to be clicked");
    
    let tbutton = await tab.$("div>div.public-DraftStyleDefault-block.public-DraftStyleDefault-ltr")
    await tbutton.type(`trending News:
     ${topName[0]}
        ${topName[1]}
        ${topName[4]}  `)
    await {waitUntil:"networkidle2"}
    
    console.log("tweeet -submit button is about to be clicked");

    await tab.click("div[data-testid='tweetButton'] span[class='css-901oao css-16my406 r-1qd0xha r-ad9z0x r-bcqeeo r-qvutc0']");
    console.log("tweeet -submit button is  clicked");

    //Pdf of top 10 news headlines:    
    
    
    console.log("Youtube Opening....");
    await playVideo(browser);
    console.log("video played")
    await pdfG(browser);
    console.log("pdf generated")
    browser.close();

    } 
    catch(err)
    {
        console.log(err);
    }

})()
async function pdfG(browser) {
	try {		
		// launch puppeteer API
		//const browser = await puppeteer.launch();
		const page = await browser.newPage();
        // content of PDF file
        
        await page.setContent (`${topName[0]}<br/> <br/>
        ${topName[1]}<br/> <br/>
        ${topName[2]}<br/> <br/>
        ${topName[3]}<br/> <br/>
        ${topName[4]}<br/> <br/>
        ${topName[5]}<br/> <br/>
        ${topName[6]}<br/> <br/>
        ${topName[7]}<br/> <br/>
        ${topName[8]}<br/> <br/>
        ${topName[9]}<br/> <br/>
        ${topName[10]}`);
		await page.emulateMedia ('screen');
		await page.pdf ({
			// name of your pdf file in directory
			path: 'pdfs/NewsTest.pdf', 
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
} 
async function playVideo(browser)
{
        let numberofPages=await browser.pages();
        let tab=numberofPages[0];
        await tab.goto("https://www.youtube.com/",{ waitUntil:"networkidle2"});
        await tab.waitForSelector("#container input#search");
        await tab.type("#container input#search",toBeSearched,{ delay: 200 });
        //await tab.click("span.yt-uix-button-content");
        await Promise.all([tab.keyboard.press("Enter"), tab.waitForNavigation({ waitUntil: "networkidle2" })]);
        await tab.waitForSelector("div#title-wrapper")
       //await tab.waitForSelector("#contents a#video-title")

       //get the 1st result
       let firstRes = await tab.$("div#title-wrapper")
       await Promise.all([firstRes.click(), tab.waitForNavigation({ waitUntil: "networkidle2" })])

       //fullscreen mode  button.icon-button.fullscreen-icon 
       await tab.waitForSelector("button.ytp-fullscreen-button.ytp-button");
       await tab.click("button.ytp-fullscreen-button.ytp-button");
       
       //let time=await tab.waitForSelector("span.time-second")
      
       await tab.waitFor(210*1000);
}
console.log("Doing other stuff");
