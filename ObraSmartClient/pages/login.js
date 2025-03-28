// Global Variabales
const urlLogin = "http://127.0.0.1:8000/api/login"

function LoginPage() {
    return {
        oncreate: () => { window.scrollTo(0, 0); },
        view: function () {
            return m(Main);
        }
    }
}

function Main() {
    let style = { width: "100%", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#f0f0f0" };
    return {
        view: function () {
            return m("main", { style: { ...style } }, m(FormComponent));
        }
    }
}

function FormComponent() {
    let style = {
        containerStyle: { minHeight: "90vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", overflow: "hidden" },
        inputStyle: { width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" },
        buttonStyle: { width: "100%", padding: "10px", borderRadius: "50px", border: "none" },
        primaryButton: { color: "#fff", marginBottom: "10px" },
        secondaryButton: { color: "#fff" },
        badCredentials: { border: "1px solid red", color: "red" },
    }
    return {
        badCredentials: false,
        login: function (e) {
            e.preventDefault()
            let formData = new FormData(e.target);
            m.request({
                method: "POST",
                url: urlLogin,
                body: formData,
                extract: (xhr) => {
                    return {
                        status: xhr.status,
                        response: JSON.parse(xhr.responseText)
                    }
                }
            }).then((data) => {
                console.log("Datos devueltos del back: ", data)
                if (data.status === 200 && data.response.user != null) {
                    this.badCredentials = false
                    localStorage.setItem("auth_token", data.response.token)
                    localStorage.setItem("user", data.response.user.id);
                    console.log("Inicio de sesión exitoso");
                    m.route.set("/home")
                }
                if (data.status === 401 && data.response.user == null) {
                    this.badCredentials = true
                    localStorage.clear()
                    console.log(data.response.message);
                }
                m.redraw()
                console.log("Ningún caso más.");
            }).catch((error) => {
                console.log("Error en la peticíon de login: ", error)
            })
        },
        view: function () {
            return m("div.col-lg-6.col-10", { style: { ...style.containerStyle } }, [
                m("div.g-3", [
                    m("img", { src: "./assets/logosObraSmart/logo-2.png", style: { width: "200px", height: "200px", marginBottom: "40px" } }),
                ]),
                m("div.col-lg-8.col-md-10.col-12", [
                    m("form.row.g-3", { onsubmit: (e) => this.login(e) }, [
                        m("input", { type: "text", name: "email", placeholder: "Username or Email", style: { ...style.inputStyle, ...(this.badCredentials ? style.badCredentials : {}) }}),
                        m("input", { type: "password", name: "password", placeholder: "Password", style: { ...style.inputStyle, ...(this.badCredentials ? style.badCredentials : {}) } }),
                        this.badCredentials ? 
                        m("p", { style: { color: "red", fontSize: "14px" } }, "Usuario o contraseña incorrectos") 
                        : null,
                        m("div.row", [
                            m("div.col-6", { style: { marginBottom: "10px" } }, [
                                m("input", { type: "checkbox", id: "rememberMe" }),
                                m("label", { for: "rememberMe", style: { marginLeft: "5px" } }, "Recuerdame")
                            ]),
                            m("div.col-6.text-end", [m("a", { href: "/forgot-password", style: { textDecoration: "none", color: "#1B8EF2" } }, "¿Olvidaste tu contraseña?")])
                        ]),
                        m("div.col-12", [
                            m("button.primaryBtn", {
                                type: "submit",
                                style: { ...style.buttonStyle, ...style.primaryButton }
                            },
                                "Iniciar Sesión"),
                            m("div", { style: { display: "flex", alignItems: "center", width: "100%" } }, [
                                m("hr", { style: { flex: 1 } }),
                                m("span", { style: { margin: "0 10px" } }, "O"),
                                m("hr", { style: { flex: 1 } })
                            ]),
                            m("div.col-6", { style: { display: "flex", alignItems: "center", justifyContent: "center", width: "100%" } },
                                m("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-evenly", gap: "20px", width: "50%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" } }, [
                                    //m("i.fa-brands.fa-google"),
                                    m("img", { src: "./assets/google-logo.png", style: { width: "30px", height: "30px" } }),
                                    m("span", { style: { paddingLeft: "25px", borderLeft: "1px solid #ccc", textAling: "center" } }, "Inicia sesión con Google")
                                ])
                            ),
                            m("hr"),
                            m("button.secondaryBtn", { style: { ...style.buttonStyle, ...style.secondaryButton }, onclick: () => (window.location.href = "register.html") }, "Crear una cuenta")
                        ]),
                    ])
                ])
            ]);
        }
    };
}

export { LoginPage }