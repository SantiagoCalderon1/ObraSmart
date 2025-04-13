const urlLogout = "http://127.0.0.1:8000/api/logout"

function Logout() {
    const token = localStorage.getItem("auth_token")
    if (token) {
        m.request({
            method: "POST",
            url: urlLogout,
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then((data) => {
            console.log("Datos devueltos del backend:", data)
        }).catch((error) => {
            console.log("Error en la petición de auth:", error)
        }).finally(() =>{
            localStorage.clear()
            sessionStorage.clear()
        })
    } else {
        console.log("No hay token, redirigiendo a /login")
        localStorage.clear()
        sessionStorage.clear()
    }
    m.route.set("/login")
}

export { Logout }