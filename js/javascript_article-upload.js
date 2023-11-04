import { supa } from "../SupaBaseClient/supabase.js";

function renameFile(originalFile, newName) {
    return new File([originalFile], newName, {type: originalFile.type});
    console.log('FileRename succeded');
}

async function insertArtInf_articles(parameterImgPath, parameterTitle, parameterCaption, parameterPrice) {
    console.log('uploadArticleInfo');

    const { user } = supa.auth.session();
    const userId = user ? user.id : null;

    const {error: articleInsertError} = await supa.from('articles').insert([
        {
            user_id: userId,
            img_path: parameterImgPath,
            title: parameterTitle,
            caption: parameterCaption,
            price: parameterPrice,
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
    const inputValue_title = document.getElementById('articleTitle').value;
    const inputValue_caption = document.getElementById('articleCaption').value;
    const inputValue_price = document.getElementById('estValue').value;

    const { user } = supa.auth.session();
    
    if(user){
        console.log('uploadPhoto');

        if (fileInput.files.length > 0) {
            let currentTime = new Date().toLocaleString();
            console.log(currentTime);
            const file = renameFile(fileInput.files[0], currentTime);
    
            const filePath = `uploads/${file.name}`;
            const { data, error: uploadError } = await supa.storage.from(bucketName).upload(filePath, file);
            
            if (uploadError) {
                console.error('Error uploading file:', uploadError);
                return;
            } else{
                console.log('File uploaded successfully');
                insertArtInf_articles(filePath, inputValue_title, inputValue_caption, inputValue_price);
                location.reload();    
            }        
        } else {
            console.log('No file selected.');
        }
    } else {
        console.log('No user is signed in');
    }   

}

const Element_uploadButton = document.getElementById('articleUpload_Upload');
const Element_cancelButton = document.getElementById('articleUpload_Cancel');

Element_cancelButton.addEventListener('click', function() {location.reload();});
Element_uploadButton.addEventListener('click', function() {uploadPhoto('article_img');});