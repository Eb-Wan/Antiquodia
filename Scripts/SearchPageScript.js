class SearchClass {
    constructor () {
        this.DBUrl = "./Json/bdd.json";
        this.JsonData = [];
        this.FilteredList = [];
        this.SlicedList = [];

        this.Url = window.location.search;
        this.UrlParams = new URLSearchParams(this.Url);
        this.SearchValue = this.UrlParams.get("search");
        this.TypeValue = this.UrlParams.get("type");
        this.CategoryValue = this.UrlParams.get("category");
        this.BrandValue = this.UrlParams.get("brand");
        this.ModelValue = this.UrlParams.get("model");
        
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

        //Cette classe gère la pagination (UI)
        //A chaque fois que l'utlisateur change de page, "DisplayResults(Start, End)" est rappelé par
        //cette instance de classe, pour mettre à jour la page.
        //Pagination (La quantité d'éléments, Page de départ, éléments par page, Callback)

        this.Pagination = new Pagination(this.FilteredList.length, 1, 8, this.DisplayResults.bind(this));
    }
    DisplayResults(Start, End) {
        //Cette méthode affiche les résultats entre Start(inclu) et End(inclu)
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
        let Link = `/Get.html?resource=${this.ElementJson.id}`;

        Title = this.ElementJson.title;
        //Si la ressource est une ressource fille, le titre devient "Re :"
        if (this.ElementJson.parent != null) {
            Title = "Re :";
        }
        Description = this.ElementJson.post;

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

/*
    Ceci est une classe qui gère la pagination, elle va automatique ajouter
    l'interface de pagination à la page.

    Pagination(TotalLength, StartPage, PageLength, CallBack)
    TotalLength = La quantité d'élements
    StartPage = Page de départ
    PageLength = Quantité d'élements par page
    CallBack = La fonction à rappeler lors d'un changement de page.
    (La gestion de l'ui est ici, mais la gestion des résulats est autre pars.)

    La fonction CallBack doit attendre deux paramètres (Start, End)
    Start = l'élement de début de page, End = l'élement de fin de page
*/
class Pagination {
    constructor (TotalLength, StartPage, PageLength, CallBack) {
        this.TotalLength = TotalLength;
        this.CurrentPage = StartPage;
        this.PageLength = PageLength;
        this.CallBack = CallBack;

        if (TotalLength > 0 && CallBack != undefined) this.Initialize();
    }
    Initialize() {
        this.TotalPage = Math.ceil(this.TotalLength / this.PageLength);

        const ResultSection = document.getElementById("ResultSection");
        if (ResultSection == undefined) return;

        let PaginationDiv = document.createElement("div");
        PaginationDiv.className = "pagination";

        PaginationDiv.appendChild(this.CreatePrevious());
        PaginationDiv.appendChild(this.CreateInput());
        PaginationDiv.appendChild(this.CreateTotal());
        PaginationDiv.appendChild(this.CreateNext());
        ResultSection.appendChild(PaginationDiv);
        
        this.ChangePage(this.CurrentPage);
    }
    CreatePrevious() {
        let Element = document.createElement("button");
        Element.className = "iconbutton";
        Element.id = "PaginationPrevious";
        Element.innerHTML = `<img class="icon" src="./Icons/caret-left-fill.svg" alt="Page précédente"></img>`;
        Element.addEventListener("click", () => this.PageButton(-1));
        return Element;
    }
    CreateInput() {
        let Element = document.createElement("input");
        Element.className = "pagination__input";
        Element.id = "PaginationInput";
        Element.type = "number";
        Element.name = "PaginationInput";
        Element.value = this.CurrentPage;
        Element.min = 1;
        Element.max = this.TotalPage;
        Element.addEventListener("keyup", (e) => this.PageInput(e));
        return Element;
    }
    CreateTotal() {
        let Element = document.createElement("span");
        Element.className = "pagination__total";
        Element.innerHTML = "/ " + this.TotalPage;
        return Element;
    }
    CreateNext() {
        let Element = document.createElement("button");
        Element.className = "iconbutton";
        Element.id = "PaginationNext";
        Element.innerHTML = `<img class="icon" src="./Icons/caret-right-fill.svg" alt="Page suivante"></img>`;
        Element.addEventListener("click", () => this.PageButton(1));
        return Element;
    }
    PageInput (event) {
        if (event.key != "Enter" && event.key != "ArrowUp" && event.key != "ArrowDown") return;
        let Value = event.target.value;
        if (Value < 1) Value = 1;
        else if (Value > this.TotalPage) Value = this.TotalPage;
        this.ChangePage(Value);
    }
    PageButton(Direction) {
        let Value = this.CurrentPage + Direction;
        if (Value < 1) Value = 1;
        else if (Value > this.TotalPage) Value = this.TotalPage;
        this.ChangePage(Value);
    }
    ChangePage(Value = 1) {
        this.UpdateUi(Value);

        this.CurrentPage = Value;
        let Start = (Value - 1) * this.PageLength;
        this.CallBack(Start, Start + this.PageLength);
    }
    UpdateUi(Value) {
        if (Value <= 1 && Value >= this.TotalPage) {
            document.getElementById("PaginationPrevious").disabled = true;
            document.getElementById("PaginationNext").disabled = true;
        } else if (Value <= 1) {
            document.getElementById("PaginationPrevious").disabled = true;
            document.getElementById("PaginationNext").disabled = false;
        } else if (Value >= this.TotalPage) {
            document.getElementById("PaginationPrevious").disabled = false;
            document.getElementById("PaginationNext").disabled = true;
        } else {
            document.getElementById("PaginationPrevious").disabled = false;
            document.getElementById("PaginationNext").disabled = false;
        }
        document.getElementById("PaginationInput").value = Value;
    }
}

const Search = new SearchClass();