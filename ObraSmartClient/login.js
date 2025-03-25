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
        containerStyle: { height: "85%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", overflow: "hidden" },
        inputStyle: { width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" },
        buttonStyle: { width: "100%", padding: "10px", borderRadius: "50px", border: "none" },
        primaryButton: { color: "#fff", marginBottom: "10px" },
        secondaryButton: { color: "#fff" }
    };

    return {
        view: function () {
            return m("div.col-lg-8.col-10", { style: { ...style.containerStyle } }, [
                m("div.g-3", [
                    m("img", { src: "./assets/logosObraSmart/logo-2.png", style: { width: "200px", height: "200px", marginBottom: "50px" } }),
                ]),
                m("div.col-lg-8.col-md-10.col-12", [
                    m("form.row.g-3", { onsubmit: (e) => e.preventDefault() }, [
                        m("input", { type: "text", placeholder: "Username or Email", style: { ...style.inputStyle } }),
                        m("input", { type: "password", placeholder: "Password", style: { ...style.inputStyle } }),
                        m("div.row", [
                            m("div.col-6", { style: { marginBottom: "10px" } }, [
                                m("input", { type: "checkbox", id: "rememberMe" }),
                                m("label", { for: "rememberMe", style: { marginLeft: "5px" } }, "Recuerdame")
                            ]),
                            m("div.col-6.text-end", [
                                m("a", { href: "/forgot-password", style: { textDecoration: "none", color: "#1B8EF2" } }, "¿Olvidaste tu contraseña?")
                            ])
                        ]),
                        m("div.col-12", [
                            m("button.primaryBtn", { style: { ...style.buttonStyle, ...style.primaryButton } }, "Iniciar Sesión"),
                            m("button.secondaryBtn", { style: { ...style.buttonStyle, ...style.secondaryButton }, onclick: () => (window.location.href = "register.html") }, "Registrate")
                        ]),
                    ])
                ])
            ]);
        }
    };
}

export { LoginPage }