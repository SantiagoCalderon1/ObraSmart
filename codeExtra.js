
function SelectComponet() {
    return {
        view: function ({ attrs }) {
            const { sizeCol, idSelect, textLabel, textSelect, required, textFeedback, data } = attrs
            return m("div", { class: sizeCol }, [
                m("label.form-label", { for: idSelect }, textLabel),
                m("select.form-select", {
                    id: idSelect,
                    "aria-describedby": `${idSelect}Feedback`,
                    required: required
                }, [
                    m("option", { selected: true, disabled: true, value: "" }, textSelect),
                    data.map(item =>
                        m("option", { value: item.value },
                            `${item.content}`
                        )
                    )
                ]),
                m("div.invalid-feedback", { id: `${idSelect}Feedback` }, textFeedback)
            ])
        }
    }
}

function InputHiddenComponent() {
    return {
        view: function ({ attrs }) {
            const { nameAux, valueAux } = attrs
            return m("input", { type: "hidden", name: nameAux, value: valueAux })
        }
    }
}

function inputTextComponent() {
    return {
        view: function ({ attrs }) {
            const { sizeCol, idInput, textLabel, textPlaceholder, required, textFeedback } = attrs

            return m("div", { class: sizeCol }, [
                m("label.form-label", { for: idInput }, textLabel),
                m("input.form-control", {
                    type: "text",
                    id: idInput,
                    placeholder: textPlaceholder,
                    "aria-describedby": `${idInput}Feedback`,
                    required: true,
                    minlength: 3,
                    maxlength: 999,
                    required: required
                }),
                m("div.invalid-feedback", { id: `${idInput}Feedback` }, textFeedback)
            ])
        }
    }
}

function InputDateComponent() {
    return {
        view: function ({ attrs }) {
            const { sizeCol, idInput, textLabel, required, maxDateToday, minDateToday, textFeedback } = attrs

            return m("div", { class: sizeCol }, [
                m("label.form-label", { for: idInput }, textLabel),
                m("input.form-control", {
                    type: "date",
                    id: idInput,
                    "aria-describedby": `${idInput}Feedback`,
                    required: required,
                    max: maxDateToday ? new Date().toISOString().split("T")[0] : "",
                    min: minDateToday ? new Date().toISOString().split("T")[0] : ""
                }),
                m("div.invalid-feedback", { id: `${idInput}Feedback` }, textFeedback)
            ])
        }
    }
}

function InputNumberComponent() {
    return {
        view: function ({ attrs }) {
            const { sizeCol, idInput, textLabel, required, minNumber, maxNumber, step, textFeedback, oninput } = attrs

            return m("div", { class: sizeCol }, [
                m("label.form-label", { for: idInput }, textLabel),

                m("input.form-control", {
                    type: "number",
                    id: idInput,
                    "aria-describedby": `${idInput}Feedback`,
                    required: required,

                    max: maxNumber ? maxNumber : "",
                    min: minNumber ? minNumber : "",
                    placeholder: 0,
                    step: step ? step : 0.25,
                    oninput: oninput

                }),
                m("div.invalid-feedback", { id: `${idInput}Feedback` }, textFeedback)
            ])
        }
    }
}



