import { supa } from "../SupaBaseClient/supabase.js";
import { authenticated_sendBack } from './javascript_helpers.js';

const user = await authenticated_sendBack();
const queryRate_PriTolChange = 1000; //in ms
const match_color = "#2E7985";
let swapButton_State = false; //true = matchState, false = putonWishlistState

async function getMyArticles() {
    try {
        const { data: data, error: error } = await supa
            .from("articles")
            .select("*")
            .eq("user_id", user.id);

        if (error) {
            throw error;
        }
        console.log("Own Articles:");
        console.log(data);
        return(data);
        } 
    catch (error){
        console.error('Error querying Supabase for myArticles: ', error.message);
    }
}

async function getOtherArticles(currentOwnArtObj, priceTolerance) {
    const lowerPriceBorder = currentOwnArtObj.price - priceTolerance;
    const upperPriceBorder = currentOwnArtObj.price + priceTolerance;
    /* console.log(`lowerPriceBorder: ${lowerPriceBorder}`);
    console.log(`upperPriceBorder: ${upperPriceBorder}`); */
    try {
        const { data, error } = await supa
            .from("articles")
            .select("*")
            .neq("user_id", user.id)
            .gte("price", lowerPriceBorder)
            .lte("price", upperPriceBorder);
            
        if (error) {
            throw error;
        }
        if (data.length === 0) {
            return null;
        }
        
        console.log("Other Articles:");
        console.log(data);

        return(data);
        } 
    catch (error){
        console.error('Error querying Supabase for OtherArticles: ', error.message);
    }
}

async function getWishlist() {
    try {
        const { data, error } = await supa
            .from("wishlist")
            .select("*")
            
        if (error) {
            throw error;
        }
        if (data.length === 0) {
            return null;
        }
        console.log("Wishlist:");
        console.log(data);
        return(data);
        } 
    catch (error){
        console.error('Error querying Supabase for Wishlist: ', error.message);
    }
}

async function getImage(parameter_bucketName, parameter_articles, i) {

    /* console.log("article-array in getImage:" + parameter_articles); */

    const path = parameter_articles[i].img_path;
    /* console.log(path); */
    try{
        const { data, error } = await supa.storage.from(parameter_bucketName).download(path);

        if (error) {
            throw error;
        }
        const url = URL.createObjectURL(data);
        return url;
    }
    catch (error){
        console.error('Error querying Supabase for image-path: ', error.message);
        return null;
    }
}

async function setArticle(index, parameter_articlesArray, parameter_divName) {
    //log index
    /* if (parameter_divName === 'ownArticle_image') {
        console.log(`ownArticleIndex: ${index}`);
    } else if (parameter_divName === 'otherArticle_image') {
        console.log(`otherArticleIndex: ${index}`);        
    } */

    //set background image
    const url = await getImage('article_img', parameter_articlesArray, index);
    const parentElement = document.getElementById(parameter_divName);
    parentElement.style.backgroundImage = `url(${url})`;

    //set title and caption
    let textColor = "white";
    /* const brigthness = getMedianBrightness(url); */
    /* console.log(brigthness); */
    /* if (getMedianBrightness(url) < 100) {
        textColor = "white";
    } else {
        textColor = "black";
    } */

    const title = parameter_articlesArray[index].title;
    const caption = parameter_articlesArray[index].caption;

    const titleElement = parentElement.querySelector('.articleTitle');
    const captionElement = parentElement.querySelector('.articleInfo');

    titleElement.textContent = title;
    /* titleElement.style.color = textColor; */
    captionElement.textContent = caption;
    /* captionElement.style.color = textColor; */

    //set price
    if (parameter_divName === 'ownArticle_image') {
        document.getElementById('price_ownArticles').textContent = "[CHF.-]: " + parameter_articlesArray[index].price;
    } else if (parameter_divName === 'otherArticle_image') {
        document.getElementById('price_otherArticles').textContent = "[CHF.-]: " + parameter_articlesArray[index].price;
    }
}

