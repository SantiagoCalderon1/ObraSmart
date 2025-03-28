
function HomePage() {
    return {
        view: function () {
            return m("p", localStorage.getItem("auth_token") + " - " + JSON.stringify(JSON.parse(localStorage.getItem("user")), null, 2));
        }
    }
}

export { HomePage}