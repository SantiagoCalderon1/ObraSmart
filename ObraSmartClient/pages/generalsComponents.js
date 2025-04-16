function BaseComponent() {
    return {
        view: function () {
            return m("div", content)
        },
    }
}

// ==================== Componentes para la estructura Header ========================================
function HeaderComponent() {
    const menuItems = [
        { label: "Presupuestos", route: "/budgets", icon: "fa-file-signature" },
        { label: "Facturas", route: "/invoices", icon: "fa-file-invoice-dollar" },
        { label: "Materiales", route: "/materials", icon: "fa-shapes" },
        { label: "Proyectos", route: "/projects", icon: "fa-hammer" },
        { label: "Mi Cuenta", route: "/myAccount", icon: "fa-circle-user" },
        { label: "Cerrar Sesión", route: "/logout", icon: "fa-arrow-right-from-bracket", },
    ]
    return {
        view: function () {
            return m('header.navbar.bg-light.fixed-top', {
                style: {
                    height: "7.5vh",
                    width: "100%",
                    boxShadow: "0px 10px 50px rgba(0, 0, 0, 0.2)",
                }
            },
                m('.container-fluid', [
                    //.d-none.d-md-block
                    m("div", { style: { height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" } }, [
                        m('img', { src: './assets/logosObraSmart/logo-1.webp', style: { width: "75px", height: "6vh", cursor: "pointer" }, onclick: () => m.route.set("/home") }),
                        m(MainMenuItems, { items: menuItems }),
                        m('button.navbar-toggler.d-block.d-md-none', {
                            type: 'button',
                            'data-bs-toggle': 'offcanvas',
                            'data-bs-target': '#offcanvasNavbar',
                            'aria-controls': 'offcanvasNavbar'
                        }, m('span.navbar-toggler-icon')),
                        m('.offcanvas.offcanvas-end', {
                            tabindex: '-1',
                            id: 'offcanvasNavbar',
                            'aria-labelledby': 'offcanvasNavbarLabel'
                        }, [
                            m('.offcanvas-header', [
                                m("div.d-flex.align-items-center.gap-3", { style: { cursor: "pointer" }, onclick: () => m.route.set("/home") }, [
                                    m('h5.offcanvas-title', { id: 'offcanvasNavbarLabel' }, 'Ir a inicio'),
                                    m("i.fa-solid.fa-home")
                                ]),
                                m('button.btn-close', {
                                    type: 'button',
                                    'data-bs-dismiss': 'offcanvas',
                                    'aria-label': 'Close'
                                })
                            ]),
                            m(Sidebar, { items: menuItems })
                        ])
                    ]),
                ])
            );
        }
    }

    function Sidebar() {
        return {
            view: function ({ attrs }) {
                return m('div.offcanvas-body', [
                    m("ul.d-md-none.text-end", { style: { height: "100%", width: "100%", maxWidth: "1200px", padding: "0", margin: "0", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "35px" } }, [
                        attrs.items.map(({ label, route, icon }, index) =>
                            m('li', {
                                'data-bs-dismiss': 'offcanvas',
                                style: { width: "100%", textAlign: "end", listStyle: "none", fontWeight: "500", fontSize: "1.5rem", paddingRight: "2rem", paddingTop: index == (attrs.items.length - 1) ? "25px" : "" },
                                onmouseenter: function (e) { e.target.style.fontWeight = "800"; },
                                onmouseleave: function (e) { e.target.style.fontWeight = "500"; },
                            },
                                m(m.route.Link, { href: route, style: { textDecoration: "none", color: "#1d1d1d", paddingRight: "20px" }, }, label), m('i.fa', { class: icon, style: { fontSize: "1.75rem" } }),
                            )
                        )
                    ])
                ])
            }
        }
    }

    function MainMenuItems() {
        return {
            view: function ({ attrs }) {
                return m("ul.d-none.d-md-flex.justify-content-center", { style: { height: "100%", width: "80%", maxWidth: "1200px", padding: "0", margin: "0" } }, [
                    attrs.items.map(({ label, route }) =>
                        m('li', {
                            style: { width: "100%", textAlign: "center", listStyle: "none", fontWeight: "600", fontSize: "1.25rem" },
                            onmouseenter: function (e) { e.target.style.fontWeight = "900"; },
                            onmouseleave: function (e) { e.target.style.fontWeight = "600"; },
                        },
                            m(m.route.Link, { href: route, style: { textDecoration: "none", color: "#1d1d1d" }, }, label)
                        )
                    )
                ])
            }
        }
    }
}

// ==================== Componentes para la estructura Lista ========================================
function TableListComponent() {
    let style = {
        containerStyle: { minHeight: "10vh", maxHeight: "75vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", overflow: "hidden" }
    }

    let localData = []
    let filteredData = []
    let searchValue = ""
    let sortState = {
        campo: null,
        tipo: "asc"
    }

    function orderData(campo) {
        if (sortState.campo === campo) {
            sortState.tipo = sortState.tipo === "asc" ? "desc" : "asc"
        } else {
            sortState.campo = campo
            sortState.tipo = "asc"
        }
        filteredData = [...localData].sort((a, b) => {
            const valA = a[campo]
            const valB = b[campo]
            if (typeof valA === "string") {
                return sortState.tipo === "asc"
                    ? valA.localeCompare(valB)
                    : valB.localeCompare(valA)
            } else {
                return sortState.tipo === "asc"
                    ? valA - valB
                    : valB - valA
            }
        })
        m.redraw()
    }

    function filterData(searchValue) {
        filteredData = localData.filter(item =>
            Object.values(item).some(val =>
                String(val).toLowerCase().includes(searchValue.toLowerCase())
            )
        )
        m.redraw()
    }

    return {
        oninit: function ({ attrs }) {
            localData = attrs.data
            filteredData = [...localData]
        },
        view: function ({ attrs, children }) {
            const onRowClick = attrs.onRowClick
            const columns = attrs.columns

            return m("div.col-11.col-md-10", { style: style.containerStyle }, [
                m("div.col-12", [
                    m("div.row", [
                        m("div.col-12.col-md-6.offset-md-6", {
                            style: { display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: "10px", padding: "10px 20px", }
                        }, [
                            m("div.input-group.flex-nowrap", [children ? children : null,]),
                            m("div.input-group.flex-nowrap", [
                                m("input.form-control", {
                                    type: "text",
                                    placeholder: "Buscar...",
                                    "aria-label": "find",
                                    "aria-describedby": "addon-wrapping",
                                    value: searchValue,
                                    oninput: (e) => {
                                        searchValue = e.target.value
                                        filterData(searchValue)
                                    }
                                }),
                                m("span.input-group-text", {
                                    id: "addon-wrapping",
                                    onclick: (e) => {
                                        e.target.closest(".input-group").querySelector("input").focus()
                                    },
                                }, m("i.fa-solid.fa-magnifying-glass")),
                            ])
                        ])
                    ]),
                    m("div.table-responsive", { style: { maxHeight: "65vh", overflowY: "auto" } }, [
                        m("table.table.table-striped.table-hover", { style: { width: "100%", borderCollapse: "collapse" } }, [
                            m("thead.bg-light.sticky-top", { style: { top: "0", zIndex: "2" } }, [
                                m("tr.text-center", { style: { cursor: "pointer" } },
                                    columns.map((col) => m("th", {
                                        scope: "col",
                                        onclick: () => orderData(col.field)
                                    }, col.title + " ", m("i.fa-solid.fa-sort")))),
                            ]),
                            m("tbody", filteredData.map((item) =>
                                m("tr.text-center", {
                                    style: { cursor: "pointer" },
                                    onclick: () => onRowClick(item),
                                }, [
                                    columns.map((col) => m("td", { style: typeof col.style == "function" ? col.style(item) : {} }, [item[col.field] || "N/A", col.euroSign && item[col.field] ? col.euroSign : ""]))
                                ])
                            )),
                        ]),
                    ]),
                ]),
            ])
        },
    }
}

// ==================== Componentes para la estructura Modal ========================================
function ModalComponent() {
    return {
        view: function ({ attrs, children }) {
            const { idModal, title, addBtnClose } = attrs
            const contentHeaderModal = children[0]
            const contentBodyModal = children[1]
            const contentFooterModal = children[2]

            return m("div.modal.fade", { id: idModal, tabindex: "-1", ariaLabelledby: idModal, ariaHidden: "true", }, [
                m("div.modal-dialog.modal-lg.modal-dialog-centered", [
                    m("div.modal-content", [
                        m("div.modal-header", [
                            m("h1.modal-title.fs-5", { id: "ModalGeneral", style: { fontWeight: "bold" } }, title),
                            m("button.btn-close", { "data-bs-dismiss": "modal", arialLabel: "close", }),
                        ]),
                        contentHeaderModal && m("div.modal-header.d-flex.justify-content-center.gap-2", contentHeaderModal),
                        m("div.modal-body.d-flex.justify-content-center", contentBodyModal ? contentBodyModal : "Cargando detalles..."),
                        m("div.modal-footer", [
                            contentFooterModal ? contentFooterModal : null,
                            addBtnClose && m("button.btn.btn-outline-secondary.mt-3", { "data-bs-dismiss": "modal", style: { fontWeight: "bold" } }, "Cerrar"),
                        ]),
                    ]),
                ]),
            ])
        },
    }
}

// ==================== Componentes para la estructura Botones ========================================




// ==================== Componentes para la estructura Botones ========================================
function ButtonComponent() {
    return {
        view: function ({ attrs, children }) {
            const { iconFirst, text, actions, style, closeModal = false, type = "button", bclass = "btn btn-success mt-3" } = attrs
            return m("button", {
                "data-bs-dismiss": closeModal ? "modal" : "",
                type: type,
                class: `btn mt-3 ${bclass}`,
                onclick: actions,
                style: { fontWeight: "bold", ...style }
            }, iconFirst ? [children, text] : [text, children])
        },
    }
}

// ==================== Exportaciones ========================================

export {
    HeaderComponent,
    TableListComponent,
    ModalComponent,
    ButtonComponent,
}
