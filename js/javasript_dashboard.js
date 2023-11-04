import { supa } from "../SupaBaseClient/supabase.js";
import { authenticated } from './javascript_helpers.js';

const user = authenticated();
/*
async function getMyArticles() {
    try {
        const { data: data, error: error } = await supa
            .from("articles")
            .select("*")
            .eq("userID", user.id);

        if (error) {
            throw error;
        }

        console.log(data);
    } catch (error){
        console.error('Error querying Supabase: ', error.message);
    }
}

getMyArticles();
*/