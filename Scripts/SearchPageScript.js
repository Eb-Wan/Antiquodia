import {Pagination} from './UiHandlerScript.js';

class SearchClass {
    constructor () {
        this.DBUrl = "./Json/bdd.json";
        this.JsonData = [];
        this.FilteredList = [];
        this.SlicedList = [];
        this.Url = window.location.search;
        this.UrlParams = new URLSearchParams(this.Url);
        this.SearchValue = this.UrlParams.get("s");
        this.TypeValue = this.UrlParams.get("t");
        this.CategoryValue = this.UrlParams.get("c");
        this.BrandValue = this.UrlParams.get("b");
        this.ModelValue = this.UrlParams.get("m");
        this.Pagination;

        this.Initialisation();
    }
    Initialisation() {
        fetch(this.DBUrl)
        .then(Response => Response.json())
        .then(Response => {
            this.JsonData = [...Response];
            this.FilterResults()
        }).catch(Error => console.error(Error))
    }
    FilterResults() {
        if (document.getElementById("ResultSectionContainer") == undefined) return;

        this.FilteredList = this.JsonData.filter(e => {
           return (e.title.toLowerCase().includes(this.SearchValue.toLowerCase()) && e.type.includes(this.TypeValue));
        });
        
        if (this.FilteredList.length == 0) {
            document.getElementById("ResultSectionContainer").innerHTML = "<h2>Aucun résultats</h2>";
            return;
        }

        //Cette classe (importée de UiHandlerScript.js) gère la pagination (UI)
        //A chaque fois que l'utlisateur change de page, "DisplayResults(Start, End)" est rappelé par
        //cette instance de classe, pour mettre à jour la page.

        this.Pagination = new Pagination(this.FilteredList.length, 1, 14, this.DisplayResults.bind(this));
    }
    DisplayResults(Start, End) {
        const ResponseSection = document.getElementById("ResultSectionContainer");
        ResponseSection.innerHTML = "";
        let ResultList = "";

        this.SlicedList = this.FilteredList.slice(Start, End);
        this.SlicedList.forEach(e => {
            const ResultHtmlElement = new ResultClass(e);
            ResultList += ResultHtmlElement.GetHtml();
            
        });

        ResponseSection.innerHTML = ResultList;
    }
}

class ResultClass {
    constructor (ElementJson) {
        this.ElementJson = ElementJson;
        this.Type = ElementJson.type;
    }
    GetHtml() {
        let Title = "Titre";
        let Description = "Description";
        let Link = "./Index.html";

        if (this.Type == "post") {
            Title = this.ElementJson.title;
            Link = "./Forum.html?p="+this.ElementJson.id;
            //Si le post est un post enfant, le titre devient "Re :"
            if (this.ElementJson.parent != null) {
                Title = "Re :";
            }
            Description = this.ElementJson.post;
        } else {
            Title = this.ElementJson.title;
            Description = this.ElementJson.description;
            Link = "./Get.html?p="+this.ElementJson.id;
        }

        return `
            <div class="resultelement">
                <div class="resultelement__leftdiv"><img src="https://picsum.photos/200" alt="Image Temporaire" width="110px" height="110px" loading="lazy"></div>
                <div class="resultelement__centerdiv">
                    <h2><a href="${Link}">${Title}</a></h2>
                    <p>
                        ${Description}
                    </p>
                </div>
                <div class = "resultelement__rightdiv">
                    <img class="Icon" src="./Icons/bookmark-plus.svg" alt="placeholder" width="32px" height="32px" loading="lazy">
                    <img class="Icon" title="${this.Type}" src="${this.GetTypeIconUrl()}" alt="placeholder" width="32px" height="32px" loading="lazy">
                </div>
            </div>
        `;
    }
    GetTypeIconUrl() {
        if (this.Type == "archive") return "/Icons/archive-fill.svg";
        else if (this.Type == "encyclopedia") return "/Icons/article.svg";
        else if (this.Type == "guide") return "/Icons/rulers.svg";
        else if (this.Type == "news") return "/Icons/newspaper.svg";
        else if (this.Type == "post") return "/Icons/post-fill.svg";
    }
}

const Search = new SearchClass();