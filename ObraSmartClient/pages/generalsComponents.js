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
                                    columns.map((col) => m("td", { style: typeof col.style == "function" ? col.style(item) : {} },
                                        item[col.field] || "N/A"))
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

// ==================== Componentes para la estructura Formularios ========================================




// ==================== Componentes para la estructura Botones ========================================
function ButtonComponent() {
    return {
        view: function ({ attrs, children }) {
            const { iconFirst, text, actions, style, closeModal = false, type = "button", bclass = "btn btn-success mt-3" } = attrs
            return m("button", {
                "data-bs-dismiss": closeModal ? "modal" : "",
                type: type,
                class: `btn mt-3 ${bclass}`,
                onclick:  actions,
                style: { fontWeight: "bold", ...style }
            }, iconFirst ? [children, text] : [text, children])
        },
    }
}

/* function FormBudgetComponentOriginal() {
    const today = new Date().toISOString().split("T")[0]

    const style = {
        containerStyle: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", overflow: "hidden" }
    };
    const urls = {
        Budgets: "../peticionesApi/dataBudgets.json",
        clients: "../peticionesApi/dataClients.json",
        projects: "../peticionesApi/dataProjects.json",
        BudgetDetails: "../peticionesApi/dataBudgetDetails.json",
    }

    const state = {
        clients: [],
        projects: [],
        filteredClients: [],
        filteredProjects: [],
        conceptItems: [createEmptyConceptItem()],
        selectedBudget: null,
        budgetDetails: [],
        total: 0
    };

    let conceptItems = [createEmptyConceptItem()]
    let localDataClients = [], filteredDataClients = []
    let localDataProjects = [], filteredDataProjects = []
    let localBudgetUpdateDetails = [], filteredBudgetUpdateDetails = []
    let selectedBudgetUpdate
    let total = 0
    let typeForm
    let budget_number

    const status = [
        { value: 1, content: "Pendiente" },
        { value: 2, content: "Aceptado" },
        { value: 3, content: "Rechazado" }
    ]

    // Static taxes
    const taxes = [
        { value: 0, content: "0% IVA" },
        { value: 2, content: "2% IVA" },
        { value: 4, content: "4% IVA" },
        { value: 5, content: "5% IVA" },
        { value: 7.5, content: "7.5% IVA" },
        { value: 10, content: "10% IVA" },
        { value: 21, content: "21% IVA" },
        { value: 0, content: "0% IGIC" },
        { value: 3, content: "3% IGIC" },
        { value: 5, content: "5% IGIC" },
        { value: 7, content: "7% IGIC" },
        { value: 9.5, content: "9.5% IGIC" },
        { value: 13.5, content: "13.5% IGIC" },
        { value: 15, content: "15% IGIC" },
        { value: 20, content: "20% IGIC" },
        { value: 35, content: "21% IGIC" },
        { value: 0, content: "0% IPSI" },
        { value: 0.5, content: "0.5% IPSI" },
        { value: 1, content: "1% IPSI" },
        { value: 2, content: "2% IPSI" },
        { value: 3, content: "3% IPSI" },
        { value: 3.5, content: "3.5% IPSI" },
        { value: 4, content: "4% IPSI" },
        { value: 5, content: "5% IPSI" },
        { value: 6, content: "6% IPSI" },
        { value: 7, content: "7% IPSI" },
        { value: 8, content: "8% IPSI" },
        { value: 9, content: "9% IPSI" },
        { value: 10, content: "10% IPSI" }
    ]

    function () {
        return { description: "", quantity: 0, unitPrice: 0, tax: 0, discount: 0, subtotal: 0 }
    }

    function totalBudget() {
        return conceptItems.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2)
    }

    function filterData(value, type) {
        const filter = (list) =>
            list.filter(item =>
                Object.values(item).some(val =>
                    String(val).toLowerCase().includes(value.toLowerCase())
                )
            )
        if (type === 1) {
            filteredDataClients = filter(localDataClients)
        } else if (type === 2) {
            filteredDataProjects = filter(localDataProjects)
        }
        m.redraw()
    }

    function requestClients() {
        m.request({ method: "GET", url: urls.clients }).then(data => {
            localDataClients = data.map(c => ({
                id: c.id,
                value: c.clients_id_document,
                content: `${c.name} ${c.surname} - ${c.clients_id_document}`
            }))
            filteredDataClients = localDataClients
            m.redraw()
        }).catch(err => console.error("Error clientes:", err))
    }

    function requestProjects() {
        m.request({ method: "GET", url: urls.projects }).then(data => {
            localDataProjects = data.map(p => ({
                id: p.id,
                value: p.id,
                content: `${p.name} - ${p.status}`
            }))
            filteredDataProjects = localDataProjects
            m.redraw()
        }).catch(err => console.error("Error proyectos:", err))
    }

    function requestBudget(budget_number) {
        m.request({ method: "GET", url: urls.Budgets })
            .then((data) => {
                let filtered = data.filter((b) => b.budget_number == budget_number);
                selectedBudgetUpdate = filtered.length > 0 ? filtered[0] : null;
                m.redraw()
            }).catch((error) => console.log("Error al obtener los detalles:", error));
    }

    function requestBudgetsDetails() {
        m.request({ method: "GET", url: urls.BudgetDetails })
            .then((data) => {
                let filtered = data.filter((detail) => detail.budget_id == selectedBudgetUpdate?.id);
                localBudgetUpdateDetails = filtered.length > 0 ? filtered : null;
                console.log("localBudgetUpdateDetails: ", localBudgetUpdateDetails);
                total = localBudgetUpdateDetails?.reduce((sum, item) => sum + item.subtotal, 0)
                console.log("total:", total);
                m.redraw()
            }).catch((error) => console.log("Error al obtener los detalles:", error));
    }


    return {
        oncreate: function ({ attrs }) {
            const { budget_number } = attrs
            // obtener los datos del los conceptos si el formualario es para editar
            if (budget_number) {
                requestBudget(budget_number)
                requestBudgetsDetails()
            }
            // Fetch clients
            requestClients()
            // Fetch projects
            requestProjects()
            m.redraw()
        },
        view: function ({ attrs }) {
            const { typeForm, budget_number } = attrs
            return m("div.col-11.col-md-10", { style: style.containerStyle }, [
                m("div.row.col-12", [
                    m("hr"),
                    m("span.fw-bold.text-uppercase.fs-5", "Cabecera del documento"),
                    m("div.row.col-12.p-0.m-0", [
                        m("div.row.col-md-8.p-0.m-0", [
                            m(InputFilter, { textLabel: "Filtrar clientes...", type: 1 }),
                            m(InputFilter, { textLabel: "Filtrar proyectos...", type: 2 }),
                            m("div.col-md-6", [
                                m(SelectFilter, { textLabel: "Cliente *", type: 1 })
                            ]),
                            m("div.col-md-6", [
                                m(SelectFilter, { textLabel: "Proyecto *", type: 2 })
                            ]),
                        ]),
                        m("div.row.col-md-4.p-0.m-0", [
                            // Estado
                            m("div.col-md-6", [
                                m("label.form-label", "Estado*"),
                                m("select.form-select", {
                                    id: "inputStatus",
                                    "aria-describedby": "inputStatusFeedback",
                                    required: true
                                },
                                    status.map(s => m("option", { value: s.value }, s.content))
                                ),
                                m("div.invalid-feedback", { id: "inputStatusFeedback" }, "Campo Obligatorio")
                            ]),
                            // Número presupuesto
                            m("div.col-md-6", [
                                m("label.form-label", "# Presupuesto*"),
                                m("input.form-control", {
                                    type: "text",
                                    id: "inputNumberBudget",
                                    placeholder: "BUD",
                                    "aria-describedby": "inputNumberBudgetFeedback",
                                    required: true,
                                    minlength: 3,
                                    maxlength: 999
                                }),
                                m("div.invalid-feedback", { id: "inputNumberBudgetFeedback" }, "Mínimo 3 caracteres")
                            ]),
                            // Fechas
                            m("div.col-md-6", [
                                m(InputDate, { textLabel: "Creación *", type: 1 })
                            ]),
                            m("div.col-md-6", [
                                m(InputDate, { textLabel: "Caducidad *", type: 2 })
                            ]),
                        ]),
                    ]),
                    m("input[type=hidden]", { name: "user_id", value: localStorage.getItem("user") }),
                    m("input[type=hidden]", { name: "budget_number", value: "valor aquí" }),
                    m("hr.mt-4"),
                    m("span.fw-bold.text-uppercase.fs-5", "Conceptos"),
                    // Conceptos dinámicos
                    typeForm == "update" ?
                        localBudgetUpdateDetails?.map((item, index) =>
                            m("div.row.col-12.mt-2.p-0.m-0", [
                                m(ConceptItemComponent, { item: item, index: index, taxes: taxes })
                            ])
                        )
                        : conceptItems.map((item, index) =>
                            m("div.row.col-12.mt-2.p-0.m-0", [
                                m(ConceptItemComponent, { item: item, index: index, taxes: taxes })
                            ])
                        ),

                    // Botones añadir/eliminar concepto
                    m("div.col-12.d-flex.justify-content-center", [
                        m("div.col-md-6.d-flex.flex-column.flex-md-row.justify-content-between", [
                            m(ButtonComponent, {
                                class: "btn btn-danger mt-3",
                                onclick: () => conceptItems.length > 1 && conceptItems.pop(),
                                text: "Eliminar concepto"
                            }, m("i.fa.fa-trash-can.me-2.ms-2", { style: { color: "white" } })),
                            m(ButtonComponent, {
                                class: "btn btn-warning mt-3",
                                onclick: () => conceptItems.push(createEmptyConceptItem()),
                                text: "Añadir nuevo concepto"
                            }, m("i.fa.fa-plus.me-2.ms-2"))
                        ])
                    ]),
                    // Total
                    m("hr.mt-4"),
                    m("div.col-12.text-end", [
                        m("strong", `Total presupuesto: ${totalBudget()} €`)
                    ]),
                    // Botón submit
                    m("hr.mt-4"),
                    m("div.col-12.d-flex.justify-content-center", [
                        m("div.col-md-6.d-flex.flex-column.flex-md-row.justify-content-between", [
                            m(ButtonComponent, {
                                iconFirst: true,
                                class: "btn btn-warning mt-3",
                                onclick: () => {
                                    new bootstrap.Modal(document.getElementById("ModalGeneral")).show();
                                    m.redraw();
                                },
                                text: "Volver"
                            }, m("i.fa.fa-arrow-left.me-2.ms-2")),
                            m(ButtonComponent, {
                                type: "submit",
                                class: "btn btn-success mt-3",
                                onclick: () => conceptItems.length > 1 && conceptItems.pop(),
                                text: "Aceptar"
                            }, m("i.fa.fa-check.me-2.ms-2", { style: { color: "white" } })),
                        ])
                    ]),
                ])
            ])
        }
    }

    function InputFilter() {
        return {
            view: function ({ attrs }) {
                const { textLabel, type } = attrs
                return m("div.col-md-6", { style: { display: "flex", flexDirection: "column", alignItems: "start" } }, [
                    m("label.form-label", textLabel),
                    m("div.input-group.flex-nowrap", [
                        m("input.form-control", {
                            type: "text",
                            "aria-label": "find",
                            "aria-describedby": "addon-wrapping",
                            oninput: (e) => filterData(e.target.value, type)
                        }),
                        m("span.input-group-text", {
                            id: "addon-wrapping",
                            onclick: e => e.target.closest(".input-group").querySelector("input").focus()
                        }, m("i.fa-solid.fa-magnifying-glass"))
                    ])
                ])
            }
        }
    }

    function SelectFilter() {

        return {
            view: function ({ attrs }) {
                const { textLabel, type } = attrs
                return [
                    m("label.form-label", textLabel),
                    m("select.form-select", {
                        id: type == 1 ? "inputClient" : "inputProject",
                        "aria-describedby": type == 1 ? "inputClientFeedback" : "inputProjectFeedback",
                        required: true
                    }, [
                        type == "1" ? m(optionUpdate, { typeSelect: "client" }) : m(optionUpdate, { typeSelect: "project" }),
                        type == 1 ?
                            filteredDataClients.map(c => m("option", { value: c.value }, c.content))
                            :
                            filteredDataProjects.map(p => m("option", { value: p.value }, p.content))
                    ]),
                    m("div.invalid-feedback", { id: type == 1 ? "inputClientFeedback" : "inputProjectFeedback" }, "Campo Obligatorio"),
                ]
            }
        }
    }

    function optionUpdate() {
        let value, text
        return {
            oncreate: function ({ attrs }) {
                if (attrs.typeSelect == "client") {
                    console.log("contenido filteredDataClients: ", filteredDataClients);
                    let client = filteredDataClients.filter(cliente => cliente.id === selectedBudgetUpdate?.client_id)
                    value = client.value
                    text = client.content
                } else {
                    console.log("contenido filteredDataProjects: ", filteredDataProjects);
                    let project = filteredDataProjects.filter(project => project.id === selectedBudget?.project_id)
                    console.log("Project =", project);
                    value = project.value
                    text = project.content
                }
            },
            view: function () {
                return m("option", { selected: true, value: value }, text)
            }
        }
    }


    function InputDate() {
        return {
            view: function ({ attrs }) {
                const { textLabel, type } = attrs
                return [
                    m("label.form-label", textLabel),
                    m("input.form-control", {
                        type: "date",
                        id: type == 1 ? "inputDate" : "inputDateExp",
                        min: type == 1 ? "" : today,
                        max: type == 1 ? today : "",
                        required: true,
                        "aria-describedby": type == 1 ? "inputDateFeedback" : "inputDateExpFeedback"
                    }),
                    m("div.invalid-feedback", { id: type == 1 ? "inputDateFeedback" : "inputDateExpFeedback" }, "Fecha inválida.")
                ]
            }
        }
    }


    function ConceptItemComponent() {
        return {
            oninit: ({ attrs }) => {
                attrs.item.subtotal = 0
            },
            view: ({ attrs }) => {
                const { item, index, taxes } = attrs
                function updateSubtotal() {
                    const qty = parseFloat(item.quantity || 0)
                    const price = parseFloat(item.unitPrice || 0)
                    const discount = parseFloat(item.discount || 0)
                    const tax = parseFloat(item.tax || 0)
                    const raw = qty * price
                    const taxed = raw * (1 + tax / 100)
                    item.subtotal = Math.max(taxed - discount, 0)
                    m.redraw()
                }
                return [
                    m("div.col-md-5", [
                        m("label.form-label", `Concepto* #${(index + 1)}`),
                        m("input.form-control", {
                            type: "text",
                            id: `inputConcept-${attrs.index}`,
                            placeholder: "Añadir un concepto",
                            "aria-describedby": `inputConcept-${index}Feedback`,
                            required: true,
                            minlength: 3,
                            maxlength: 999,
                            oninput: e => { item.description = e.target.value }
                        }),
                        m("div.invalid-feedback", { id: `inputConcept-${index}Feedback` }, "Campo requerido*"),
                    ]),
                    m("div.col-md-1", [
                        m("label.form-label", "Cantidad*"),
                        m("input.form-control", {
                            type: "number",
                            id: `inputQuantity-${index}`,
                            required: true,
                            min: 0,
                            max: 999,
                            placeholder: 0,
                            oninput: e => { item.quantity = e.target.value; updateSubtotal() }
                        }),
                        m("div.invalid-feedback", { id: `inputQuantity-${index}Feedback` }, "Campo requerido*"),
                    ]),
                    m("div.col-md-2.text-md-center", [
                        m("label.form-label", "Impuestos*"),
                        m("select.form-select", {
                            id: `inputTax-${index}`,
                            "aria-describedby": `inputTax-${index}Feedback`,
                            required: true,
                            onchange: e => {
                                item.tax = parseFloat(e.target.value || 0)
                                updateSubtotal()
                            }
                        }, [
                            taxes.map(p => {
                                return m("option", { value: p.value }, p.content)
                            })
                        ]
                        ),
                        m("div.invalid-feedback", { id: `inputTax-${index}Feedback` }, "Campo Obligatorio"),
                    ]),
                    m("div.col-md-2", [
                        m("label.form-label", "Descuento"),
                        m("input.form-control", {
                            type: "number",
                            id: `disc-${index}`,
                            min: 0,
                            placeholder: "0€",
                            oninput: e => { item.discount = e.target.value; updateSubtotal() }
                        }),
                        m("div.invalid-feedback", { id: `disc-${attrs.index}Feedback` }, "Valor requerido")
                    ]),
                    m("div.col-md-2.text-md-center", [
                        m("label.form-label", "P/Unitario*"),
                        m("input.form-control", {
                            type: "number",
                            id: `inputPrice-${index}`,
                            "aria-describedby": `inputPrice-${index}Feedback`,
                            required: true,
                            min: 0,
                            step: 0.25,
                            placeholder: "0€",
                            oninput: e => { item.unitPrice = e.target.value; updateSubtotal() }
                        }),
                        m("div.invalid-feedback", { id: `inputPrice-${index}Feedback` }, "Valor requerido*"),
                    ]),
                    m("div.col-md-8.mt-md-2", [
                        m("label.form-label", "Información Adicional"),
                        m("textarea.form-control", {
                            id: `info-${index}`,
                            placeholder: "Opcional...",
                            minlength: 3,
                            style: {
                                height: "38px",
                                resize: ""
                            },
                            oninput: e => {
                                item.additionalInfo = e.target.value;
                            }
                        }),
                        m("div.invalid-feedback", { id: `info-${index}Feedback` }, "Mínimo 3 caracteres")
                    ]),
                    m("div.col-md-2"),
                    m("div.col-md-2.mt-md-2", [
                        m("label.form-label", "Subtotal"),
                        m("input.form-control[readonly]", {
                            value: `${item.subtotal.toFixed(2)} €`
                        })
                    ]),
                    m("div.col-12.mb-3"),
                ]
            }
        }
    }
}
 */
// ==================== Exportaciones ========================================

export {
    HeaderComponent,
    TableListComponent,
    ModalComponent,
    ButtonComponent,
}
