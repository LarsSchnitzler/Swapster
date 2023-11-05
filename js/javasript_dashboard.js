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

async function articles_Next(indexObj, parameter_maxIndex, parameter_articlesArray, parameter_divName) {
    if (indexObj.value < parameter_maxIndex) {
        indexObj.value++;
    } else {
        indexObj.value = 0;
    }
    console.log(`OwnArticleIndex: ${indexObj.value}`);
    const url = await getImage('article_img', parameter_articlesArray, indexObj.value);
    document.getElementById(parameter_divName).style.backgroundImage = `url(${url})`;
}

//define index, maxIndex for own articles
const ownArticles = await getMyArticles();
let indexObj_ownArticles = { value: 0 }; //because of "pass by value" for primitives I used an object. So that it is passed by reference.
console.log(`indexObj_ownArticles: ${indexObj_ownArticles.value}`);
const OwnArticles_MaxIndex = ownArticles.length-1;
console.log(`OwnArticleMaxIndex: ${OwnArticles_MaxIndex}`);

//load inital Article
const img1_Url = await getImage('article_img', ownArticles, indexObj_ownArticles.value);
document.getElementById('ownArticle_image').style.backgroundImage = `url(${img1_Url})`;

//EventListener to arrowRight
document.getElementById('arrowRight_OwnArticle').addEventListener('click', async () => {
    await articles_Next(indexObj_ownArticles, OwnArticles_MaxIndex, ownArticles, 'ownArticle_image');
});   