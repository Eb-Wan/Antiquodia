class ResourceClass {
    constructor () {
        this.Url = window.location.search;
        this.UrlParams = new URLSearchParams(this.Url);
        this.Id = this.UrlParams.get("resource");
        this.HtmlContainer = document.getElementById("RessourceContainer");
        if (this.Id != null && this.Id >= 0) this.FetchRessource();
        else this.DisplayError(this.NewError("La ressource demandée n'a pas pu être trouvée.", 404));
    }
    FetchRessource() {
        fetch("/Json/bdd.json")
        .then(Response => Response.json())
        .then(Response => {
            let Index = Response.findIndex(Element => Element.id == this.Id);
            if (Index == -1) throw this.NewError("La ressource demandée n'a pas pu être trouvée.", 404);
            this.DisplayRessource(Response[Index]);
        })
        .catch(Error => this.DisplayError(Error));
    }
    DisplayRessource(Resource) {
        let TypeInfos = this.GetTypeInfo(Resource.type);
        let Authors = "Par:";
        Authors += Resource.by.map(element => " "+element.name);

        this.HtmlContainer.innerHTML = `
            <h1 class="article__title">${Resource.title}</h1>
            <div class="article__infos"><span>${TypeInfos}</span><span>${Authors}</span></div>
            <p class="article__contents"><img class="article__leftimg" src="/Images/PlaceHolder.webp" alt="Un osciloscope (Placeholder Image)">${Resource.post}</p>
        `;
    }
    GetTypeInfo(Type) {
        if (Type == "archive") return `<img class="icon medium" src="/Icons/archive-fill.svg" alt="Archive"> Archive`;
        else if (Type == "encyclopedia") return `<img class="icon medium" src="/Icons/article.svg" alt="Article Encyclopedie"> Article Encyclopedie`;
        else if (Type == "guide") return `<img class="icon medium" src="/Icons/rulers.svg" alt="Guide"> Guide`;
        else if (Type == "news") return `<img class="icon medium" src="/Icons/newspaper.svg" alt="Actualité"> Actualité`;
        else if (Type == "post") return `<img class="icon medium" src="/Icons/post-fill.svg" alt="Poste"> Poste`;
    }
    DisplayError(Error) {
        let ShowToUser = false;
        if (Error.statusCode == 404) ShowToUser = true;
        if (ShowToUser) {
            this.HtmlContainer.innerHTML = `<h1 style="color:red">${Error.message}</h1>`;
        }
        console.error(Error);
    }
    NewError(Message, StatusCode) {
        const NewError = new Error(Message);
        NewError.statusCode = StatusCode;
        return NewError;
    }
}

const Resource = new ResourceClass();