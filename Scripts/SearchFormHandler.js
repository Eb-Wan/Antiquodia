class SearchFormClass {
    constructor(SearchFormHtml) {
        this.SearchFormHtml = SearchFormHtml;
        this.SearchFormHtml.addEventListener("submit", (e) => this.Search(e));
    }
    Search(e) {
        e.preventDefault();
        const SearchFormData = new FormData(this.SearchFormHtml);
        const FormEntries = Array.from(SearchFormData);
        const UrlParams = new URLSearchParams();

        //&& peut être utiliser comme condition. Utilisé ici pour filter les param vides
        FormEntries.forEach (Element => Element[1]!="" && UrlParams.append(Element[0], Element[1]));
        if(UrlParams.toString() == "") window.location.href = "/Search.html";
        else window.location.href = "/Search.html?"+UrlParams.toString();
    }
}
const SearchFormInst = new SearchFormClass(document.getElementById("SearchForm"));