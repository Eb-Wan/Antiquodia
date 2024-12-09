const SmallWidth = 900;

const FiltersBtn = document.getElementById("FiltersButton");
const FiltersMenu = document.getElementById("FiltersMenu");


/*
    Ceci est une classe qui permet la gestion des menus.
    Menu(OpenButton, Menu, ForSmallDevices)

    OpenButton = L'élément HTML qui activera le menu.

    Menu = L'élément HTML qui sera le menu.

    WidthBehaviour = String (par défaut false) qui défini si le menu doit 
    Si WidthBehaviour = "DisplaySmall" le menu sera uniquement visible sur les
    appareils.
    Mais si WidthBehaviour = "LockLarge" le menu sera toujours visible sur les grands appareils,
    mais refermable sur les petis appareils.
    Sinon WidthBehaviour = false le menu agira toujours normalement.
*/
class Menu {
    constructor(OpenButton, Menu, WidthBehaviour = false) {
        this.OpenButton = OpenButton;
        this.Menu = Menu;
        this.IsOpened = false;
        this.WidthBehaviour = WidthBehaviour;
        this.Enabled = true;
        this.Initialize();
    }
    Initialize() {
        if (this.WidthBehaviour != false) {
            window.addEventListener("resize", () => this.UpdateToScreen());
            this.UpdateToScreen()
        }

        if (this.OpenButton != undefined && this.Menu != undefined) {
            this.OpenButton.addEventListener("click", (e) => {
                e.stopPropagation();
                this.ChangeState();
            });
            document.addEventListener("click", (e) => {
                let IsClickInside = this.Menu.contains(e.target);
                if (!IsClickInside) this.ChangeState(false);
            });

            this.IsOpened = (this.Menu.style.visibility == "hidden") ? false : true;
        }
    }
    ChangeState(SetTo = undefined) {
        if (this.Enabled == true) {
            if (SetTo == undefined) this.IsOpened = !this.IsOpened;
            else this.IsOpened = SetTo;
            
            if (this.IsOpened == false) this.Menu.style.visibility = "hidden";
            else this.Menu.style.visibility = "visible";
        }
    }
    UpdateToScreen() {
        if (window.innerWidth < SmallWidth) {
            this.Enabled = true;
            this.ChangeState(false);
        } else {
            if (this.WidthBehaviour == "DisplaySmall") this.ChangeState(false);
            else if (this.WidthBehaviour == "LockLarge") this.ChangeState(true);
            this.Enabled = false;
        }
    }
}

class Pagination {
    constructor (TotalLength, StartPage, PageLength, CallBack) {
        this.TotalLength = TotalLength;
        this.CurrentPage = StartPage;
        this.PageLength = PageLength;
        this.CallBack = CallBack;
        if (TotalLength > 0 && CallBack != undefined) this.Initialize();
    }
    Initialize() {
        this.LastPage = Math.ceil(this.TotalLength / this.PageLength);
        const ResultSection = document.getElementById("ResultSection");
        if (ResultSection == undefined) return;
        let PaginationDiv = document.createElement("div");
        PaginationDiv.className = "pagination";
        PaginationDiv.appendChild(this.CreatePrevious());
        PaginationDiv.appendChild(this.CreateInput());
        PaginationDiv.appendChild(this.CreateTotal());
        PaginationDiv.appendChild(this.CreateNext());
        ResultSection.appendChild(PaginationDiv);
        this.ChangePage();
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
        Element.addEventListener("keyup", (e) => this.PageInput(e));
        return Element;
    }
    CreateTotal() {
        let Element = document.createElement("span");
        Element.className = "pagination__total";
        Element.innerHTML = "/ " + this.LastPage;
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
        if (Value < 1) {
            event.target.value = 1;
        } else if (Value > this.LastPage) {
            event.target.value = this.LastPage;
        } else {
            this.ChangePage(Value);
        }
    }
    PageButton(Direction) {
        let Value = this.CurrentPage + Direction;
        if (Value < 1) {
            Value = 1;
        } else if (Value > this.LastPage) {
            Value = this.LastPage;
        }
        this.ChangePage(Value);
    }
    ChangePage(Value = 1) {
        if (Value <= 1) {
            document.getElementById("PaginationPrevious").disabled = true;
            document.getElementById("PaginationNext").disabled = false;
        } else if (Value >= this.LastPage) {
            document.getElementById("PaginationPrevious").disabled = false;
            document.getElementById("PaginationNext").disabled = true;
        } else {
            document.getElementById("PaginationPrevious").disabled = false;
            document.getElementById("PaginationNext").disabled = false;
        }
        document.getElementById("PaginationInput").value = Value;

        this.CurrentPage = Value;
        let Start = (Value - 1) * this.PageLength;
        this.CallBack(Start, Start + this.PageLength);
    }
}


const FiltersMenuInstance = new Menu(FiltersBtn, FiltersMenu, "LockLarge");
// const HeaderMenuInstance = new Menu(, , false);
export {Pagination};