function FormComponent() {
    let style = {
        containerStyle: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", overflow: "hidden" }
    };
    let urlClients = "../peticionesApi/dataClients.json"
    let urlProjects = "../peticionesApi/dataProjects.json"
    let clients = [], projects = [], status = [], taxes = [];

    function createEmptyConceptItem() {
        return { description: "", quantity: 1, unitPrice: 0, tax: 0, discount: 0, subtotal: 0 };
    }

    let conceptItems = [createEmptyConceptItem()];

    function totalBudget() {
        return conceptItems.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2);
    }

    return {
        oncreate: function () {
            //clientes
            m.request({ method: "GET", url: urlClients, })
                .then((data) => {
                    clients = data.map(client => ({
                        value: client.clients_id_document,
                        content: `${client.name} ${client.surname} - ${client.clients_id_document}`
                    }))
                }).catch((error) => { console.error("Error pidiendo los clientes: ", error); })
            //projectos
            m.request({ method: "GET", url: urlProjects, })
                .then((data) => {
                    projects = data.map(project => ({
                        value: project.id,
                        content: `${project.name} - ${project.status}`
                    }));
                }).catch((error) => { console.error("Error pidiendo los proyectos: ", error); })
            //status
            status = [
                { value: "pendiente", content: "Pendiente" },
                { value: "aceptado", content: "Aceptado" },
                { value: "rechazado", content: "Rechazado" }
            ]

            taxes = [
                // IVA
                { value: "0", content: "0% IVA" },
                { value: "2", content: "2% IVA" },
                { value: "4", content: "4% IVA" },
                { value: "5", content: "5% IVA" },
                { value: "7.5", content: "7.5% IVA" },
                { value: "10", content: "10% IVA" },
                { value: "21", content: "21% IVA" },
                // IGIC
                { value: "0", content: "0% IGIC" },
                { value: "3", content: "3% IGIC" },
                { value: "5", content: "5% IGIC" },
                { value: "7", content: "7% IGIC" },
                { value: "9.5", content: "9.5% IGIC" },
                { value: "13.5", content: "13.5% IGIC" },
                { value: "15", content: "15% IGIC" },
                { value: "20", content: "20% IGIC" },
                { value: "35", content: "21% IGIC" },
                // IPSI
                { value: "0", content: "0% IPSI" },
                { value: "0.5", content: "0.5% IPSI" },
                { value: "1", content: "1% IPSI" },
                { value: "2", content: "2% IPSI" },
                { value: "3", content: "3% IPSI" },
                { value: "3.5", content: "3.5% IPSI" },
                { value: "4", content: "4% IPSI" },
                { value: "5", content: "5% IPSI" },
                { value: "6", content: "6% IPSI" },
                { value: "7", content: "7% IPSI" },
                { value: "8", content: "8% IPSI" },
                { value: "9", content: "9% IPSI" },
                { value: "10", content: "10% IPSI" },
            ]
            m.redraw()
        },
        view: function ({ attrs, children }) {

            return m("div.col-11.col-md-10", { style: style.containerStyle }, [
                m("div.row.col-12", [
                    //Section Cabecera del formulario
                    m("div.row.col-12", [
                        m("hr"),
                        m("span.fw-bold.text-uppercase.fs-5", "Cabecera del documento"),
                        m(SelectComponet, { sizeCol: "col-md-5", idSelect: "clientInput", textLabel: "Cliente*", textSelect: "Elige un cliente...", required: true, textFeedback: "Campo Obligatorio.", data: clients }),
                        m(SelectComponet, { sizeCol: "col-md-5", idSelect: "projectInput", textLabel: "Proyecto*", textSelect: "Elige un proyecto...", required: true, textFeedback: "Campo Obligatorio.", data: projects }),
                        m(InputHiddenComponent, { nameAux: "user_id", valueAux: `${localStorage.getItem("user")}` }),
                        m(InputHiddenComponent, { nameAux: "budget_number", valueAux: "Valor Aqui" }),
                        m(SelectComponet, { sizeCol: "col-md-2", idSelect: "statusSelect", textLabel: "Estado*", textSelect: "Pendiente", required: true, textFeedback: "Campo Obligatorio.", data: status }),
                        , m("div.col-md-5"),
                        m(inputTextComponent, { sizeCol: "col-md-3", idInput: "budgetNumberInput", textLabel: "Núm presupuesto*", textPlaceholder: "BUD", required: true, textFeedback: "Mínimo 3 caracteres" }),
                        m(InputDateComponent, { sizeCol: "col-md-2", idInput: "dateInput", textLabel: "Creación*", required: true, maxDateToday: true, textFeedback: "La fecha no puede ser mayor a hoy." }),
                        m(InputDateComponent, { sizeCol: "col-md-2", idInput: "dateExpInput", textLabel: "Caducidad*", required: true, minDateToday: true, textFeedback: "La fecha no puede ser menor a hoy." }),
                        m("hr.mt-4"),
                        m("span.fw-bold.text-uppercase.fs-5", "Conceptos"),
                    ]),
                    conceptItems.map((item, index) =>
                        m("div.row.col-12.mt-2", [m(ConceptItemComponent, { item, index, taxes })])
                    ),
                    m("div.row.col-12", [
                        m(ButtonComponent, {
                            class: "btn btn-warning mt-3",
                            style: { fontWeight: "" },
                            onclick: () => conceptItems.push(createEmptyConceptItem()),
                            text: "Añadir nuevo concepto "
                        },
                            m("i.fa.fa-plus.me-2")
                        ),
                    ]),
                    m("hr.mt-4"),
                    m("div.col-12.text-end", [
                        m("strong", `Total presupuesto: ${totalBudget()} €`)
                    ]),
                    m("hr.mt-4"),
                    m("div.col-12.d-flex.justify-content-end", m("button.btn.btn-success", { type: "submit" }, "Enviar"))
                ])
            ])
        }
    }
}

