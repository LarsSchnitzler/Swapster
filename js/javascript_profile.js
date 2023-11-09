import { supa } from "../SupaBaseClient/supabase.js";
import { authenticated_sendBack } from './javascript_helpers.js';

const user = await authenticated_sendBack();

async function getProfileData(userId) {
    try {
        const { data, error } = await supa
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            throw error;
        }
        return data;
        /* console.log(data); */
        } 
    catch (error){
        console.error('Error querying Supabase for UserProfileData: ', error.message);
    }
    
}

function toggle_editSection(toggleState){
    if (toggleState) { //if editProfile is visible
        document.getElementById('editProfile').style.display = 'none';
        //rotate editPen 90 degrees anti-clockwise
        document.getElementById('editPen').style.transform = 'rotate(0deg)';

        edit_toggleState = false;

    } else { //if editProfile is not visible
        document.getElementById('editProfile').style.display = 'flex';
        //rotate editPen 90 degrees clockwise
        document.getElementById('editPen').style.transform = 'rotate(90deg)';

        edit_toggleState = true;

    }
}

function clearInputs() {
    document.getElementById('fName').value = '';
    document.getElementById('lName').value = '';
    document.getElementById('dob').value = '';  
    document.getElementById('big-textarea').value = '';
}

if (params.toString()) { // There are parameters in the URL
    //make new Div for Title
    const titleDiv = document.createElement('div');
    titleDiv.classList.add('txt');
    titleDiv.classList.add('title2');
    titleDiv.textContent = 'Contact this user to trade:';
    titleDiv.style.marginBottom = '1rem';
    const parentDiv = document.getElementById('profileInfo');
    console.log(parentDiv);
    parentDiv.prepend(titleDiv);

    //get Url parameters
    const profile_id = params.get('otherUser');

    //get profile data
    const profile = await getProfileData(profile_id);
    /* console.log(profile); */

    //set profile data
    document.getElementById('name').textContent = profile.first_name + ' ' + profile.last_name;
    document.getElementById('dob').textContent = profile.date_of_birth;
    document.getElementById('email').textContent = profile.email;
    if (profile.aboutMe !== null) {
        document.getElementById('aboutMe').textContent = profile.aboutMe;
    } else {
        document.getElementById('aboutMe').textContent = 'No About-Me for this user';
    }
    
    //hide edit Profile section and editPen
    document.getElementById('editProfile').style.display = 'none';
    document.getElementById('editPen').style.display = 'none';
    document.getElementById('trashBin').style.display = 'none';
} else { // There are no parameters in the URL -> meaning it's the user's own profile
    //hide editProfile section FOR NOW
    document.getElementById('trashBin').style.display = 'none';

    //get profile data
    const profile = await getProfileData(user.id);
    /* console.log(profile); */

    //set profile data
        //name
        document.getElementById('name').textContent = profile.first_name + ' ' + profile.last_name;

        //format date of birth to dd/mm/yyyy
        const dob = new Date(profile.date_of_birth);
        document.getElementById('dob').textContent = dob.toLocaleDateString('en-GB');

        //email
        document.getElementById('email').textContent = profile.email;

        //aboutMe        
        if (profile.aboutMe !== null) {
            document.getElementById('aboutMe').textContent = profile.aboutMe;
        } else {
            document.getElementById('aboutMe').textContent = '*No About-Me for this user*';
        }
    
    //editPen click event
    document.getElementById('editPen').addEventListener('click', function() {
        toggle_editSection(edit_toggleState);
    });

    //save button click event
    document.getElementById('editProfile_Save').addEventListener('click', async (event) => {
        event.preventDefault();

        if (document.getElementById('fName').value.trim() !== '') {
            const first_name = document.getElementById('fName').value;

            try {
                const { data, error } = await supa
                    .from('profiles')
                    .update({ first_name })
                    .eq('id', user.id);

            if (error) {
                throw error;
            } else {
                console.log('Profile updated successfully!');
            }
            } catch (error) {
                console.error(`Error querying Supabase trying to update profile: ${error.message}`);
            }
            
        }
        
        if (document.getElementById('lName').value.trim() !== '') {
            const last_name = document.getElementById('lName').value;

            try {
                const { data, error } = await supa
                    .from('profiles')
                    .update({ last_name })
                    .eq('id', user.id);

            if (error) {
                throw error;
            } else {
                console.log('Profile updated successfully!');
            }
            } catch (error) {
                console.error(`Error querying Supabase trying to update profile: ${error.message}`);
            }
            
        }

        if (document.getElementById('dob-input').value.trim() !== '') {
            const date_of_birth = document.getElementById('dob-input').value;

            try {
                const { data, error } = await supa
                    .from('profiles')
                    .update({ date_of_birth })
                    .eq('id', user.id);

            if (error) {
                throw error;
            } else {
                console.log('Profile updated successfully!');
            }
            } catch (error) {
                console.error(`Error querying Supabase trying to update profile: ${error.message}`);
            }
            
        }

        if (document.getElementById('big-textarea').value.trim() !== '') {
            console.log(document.getElementById('big-textarea').value);
            const aboutMe = document.getElementById('big-textarea').value;

            try {
                const { data, error } = await supa
                    .from('profiles')
                    .update({ aboutMe })
                    .eq('id', user.id);

            if (error) {
                throw error;
            } else {
                console.log('Profile updated successfully!');
            }
            } catch (error) {
                console.error(`Error querying Supabase trying to update profile: ${error.message}`);
            }
        }
        clearInputs();
        window.location.reload();
    });

    //cancel button click event
    document.getElementById('editProfile_Cancel').addEventListener('click', function() {
        document.getElementById('fName').value = '';
        document.getElementById('lName').value = '';
        document.getElementById('dob').value = '';
        document.getElementById('big-textarea').value = '';
    });

    document.getElementById('profilePic_upload').addEventListener('click', async () => {
        const url = new URL('./articleUpload.html', window.location.href);
        const params = url.searchParams; //even if you know there are no search parameters in the URL, you still need to use url.searchParams to get a URLSearchParams object
        params.append('profilePic_upload', true);
        window.location.href = url.toString(); //assigning the URL string to window.location.href will redirect the browser to the new page.
    });	

/*     //delete button click event
    document.getElementById('trashBin').addEventListener('click', async () => {
        //delete profile in profiles table
        try {
            const { data, error } = await supa
                .from('profiles')
                .delete()
                .eq('id', user.id);

            if (error) {
                throw error;
            } else {
                console.log(data);
            }
            window.location.href = "/index.html";
        } catch (error) {
            console.error(`Error querying Supabase trying to delete profile: ${error.message}`);
        }
        //delete user in auth namespace: user table

        //create admin client
        const supaBaseAdmin = createClient('https://wovrufcmlvwhuegcwcif.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvdnJ1ZmNtbHZ3aHVlZ2N3Y2lmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5NjMxNzU0NywiZXhwIjoyMDExODkzNTQ3fQ.oedyBX6da84WcRtQ5XvalEuCzXFnqb8iSa-kZW26kvs', 
        {
            auth: {
              autoRefreshToken: false,
              persistSession: false
            }
        });

        console.log('trying to delete user in auth namespace');

        supaBaseAdmin.auth.deleteUser(user.id)
            .then(response => console.log('User deleted:', response))
            .catch(error => console.error('Error deleting user:', error))

        authenticated_sendBack();
    }); */

}