import { supa } from "../SupaBaseClient/supabase.js";
import { authenticated_sendBack } from './javascript_helpers.js';

const user = await authenticated_sendBack();
const waitTime = 2000; //wait time in ms after upload until return to profile page

async function insertArtInf_articles(parameterImgPath, parameterTitle, parameterCaption, parameterPrice, parameterobjectId) {
    console.log('Trying Insert ArticleInfo');
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

async function insertProfile_pic(parameterImgPath) {
    console.log('Trying Insert ProfilePic Into Profiles');
    try {
        const { error } = await supa
            .from('profiles')
            .update({
                profilePic_path: parameterImgPath
            })
            .eq('id', user.id);

        if (error) {
            throw error;
        }
    } 
    catch (error){
        console.error('Error querying Supabase, trying to insert profilePic-Path into profiles: ', error.message);
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

async function uploadProfPic(bucketName) {
    const fileInput = document.getElementById('file-upload');
    console.log('uploadPhoto ProfilePic');

    if (fileInput.files.length > 0) {
        //rename with random number
        const file = fileInput.files[0];

        const randomNumber = Math.floor(Math.random() * 10000000000000);
        console.log(randomNumber);

        const newFileName = `profilePic_${randomNumber}`;
        const newFile = new File([file], newFileName, { type: file.type });

        const filePath = `uploads/${newFile.name}`;

        //delete oldProfilePic from storage, needs to be done before uploading new one, because there should only be one profilePic per user
            let oldProfPic_Path = '';
            //get oldProfilePic-Path from profiles
            try {
                const { data, error } = await supa
                    .from('profiles')
                    .select('profilePic_path')
                    .eq('id', user.id);
        
                if (error) {
                    throw error;
                }
        
                oldProfPic_Path = data[0].profilePic_path;
                console.log(oldProfPic_Path);
            } catch (error){
                console.error('Error querying Supabase: ', error.message);
            }
            
            //delete oldProfilePic from storage
            try {
                const { data: data, error: error } = await supa
                    .storage
                    .from(bucketName)
                    .remove(oldProfPic_Path);
        
                if (error) {
                    throw error;
                }
        
                console.log(data);
            } catch (error){
                console.error('Error querying Supabase: ', error.message);
            }
        
        //upload newProfilePic to storage
            try {
                const { data: data, error: error } = await supa.storage
                    .from(bucketName)
                    .upload(filePath, newFile);
        
                if (error) {
                    throw error;
                }
        
                console.log(data);
            } catch (error){
                console.error('Error querying Supabase: ', error.message);
            }

        //insert newProfilePic-Path into profiles
        await insertProfile_pic(filePath);

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

//get URL query string
const url = new URL(window.location.href);
const params = url.searchParams;

if (params.toString() && user.id === params.get('userId')) { //meaning its the profilePic upload page

    //change text
    document.getElementById('article-Upload_title').textContent = 'Profile Picture - Upload';
    document.getElementById('subtitle').style.display = 'none';
    document.getElementById('Art_PropInputs').style.display = 'none';
    document.getElementById('fileInput_label').textContent = 'Choose a Profile Picture to upload. (Old Profile Picture will be deleted)';

    //cancel clears all inputs
    document.getElementById('articleUpload_Cancel').addEventListener('click', function(event) {clearInputs();});

    //submit uploads profile pic
    document.getElementById('article-Upload_Inputs').addEventListener('submit', async function(event) {
        event.preventDefault();
        await uploadProfPic('avatars');
        clearInputs();

        /* setTimeout(() => {
            window.location.href = `./userprofile.html`;
        }, waitTime); */
        
    });

} else { //meaning its just the article upload page

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
}