function ConceptItemComponent() {
    return {
        oninit: ({ attrs }) => {
            attrs.item.subtotal = 0;
        },
        view: ({ attrs }) => {
            const item = attrs.item;

            function updateSubtotal() {
                const qty = parseFloat(item.quantity || 0);
                const price = parseFloat(item.unitPrice || 0);
                const discount = parseFloat(item.discount || 0);
                const tax = parseFloat(item.tax || 0);
                console.log({ qty, price, discount, tax });

                const raw = qty * price;
                const taxed = raw * (1 + tax / 100);
                item.subtotal = Math.max(taxed - discount, 0);
                m.redraw();
            }


            return [
                //m("span.mb-2", "#",(attrs.index + 1)),
                m(inputTextComponent, {
                    sizeCol: "col-md-6",
                    idInput: `desc-${attrs.index}`,
                    textLabel: `Concepto* `,
                    textPlaceholder: "Añadir un concepto",
                    required: true,
                    textFeedback: "Campo requerido",
                    oninput: (e) => { item.description = e.target.value; }
                }),
                m(InputNumberComponent, {
                    sizeCol: "col-md-2",
                    idInput: `qty-${attrs.index}`,
                    textLabel: "Cantidad*",
                    minNumber: 1,
                    step: 1,
                    required: true,
                    textFeedback: "Valor requerido",
                    oninput: (e) => { item.quantity = e.target.value; updateSubtotal(); }
                }),
                m(SelectComponet, {
                    sizeCol: "col-md-2",
                    idSelect: `tax-${attrs.index}`,
                    textLabel: "Impuestos*",
                    textSelect: "%",
                    required: false,
                    textFeedback: "Obligatorio",
                    data: attrs.taxes,
                    onchange: e => { item.tax = e.target.value; updateSubtotal(); }
                }),
                m(InputNumberComponent, {
                    sizeCol: "col-md-2",
                    idInput: `price-${attrs.index}`,
                    textLabel: "P/Unitario*",
                    minNumber: 0,
                    required: true,
                    textFeedback: "Valor requerido",
                    oninput: e => { item.unitPrice = e.target.value; updateSubtotal(); }
                }), m(inputTextComponent, {
                    sizeCol: "col-md-6",
                    idInput: `desc-${attrs.index}`,
                    textLabel: "Información Adicional",
                    textPlaceholder: "Añadir un información adicional...",
                    required: false,
                    textFeedback: "Mínimo 3 caracteres"
                }),
                m("div.col-md-2"),
                m(InputNumberComponent, {
                    sizeCol: "col-md-2",
                    idInput: `disc-${attrs.index}`,
                    textLabel: "Descuento",
                    minNumber: 0,
                    required: false,
                    textFeedback: "Valor requerido",
                    oninput: e => { item.discount = e.target.value; updateSubtotal(); }
                }),
                m("div.col-md-2", [
                    m("label.form-label", "Subtotal"),
                    m("input.form-control[readonly]", { value: item.subtotal.toFixed(2) })
                ]),

                m("div.mb-3"),
            ]
        }
    };
}



// Furmaulario V·3

