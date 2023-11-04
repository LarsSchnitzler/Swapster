import { supa } from "../SupaBaseClient/supabase.js";
import { authenticated } from './javascript_helpers.js';

const user = authenticated();

async function insertArtInf_articles(parameterImgPath, parameterTitle, parameterCaption, parameterPrice, parameterobjectId) {
    console.log('uploadArticleInfo');

    const user = supa.auth.user();
    const userId = user ? user.id : null;

    const {error: articleInsertError} = await supa.from('articles').insert([
        {
            user_id: userId,
            img_path: parameterImgPath,
            title: parameterTitle,
            caption: parameterCaption,
            price: parameterPrice,
            object_id: parameterobjectId
        }
    ]);
    
    if (articleInsertError) {
        console.error('Error saving to "articles" table:', articleInsertError.message);
    } else {
        console.log('ArticleInfo Insert successfull:');
    } 
}

async function uploadPhoto(bucketName) {
    const fileInput = document.getElementById('file-upload');
    const inputValue_title = document.getElementById('articleCaption').value;
    const inputValue_caption = document.getElementById('articleCaption').value;
    const inputValue_price = document.getElementById('estValue').value;
    console.log('uploadPhoto');

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const filePath = `uploads/${file.name}`;
        const { data, error: uploadError } = await supa.storage.from(bucketName).upload(filePath, file);
        
        if (uploadError) {
            console.error('Error uploading file:', uploadError);
            return;
        } else{
            console.log('File uploaded successfully');
        }

        const objectId = data.id;
        console.log('objectId: ', objectId);

        insertArtInf_articles(filePath, inputValue_title, inputValue_caption, inputValue_price);

    } else {
        console.log('No file selected.');
    }
}

const uploadButton = document.getElementById('articleUpload_Upload');
uploadButton.addEventListener('click', function() {uploadPhoto('article_img');});