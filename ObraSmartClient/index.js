import { HomePage } from "./pages/home.js";
import { LoginPage } from "./pages/login.js";
import { LogoutPage } from "./pages/logout.js"; 
/* import { RegisterPage } from "./pages/register.js"; 
import { ProfilePage } from "./pages/profile.js"; 
import { AboutPage } from "./pages/about.js"; 
import { ContactPage } from "./pages/contact.js"; 
import { NotFoundPage } from "./pages/notfound.js"; 
 */

const urlAuth = "http://127.0.0.1:8000/api/auth"

const routes = {
    '/': { view: () => m(LoginPage) },
    '/login': { view: () => m(LoginPage) },
    /*     '/register': { view: () => m(RegisterPage) },
     */
    // Rutas protegidas (Solo accesibles si está autenticado)
    '/home': { view: () => m(authGuard, { isProtected: true }, HomePage) },
    '/logout': { view: () => m(authGuard, { isProtected: true }, LogoutPage) },

    /*     '/profile': { view: () => authGuard(ProfilePage, true) },
        '/about': { view: () => authGuard(AboutPage, true) },
        '/contact': { view: () => authGuard(ContactPage, true) }, */

    // Página no encontrada
    /*     '/404': { view: () => m(NotFoundPage) },
     */
};


// Función para proteger rutas con Bearer Token
function authGuard() {
    return {
        oninit: function ({ attrs }) {
            const isProtected = attrs.isProtected;
            const token = localStorage.getItem("auth_token");
            if (!token) {
                console.log("No hay token, redirigiendo a /login");
                m.route.set("/login");
                return;
            }
            m.request({
                method: "GET",
                url: urlAuth,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then((data) => {
                console.log("Datos devueltos del backend:", data);
                if (isProtected && !data.auth) {
                    console.log("Usuario no autenticado, redirigiendo a /login");
                    m.route.set("/login");
                }
            }).catch((error) => {
                console.log("Error en la petición de auth:", error);
                m.route.set("/login");
            });
        },
        view: function ({ children }) {
            return m(...children);
        }
    };
}



// Configuración de rutas en Mithril
m.route(document.body, '/login', routes);
