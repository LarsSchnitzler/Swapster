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

        const timestamp = Date.now();
        console.log(timestamp);

        const newFile = new File([file], timestamp, { type: file.type });

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

        insertArtInf_articles(filePath, inputValue_title, inputValue_caption, inputValue_price);

    } else {
        console.log('No file selected.');
    }
}

document.getElementById('articleUpload_Cancel').addEventListener('click', function(event) {window.location.reload();});

document.getElementById('article-Upload_Inputs').addEventListener('submit', async function(event) {
    event.preventDefault();
    uploadArticle('article_img');
    window.location.reload();
});