import { supa } from "../SupaBaseClient/supabase.js";

/* function: setArticle (articles, articleIndex, divIdImg, divIdCaption, divIdTitle) {
    const ownItemsDiv = document.getElementById(".ownItems-div");
    ownItemsDiv.style.backgroundimage(url:"articles."+ articleIndex +".imgPath")
}*/
const { user } = supa.auth.user();

const { data: ownArticles, error: ownArticlesError } = await supa
    .from("articles")
    .select("*")
    .eq("userID", user.id);
    .join("IMGtable", { foreignKey: "articleID" });

const ownArticleIndex = 0;
const matchingArticleIndex = 0;
const priceTolerance = document.getElementById("price-tolerance").value || 5;

const Element_ownArticle_img = document.getElementById("");
const Element_matchingArticle_img = document.getElementById("next-button");

const { data: matchingArticles, error: matchingArticlesError } = await supabase
    .from("articles")
    .select("*")
    //.selfjoin("articles", {price = price - priceTolerance || price = price + priceTolerance});
    //???: .lt("price", priceTolerance)
    .neq("userID", user.id)

//setArticle(ownArticles, ownArticleIndex, )

ownItemsDivs.forEach((div, index) => {
    div.style.backgroundImage = `url(${matchingArticles[index].IMGPaths})`;
    div.textContent = matchingArticles[index].caption;
});

const nextButton = document.getElementById("next-button");
nextButton.addEventListener("click", () => {
    // code for handling click on "next" button
});
