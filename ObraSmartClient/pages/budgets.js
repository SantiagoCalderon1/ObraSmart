import { TableListComponent, ModalComponent, ButtonComponent } from "./generalsComponents.js";



function BudgetsPage() {
    let style = { width: "100%", minHeight: "92.5vh", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#f0f0f0", paddingBottom:'50px' };
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
    return {
        view: function () {
            return [
                m("h1", { style: { padding: "30px 0", textTransform: "uppercase" } }, "Presupuestos"),
                m(BudgetsListComponent),
                m(BudgetModalDetailsComponent, { idModal: "ModalDetailsBudgetsList" }),
                m(BudgetModalConfirmationComponent, { idModal: "ModalDeleteBudget", titulo: "Confirmación de eliminación", mensaje: `¿Está seguro de eliminar el presupuesto con #${selectedBudget?.budget_number}?`, slug: "/budgets" }),
            ]
        }
    }
}

function BudgetsFormCreatePage() {
    return {
        view: function ({ attrs }) {
            return [
                m("h1", { style: { padding: "30px 0", textTransform: "uppercase" } }, "Nuevo Presupuesto"),
                m(FormBudgetComponent, { typeForm: "create" }),
                m(BudgetModalConfirmationComponent, { idModal: "ModalCancelationBudget", titulo: "Confirmación", mensaje: "¿Está seguro de cancelar la creación del presupuesto?", slug: "/budgets" }),
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
                m(BudgetModalConfirmationComponent, { idModal: "ModalCancelationBudget", titulo: "Confirmación de cancelación", mensaje: "¿Está seguro de cancelar la actualización del presupuesto?", slug: "/budgets" }),
            ]
        }
    }
}


let selectedBudget = null;

function BudgetsListComponent() {
    let urlBudgets = "../peticionesApi/dataBudgets.json";
    let budgets = [];

    return {
        oncreate: function () {
            m.request({ method: "GET", url: urlBudgets, })
                .then((data) => {
                    budgets = data.map((item, i) => ({ ...item, index: i + 1 }));
                    m.redraw();
                }).catch((error) => { console.log("Error al obtener los datos de budgets: ", error); });
        },
        view: function () {
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
                            color: item.status === "accepted"
                                ? "green"
                                : item.status === "rejected"
                                    ? "red"
                                    : "black"
                        }
                    }
                },
                { title: "ID Cliente", field: "client_id" },
                { title: "ID Proyecto", field: "project_id" },
                { title: "Total", field: "total" },
                { title: "Fecha", field: "date" }
            ];

            const onRowClick = (budget) => {
                selectedBudget = budget;
                new bootstrap.Modal(document.getElementById("ModalDetailsBudgetsList")).show();
                m.redraw();
            };

            return m(TableListComponent, {
                columns: columns,
                data: budgets,
                onRowClick: onRowClick
            }, [
                m(ButtonComponent, {  actions: () => m.route.set("/budget/create/0"), text: "Crear Presupuesto" })
            ])
        }
    };
}

function BudgetModalDetailsComponent() {
    let urlBudgetDetails = "../peticionesApi/dataBudgetDetails.json";

    let selectedBudgetDetails = [];
    let tituloModal
    let total = 0

    const columns = [
        //{ title: "ID Presupuesto", field: "budget_id" },
        { title: "Concepto", field: "concept" },
        { title: "Descripción", field: "description" },
        { title: "Cantidad", field: "quantity" },
        { title: "Impuestos", field: "typeTaxe" },
        { title: "Descuento", field: "discount" },
        { title: "Precio Unitario", field: "unit_price" },
        { title: "Subtotal", field: "subtotal" }
    ];

    function fetchDetails() {
        if (selectedBudget) {
            m.request({ method: "GET", url: urlBudgetDetails })
                .then((data) => {
                    let filtered = data.filter((detail) => detail.budget_id == selectedBudget.id);
                    selectedBudgetDetails = filtered.length > 0 ? filtered : null;
                    tituloModal = `Detalles del Presupuesto ${selectedBudget.budget_number}`
                    total = selectedBudgetDetails.reduce((sum, item) => sum + item.subtotal, 0)
                })
                .catch((error) => console.log("Error al obtener los detalles:", error));
        }
    }
    return {
        oncreate: fetchDetails,
        onupdate: fetchDetails,
        view: function ({ attrs }) {

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
                        actions: () => m.route.set(`/budget/update/${selectedBudget.budget_number}`)
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
                        m("tbody", selectedBudgetDetails ? selectedBudgetDetails.map((detail, index) =>
                            m("tr.text-center", [m("td", (index + 1)), columns.map((col) => m("td", detail[col.field] || "N/A"))])
                        ) : null),
                        m("tfoot", [
                            m("tr", m("th[colspan=8].text-end", `Total ${total.toFixed(2)}`))
                        ])
                    ]),
                ])

            const ContentFooterModal = () =>
                m(ButtonComponent, { bclass: "btn-outline-danger", text: "Descargar PDF ", },
                    m("i.fa-solid.fa-file-pdf", { style: { color: "red" } })
                )

            return m(ModalComponent, {
                idModal: attrs.idModal,
                title: tituloModal,
                addBtnClose: true
            }, [
                ContentHeaderModal(),
                ContentBodyModal(),
                ContentFooterModal()
            ])
        }
    }
}