function checkWether_curOthArt_wants_curOwnArt(parameter_ownArticleId, parameter_otherArticleId) {
    if ('wishlist' in window) {	
        const curOthArt_wants_curMyArt = wishlist.some(entry => entry.desiredArticle_id === ownArticles[index_ownArticles].id && entry.offeredArticle_id === otherArticles[index_otherArticles].id); /* (gibt es einen entry in wishlist wo der momentane OwnArt entsprich dem desiredArt) && (gibt es entry in wishlist wo der momentane OthArt dem angebotenenArtikel entspr.?) */
        
        if (curOthArt_wants_curMyArt) {
            console.log("curOthArt_wants_curMyArt");
            return true;
        } else {
            console.log("curOthArt_DOES_NOT_want_curMyArt");
            return false;
        }
    }
    else {
        console.log("wishlist not yet initialized");
    }
}

async function checkWetherWishExists(parameter_offered, parameter_desired) {
    let returnValue = false;

    try {
        const { data, error } = await supa
            .from('wishlist')
            .select('*')
            .eq('offeredArticle_id', parameter_offered)
            .eq('desiredArticle_id', parameter_desired)

        if (data && data.length > 0) {
            /* console.log('Wish exists in wishlist.'); */
            returnValue = true;
        } else {
            /* console.log('Wish does not exist in wishlist.'); */
            returnValue = false;
        }

        if (error) {
            throw error;
        }

    } catch (error) {
        console.error('Error querying Supabase wether wish exists in wishlist: ', error.message);
    }
    /* console.log(`returnValue: ${returnValue}`); */
    return returnValue;
}

async function putArticleOnWishlist(parameter_offered, parameter_desired) {
    const wishExists = await checkWetherWishExists(parameter_offered, parameter_desired);
    /* console.log(`wishExists: ${wishExists}`); */
    if (wishExists === false) {
        //put wish on wishlist
        console.log('trying to put wish on wishlist'); 
        try {
            const { data, error } = await supa
                .from("wishlist")
                .insert([
                    {
                        offeredArticle_id: parameter_offered,
                        desiredArticle_id: parameter_desired
                    }
                ]);

            if (error) {
                throw error;
            }
            /* console.log(data); */
            } 
        catch (error){
            console.error('Error querying Supabase for putting article on wishlist: ', error.message);
        }
        console.log('wish put on wishlist');
    } else {
        console.log('wish already exists in wishlist');
    }
}

/* function configure_swapButton() { //true = matchState, false = putonWishlistState
    const artMatch = checkWether_CurrentArticlesMatching();
        if (artMatch === true) {
            document.getElementById('swap_button').style.borderColor = match_color;
        }
} */

function noArticlesFound(string_ownOrOtherArticles) {
    console.log(`No ${string_ownOrOtherArticles} articles found.`);
    if (string_ownOrOtherArticles === "own") {
        const parentElement = document.getElementById('ownArticle_image');

    //set title and caption of ownArticle
        const title = "No own articles yet.";
        const caption = "Got to Article-Upload to upload articles.";

        const titleElement = parentElement.querySelector('.articleTitle');
        const captionElement = parentElement.querySelector('.articleInfo');

        titleElement.textContent = title;
        captionElement.textContent = caption;

        /* titleElement.style.opacity = 1; //not working yet
        captionElement.style.opacity = 1;   */  

        //set background image
        parentElement.style.backgroundImage = "url(./img/elements/blueGradient.png)";

    //set title and caption of otherArticle
        const parentElement2 = document.getElementById('otherArticle_image');

        //set title and caption
        const title2 = "No articles to show.";
        const caption2 = "You need to upload at least one article.";

        const titleElement2 = parentElement2.querySelector('.articleTitle');
        const captionElement2 = parentElement2.querySelector('.articleInfo');

        titleElement2.textContent = title2;
        captionElement2.textContent = caption2;

        /* titleElement.style.opacity = 1; //not working yet
        captionElement.style.opacity = 1;   */      

        //set background image        
        parentElement2.style.backgroundImage = "url(./img/elements/blueGradient.png)";
    } 

    else if (string_ownOrOtherArticles === "other") {
        const parentElement = document.getElementById('otherArticle_image');

        //set title and caption
        const title = "No articles in Price-range found.";
        const caption = "Try increasing the price-tolerance.";

        const titleElement = parentElement.querySelector('.articleTitle');
        const captionElement = parentElement.querySelector('.articleInfo');

        titleElement.textContent = title;
        captionElement.textContent = caption;

        /* titleElement.style.opacity = 1; //not working yet
        captionElement.style.opacity = 1;   */      

        //set background image        
        parentElement.style.backgroundImage = "url(./img/elements/blueGradient.png)";
    }
}

