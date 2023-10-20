import { supa } from "../SupaBaseClient/supabase.js";

Read (Price-Tolerance and Selected OwnItem) from Localstorage(In case of first execution of Reading Matches in a session, assume standard-tolerance and assume first OwnItem is selected -> DB query)

/* function dashboard () {
    OwnArticles = Read all articles where userID = supa.auth.user.userID

    Read PriceTolerance from html form //if not set, use standard-tolerance of 5 chf
    Read() from articles where price is < PriceTolerance && UploadUserId != userID JOIN IMGPaths from IMGtable where IMGarticleID = articleID

    fill corresponding ownItems-div with caption from articles and background image with IMGPaths

    OwnArticles = Read all articles where userID = supa.auth.user.userID

    Read PriceTolerance from html form //if not set, use standard-tolerance of 5 chf
    Read() from articles where price is < PriceTolerance && UploadUserId != userID JOIN IMGPaths from IMGtable where IMGarticleID = articleID

    fill corresponding ownItems-div with caption from articles and background image with IMGPaths

    Eventlistener for Click on "next" 
} */

function dashboard () {
    const { user } = supa.auth.user();
    const { data: ownArticles, error: ownArticlesError } = await supa
        .from("articles")
        .select("*")
        .eq("userID", user.id);

    const priceTolerance = document.getElementById("price-tolerance").value || 5;
    const { data: matchingArticles, error: matchingArticlesError } = await supabase
        .from("articles")
        .select("caption, IMGPaths")
        .lt("price", priceTolerance)
        .neq("userID", user.id)
        .join("IMGtable", { foreignKey: "articleID" });

    const ownItemsDivs = document.querySelectorAll(".ownItems-div");

    ownItemsDivs.forEach((div, index) => {
        div.style.backgroundImage = `url(${matchingArticles[index].IMGPaths})`;
        div.textContent = matchingArticles[index].caption;
    });

    const nextButton = document.getElementById("next-button");
    nextButton.addEventListener("click", () => {
        // code for handling click on "next" button
    });
}