function BudgetModalConfirmationComponent() {

    return {
        view: function ({ attrs }) {
            const { idModal, titulo, mensaje, slug } = attrs

            const ContentBodyModal = () =>
                m("p.text-center", mensaje)

            const ContentFooterModal = () =>
                m("div.col-12.d-flex.justify-content-center", [
                    m("div.col-md-6.d-flex.flex-md-row.justify-content-between", [
                        m("button.btn.btn-danger.mt-3.me-2", { "data-bs-dismiss": "modal", style: { fontWeight: "bold" } }, "Cancelar"),
                        m(ButtonComponent, {
                            closeModal: true,
                            class: "btn btn-success ",
                            actions: () => m.route.set('/budgets'),
                            text: "Aceptar"
                        })
                    ])
                ])
            return m(ModalComponent, { idModal: idModal, title: titulo },
                [
                    null,
                    ContentBodyModal(),
                    ContentFooterModal()
                ])
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
        { value: 1, content: "Pendiente" },
        { value: 2, content: "Aceptado" },
        { value: 3, content: "Rechazado" },
    ];

    const createEmptyConcept = () => ({ description: "", quantity: 0, unitPrice: 0, tax: 0, discount: 0, subtotal: 0 });

    const state = {
        clients: [],
        projects: [],
        conceptItems: [createEmptyConcept()],
        selectedBudget: null,
        budgetDetails: [],
        filterClients: "",
        filterProjects: "",
    };

    const fetchData = (url, mapFn = (x) => x) =>
        m.request({ method: "GET", url }).then(data => mapFn(data)).catch(console.error);

    const totalBudget = () =>
        state.conceptItems.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2);

    const updateConceptSubtotal = (item) => {
        const pBruto = item.quantity * item.unitPrice
        const pNeto = pBruto * (1 + parseFloat(item.tax || 0) / 100)
        item.subtotal = Math.max(pNeto - item.discount, 0)
        m.redraw()
    };

    return {
        oncreate: ({ attrs }) => {
            const { budget_number } = attrs;

            fetchData(urls.clients, data => {
                state.clients = data.map(c => ({
                    id: c.id,
                    value: c.clients_id_document,
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
                    return fetchData(urls.BudgetDetails);
                }).then(details => {
                    state.budgetDetails = details.filter(d => d.budget_id === state.selectedBudget?.id);
                    m.redraw();
                });
            }
        },

        view: ({ attrs }) => {
            const filterList = (list, keyword) =>
                list.filter(item => Object.values(item).some(val => String(val).toLowerCase().includes(keyword.toLowerCase())));

            const renderInputGroup = (label, oninput, onclick, icon = "fa-magnifying-glass") =>
                m("div.col-md-4.d-flex.flex-column.align-items-start", [
                    m("label.form-label", label),
                    m("div.input-group.flex-nowrap", [
                        m("input.form-control", { oninput }),
                        m("span.input-group-text", { onclick }, m("i.fa", { class: icon }))
                    ])
                ]);

            const renderSelect = (label, options, onchange, id, bclass = "col-md-4") =>
                m("div", { class: bclass }, [
                    m("label.form-label", label),
                    m("select.form-select", { id, onchange },
                        options.map(opt => m("option", { value: opt.value }, opt.label || opt.content))
                    )
                ]);

            const renderInputDate = (label, type, id) =>
                m("div.col-md-2", [
                    m("label.form-label", label),
                    m("input.form-control", {
                        type: "date",
                        id: id,
                        min: type == 1 ? "" : today,
                        max: type == 1 ? today : "",
                    })
                ])

            const renderConcept = (item, index) =>
                m("div.row.col-12.mt-3.p-0.m-0", [
                    m("div.col-md-6", [
                        m("label.form-label", `Concepto* #${index + 1}`),
                        m("input.form-control", {
                            id: `concept-${index}`,
                            oninput: e => item.description = e.target.value
                        })
                    ]),
                    m("div.col-md-2", [
                        m("label.form-label", "Cantidad *"),
                        m("input.form-control", {
                            type: "number",
                            placeholder: "0",
                            min: 0,
                            id: `quantity-${index}`,
                            oninput: e => { item.quantity = +e.target.value; updateConceptSubtotal(item); }
                        })
                    ]),
                    m("div.col-md-2", [
                        m("label.form-label", "Descuento"),
                        m("input.form-control", {
                            type: "number",
                            placeholder: "0 €",
                            id: `discount-${index}`,
                            oninput: e => { item.discount = +e.target.value; updateConceptSubtotal(item); }
                        })
                    ]),
                    m("div.col-md-2", [
                        m("label.form-label", " P / U *"),
                        m("input.form-control", {
                            type: "number",
                            placeholder: "0",
                            min: 0,
                            id: `price-${index}`,
                            oninput: e => { item.unitPrice = +e.target.value; updateConceptSubtotal(item); }
                        })
                    ]),
                    m("div.col-md-6.mt-2", [
                        m("label.form-label", "Descripción"),
                        m("textarea.form-control", {
                            id: `concept-${index}`,
                            style: {
                                height: "38px",
                            },
                            placeholder: "Opcional...",
                            oninput: e => item.description = e.target.value
                        })
                    ]),
                    m("div.col-md-2"),

                    m("div.col-md-2.mt-2", renderSelect("Impuestos", taxes, e => { item.tax = e.target.value; updateConceptSubtotal(item) }, `tax-${index}`, "col-md-12")),

                    m("div.col-md-2.mt-2", [
                        m("label.form-label", "SubTotal"),
                        m("input.form-control[readonly]", {
                            value: `${item.subtotal.toFixed(2)} €`
                        })
                    ])
                ])

            const btnsAction = () =>
                m("div.col-12.mt-3.d-flex.justify-content-center", [
                    m("div.col-md-6.d-flex.flex-column.flex-md-row.justify-content-between", [
                        m(ButtonComponent, {
                            text: "Eliminar concepto",
                            bclass: "btn btn-danger ",
                            actions: () => state.conceptItems.length > 1 && state.conceptItems.pop(),
                        }, m("i.fa.fa-trash-can.me-2.ms-2", { style: { color: "white" } })),
                        m(ButtonComponent, {
                            text: "Añadir concepto",
                            bclass: "btn-warning ",
                            actions: () => state.conceptItems.push(createEmptyConcept()),
                        }, m("i.fa.fa-plus.me-2.ms-2"))
                    ])
                ])

            const btnsFoot = () =>
                // Btns volver y aceptar
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

            return m("div.col-11.col-md-10", { style: style.containerStyle }, [
                m("div.row.col-12", [
                    m("hr"),
                    m("span.fw-bold.text-uppercase.fs-5", "Cabecera del documento"),
                    m("div.row.col-12.p-0.m-0", [
                        renderInputGroup("Filtrar clientes", e => state.filterClients = e.target.value, e => e.target.closest(".input-group").querySelector("input").focus()),
                        renderInputGroup("Filtrar proyectos", e => state.filterProjects = e.target.value, e => e.target.closest(".input-group").querySelector("input").focus()),
                        renderSelect("Estado", statusOptions, "inputStatus"),
                        renderSelect("Cliente", filterList(state.clients, state.filterClients), "inputClient"),
                        renderSelect("Proyecto", filterList(state.projects, state.filterProjects), "inputProject"),
                        renderInputDate("Creación*", 1, "inputCreation"),
                        renderInputDate("Expiración*", 2, "inputExpiration"),
                        m("hr.mt-4"),
                    ]),

                    m("h5", "Conceptos"),
                    // Conceptos dinámicos
                    state.conceptItems.map(renderConcept),
                    // Botones añadir/eliminar concepto
                    btnsAction(),
                    // Total
                    m("hr.mt-4"),
                    m("div.col-12.text-end", [
                        m("h5", `Total presupuesto: ${totalBudget()} €`)
                    ]),
                    m("hr.mt-4"),
                    btnsFoot()
                ])
            ])
        }
    };
}




export { BudgetsPage }





