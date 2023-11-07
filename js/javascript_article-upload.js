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

        await insertArtInf_articles(filePath, inputValue_title, inputValue_caption, inputValue_price);

    } else {
        console.log('No file selected.');
    }
}

function clearInputs() {
    document.getElementById('articleTitle').value = '';
    document.getElementById('articleCaption').value = '';
    document.getElementById('estValue').value = '';
    document.getElementById('file-upload').value = '';
}

function InputValidation() {
    const inputTitle = document.getElementById('articleTitle').value;
    const inputCaption = document.getElementById('articleCaption').value;
    const inputPrice = document.getElementById('estValue').value;
    const inputImg = document.getElementById('file-upload').value;

    if (inputTitle === '' || inputCaption === '' || inputPrice === '' || inputImg === '') {
        return false;
    } else {
        return true;
    }
}

document.getElementById('articleUpload_Cancel').addEventListener('click', function(event) {clearInputs();});

document.getElementById('article-Upload_Inputs').addEventListener('submit', async function(event) {
    event.preventDefault();
    if (!InputValidation()) {
        //show error message in div
        let newDiv = document.createElement('div');

        newDiv.className = 'txt';

        newDiv.textContent = 'Please fill out all fields.';

        newDiv.style.color = 'red';

        // Add a transition to the opacity
        newDiv.style.transition = 'opacity 2s';
        
        document.getElementById('article-Upload').appendChild(newDiv);

        // Wait for 2 seconds
        setTimeout(function() {
            // Start the fade out
            newDiv.style.opacity = '0';

            // Wait for the transition to finish and then remove the div
            setTimeout(function() {
                newDiv.parentNode.removeChild(newDiv);
            }, 500); // the duration of the fade out
        }, 2000); // the delay before the fade out starts

        return;
    }
    await uploadArticle('article_img');
    clearInputs();
});

document.getElementById('estValue').addEventListener('input', function(event) {
    if (!Number.isInteger(Number(event.target.value))) {
        event.target.value = '';
    }
});