import { supa } from "../SupaBaseClient/supabase.js";
 
async function updateProfilesEntry(parameter_firstName, parameter_lastName, parameter_dob) {
    const { user } = supa.auth.session();
    
    if (user) {
        const { data, error } = await supa
            .from('profiles')
            .update({ 
                first_name: parameter_firstName, 
                last_name: parameter_lastName, 
                date_of_birth: parameter_dob
            })
            .eq('id', user.id);

        if (error) {
            console.log('Error updating profile:', error.message);
        } else if (data.length === 0) {
            console.log('No matching profile found to update');
        } else {
            console.log('Profile updated successfully:', data);
        }
    } else {
        console.log('No user is signed in');
    }
}

async function signUpWithEmailAndPassword() {
    const checkboxElement = document.getElementById('TermsCB').checked;
    const InputElement_firstName = document.getElementById('firstName').value;
    const InputElement_lastName = document.getElementById('lastName').value;
    const InputElement_dob = document.getElementById('dateOfBirth').value;
    
    let inputComplete = true;
    let signUpDone = false;

    if ((InputElement_firstName === '') || (InputElement_lastName === '') || (InputElement_dob === '')) {
        inputComplete = false;
    }

    if (checkboxElement && inputComplete) {
        const emailElement = document.getElementById('email').value;
        const passwordElement = document.getElementById('password').value;
        const { user, error } = await supa.auth.signUp({email: emailElement, password: passwordElement});

        if (error) {
            console.log('Error signing up:', error.message);
            if (error.message === 'Unable to validate email address: invalid format') {
                const element_check_IEF = document.getElementById('invEmailFormat');

                if (!element_check_IEF) {
                    const alert_invEmailFormat = document.createElement('div');
                    const element_signUpContent = document.getElementById('signUpContent');
                    alert_invEmailFormat.textContent = 'Invalid email format use';
                    alert_invEmailFormat.classList.add('txt');
                    alert_invEmailFormat.id = 'invEmailFormat';
                    alert_invEmailFormat.style.color = 'red';
                    alert_invEmailFormat.style.fontWeight = 'bold';
                    alert_invEmailFormat.style.fontSize = '0.8rem';
                    alert_invEmailFormat.style.width = '60%';
                    alert_invEmailFormat.style.textAlign = 'center';
                    alert_invEmailFormat.style.position = 'absolute';
                    alert_invEmailFormat.style.bottom = '5%';
                    alert_invEmailFormat.style.left = '50%';
                    alert_invEmailFormat.style.transform = 'translateX(-50%)';
                    element_signUpContent.appendChild(alert_invEmailFormat);
                    setTimeout(() => {
                        alert_invEmailFormat.remove();
                    }, 3000);
                }
            }
            if (error.message === 'User already registered') {
                const element_check_UAR = document.getElementById('UserAlrReg');

                if (!element_check_UAR) {
                    const alert_UserAlrReg = document.createElement('div');
                    const element_signUpContent = document.getElementById('signUpContent');
                    alert_UserAlrReg.textContent = 'Email already registered';
                    alert_UserAlrReg.classList.add('txt');
                    alert_UserAlrReg.id = 'UserAlrReg';
                    alert_UserAlrReg.style.color = 'red';
                    alert_UserAlrReg.style.fontWeight = 'bold';
                    alert_UserAlrReg.style.fontSize = '0.8rem';
                    alert_UserAlrReg.style.width = '60%';
                    alert_UserAlrReg.style.textAlign = 'center';
                    alert_UserAlrReg.style.position = 'absolute';
                    alert_UserAlrReg.style.bottom = '5%';
                    alert_UserAlrReg.style.left = '50%';
                    alert_UserAlrReg.style.transform = 'translateX(-50%)';
                    element_signUpContent.appendChild(alert_UserAlrReg);
                    setTimeout(() => {
                            alert_UserAlrReg.remove();
                    }, 3000);
                }
            }
            } else {
                console.log('Signed up successfully:', user);
                await updateProfilesEntry(InputElement_firstName, InputElement_lastName, InputElement_dob);
                signUpDone = true;
            }
    }

    else if ((inputComplete === false) && (checkboxElement === true)){
        alert('input is missing'); //später so machen wie die handlers von den sign up errors
    }

    else if ((inputComplete === true) && (checkboxElement === false)){
        alert('checkbox is missing'); //später so machen wie die handlers von den sign up errors
    }

    else {
        alert ('many missing required fields'); //später so machen wie die handlers von den sign up errors
    }

    if (signUpDone) {
        window.location.href='./dashboard.html';
    }
}

document.getElementById('sign-up-button').addEventListener('click', signUpWithEmailAndPassword);