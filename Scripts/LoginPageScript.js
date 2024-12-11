const HtmlForm = document.getElementById("LoginFormId");

class LoginClass {
    constructor(Form) {
        this.Form = Form;
        this.Form.addEventListener("submit", (e) => this.Submit(e))
        this.CheckConnected();
    }
    CheckConnected() {
        //Si l'utilisateur est déjà connecté, redirection vers la page d'accueil
        const Account = JSON.parse(localStorage.getItem("AntiquodiaAccount"));
        if (Account) this.ToHomePage();
    }
    Submit(event) {
        event.preventDefault();
        let LoginData = new FormData(event.target);
        let Email = LoginData.get("EmailInput");
        let Password = LoginData.get("PasswordInput");

        if (Email == "") this.DisplayMessages("Champ adresse Email vide.", event.target);
        if (Password == "") this.DisplayMessages("Champ mot de passe vide.", event.target);
        if (Email == "" || Password == "") return;

        this.ClearMessages(event.target);

        fetch("/Json/TestAccounts.json")
        .then(Response => Response.json())
        .then(Response => {
            let Index = Response.findIndex(e => e.Email == Email  && e.Password == Password)

            if (Index == -1) {
                this.DisplayMessages("L'adresse Email ou le mot de passe est eronné.", event.target);
            } else {
                localStorage.setItem("AntiquodiaAccount", JSON.stringify(Response[Index]));
                this.ToHomePage();
            }
        }).catch (Error => this.DisplayMessages(Error, event.target));
    }
    DisplayMessages(Message, Target) {
        let ErrorMessage = document.getElementById("MessageP");
        if (!(ErrorMessage)) {
            //Si il n'y a pas de message d'érreur
            ErrorMessage = document.createElement("p");
            ErrorMessage.id = "MessageP"
            ErrorMessage.style.color = "red";
            ErrorMessage.style.whiteSpace = "pre";
            
            ErrorMessage.textContent = Message;
            Target.appendChild(ErrorMessage);
        } else {
            //Sinon on revient à la ligne et on ajoute le nouveau message.
            ErrorMessage.textContent += "\r\n" + Message;
        }
    }
    ClearMessages(Target) {
        let ErrorMessage = document.getElementById("MessageP");
        if (ErrorMessage) {
            Target.removeChild(ErrorMessage);
        }
    }
    ToHomePage() {
        window.location.replace("/");
    }
}

const Login = new LoginClass(HtmlForm);