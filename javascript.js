import { supa } from "./SupaBaseClient/supabase.js";

console.log("DatenBank_des_Projekts_Swapster_verbunden")

//Alle User abrufen
async function UserTest() {
    const { data, error } = await supa.from("users").select();
    return data;
}

console.log('UserTest', UserTest());