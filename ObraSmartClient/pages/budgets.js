import { TableListComponent, ModalComponent, ButtonComponent } from "./generalsComponents.js";

//Varibales Globales

/* 
Json de prueba

let urlBudgets = "../peticionesApi/dataBudgets.json";
let urlBudgetDetails = "../peticionesApi/dataBudgetDetails.json";
*/

//Api Real
const urlBudgets = "http://127.0.0.1:8000/api/budgets"
const urlBudgetDetails = "http://127.0.0.1:8000/api/budgets-details/"
const token = localStorage.getItem("token") || sessionStorage.getItem("token")

function BudgetsPage() {
    let style = { width: "100%", minHeight: "92.5vh", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#f0f0f0", paddingBottom: '50px' };
    return {
        oncreate: () => { window.scrollTo(0, 0); },
        view: function ({ attrs }) {
            let content;
            switch (attrs.option) {
                case "list":
                    content = m(BudgetsListPage);
                    break;
                case "create":
                    content = m(BudgetsFormCreatePage);
                    break;
                case "update":
                    content = m(BudgetsFormUpdatePage, { budget_number: attrs.id });
                    break;
                default:
                    content = m("div", "Vista no encontrada");
            }
            return m("div", { style: { ...style } }, [
                content
            ]);
        }
    }
}

function BudgetsListPage() {
    let selectedBudget = null;
    let selectedBudgetDetails = null
    return {
        view: function () {

            return [
                m("h1", { style: { padding: "30px 0", textTransform: "uppercase" } }, "Presupuestos"),
                m(BudgetsListComponent, {
                    onBudgetSelect: (budget, data) => {
                        selectedBudget = budget; selectedBudgetDetails = data;
                        m.redraw();
                    }
                }),
                m(BudgetModalDetailsComponent, {
                    idModal: "ModalDetailsBudgetsList",
                    tituloModal: `Detalles Presupuesto #${selectedBudget?.budget_number}`,
                    budget: selectedBudget,
                    budgetDetails: selectedBudgetDetails
                }),
                m(BudgetModalConfirmation, {
                    idModal: "ModalDeleteBudget",
                    tituloModal: "Confirmación de eliminación",
                    mensaje: `¿Está seguro de eliminar el presupuesto con #${selectedBudget?.budget_number}?`,
                    actions: () => {
                        m.request({ method: "DELETE", url: urlBudgets + "/" + selectedBudget?.budget_id, headers: { "Authorization": `Bearer ${token}` } })
                            .then((data) => {
                                console.log("Data de eliminación: ", data);
                                m.redraw();
                            }).catch(() => { //console.log("Error al obtener los datos de budgets: ", error); 
                            });
                        m.route.set("/budgets");
                        m.redraw();
                    },
                }),
            ]
        }
    }
}

function BudgetsFormCreatePage() {
    return {
        view: function () {
            return [
                m("h1", { style: { padding: "30px 0", textTransform: "uppercase" } }, "Nuevo Presupuesto"),
                m(FormBudgetComponent, { typeForm: "create" }),
                m(BudgetModalConfirmation, {
                    idModal: "ModalCancelationBudget",
                    tituloModal: "Confirmación de cacelación",
                    mensaje: "¿Está seguro de cancelar la creación del nuevo presupuesto?",
                    actions: () => {
                        m.route.set("/budgets");
                        m.redraw();
                    }
                })
            ]
        }
    }
}

function BudgetsFormUpdatePage() {
    return {
        view: function ({ attrs }) {
            return [
                m("h1.text-center", { style: { padding: "30px 0", textTransform: "uppercase" } }, `Actualizando el Presupuesto ${attrs.budget_number}`),
                m(FormBudgetComponent, { typeForm: "update", budget_number: attrs.budget_number }),
                m(BudgetModalConfirmation, {
                    idModal: "ModalCancelationBudget",
                    tituloModal: "Confirmación de cancelación",
                    mensaje: "¿Está seguro de cancelar la actualización del presupuesto?",
                    actions: () => {
                        m.route.set("/budgets");
                        m.redraw();
                    }
                })
            ]
        }
    }
}

function BudgetsListComponent() {
    let budgets = [];

    return {
        oncreate: function () {
            m.request({ method: "GET", url: urlBudgets, headers: { "Authorization": `Bearer ${token}` } })
                .then((data) => {
                    budgets = data.map((item, i) => ({ ...item, index: i + 1 }));
                    m.redraw();
                }).catch(() => { //console.log("Error al obtener los datos de budgets: ", error); 
                });
        },
        view: function ({ attrs }) {
            if (budgets.length === 0) {
                return m("div.d-flex.justify-content-center.align-items-center", { style: { height: "30vh" } }, [
                    m("div.spinner-border.text-primary", { role: "status" }, [
                        m("span.visually-hidden", "Cargando...")
                    ])
                ]);
            }
            const columns = [
                { title: "#", field: "index" },
                { title: "Número Presupuesto", field: "budget_number" },
                {
                    title: "Estado", field: "status", style: (item) => {
                        return {
                            fontWeight: "bold",
                            textTransform: "uppercase",
                            color: item.status === "Aceptado"
                                ? "green"
                                : item.status === "Rechazado"
                                    ? "red"
                                    : "black"
                        }
                    }
                },
                { title: "ID Cliente", field: "client_id" },
                { title: "ID Proyecto", field: "project_id" },
                { title: "Total", field: "total", euroSign: "€" },
                { title: "Fecha", field: "date" }
            ];

            const onRowClick = (budget) => {
                m.request({ method: "GET", url: urlBudgetDetails + budget.budget_id, headers: { "Authorization": `Bearer ${token}` } })
                    .then((data) => {
                        attrs.onBudgetSelect(budget, data)
                        new bootstrap.Modal(document.getElementById("ModalDetailsBudgetsList")).show();
                        m.redraw()
                    })
                    .catch(() => { attrs.onBudgetSelect(budget, null); new bootstrap.Modal(document.getElementById("ModalDetailsBudgetsList")).show() })

            }
            return [
                m(TableListComponent, { columns: columns, data: budgets, onRowClick: onRowClick },
                    [m(ButtonComponent, { actions: () => m.route.set("/budget/create/0"), text: "Crear Presupuesto" })]
                )
            ]
        }
    };
}

function BudgetModalDetailsComponent() {
    return {
        view: function ({ attrs }) {
            const { idModal, tituloModal, budget, budgetDetails } = attrs
            //console.log("Content de atrrs: ", attrs);

            let total = 0
            if (budgetDetails) {
                total = budgetDetails.reduce((sum, item) => sum + Number(item.subtotal), 0);
            }

            const columns = [
                { title: "Concepto", field: "concept" },
                { title: "Descripción", field: "description" },
                { title: "Cantidad", field: "quantity" },
                { title: "Impuestos", field: "tax" },
                { title: "Descuento", field: "discount", euroSign: "€" },
                { title: "P/U", field: "unit_price", euroSign: "€" },
                { title: "Subtotal", field: "subtotal", euroSign: "€" }
            ];

            const ContentHeaderModal = () =>
                [
                    m(ButtonComponent, {
                        closeModal: true, bclass: "btn-danger", text: "Eliminar Presupuesto",
                        actions: () => new bootstrap.Modal(document.getElementById("ModalDeleteBudget"), { backdrop: true }).show()
                    },
                        m("i.fa-solid.fa-trash-can", { style: { color: "white" } })
                    ),
                    m(ButtonComponent, {
                        closeModal: true, bclass: "btn-warning", text: "Editar Presupuesto ",
                        actions: () => m.route.set(`/budget/update/${budget.budget_number}`)
                    },
                        m("i.fa-solid.fa-pen-to-square")
                    )]

            const ContentBodyModal = () =>
                m("div.table-responsive", { style: { maxHeight: "55vh", overflowY: "auto" } }, [
                    m("table.table.table-striped.table-hover", { style: { width: "100%", borderCollapse: "collapse" }, }, [
                        m("thead.bg-light.sticky-top", [
                            m("tr.text-center",
                                m("th", { scope: "col" }, "#"),
                                columns.map((col) => m("th", { scope: "col" }, col.title))
                            ),
                        ]),
                        m("tbody",
                            budgetDetails
                                ? budgetDetails.map((detail, index) =>
                                    m("tr.text-center", [m("td", (index + 1)), columns.map((col) => m("td", [detail[col.field] || "N/A", col.euroSign && detail[col.field] ? col.euroSign : ""]))])
                                )
                                : m("tr.text-center", m("td[colspan=8]", "No hay detalles disponibles"))),
                        m("tfoot", [
                            m("tr", m("th[colspan=8].text-end", `Total ${(+total).toFixed(2)} €`))
                        ])
                    ]),
                ])

            const ContentFooterModal = () =>
                m(ButtonComponent, { bclass: "btn-outline-danger", text: "Descargar PDF ", },
                    m("i.fa-solid.fa-file-pdf", { style: { color: "red" } })
                )

            return m(ModalComponent, {
                idModal: idModal,
                title: tituloModal,
                addBtnClose: true,
                slots: {
                    header: ContentHeaderModal(),
                    body: ContentBodyModal(),
                    footer: ContentFooterModal(),
                }
            })
        }
    }
}

function BudgetModalConfirmation() {
    return {
        view: function ({ attrs }) {
            const { idModal, tituloModal, mensaje, actions } = attrs

            const ContentBodyModal = () =>
                m("p.text-center", mensaje)
            const ContentFooterModal = () =>
                m("div.col-12.d-flex.justify-content-center", [
                    m("div.col-md-6.d-flex.flex-md-row.justify-content-between", [
                        m("button.btn.btn-danger.mt-3.me-2", { "data-bs-dismiss": "modal", style: { fontWeight: "bold" } }, "Cancelar"),
                        m(ButtonComponent, {
                            closeModal: true,
                            class: "btn btn-success ",
                            actions: actions,
                            text: "Aceptar"
                        })
                    ])
                ])
            return m(ModalComponent, {
                idModal: idModal,
                title: tituloModal,
                slots: {
                    body: ContentBodyModal(),
                    footer: ContentFooterModal(),
                }
            })
        }
    }
}


function FormBudgetComponent() {

    const style = {
        containerStyle: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", overflow: "hidden" }
    }

    const today = new Date().toISOString().split("T")[0];

    const urls = {
        clients: "../peticionesApi/dataClients.json",
        projects: "../peticionesApi/dataProjects.json",
        BudgetDetails: "../peticionesApi/dataBudgetDetails.json",
        Budgets: "../peticionesApi/dataBudgets.json"
    };

    // Impuestos estaticos
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
        { value: 35, content: "35% IGIC" },
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

    // Opciones de estado
    const statusOptions = [
        { value: "Aceptado", content: "Aceptado" },
        { value: "Pendiente", content: "Pendiente" },
        { value: "Rechazado", content: "Rechazado" },
    ];

    const createHeaderDocument = ({
        inputClient = "",
        inputProject = "",
        inputStatus = "Pendiente",
        inputCreation = today,
        inputExpiration = today,
    } = {}) => ({
        inputClient,
        inputProject,
        inputStatus,
        inputCreation,
        inputExpiration,
    });

    const createConcept = ({
        concept = "",
        quantity = 0,
        unit_price = 0,
        description = "",
        tax = 0,
        discount = 0,
        subtotal = 0
    } = {}) => ({
        concept,
        quantity,
        unit_price,
        description,
        tax,
        discount,
        subtotal
    });

    const state = {
        clients: [],
        projects: [],
        conceptItems: [createConcept()],
        selectedBudget: null,
        budgetDetails: [],
        filterClients: "",
        filterProjects: "",
        headerDocumentUpdate: [],
        conceptItemsUpdate: []
    };


    const fetchData = (url, mapFn = (x) => x) =>
        m.request({ method: "GET", url }).then(data => mapFn(data)).catch(/* console.error */);

    const totalBudget = () =>
        state.conceptItems.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2);

    const updateConceptSubtotal = (item) => {
        const pBruto = item.quantity * item.unit_price
        const pNeto = pBruto * (1 + parseFloat(item.tax || 0) / 100)
        item.subtotal = Math.max(pNeto - item.discount, 0)
        m.redraw()
    };

    return {
        badForm: false,
        login: function (e) {
            e.preventDefault();
            let loginData = {
                email: e.target.email.value,
                password: e.target.password.value,
            };
            ////console.log("Enviando datos: ", JSON.stringify(loginData));
            m.request({
                method: "POST",
                url: urlLogin,
                body: loginData,
                extract: (xhr) => {
                    return {
                        status: xhr.status,
                        response: JSON.parse(xhr.responseText)
                    }
                }
            }).then((data) => {
                if (data.status === 200 && data.response.user != null) {
                    this.badCredentials = false;

                }
                if (data.status === 401 && data.response.user == null) {
                    this.badForm = true;

                }
                m.redraw();
            }).catch(() => {
            });
        },
        oncreate: ({ attrs }) => {
            const { budget_number } = attrs;

            fetchData(urls.clients, data => {
                state.clients = data.map(c => ({
                    id: c.id,
                    value: c.id,
                    label: `${c.name} ${c.surname} - ${c.clients_id_document}`
                }));
                m.redraw();
            });

            fetchData(urls.projects, data => {
                state.projects = data.map(p => ({
                    id: p.id,
                    value: p.id,
                    label: `${p.name} - ${p.status}`
                }));
                m.redraw();
            });

            if (budget_number) {
                fetchData(urls.Budgets).then(budgets => {
                    state.selectedBudget = budgets.find(b => b.budget_number == budget_number);
                    //console.log("Contenido de state.selectedBudget", state.selectedBudget);
                    state.headerDocumentUpdate = [
                        createHeaderDocument({
                            inputClient: state.selectedBudget.client_id,
                            inputProject: state.selectedBudget.project_id,
                            inputStatus: state.selectedBudget.status,
                            inputCreation: today,
                            inputExpiration: today,
                        })]
                    //console.log("Contenido de state.headerDocumentUpdate", state.headerDocumentUpdate);

                    return fetchData(urls.BudgetDetails);
                }).then(details => {
                    state.budgetDetails = details.filter(d => d.budget_id === state.selectedBudget?.id);
                    //console.log("Contenido de state.budgetDetails", state.budgetDetails);
                    state.conceptItemsUpdate = state.budgetDetails.map((item) =>
                        createConcept({
                            concept: item.concept,
                            quantity: item.quantity,
                            unit_price: item.unit_price,
                            description: item.description,
                            tax: item.tax,
                            discount: item.discount,
                            subtotal: item.subtotal
                        })
                    )
                    //console.log("Contenido de state.conceptItemsUpdate", state.conceptItemsUpdate);
                    m.redraw();
                });
            }
        },

        view: ({ attrs }) => {
            const { typeForm } = attrs;

            const filterList = (list, keyword) =>
                list.filter(item => Object.values(item).some(val => String(val).toLowerCase().includes(keyword.toLowerCase())));

            const renderInputGroup = (label, filterKey, icon = "fa-magnifying-glass") =>
                m("div.col-md-4.d-flex.flex-column.align-items-start", [
                    m("label.form-label", label),
                    m("div.input-group.flex-nowrap", [
                        m("input.form-control", { oninput: e => state[filterKey] = e.target.value }),
                        m("span.input-group-text", { onclick: e => e.target.closest(".input-group").querySelector("input").focus() }, m("i.fa", { class: icon }))
                    ])
                ]);

            const renderSelect = (label, options, id, bclass = "col-md-4", type = 1) =>
                m("div", { class: bclass }, [
                    m("label.form-label", label),
                    m("select.form-select", {
                        id: id,
                        value: state.headerDocumentUpdate[0]?.[id],
                        onchange: e => { state.headerDocumentUpdate[0][id] = e.target.value; m.redraw(); },
                    },
                        options.map(opt => m("option", { value: opt.value }, opt.label || opt.content))
                    )
                ]);

            const renderInputDate = (label, type, id) =>
                m("div.col-md-2", [
                    m("label.form-label", label),
                    m("input.form-control", {
                        type: "date",
                        id: id,
                        value: state.headerDocumentUpdate[0]?.[id] || today,
                        oninput: e => {
                            state.headerDocumentUpdate[0][id] = e.target.value;
                            m.redraw();
                        },
                        min: type == 1 ? "" : today,
                        max: type == 1 ? today : "",
                    })
                ])

            // Grupo de conceptos
            const renderConcept = (item, index) =>
                m("div.row.col-12.mt-3.p-0.m-0", [
                    // Concepto
                    m("div.col-md-6", [
                        m("label.form-label", `Concepto* #${index + 1}`),
                        m("input.form-control", {
                            id: `concept-${index}`,
                            value: item.concept,
                            oninput: e => item.concept = e.target.value
                        })
                    ]),
                    // Cantidad
                    m("div.col-md-2", [
                        m("label.form-label", "Cantidad *"),
                        m("input.form-control", {
                            type: "number",
                            placeholder: "0",
                            min: 0,
                            id: `quantity-${index}`,
                            value: item.quantity,
                            oninput: e => { item.quantity = +e.target.value; updateConceptSubtotal(item); }
                        })
                    ]),
                    // Descuentos
                    m("div.col-md-2", [
                        m("label.form-label", "Descuento"),
                        m("input.form-control", {
                            type: "number",
                            placeholder: "0 €",
                            id: `discount-${index}`,
                            value: item.discount,
                            oninput: e => { item.discount = +e.target.value; updateConceptSubtotal(item); }
                        })
                    ]),
                    // Precio unitario
                    m("div.col-md-2", [
                        m("label.form-label", " P / U *"),
                        m("input.form-control", {
                            type: "number",
                            placeholder: "0",
                            min: 0,
                            id: `price-${index}`,
                            value: item.unit_price,
                            oninput: e => { item.unit_price = +e.target.value; updateConceptSubtotal(item); }
                        })
                    ]),
                    // Descripción
                    m("div.col-md-6.mt-2", [
                        m("label.form-label", "Descripción"),
                        m("textarea.form-control", {
                            id: `description-${index}`,
                            style: {
                                height: "38px",
                            },
                            placeholder: "Opcional...",
                            value: item.description,
                            oninput: e => item.description = e.target.value
                        })
                    ]),
                    m("div.col-md-2"),
                    // Select de impuestos
                    m("div.col-md-2.mt-2", [
                        m("label.form-label", "Impuestos"),
                        m("select.form-select", {
                            id: `tax-${index}`,
                            value: item.tax,
                            onchange: e => { item.tax = e.target.value; m.redraw(); },
                        },
                            taxes.map(opt => m("option", { value: opt.value }, opt.label || opt.content))
                        )
                    ]),
                    // Suub Total
                    m("div.col-md-2.mt-2", [
                        m("label.form-label", "SubTotal"),
                        m("input.form-control[readonly]", { id: `subtotal-${index}`, value: `${item.subtotal.toFixed(2)} €` })
                    ])
                ])

            // Btns Eliminar y Añadir concepto
            const btnsAction = () =>
                m("div.col-12.mt-3.d-flex.justify-content-center", [
                    m("div.col-md-6.d-flex.flex-column.flex-md-row.justify-content-between", [
                        m(ButtonComponent, {
                            text: "Eliminar concepto",
                            bclass: "btn btn-danger ",
                            actions: () => typeForm == "update" ? state.conceptItemsUpdate.pop() : state.conceptItems.pop(),
                        }, m("i.fa.fa-trash-can.me-2.ms-2", { style: { color: "white" } })),
                        m(ButtonComponent, {
                            text: "Añadir concepto",
                            bclass: "btn-warning ",
                            actions: () => typeForm == "update" ? state.conceptItemsUpdate.push(createConcept()) : state.conceptItems.push(createConcept()),
                        }, m("i.fa.fa-plus.me-2.ms-2"))
                    ])
                ])

            // Btns volver y aceptar
            const btnsFoot = () =>
                m("div.col-12.d-flex.justify-content-center", [
                    m("div.col-md-6.d-flex.flex-column.flex-md-row.justify-content-between", [
                        m(ButtonComponent, {
                            iconFirst: true,
                            text: "Volver",
                            bclass: "btn-warning ",
                            actions: () => new bootstrap.Modal(document.getElementById("ModalCancelationBudget")).show()
                            ,
                        }, m("i.fa.fa-arrow-left.me-2.ms-2")),
                        m(ButtonComponent, {
                            text: "Aceptar",
                            type: "submit",
                            class: "btn-success ",
                        }, m("i.fa.fa-check.me-2.ms-2", { style: { color: "white" } })),
                    ])
                ])


            //Formulario completo y renderizado
            return m("div.col-11.col-md-10", { style: style.containerStyle }, [
                m("form.row.col-12", { onsubmit: (e) => this.login(e) }, [
                    m("hr"),
                    m("span.fw-bold.text-uppercase.fs-5", "Cabecera del documento"),
                    m("div.row.col-12.p-0.m-0", [
                        renderInputGroup("Filtrar clientes", "filterClients"),
                        renderInputGroup("Filtrar proyectos", "filterProjects"),
                        renderSelect("Estado", statusOptions, "inputStatus"),
                        renderSelect("Cliente", filterList(state.clients, state.filterClients), "inputClient",),
                        renderSelect("Proyecto", filterList(state.projects, state.filterProjects), "inputProject",),
                        renderInputDate("Creación*", 1, "inputCreation",),
                        renderInputDate("Expiración*", 2, "inputExpiration",),
                        m("hr.mt-4")
                    ]),

                    m("h5", "Conceptos"),
                    // Conceptos dinámicos
                    typeForm == "update" ? state.conceptItemsUpdate.map(renderConcept) : state.conceptItems.map(renderConcept),
                    // Botones añadir/eliminar concepto
                    btnsAction(),
                    // Total
                    m("hr.mt-4"),
                    m("div.col-12.text-end", [m("h5", `Total presupuesto: ${totalBudget()} €`)]),
                    m("hr.mt-4"),
                    btnsFoot()
                ])
            ])
        }
    }
}

export { BudgetsPage }
