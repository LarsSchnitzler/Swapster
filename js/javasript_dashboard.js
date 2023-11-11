import { supa } from "../SupaBaseClient/supabase.js";
import { authenticated_sendBack } from './javascript_helpers.js';

const user = await authenticated_sendBack();
const queryRate_PriTolChange = 500; //in ms
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

    const lowerPriceBorder = parseInt(currentOwnArtObj.price) - parseInt(priceTolerance);
    const upperPriceBorder = parseInt(currentOwnArtObj.price) + parseInt(priceTolerance);
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
        /* console.log("Wishlist:");
        console.log(data); */
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

    //set background image
    const url = await getImage('article_img', parameter_articlesArray, index);
    const parentElement = document.getElementById(parameter_divName);
    parentElement.style.backgroundImage = `url(${url})`;

    //set title and caption
    let textColor = "white";

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
        document.getElementById('price_ownArticles').textContent = parameter_articlesArray[index].price + " [CHF]: ";
    } else if (parameter_divName === 'otherArticle_image') {
        document.getElementById('price_otherArticles').textContent = parameter_articlesArray[index].price + " [CHF]: ";
    }
}

function checkWether_curOthArt_wants_curOwnArt(otherArticles, index_otherArticles) {
    /* console.log("checkWether_curOthArt_wants_curOwnArt CALLED"); */

    if ((wishlist !== null) && (ownArticles !== null) && (otherArticles !== null)) {	
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
        console.log("wishlist/ownArticles/otherArticles are null");
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

function configure_swapButton(state) { //true = matchState, false = putonWishlistState
    if (state === true) {
        //styling
        document.getElementById('swap_button').style.boxShadow = `0 0 60px ${match_color}`;
        //set swapButton_State so that it can be used in eventlistener for swap_button
        swapButton_State = true;
    } else if (state === false) {
        //styling
        document.getElementById('swap_button').style.boxShadow = 'none';
        //set swapButton_State so that it can be used in eventlistener for swap_button
        swapButton_State = false;
    }
}

function noArticlesFound(string_ownOrOtherArticles) {
    console.log(`No ${string_ownOrOtherArticles} articles found.`);
    if (string_ownOrOtherArticles === "own") {
        const parentElement = document.getElementById('ownArticle_image');

    //set title and caption of ownArticle
        const title = "No own articles.";
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

//get wishlist
let wishlist = await getWishlist();

//OwnArticles
const ownArticles = await getMyArticles();
let index_ownArticles = 0 ;

if (typeof(ownArticles) === "undefined" || ownArticles === null || ownArticles.length === 0) {
    noArticlesFound("own");
}
else {

    const OwnArticles_MaxIndex = ownArticles.length-1;

    //set initial OwnArticle
    await setArticle(index_ownArticles, ownArticles, 'ownArticle_image');

    document.getElementById('arrowRight_OwnArticle').addEventListener('click', async () => {
        console.log("arrowRight_OwnArticle clicked");
        if (ownArticles !== null){
            //set next Article
            if (index_ownArticles < OwnArticles_MaxIndex) {
                index_ownArticles++;
            } else {
                index_ownArticles = 0;
            }
            await setArticle(index_ownArticles, ownArticles, 'ownArticle_image');

            //checkWether curOthArt wants curOwnArt
            if (otherArticles !== null){

                const check_a = checkWether_curOthArt_wants_curOwnArt(otherArticles, index_ownArticles);
                if (check_a === true) {
                    configure_swapButton(true);
                } else {
                    configure_swapButton(false);
                }
            }
        }    
    }); 
    
    
    document.getElementById('arrowLeft_OwnArticle').addEventListener('click', async () => {
        console.log("arrowLeft_OwnArticle clicked");
        if (ownArticles !== null){
            //set previous Article on left-arrow click
            if (index_ownArticles > 0) {
                index_ownArticles--;
            } else {
                index_ownArticles = 0;
            }
            await setArticle(index_ownArticles, ownArticles, 'ownArticle_image');

            //checkWether curOthArt wants curOwnArt

            if (otherArticles !== null){

                const check_b = checkWether_curOthArt_wants_curOwnArt(otherArticles, index_otherArticles);
                if (check_b === true) {
                    configure_swapButton(true);
                } else {
                    configure_swapButton(false);
                }
            }
        }
    });

    //OtherArticles

        let index_otherArticles = 0 ; 

        //initial OtherArticle
        let priceTolerance = document.getElementById('price_tolerance_input').value;
        if (isNaN(parseInt(priceTolerance))) {priceTolerance = 0;}

        let otherArticles = await getOtherArticles(ownArticles[index_otherArticles], priceTolerance);
        let OtherArticles_MaxIndex = 0;
        
        if (typeof(otherArticles) === "undefined" || otherArticles === null || otherArticles.length === 0) {
            noArticlesFound("other");
        } else {
            await setArticle(index_otherArticles, otherArticles, 'otherArticle_image');
            OtherArticles_MaxIndex = otherArticles.length-1;

            //checkWether curOthArt wants curOwnArt

            const check_b = checkWether_curOthArt_wants_curOwnArt(otherArticles, index_otherArticles);
            if (check_b === true) {
                configure_swapButton(true);
            } else {
                configure_swapButton(false);
            }
        }

        //Prepare OtherArticles-'Updater'. Set initial lastChangeTime
        let lastChangeTime = new Date().getTime();

        //get other articles-array again, when price tolerance changes
        document.getElementById('price_tolerance').addEventListener('submit', async (event) => {event.preventDefault();});
        document.getElementById('price_tolerance_input').addEventListener('change', async () => {
            const currentTime = new Date().getTime();
            if (currentTime - lastChangeTime >= queryRate_PriTolChange) { //so that it has been at least 1 second since the last change of price tolerance until we query again.
                
                //get other_articles-array again
                let priceTolerance = document.getElementById('price_tolerance_input').value;
                if (isNaN(parseInt(priceTolerance))) {priceTolerance = 0;}

                otherArticles = await getOtherArticles(ownArticles[index_ownArticles], priceTolerance); //overwrite otherArticles with new array

                if (otherArticles !== null) {
                    //set index, so that the index is reset to 0
                    index_otherArticles = 0;
                    
                    //set maxIndex for other articles again
                    OtherArticles_MaxIndex = otherArticles.length-1;
                    
                    //set initial OtherArticle
                    await setArticle(index_otherArticles, otherArticles, 'otherArticle_image');

                    if (ownArticles !== null){

                        //checkWether curOthArt wants curOwnArt
        
                            const check_b = checkWether_curOthArt_wants_curOwnArt(otherArticles, index_otherArticles);
                            if (check_b === true) {
                                configure_swapButton(true);
                            } else {
                                configure_swapButton(false);
                            }
                    }
                                    
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
            console.log("arrowRight_OtherArticle clicked");
            if (otherArticles !== null){
                //set next Article on right-arrow click
                    if (index_otherArticles < OtherArticles_MaxIndex) {
                        index_otherArticles++;
                    } else {
                        index_otherArticles = 0;
                    }
                    await setArticle(index_otherArticles, otherArticles, 'otherArticle_image');
            
                if (ownArticles !== null){
                    //checkWether curOthArt wants curOwnArt
            
                    const check_c = checkWether_curOthArt_wants_curOwnArt(otherArticles, index_otherArticles);
                    if (check_c === true) {
                        configure_swapButton(true);
                    } else {
                        configure_swapButton(false);
                    }
                }
            }
        }); 
        
        //set previous Article on left-arrow click
        document.getElementById('arrowLeft_OtherArticle').addEventListener('click', async () => {
            console.log("arrowLeft_OtherArticle clicked");
            if (otherArticles !== null){

                //set previous Article on left-arrow click
                    if (index_otherArticles > 0) {
                        index_otherArticles--;
                    } else {
                        index_otherArticles = 0;
                    }
                    await setArticle(index_otherArticles, otherArticles, 'otherArticle_image');

                if (ownArticles !== null){
                    //checkWether curOthArt wants curOwnArt
            
                    const check_c = checkWether_curOthArt_wants_curOwnArt(otherArticles, index_otherArticles);
                    if (check_c === true) {
                        configure_swapButton(true);
                    } else {
                        configure_swapButton(false);
                    }
                }
            }
        });

    document.getElementById('swap_button').addEventListener('click', async () => {
        /* console.log(swapButton_State); */
        if (swapButton_State === true) /* = matchState */ {

            //add corresponding user_id to current otherArticle into URL-Parameter
                const url = new URL('./userprofile.html', window.location.href);
                const params = url.searchParams; //even if you know there are no search parameters in the URL, you still need to use url.searchParams to get a URLSearchParams object
                params.append('otherUser', otherArticles[index_otherArticles].user_id);
                /* console.log(url.toString()); */

                window.location.href = url.toString(); //assigning the URL string to window.location.href will redirect the browser to the new page.

        } else if (swapButton_State === false) /* = putonWishlist-State */ {
            if (otherArticles !== null && ownArticles !== null) {
                await putArticleOnWishlist(ownArticles[index_ownArticles].id, otherArticles[index_otherArticles].id);
                wishlist = await getWishlist();
            }
        }
    });

    //delete article from articles-table
    document.getElementById('delete_button').addEventListener('click', async () => {
        if (ownArticles.length <= 0) {
            return;
        } else {

            //delete entry from articles-table
            const articleId = ownArticles[index_ownArticles].id;
            try {
                const { data, error } = await supa
                    .from("articles")
                    .delete()
                    .match({ id: articleId });
        
                if (error) {
                    throw error;
                }
                } 
            catch (error){
                console.error('Error querying Supabase for deleting article: ', error.message);
            }

            //delete entry from storage
            const { data, error } = await supa
                .storage
                .from('article_img')
                .remove(ownArticles[index_ownArticles].img_path);

            if (error) {
                console.error('Error deleting file:', error);
            } else {
                console.log('File deleted:', data);
            }
            
            window.location.reload();    
        }
    });

    // make active-class for animation of swap button
    let sw_button = document.getElementById('swap_button');

    sw_button.addEventListener('mousedown', function() {
        if (ownArticles !== null && otherArticles !== null){
            this.classList.add('active');
        }
    });

    sw_button.addEventListener('animationend', function() {
        setTimeout(() => {
            this.classList.remove('active');                
        }, 1010);
    });

}