/* function getMedianBrightness(imgUrl) { //to get the median brightness, the function stores all the brightness values in an array, sorts the array, and then find the middle value.
    const imgEl = new Image();
    imgEl.crossOrigin = 'anonymous';
    imgEl.src = imgUrl;
    imgEl.onload = function() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
 
        const width = imgEl.naturalWidth;
        const height = imgEl.naturalHeight;

        canvas.width = width;
        canvas.height = height;

        context.drawImage(imgEl, 0, 0, width, height);

        const imageData = context.getImageData(0, 0, width, height);
        const data = imageData.data;
        let brightnessValues = [];

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const brightness = (r + g + b) / 3;
            brightnessValues.push(brightness);
        }

        brightnessValues.sort((a, b) => a - b);
        const mid = Math.floor(brightnessValues.length / 2);
        const median = Math.round(brightnessValues.length % 2 === 0 ? (brightnessValues[mid - 1] + brightnessValues[mid]) / 2 : brightnessValues[mid]);
        
        console.log(median);
        callback(median);
    };
} */

const wishlist = await getWishlist();

//OwnArticles

    //get own articles-array
    const ownArticles = await getMyArticles();
    let index_ownArticles = 0 ; //its global so that it can be used in the otherArticles-section
    if (ownArticles.length === 0) {
        noArticlesFound("own");
    }
    else {
        //set maxIndex for own articles
        const OwnArticles_MaxIndex = ownArticles.length-1;

        //set initial OwnArticle
        await setArticle(index_ownArticles, ownArticles, 'ownArticle_image');

        
        document.getElementById('arrowRight_OwnArticle').addEventListener('click', async () => {
            
            //set next Article
            if (index_ownArticles < OwnArticles_MaxIndex) {
                index_ownArticles++;
            } else {
                index_ownArticles = 0;
            }
            await setArticle(index_ownArticles, ownArticles, 'ownArticle_image');

            //checkWether curOthArt wants curOwnArt
            if ('otherArticles' in window){
                const check_a = checkWether_curOthArt_wants_curOwnArt;
                if (check_a === true) {
                    /* configure_swapButton(true); */
                } else {
                    /* configure_swapButton(false); */
                }
            }
            
        }); 
        
        
        document.getElementById('arrowLeft_OwnArticle').addEventListener('click', async () => {
            
            //set previous Article on left-arrow click
            if (index_ownArticles > 0) {
                index_ownArticles--;
            } else {
                index_ownArticles = 0;
            }
            await setArticle(index_ownArticles, ownArticles, 'ownArticle_image');

            //checkWether curOthArt wants curOwnArt
            if ('otherArticles' in window){
                const check_b = checkWether_curOthArt_wants_curOwnArt;
                if (check_b === true) {
                    /* configure_swapButton(true); */
                } else {
                    /* configure_swapButton(false); */
                }
            }

        });
    }

