import { supa } from "../SupaBaseClient/supabase.js";
import { authenticated_sendBack } from './javascript_helpers.js';

const user = await authenticated_sendBack();

async function getMyArticles() {
    try {
        const { data: data, error: error } = await supa
            .from("articles")
            .select("*")
            .eq("user_id", user.id);

        if (error) {
            throw error;
        }
        console.log(data);
        return(data);
        } 
    catch (error){
        console.error('Error querying Supabase: ', error.message);
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

//OwnArticles

    //get own articles-array
    const ownArticles = await getMyArticles();

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
    

/* 
//define index, maxIndex for own articles

console.log(`indexObj_ownArticles: ${indexObj_ownArticles.value}`);

console.log(`OwnArticleMaxIndex: ${OwnArticles_MaxIndex}`);

//load inital Article
const art1_Title = ownArticles[indexObj_ownArticles.value].title;
const art1_Caption = ownArticles[indexObj_ownArticles.value].caption;
document.getElementById('ownArticle_title').textContent = art1_Title;
document.getElementById('ownArticle_caption').textContent = art1_Caption;

const img1_Url = await getImage('article_img', ownArticles, indexObj_ownArticles.value);
document.getElementById('ownArticle_image').style.backgroundImage = `url(${img1_Url})`;

//EventListener to arrowRight
document.getElementById('arrowRight_OwnArticle').addEventListener('click', async () => {
    await articles_Next(indexObj_ownArticles, OwnArticles_MaxIndex, ownArticles, 'ownArticle_image');
});    */