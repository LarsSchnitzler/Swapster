import { supa } from "../SupaBaseClient/supabase.js";

async function getOwnArticles() {
    
    const { user } = supa.auth.session();
    console.log(user);
    const { data: ownArticles, error: ownArticlesError } = await supa
        .from("articles")
        .select("*")
    
    if (ownArticlesError) {
        console.log(ownArticlesError.message);
    }else{
        console.log(ownArticles);
    }

/*     return ownArticles;
 */}

getOwnArticles();