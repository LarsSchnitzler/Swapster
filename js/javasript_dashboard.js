import { supa } from "../SupaBaseClient/supabase.js";
import { authenticated_sendBack } from './javascript_helpers.js';

const user = await authenticated_sendBack();
const queryRate_PriTolChange = 1000; //in ms
const match_color = "#2E7985";

async function getMyArticles() {
    try {
        const { data: data, error: error } = await supa
            .from("articles")
            .select("*")
            .eq("user_id", user.id);

        if (error) {
            throw error;
        }
        /* console.log("Own Articles:");
        console.log(data); */
        return(data);
        } 
    catch (error){
        console.error('Error querying Supabase for myArticles: ', error.message);
    }
}

async function getOtherArticles(currentOwnArtObj, priceTolerance) {
    const lowerPriceBorder = currentOwnArtObj.price - priceTolerance;
    const upperPriceBorder = parseInt(currentOwnArtObj.price) + parseInt(priceTolerance);
    console.log(`lowerPriceBorder: ${lowerPriceBorder}`);
    console.log(`upperPriceBorder: ${upperPriceBorder}`);
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
        console.log(data);
        return(data);

        } 
    catch (error){
        console.error('Error querying Supabase for OtherArticles: ', error.message);
    }
}

async function getImage(parameter_bucketName, parameter_articles, i) {
    console.log("article-array in getImage:" + parameter_articles);

    const path = parameter_articles[i].img_path;
    console.log(path);
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
    if (parameter_divName === 'ownArticle_image') {
        console.log(`ownArticleIndex: ${index}`);
    } else if (parameter_divName === 'otherArticle_image') {
        console.log(`otherArticleIndex: ${index}`);        
    }
    //set background image
    const url = await getImage('article_img', parameter_articlesArray, index);
    const parentElement = document.getElementById(parameter_divName);
    parentElement.style.backgroundImage = `url(${url})`;

    //set title and caption
    const title = parameter_articlesArray[index].title;
    const caption = parameter_articlesArray[index].caption;

    const titleElement = parentElement.querySelector('.articleTitle');
    const captionElement = parentElement.querySelector('.articleInfo');

    titleElement.textContent = title;
    captionElement.textContent = caption;
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
    }
}

async function readOut_curArtSets_Matches () {
    matches = []; //reset matches-array

    for (const ownArt of ownArticles) {
        console.log(ownArt);
        
        //check for each of otherArticles whether a corresponding wish exists AND whether inverted wish exists
        for (const othArt of otherArticles) {
         
            const check1 = await checkWetherWishExists(ownArt.id, othArt.id);
            const check2 = await checkWetherWishExists(othArt.id, ownArt.id);
            /* console.log("check1: " + check1 + "");
            console.log("check2: " + check2 + ""); */

            //if yes, write combination as object into matches-array
            if (check1 === true && check2 === true) {
                console.log("pushing into matches-array");
                matches.push({ownItemMatched: ownArt.id, otherItemMatched: othArt.id});
            }
        }
    }
}

function checkWether_CurrentArticlesMatching() {
    const artId1 = ownArticles[indexObj_ownArticles].id;
    const artId2 = otherArticles[indexObj_otherArticles].id;
    /* console.log('artId1:', artId1);
    console.log('artId2:', artId2); */
    const entryExists = matches.some(obj => obj.ownItemMatched === artId1 && obj.otherItemMatched === artId2); //The array.some() method in tests whether at least one element in the array passes the test implemented by the provided function
    
    if (entryExists) {
        console.log('This article-combination is matching.');
        const swap_button = document.getElementById('swap_button');
        swap_button.href = "./userprofile.html"; 
        swap_button.style.boxShadow = `0px 0px 85px 0px ${match_color}`;
        return true;
    } else {
        console.log('This article-combination is NOT matching.');
        const swap_button = document.getElementById('swap_button');
        swap_button.style.borderColor = "black";
        swap_button.style.boxShadow = 'none';
        swap_button.removeAttribute('href');
        return false;
    }
}

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

//OwnArticles

    //get own articles-array
    const ownArticles = await getMyArticles();
    let indexObj_ownArticles = 0 ; //its global so that it can be used in the otherArticles-section
    if (ownArticles.length === 0) {
        noArticlesFound("own");
    }
    else {
        //set index, maxIndex for own articles
        const OwnArticles_MaxIndex = ownArticles.length-1;

        //set initial OwnArticle
        await setArticle(indexObj_ownArticles, ownArticles, 'ownArticle_image');

        //set next Article on right-arrow click
        document.getElementById('arrowRight_OwnArticle').addEventListener('click', async () => {
            
            if (indexObj_ownArticles < OwnArticles_MaxIndex) {
                indexObj_ownArticles++;
            } else {
                indexObj_ownArticles = 0;
            }
            await setArticle(indexObj_ownArticles, ownArticles, 'ownArticle_image');

            //check wether new articles are matching
            if(otherArticles !== null) { //so that no error occurs when no articles are found
            const artMatch = checkWether_CurrentArticlesMatching(ownArticles[indexObj_ownArticles].id, otherArticles[indexObj_otherArticles].id);
            }
        }); 
        
        //set previous Article on left-arrow click
        document.getElementById('arrowLeft_OwnArticle').addEventListener('click', async () => {
        
            if (indexObj_ownArticles > 0) {
                indexObj_ownArticles--;
            } else {
                indexObj_ownArticles = 0;
            }
            await setArticle(indexObj_ownArticles, ownArticles, 'ownArticle_image');

            //check wether new articles are matching
            if(otherArticles !== null) { //so that no error occurs when no articles are found
            const artMatch = checkWether_CurrentArticlesMatching(ownArticles[indexObj_ownArticles].id, otherArticles[indexObj_otherArticles].id);
            if (artMatch === true) {
                document.getElementById('swap_button').style.borderColor = match_color;
            }
        }
        });
    }

