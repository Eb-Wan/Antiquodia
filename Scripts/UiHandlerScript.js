const SmallWidth = 900;

/*
    Ceci est une classe qui permet la gestion des menus.
    Menu(OpenButton, Menu, WidthBehaviour)

    OpenButton = L'élément HTML qui activera le menu.

    Menu = L'élément HTML qui sera le menu.

    WidthBehaviour = String (par défaut false) qui défini comment le menu va
    agir selon différentes résolutions d'écran
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
            //Si un WidthBehaviour a été défini
            window.addEventListener("resize", () => this.UpdateToScreen());
            this.UpdateToScreen();
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
            //Si la taille est plus petite que le breakpoint SmallWidth, on active le menu et le cache.
            this.Enabled = true;
            this.ChangeState(false);
        } else {
            //Sinon selon le comportement désiré, on affiche ou non le menu. Et après on le désactive.
            if (this.WidthBehaviour == "DisplaySmall") this.ChangeState(false);
            else if (this.WidthBehaviour == "LockLarge") this.ChangeState(true);
            this.Enabled = false;
        }
    }
}


/*
    Ceci est une classe qui gère le header. Elle verifie si l'utilisateur est connecté.
    Si oui, le header qui sera ajouté est le AccountHeader avec pour le moment, un menu qui contient un bouton de déconnection
    Si non, le header sera GestUser
*/
class Header {
    constructor() {
        this.Account = JSON.parse(localStorage.getItem("AntiquodiaAccount"));
        this.IsConnected = (this.Account) ? true : false;
        this.HtmlBody = document.querySelector("body");
        this.DisplayHeader();
    }
    DisplayHeader() {
        if (!this.HtmlBody) return;
        if (this.IsConnected) this.AccountHeader();
        else this.GestHeader();
    }
    AccountHeader() {
        let AccountButton = this.CreateButton("iconbutton", `<img class="icon" src="./Icons/person-fill.svg" alt="Icône Compte">`)
        let AccountMenu = this.CreateAccountMenu();
        const AccountMenuInst = new Menu(AccountButton, AccountMenu, false); //Cette classe va gérer le menu (afficher/cacher)

        let Header = document.createElement("header");
        Header.className = "mainheader";
        Header.innerHTML = `
            <div class="mainheader__container">
                <a href="./index.html"><img class="headerlogo" src="./Images/LogoMedium.webp" alt="Logo du site" width="auto" height="40px"></a>
            </div>
        `;

        let HeaderTools = document.createElement("div");
        HeaderTools.className = "mainheader__container";

        HeaderTools.appendChild(AccountButton);
        HeaderTools.appendChild(AccountMenu);
        HeaderTools.appendChild(this.CreateButton("iconbutton", `<img class="icon" src="./Icons/three-dots-vertical.svg" alt="Icône Menu">`, this.PlaceHolder));
        
        Header.appendChild(HeaderTools);
        this.HtmlBody.prepend(Header);
    }
    GestHeader() {
        let Header = document.createElement("header");
        Header.className = "mainheader";

        Header.innerHTML = `
            <div class="mainheader__container">
                <a href="./index.html"><img class="headerlogo" src="./Images/LogoMedium.webp" alt="Logo du site" width="auto" height="40px"></a>
            </div>
            <div class="mainheader__container">
                <a class="linkbutton mainheader__btn" href="/Login.html">Connexion</a>
                <button class="iconbutton"><img class="icon" src="./Icons/three-dots-vertical.svg" alt="Icône Menu" width="22px" height="22px"></button>
            </div>
        `;

        this.HtmlBody.prepend(Header);
    }
    CreateButton (Class, Contents, CallBack) {
        let NewButton = document.createElement("button");
        NewButton.className = Class;
        NewButton.innerHTML = Contents;
        if (CallBack) NewButton.addEventListener("click", (e) => CallBack(e));
        return NewButton;
    }
    CreateAccountMenu() {
        let NewMenu = document.createElement("div");
        NewMenu.className = "menu boxshadow";
        NewMenu.style = "visibility: hidden;";
        NewMenu.innerHTML = `
            <span class="menu__title">Bienvenue ${this.Account.Name} !</span>
            <a class="linkbutton" href="/Deconnect.html">Déconnexion</a>
        `;
        return NewMenu;
    }
    PlaceHolder() {
        console.log("This method does nothing. It's just here as a placeholder.")
    }
}

const FiltersBtn = document.getElementById("FiltersButton");
const FiltersMenu = document.getElementById("FiltersMenu");
const FiltersMenuInstance = new Menu(FiltersBtn, FiltersMenu, "LockLarge");

const HeaderInstance = new Header();