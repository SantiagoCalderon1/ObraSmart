import { HeaderComponent } from "./pages/generalsComponents.js"
import { HomePage } from "./pages/home.js"
import { LoginPage } from "./pages/login.js"
import { BudgetsPage } from "./pages/budgets.js";
/* import { RegisterPage } from "./pages/register.js" 
import { ProfilePage } from "./pages/profile.js" 
import { AboutPage } from "./pages/about.js" 
import { ContactPage } from "./pages/contact.js" 
import { NotFoundPage } from "./pages/notfound.js" 
 */

const urlAuth = "http://127.0.0.1:8000/api/auth"

function isAuthenticated() {
    return localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
}

// Función para proteger rutas con Bearer Token
function authGuard() {
    return {
        oninit: function () {
            const token = isAuthenticated()
            if (!token) {
                console.log("No hay token, redirigiendo a /login")
                m.route.set("/login")
                return
            }
            m.request({
                method: "GET",
                url: urlAuth,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then((data) => {
                console.log("Datos devueltos del backend:", data)
                if (!data.auth) {
                    console.log("Usuario no autenticado, redirigiendo a /login")
                    m.route.set("/login")
                }
            }).catch((error) => {
                console.log("Error en la petición de auth:", error)
                console.log("Token inválido o expirado, redirigiendo a login")
                localStorage.clear()
                sessionStorage.clear()
                m.route.set("/login")
            })
        },
        view: function ({ children }) {
            return [
                m("div", {
                    id: "container-app",
                    style: { display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", width: "100%", height: "100%" }
                }, [
                    isAuthenticated() ? m("header", { id: "header" }, m(HeaderComponent)) : null,
                    m("main", { id: "app", style: { paddingTop: isAuthenticated() ? "7.5vh" : "" } }, children),
                    //isAuthenticated() ? m("footer", { id: "footer" }, m(FooterComponent)) : null
                ])
            ];
        }
    }
}

// Definimos las rutas
const routes = {
    '/': { view: () => m(LoginPage) },
    '/login': { view: () => m(LoginPage) },
    /*     '/register': { view: () => m(RegisterPage) }, */
    // Rutas protegidas (Solo accesibles si está autenticado)
    '/home': { view: () => m(authGuard, m(HomePage)) },
    '/budgets': { view: () => m(authGuard, m(BudgetsPage, { option: "list" })) },
    '/budget/:option/:id': { view: ({attrs}) => m(authGuard, m(BudgetsPage, { option : attrs.option, id: attrs.id})) },

}

// Montamos en app y actualizamos el layout
m.route(document.getElementById("app"), "/login", routes);