//OtherArticles

    //set index, maxIndex for other articles
    let indexObj_otherArticles = 0 ; 

    //set initial OtherArticle
    const priceTolerance = document.getElementById('price_tolerance_input').value;
    let otherArticles = await getOtherArticles(ownArticles[indexObj_otherArticles], priceTolerance);
    if (otherArticles !== null) { //so that no error occurs when no articles are found
        await setArticle(indexObj_otherArticles, otherArticles, 'otherArticle_image');
    } else {
        noArticlesFound("other");
    }

    //set maxIndex for other articles
    let OtherArticles_MaxIndex = otherArticles.length-1;

        
    //define matches globally
        let matches = [];
        //check wether matches exist. THIS NEEDS TO BE DONE EVERYTIME EITHER OTHERARTICLES OR OWNARTICLES GET QUERIED AGAIN.
        await readOut_curArtSets_Matches();
        console.log('matches:', matches);
        //check wether new articles are matching
        const artMatch = checkWether_CurrentArticlesMatching(ownArticles[indexObj_ownArticles].id, otherArticles[indexObj_otherArticles].id);
        if (artMatch === true) {
            document.getElementById('swap_button').style.borderColor = match_color;
        }

    //set initial lastChangeTime
    let lastChangeTime = new Date().getTime();

    //get other articles-array again, when price tolerance changes
    document.getElementById('price_tolerance_input').addEventListener('change', async () => {
        const currentTime = new Date().getTime();
        if (currentTime - lastChangeTime >= queryRate_PriTolChange) { //so that it has been at least 1 second since the last change of price tolerance until we query again.
            
            //get other_articles-array
            const priceTolerance = document.getElementById('price_tolerance_input').value;
            console.log(`priceTolerance: ${priceTolerance}`);
            otherArticles = await getOtherArticles(ownArticles[indexObj_ownArticles], priceTolerance); //overwrite otherArticles with new array
            if (otherArticles !== null) { //so that no error occurs when no articles are found
                await setArticle(indexObj_otherArticles, otherArticles, 'otherArticle_image');
                //check wether matches exist. THIS NEEDS TO BE DONE EVERYTIME EITHER otherArticles OR ownArticles GET QUERIED AGAIN.
                await readOut_curArtSets_Matches();
                console.log('matches:', matches);
                //set index, maxIndex for other articles again so that the index is reset to 0
                indexObj_otherArticles = 0; 
                OtherArticles_MaxIndex = otherArticles.length-1;
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
        
        if (indexObj_otherArticles < OtherArticles_MaxIndex) {
            indexObj_otherArticles++;
        } else {
            indexObj_otherArticles = 0;
        }
        await setArticle(indexObj_otherArticles, otherArticles, 'otherArticle_image');

        //check wether new articles are matching
            const artMatch = checkWether_CurrentArticlesMatching(ownArticles[indexObj_ownArticles].id, otherArticles[indexObj_otherArticles].id);
            if (artMatch === true) {
                document.getElementById('swap_button').style.borderColor = match_color;
            }
    }); 
    
    //set previous Article on left-arrow click
    document.getElementById('arrowLeft_OtherArticle').addEventListener('click', async () => {
    
        if (indexObj_otherArticles > 0) {
            indexObj_otherArticles--;
        } else {
            indexObj_otherArticles = 0;
        }
        await setArticle(indexObj_otherArticles, otherArticles, 'otherArticle_image');

        //check wether new articles are matching
            const artMatch = checkWether_CurrentArticlesMatching(ownArticles[indexObj_ownArticles].id, otherArticles[indexObj_otherArticles].id);
            if (artMatch === true) {
                document.getElementById('swap_button').style.borderColor = match_color;
            }
    });

document.getElementById('swap_button').addEventListener('click', async () => {
    //put article on wishlist
    await putArticleOnWishlist(ownArticles[indexObj_ownArticles].id, otherArticles[indexObj_otherArticles].id);
    const artMatch = checkWether_CurrentArticlesMatching(ownArticles[indexObj_ownArticles].id, otherArticles[indexObj_otherArticles].id);
    if (artMatch === true) {
        console.log('its a match!');
        window.location.href = "./view-profile.html?otheruser=" + otherArticles[indexObj_otherArticles].user_id + "&ownproduct=" + ownArticles[indexObj_ownArticles].id + "&otherproduct=" + otherArticles[indexObj_otherArticles].id;
    }

});

//delete article from articles-table
document.getElementById('delete_button').addEventListener('click', async () => {
    const articleId = ownArticles[indexObj_ownArticles].id;
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
    
    window.location.reload(); //No readOut of current matches needs to be done here, because of reload it will be done either way.
});