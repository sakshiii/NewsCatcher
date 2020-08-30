let request=require("request");
let fs=require("fs");
let cheerio=require("cheerio");
let puppeteer = require("puppeteer");
let toBeSearched="Delhi news 2020"
let url="https://www.indiatoday.in/trending-news";

console.log("work Start")
let credentialsFile = process.argv[2];
let turl,pwd,email;
let topName=[];

request(url,function(err,response,data)
{
    console.log("come back later")
    if(err==null && response.statusCode===200){
       
            parseHtml(data); 
           
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
    await tab.waitForSelector("div.css-901oao.r-13qz1uu.r-16dba41.r-1awozwy.r-1b6yd1w.r-1qd0xha.r-6koalj.r-ad9z0x.r-bcqeeo.r-jwli3a.r-k200y.r-qvutc0 > input[name='session[username_or_email]']");
    await tab.type("div.css-901oao.r-13qz1uu.r-16dba41.r-1awozwy.r-1b6yd1w.r-1qd0xha.r-6koalj.r-ad9z0x.r-bcqeeo.r-jwli3a.r-k200y.r-qvutc0 > input[name='session[username_or_email]']",email,{delay : 200});
    await tab.waitForSelector("div.css-901oao.r-13qz1uu.r-16dba41.r-1awozwy.r-1b6yd1w.r-1qd0xha.r-6koalj.r-ad9z0x.r-bcqeeo.r-jwli3a.r-k200y.r-qvutc0 > input[name='session[password]']");
    await tab.type("div.css-901oao.r-13qz1uu.r-16dba41.r-1awozwy.r-1b6yd1w.r-1qd0xha.r-6koalj.r-ad9z0x.r-bcqeeo.r-jwli3a.r-k200y.r-qvutc0 > input[name='session[password]']",pwd,{delay : 200})
    await tab.click("div[class='css-1dbjc4n r-eqz5dr r-1777fci'] div[role='button'] span[class='css-901oao css-16my406 r-1qd0xha r-ad9z0x r-bcqeeo r-qvutc0'");
    console.log("logged in");
    await tab.click("a[role='button']>div.css-901oao.r-1awozwy.r-jwli3a.r-6koalj.r-18u37iz.r-16y2uox.r-1qd0xha.r-a023e6.r-vw2c0b.r-1777fci.r-eljoum.r-dnmrzs.r-bcqeeo.r-q4m81j.r-qvutc0");
    console.log("tweet button clicked");
    
    console.log("tweet type button is about to be clicked");
    
    let tbutton = await tab.$("div>div.public-DraftStyleDefault-block.public-DraftStyleDefault-ltr")
    await tbutton.type(`trending News:
    ${topName[7]}`)
    await {waitUntil:"networkidle2"}
    
    console.log("tweet -submit button is about to be clicked");

    await tab.click("div[data-testid='tweetButton'] span[class='css-901oao css-16my406 r-1qd0xha r-ad9z0x r-bcqeeo r-qvutc0']");
    console.log("tweeet -submit button is  clicked");

    //Pdf of top 10 news headlines:    
    await pdfG(browser);
    console.log("pdf generated")
    
    //window.prompt("Do you want to see the latest news via youtube?", "No");
    console.log("Youtube Opening....");
    var play = true;
    
    if(play)
        await playVideo(browser);
    console.log("video played")
    
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
        await page.waitFor(10*1000)
		await page.emulateMedia ('screen');
		await page.pdf ({
			// name of your pdf file in directory
			path: 'pdfs/NewsTesting.pdf', 
			//  specifies the format
			format: 'A4', 
			// print background property
			printBackground: true
		});
		// console message when conversion  is complete :)
		console.log ('done');
		//await browser.close();
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
        await Promise.all([tab.keyboard.press("Enter"), tab.waitForNavigation({ waitUntil: "networkidle2" })]);
        await tab.waitForSelector("div#title-wrapper")
       
       //get the 1st result
       let firstRes = await tab.$("div#title-wrapper")
       await Promise.all([firstRes.click(), tab.waitForNavigation({ waitUntil: "networkidle2" })])

       //fullscreen mode   
       await tab.waitForSelector("button.ytp-fullscreen-button.ytp-button");
       await tab.click("button.ytp-fullscreen-button.ytp-button");
      
       await tab.waitFor(110*1000);
       await tab.close();
}
console.log("Doing other stuff");