function FormComponent() {
    let style = {
        containerStyle: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", overflow: "hidden" }
    };
    let urlClients = "../peticionesApi/dataClients.json"
    let urlProjects = "../peticionesApi/dataProjects.json"
    let clients = [], projects = [], status = [], taxes = [];
    let localDataClients = []
    let localDataProjects = []
    let filteredDataClients = []
    let filteredDataProjects = []

    function filterData(type, value) {
        if (type === "clients") {
            filteredDataClients = localDataClients.filter(item =>
                Object.values(item).some(val =>
                    String(val).toLowerCase().includes(value.toLowerCase())
                )
            );
        } else if (type === "projects") {
            filteredDataProjects = localDataProjects.filter(item =>
                Object.values(item).some(val =>
                    String(val).toLowerCase().includes(value.toLowerCase())
                )
            );
        }
        m.redraw();
    }


    function createEmptyConceptItem() {
        return { description: "", quantity: 1, unitPrice: 0, tax: 0, discount: 0, subtotal: 0 };
    }

    let conceptItems = [createEmptyConceptItem()];

    function totalBudget() {
        return conceptItems.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2);
    }

    return {
        oncreate: function () {
            //clientes
            m.request({ method: "GET", url: urlClients, })
                .then((data) => {
                    filteredDataClients = localDataClients = clients = data.map(client => ({
                        value: client.clients_id_document,
                        content: `${client.name} ${client.surname} - ${client.clients_id_document}`
                    }))
                }).catch((error) => { console.error("Error pidiendo los clientes: ", error); })
            //projectos
            m.request({ method: "GET", url: urlProjects, })
                .then((data) => {
                    filteredDataProjects = localDataProjects = projects = data.map(project => ({
                        value: project.id,
                        content: `${project.name} - ${project.status}`
                    }));
                }).catch((error) => { console.error("Error pidiendo los proyectos: ", error); })
            //status
            status = [
                { value: "pendiente", content: "Pendiente" },
                { value: "aceptado", content: "Aceptado" },
                { value: "rechazado", content: "Rechazado" }
            ]

            taxes = [
                // IVA
                { value: 0, content: "0% IVA" },
                { value: 2, content: "2% IVA" },
                { value: 4, content: "4% IVA" },
                { value: 5, content: "5% IVA" },
                { value: 7.5, content: "7.5% IVA" },
                { value: 10, content: "10% IVA" },
                { value: 21, content: "21% IVA" },
                // IGIC
                { value: 0, content: "0% IGIC" },
                { value: 3, content: "3% IGIC" },
                { value: 5, content: "5% IGIC" },
                { value: 7, content: "7% IGIC" },
                { value: 9.5, content: "9.5% IGIC" },
                { value: 13.5, content: "13.5% IGIC" },
                { value: 15, content: "15% IGIC" },
                { value: 20, content: "20% IGIC" },
                { value: 35, content: "21% IGIC" },
                // IPSI
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
                { value: 10, content: "10% IPSI" },
            ]
            m.redraw()
        },
        view: function () {
            return m("div.col-11.col-md-10", { style: style.containerStyle }, [
                m("div.row.col-12", [
                    m("hr"),
                    m("span.fw-bold.text-uppercase.fs-5", "Cabecera del documento"),
                    m("div.col-md-4", {
                        style: { display: "flex", flexDirection: "column", alignItems: "start" }
                    }, [
                        m("label.form-label", { for: "searchClient" }, "Filtrar clientes..."),
                        m("div.input-group.flex-nowrap", [
                            m("input.form-control", {
                                type: "text",
                                id: "searchClient",
                                "aria-label": "find",
                                "aria-describedby": "addon-wrapping",
                                //value: searchValueClients,
                                oninput: (e) => {
                                    filterData("clients", e.target.value);
                                }
                            }),
                            m("span.input-group-text", {
                                id: "addon-wrapping",
                                onclick: (e) => {
                                    e.target.closest(".input-group").querySelector("input").focus();
                                },
                            }, m("i.fa-solid.fa-magnifying-glass")),
                        ])
                    ]),
                    m("div.col-md-4", {
                        style: { display: "flex", flexDirection: "column", alignItems: "start" }
                    }, [
                        m("label.form-label", { for: "searchClient" }, "Filtrar Presupuesto..."),
                        m("div.input-group.flex-nowrap", [
                            m("input.form-control", {
                                type: "text",
                                id: "searchClient",
                                "aria-label": "find",
                                "aria-describedby": "addon-wrapping",
                                oninput: (e) => {
                                    filterData("projects", e.target.value);
                                }

                            }),
                            m("span.input-group-text", {
                                id: "addon-wrapping",
                                onclick: (e) => {
                                    e.target.closest(".input-group").querySelector("input").focus();
                                },
                            }, m("i.fa-solid.fa-magnifying-glass")),
                        ])
                    ]),
                    m(FormInputComponent, {
                        type: "hidden", nameAux: "user_id", valueAux: `${localStorage.getItem("user")}`
                    }),
                    m(FormInputComponent, {
                        type: "hidden", nameAux: "budget_number", valueAux: "Valor Aqui"
                    }),
                    m(FormInputComponent, {
                        type: "select", sizeCol: "col-md-2", idInput: "statusSelect",
                        textLabel: "Estado*", textSelect: "Pendiente",
                        required: true, textFeedback: "Campo Obligatorio.", data: status
                    }), m(FormInputComponent, {
                        type: "text", sizeCol: "col-md-2", idInput: "budgetNumberInput",
                        textLabel: "Núm presupuesto*", textPlaceholder: "BUD",
                        required: true, textFeedback: "Mínimo 3 caracteres"
                    }),
                    m(FormInputComponent, {
                        type: "select", sizeCol: "col-md-4", idInput: "clientInput",
                        textLabel: "Cliente*", textSelect: "Elige un cliente...",
                        required: true, textFeedback: "Campo Obligatorio.", data: filteredDataClients
                    }),
                    m(FormInputComponent, {
                        type: "select", sizeCol: "col-md-4", idInput: "projectInput",
                        textLabel: "Proyecto*", textSelect: "Elige un proyecto...",
                        required: true, textFeedback: "Campo Obligatorio.", data: filteredDataProjects
                    }),
                    m(FormInputComponent, {
                        type: "date", sizeCol: "col-md-2", idInput: "dateInput",
                        textLabel: "Creación*", required: true, maxDateToday: true,
                        textFeedback: "La fecha no puede ser mayor a hoy."
                    }),
                    m(FormInputComponent, {
                        type: "date", sizeCol: "col-md-2", idInput: "dateExpInput",
                        textLabel: "Caducidad*", required: true, minDateToday: true,
                        textFeedback: "La fecha no puede ser menor a hoy."
                    }),
                    m("hr.mt-4"),
                    m("span.fw-bold.text-uppercase.fs-5", "Conceptos"),
                    // CONCEPTOS
                    conceptItems.map((item, index) =>
                        m("div.row.col-12.mt-2", [
                            m(ConceptItemComponent, { item, index, taxes })
                        ])
                    ),
                    m("div.col-12.d-flex.justify-content-center", [
                        m("div.col-md-6.d-flex.flex-column.flex-md-row.justify-content-between", [
                            m(ButtonComponent, {
                                class: "btn btn-danger mt-3",
                                onclick: () => conceptItems.length <= 1 ? null : conceptItems.pop(),
                                text: "Eliminar concepto "
                            }, m("i.fa.fa-trash-can.me-2", { style: { color: "white" } })),
                            m(ButtonComponent, {
                                class: "btn btn-warning mt-3",
                                onclick: () => conceptItems.push(createEmptyConceptItem()),
                                text: "Añadir nuevo concepto "
                            }, m("i.fa.fa-plus.me-2"))
                        ]),
                    ]),
                    m("hr.mt-4"),
                    m("div.col-12.text-end", [
                        m("strong", `Total presupuesto: ${totalBudget()} €`)
                    ]),
                    m("hr.mt-4"),
                    m("div.col-12.d-flex.justify-content-end", [
                        m("button.btn.btn-success", { type: "submit" }, "Enviar")
                    ])
                ])
            ]);
        }
    }
}