//OtherArticles

    //set index for other articles
    let index_otherArticles = 0 ; 

    //initialize otherArticles and set initial OtherArticle
    const priceTolerance = document.getElementById('price_tolerance_input').value;
    let otherArticles = await getOtherArticles(ownArticles[index_otherArticles], priceTolerance);
    let OtherArticles_MaxIndex = 0;
    
    if (otherArticles === null) { 
        noArticlesFound("other");
    } else {
        await setArticle(index_otherArticles, otherArticles, 'otherArticle_image');
        //set maxIndex for other articles
        OtherArticles_MaxIndex = otherArticles.length-1;
    }

    //Prepare OtherArticles-'Updater', which is the Eventlistener for price-tolerance-change
        //set initial lastChangeTime
        let lastChangeTime = new Date().getTime();

    //get other articles-array again, when price tolerance changes
    document.getElementById('price_tolerance_input').addEventListener('change', async () => {
        const currentTime = new Date().getTime();
        if (currentTime - lastChangeTime >= queryRate_PriTolChange) { //so that it has been at least 1 second since the last change of price tolerance until we query again.
            
            //get other_articles-array again
            const priceTolerance = document.getElementById('price_tolerance_input').value;
            otherArticles = await getOtherArticles(ownArticles[index_ownArticles], priceTolerance); //overwrite otherArticles with new array

            if (otherArticles !== null) {
                //set index, so that the index is reset to 0
                index_otherArticles = 0;
                
                //set maxIndex for other articles again
                OtherArticles_MaxIndex = otherArticles.length-1;
                
                //set initial OtherArticle
                await setArticle(index_otherArticles, otherArticles, 'otherArticle_image');
                                
            } else {
                noArticlesFound("other");
            }

            // Update the last change time
            lastChangeTime = currentTime;
        }
        else {
            const currentTime = new Date().getTime();
            lastChangeTime = currentTime;
            console.log("last Price-tolerance Change too recent, so no query has been sent.");
        }
    });

    //set next Article on right-arrow click
    document.getElementById('arrowRight_OtherArticle').addEventListener('click', async () => {
        
        //set next Article on right-arrow click
        if (index_otherArticles < OtherArticles_MaxIndex) {
            index_otherArticles++;
        } else {
            index_otherArticles = 0;
        }
        await setArticle(index_otherArticles, otherArticles, 'otherArticle_image');

        //checkWether curOthArt wants curOwnArt
        if ('otherArticles' in window){
            const check_c = checkWether_curOthArt_wants_curOwnArt;
            if (check_c === true) {
                /* configure_swapButton(true); */
            } else {
                /* configure_swapButton(false); */
            }
        }
    }); 
    
    //set previous Article on left-arrow click
    document.getElementById('arrowLeft_OtherArticle').addEventListener('click', async () => {
        
        //set previous Article on left-arrow click
        if (index_otherArticles > 0) {
            index_otherArticles--;
        } else {
            index_otherArticles = 0;
        }
        await setArticle(index_otherArticles, otherArticles, 'otherArticle_image');

        //checkWether curOthArt wants curOwnArt
        if ('otherArticles' in window){
            const check_a = checkWether_curOthArt_wants_curOwnArt;
            if (check_a === true) {
                /* configure_swapButton(true); */
            } else {
                /* configure_swapButton(false); */
            }
        }
    });

document.getElementById('swap_button').addEventListener('click', async () => {
    if (swapButton_State === true) /* = matchState */ {
        //go to userprofile
    } else if (swapButton_State === false) /* = putonWishlistState */ {
        //put article on wishlist
        await putArticleOnWishlist(ownArticles[index_ownArticles].id, otherArticles[index_otherArticles].id);
    }
});

//delete article from articles-table
document.getElementById('delete_button').addEventListener('click', async () => {
    if (ownArticles.length <= 0) {
        return;
    } else {
        const articleId = ownArticles[index_ownArticles].id;
        try {
            const { data, error } = await supa
                .from("articles")
                .delete()
                .match({ id: articleId });
    
            if (error) {
                throw error;
            }
            /* console.log(data); */
            } 
        catch (error){
            console.error('Error querying Supabase for deleting article: ', error.message);
        }
        
        window.location.reload();    
    }
});