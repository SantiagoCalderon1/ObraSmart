import { LoginPage } from "./login.js";

const routes = {
    '/inicio': { view: () => m(HomePage)},
    '/login': { view: () => m(LoginPage)},
    '/register': { view: () => m(RegisterPage)},
    '/logout': { view: () => m(LogoutPage)},
    '/profile': { view: () => m(ProfilePage)},
    '/about': { view: () => m(AboutPage)},
    '/contact': { view: () => m(ContactPage)},
    '/404': { view: () => m(NotFoundPage)},
}

m.route(document.body, '/login', routes)
