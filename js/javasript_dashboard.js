import { supa } from "../SupaBaseClient/supabase.js";
import { authenticated_sendBack } from './javascript_helpers.js';

const user = await authenticated_sendBack();
const queryRate_PriTolChange = 1000; //in ms

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
    console.log(`lowerPriceBorder: ${lowerPriceBorder}`);
    console.log(`upperPriceBorder: ${upperPriceBorder}`);
    try {
        const { data, error } = await supa
            .from("articles")
            .select("*")
            .neq("user_id", user.id)
            .neq("id", currentOwnArtObj.id )
            .gte("price", lowerPriceBorder)
            .lte("price", upperPriceBorder);

        if (error) {
            throw error;
        }
        console.log(data);
        return(data);
        } 
    catch (error){
        console.error('Error querying Supabase for OtherArticles: ', error.message);
    }
}

async function getImage(parameter_bucketName, parameter_articles, i) {
    const path = parameter_articles[i].img_path;
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
    console.log(`OwnArticleIndex: ${index}`);
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

    if (ownArticles.length === 0) {
        noArticlesFound("own");
    }
    else {
        //set index, maxIndex for own articles
        let indexObj_ownArticles = { value: 0 }; //because of "pass by value" for primitives I used an object. So that it is passed by reference.
        const OwnArticles_MaxIndex = ownArticles.length-1;

        //set initial OwnArticle
        await setArticle(indexObj_ownArticles.value, ownArticles, 'ownArticle_image');

        //set next Article on right-arrow click
        document.getElementById('arrowRight_OwnArticle').addEventListener('click', async () => {
        
            if (indexObj_ownArticles.value < OwnArticles_MaxIndex) {
                indexObj_ownArticles.value++;
            } else {
                indexObj_ownArticles.value = 0;
            }
            await setArticle(indexObj_ownArticles.value, ownArticles, 'ownArticle_image');
        }); 
        
        //set previous Article on left-arrow click
        document.getElementById('arrowLeft_OwnArticle').addEventListener('click', async () => {
        
            if (indexObj_ownArticles.value > 0) {
                indexObj_ownArticles.value--;
            } else {
                indexObj_ownArticles.value = 0;
            }
            await setArticle(indexObj_ownArticles.value, ownArticles, 'ownArticle_image');
        }); 
    }

//OtherArticles

    //set index, maxIndex for other articles
    let indexObj_otherArticles = { value: 0 }; //because of "pass by value" for primitives I used an object. So that it is passed by reference.

    //set initial OtherArticle
    const priceTolerance = document.getElementById('price_tolerance_input').value;
    const otherArticles = await getOtherArticles(ownArticles[indexObj_otherArticles.value], priceTolerance);
    await setArticle(indexObj_otherArticles.value, otherArticles, 'otherArticle_image');

    //set maxIndex for other articles
    let OtherArticles_MaxIndex = otherArticles.length-1;

    /* //set initial lastChangeTime
    let lastChangeTime = new Date().getTime();

    //get other articles-array again, when price tolerance changes
    document.getElementById('price_tolerance_input').addEventListener('change', async () => {
        const currentTime = new Date().getTime();
        if (currentTime - lastChangeTime >= queryRate_PriTolChange) { //so that it has been at least 1 second since the last change of price tolerance until we query again.
            
            //get other articles-array
            const priceTolerance = document.getElementById('price_tolerance_input').value;
            console.log(ownArticles[indexObj_ownArticles.value]);
            const otherArticles = await getOtherArticles(ownArticles[indexObj_ownArticles.value], priceTolerance);
            console.log(otherArticles);

            //set index, maxIndex for other articles
            indexObj_otherArticles.value = 0; //because of "pass by value" for primitives I used an object. So that it is passed by reference.
            OtherArticles_MaxIndex = otherArticles.length-1;

            //set OtherArticle
            await setArticle(indexObj_otherArticles.value, otherArticles, 'otherArticle_image');

            // Update the last change time
            lastChangeTime = currentTime;
        }
    });

    //set next Article on right-arrow click

    //set previous Article on left-arrow click   */