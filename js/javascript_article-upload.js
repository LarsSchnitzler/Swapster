import { supa } from "../SupaBaseClient/supabase.js";
import { authenticated_sendBack } from './javascript_helpers.js';

const user = await authenticated_sendBack();

async function insertArtInf_articles(parameterImgPath, parameterTitle, parameterCaption, parameterPrice, parameterobjectId) {
    console.log('TryingInsertArticleInfo');
    try {
        const { error: error } = await supa.from('articles').insert([
            {
                user_id: user.id,
                img_path: parameterImgPath,
                title: parameterTitle,
                caption: parameterCaption,
                price: parameterPrice,
            }
        ]);

        if (error) {
            throw error;
        }
    } 
    catch (error){
        console.error('Error querying Supabase: ', error.message);
    }
}

async function uploadArticle(bucketName) {
    const fileInput = document.getElementById('file-upload');
    const inputValue_title = document.getElementById('articleTitle').value;
    const inputValue_caption = document.getElementById('articleCaption').value;
    const inputValue_price = document.getElementById('estValue').value;
    console.log('uploadPhoto');

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];

        const randomNumber = Math.floor(Math.random() * 10000000000000);
        console.log(randomNumber);

        const newFileName = `${randomNumber}`;
        const newFile = new File([file], newFileName, { type: file.type });

        const filePath = `uploads/${newFile.name}`;
        
        try {
            const { data: data, error: error } = await supa.storage.from(bucketName).upload(filePath, newFile);
    
            if (error) {
                throw error;
            }
    
            console.log(data);
        } catch (error){
            console.error('Error querying Supabase: ', error.message);
        }

        await insertArtInf_articles(filePath, inputValue_title, inputValue_caption, inputValue_price);

    } else {
        console.log('No file selected.');
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

function clearInputs() {
    document.getElementById('articleTitle').value = '';
    document.getElementById('articleCaption').value = '';
    document.getElementById('estValue').value = '';
    document.getElementById('file-upload').value = '';
}



document.getElementById('articleUpload_Cancel').addEventListener('click', function(event) {clearInputs();});

document.getElementById('article-Upload_Inputs').addEventListener('submit', async function(event) {
    event.preventDefault();
    await uploadArticle('article_img');
    clearInputs();
});

document.getElementById('estValue').addEventListener('input', function() {
    if (!Number.isInteger(Number(this.value))) {
        this.value = '';
    }
});