function ConceptItemComponent() {
    return {
        oninit: ({ attrs }) => { attrs.item.subtotal = 0 },
        view: ({ attrs }) => {
            const item = attrs.item;

            function updateSubtotal() {
                const qty = parseFloat(item.quantity || 0);
                const price = parseFloat(item.unitPrice || 0);
                const discount = parseFloat(item.discount || 0);
                const tax = parseFloat(item.tax || 0);
                const raw = qty * price;
                const taxed = raw * (1 + tax / 100);
                item.subtotal = Math.max(taxed - discount, 0);
                m.redraw();
            }

            return [
                m(FormInputComponent, {
                    type: "text", sizeCol: "col-md-6", idInput: `desc-${attrs.index}`,
                    textLabel: `Concepto* #${(attrs.index + 1)}`, textPlaceholder: "Añadir un concepto",
                    required: true, textFeedback: "Campo requerido",
                    oninput: e => { item.description = e.target.value }
                }),
                m(FormInputComponent, {
                    type: "number", sizeCol: "col-md-2", idInput: `qty-${attrs.index}`,
                    textLabel: "Cantidad*", required: true, minNumber: 1, step: 1,
                    textFeedback: "Valor requerido",
                    oninput: e => { item.quantity = e.target.value; updateSubtotal(); }
                }),
                m(FormInputComponent, {
                    type: "select", sizeCol: "col-md-2", idInput: `tax-${attrs.index}`,
                    textLabel: "Impuestos*", textSelect: "%", required: true,
                    textFeedback: "Obligatorio", data: attrs.taxes, value: item.tax,
                    onchange: e => {
                        item.tax = parseFloat(e.target.value);
                        updateSubtotal();
                    }
                }),
                m(FormInputComponent, {
                    type: "number", sizeCol: "col-md-2", idInput: `price-${attrs.index}`,
                    textLabel: "P/Unitario*", required: true, minNumber: 0,
                    textFeedback: "Valor requerido",
                    oninput: e => { item.unitPrice = e.target.value; updateSubtotal(); }
                }),
                m(FormInputComponent, {
                    type: "text", sizeCol: "col-md-6", idInput: `info-${attrs.index}`,
                    textLabel: "Información Adicional", textPlaceholder: "Opcional...",
                    required: false, textFeedback: "Mínimo 3 caracteres"
                }),
                m("div.col-md-2"),
                m(FormInputComponent, {
                    type: "number", sizeCol: "col-md-2", idInput: `disc-${attrs.index}`,
                    textLabel: "Descuento", required: false, minNumber: 0,
                    textFeedback: "Valor requerido",
                    oninput: e => { item.discount = e.target.value; updateSubtotal(); }
                }),
                m("div.col-md-2", [
                    m("label.form-label", "Subtotal"),
                    m("input.form-control[readonly]", { value: item.subtotal.toFixed(2) })
                ]),
                m("div.mb-3")
            ];
        }
    };
}

