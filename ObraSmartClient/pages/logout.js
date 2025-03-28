const urlLogout = "http://127.0.0.1:8000/api/logout"

function LogoutPage() {
    return {
        view: function () {
            return m("button", {onclick: () => logout()}, "Boton de cerrar sesión");
        }
    };
}

function logout() {
    const token = localStorage.getItem("auth_token");
    if (!token) {
        console.log("No hay token, redirigiendo a /login");
        m.route.set("/login");
        return;
    }
    m.request({
        method: "POST",
        url: urlLogout,
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }).then((data) => {
        console.log("Datos devueltos del backend:", data);
        m.route.set("/login");

    }).catch((error) => {
        console.log("Error en la petición de auth:", error);
        m.route.set("/login");
    });
}

export { LogoutPage }