function FormInputComponent() {
    return {
        view: function ({ attrs }) {
            const {
                type = "text",
                sizeCol = "col-md-12",
                idInput,
                textLabel = "",
                textPlaceholder = "",
                required = false,
                textFeedback = "",
                oninput,
                onchange,
                minlength,
                maxlength,
                step,
                minNumber,
                maxNumber,
                data = [],
                textSelect = "Seleccionar...",
                nameAux,
                valueAux,
                maxDateToday,
                minDateToday
            } = attrs;
            if (type === "hidden") {
                return m("input", {
                    type: "hidden",
                    name: nameAux,
                    value: valueAux
                });
            }
            const label = m("label.form-label", { for: idInput }, textLabel);
            const feedback = m("div.invalid-feedback", { id: `${idInput}Feedback` }, textFeedback);
            let inputField;
            switch (type) {
                case "select":
                    inputField = m("select.form-select", {
                        id: idInput,
                        "aria-describedby": `${idInput}Feedback`,
                        required: required,
                        onchange: onchange,
                        value: attrs.value || ""
                    }, [
                        m("option", { selected: true, disabled: true, value: "" }, textSelect),
                        data.map(item =>
                            m("option", { value: item.value }, item.content)
                        ),
                    ]);
                    break;
                case "date":
                    const today = new Date().toISOString().split("T")[0];
                    inputField = m("input.form-control", {
                        type: "date",
                        id: idInput,
                        required: required,
                        "aria-describedby": `${idInput}Feedback`,
                        max: maxDateToday ? today : "",
                        min: minDateToday ? today : "",
                        oninput: oninput
                    });
                    break;
                case "number":
                    inputField = m("input.form-control", {
                        type: "number",
                        id: idInput,
                        placeholder: 0,
                        "aria-describedby": `${idInput}Feedback`,
                        required: required,
                        min: minNumber ?? "",
                        max: maxNumber ?? "",
                        step: step ?? 0.25,
                        oninput: oninput
                    });
                    break;
                default: // text
                    inputField = m("input.form-control", {
                        type: "text",
                        id: idInput,
                        placeholder: textPlaceholder,
                        "aria-describedby": `${idInput}Feedback`,
                        required: required,
                        minlength: minlength ?? 3,
                        maxlength: maxlength ?? 999,
                        oninput: oninput
                    });
                    break;
            }
            return m("div", { class: sizeCol }, [
                type !== "hidden" && label,
                inputField,
                type !== "hidden" && feedback
            ]);
        }
    }
}