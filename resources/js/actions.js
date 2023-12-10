const STATUS = {
    ERROR: {
        icon: "xmark",
        color: "danger",
    },
    SUCCESS: {
        icon: "check",
        color: "success",
    },
    WARNING: {
        icon: "start",
        color: "success",
    },
};

class Action {
    constructor(
        actionId,
        actionText,
        actionName,
        actionType,
        parentActionId,
        childActionId,
        data,
        icon,
    ) {
        this.actionId = actionId;
        this.actionText = actionText;
        this.actionName = actionName;
        this.actionType = actionType;
        this.parentActionId = parentActionId;
        this.childActionId = childActionId;
        this.data = data;
        this.icon = icon;
    }

    markupForMainWrapper() {
        return `
        <div class="relative flex items-center justify-between gap-1 w-[220px] p-3 mx-4 bg-boxColor rounded-lg elevation-low border border-solid border-neutral-500 transition delay-50 duration-250 ease-in-out hover:bg-neutral-700 hover:elevation-high cursor-pointer active:bg-zinc-900" onclick="openActionForm(${this.actionId})">
            <div>
                <div class="flex px-2 items-center">
                    <i class="fa-solid fa-${this.icon} px-2 py-0.5 mr-0.5 rounded bg-primary text-[10px] text-pure"></i>
                    <span class="text-pure mx-1 text-md">${this.actionText}</span>
                </div>
                <div class="text-gray text-[12px] px-2 whitespace-nowrap text-ellipsis overflow-hidden max-w-[160px] mt-[2px]" actionName="${this.actionId}">${this.actionName}</div>
            </div>
            <div class="flex items-center justify-between flex-col">
                <span status="${this.actionId}">
                    <i class="fa-solid fa-star text-[10px] font-bold text-warning rounded-full p-[3px] bg-neutral-500 flex items-center justify-center hover:bg-stone-600 transition-all"></i> 
                </span>
                <div class="flex items-center justify-end mt-[5px]" onclick="deleteAction(${this.actionId})">
                    <i class="fa-solid fa-trash text-[10px] font-bold text-danger rounded-full p-[3px] bg-neutral-500 flex items-center justify-center hover:bg-stone-600 transition-all"></i> 
                </div>
            </div>
        </div>
    `;
    }

    markupForDropBtn(curActionId) {
        return `
        <div class="relative flex self-center h-[26px] cursor-pointer z-10 items-center justify-center">
            <div class="relative select-none flex items-center justify-center border border-neutral-500 h-[26px]">
                <i class="fa-solid fa-add absolute bg-primary rounded-full h-[12px] w-[12px] top-1 flex items-center justify-center text-xs text-pure opacity-100 transition-all delay-0 duration-150 group-hover:opacity-100" ondrop="dropAction(${this.actionId}, ${curActionId})" ondragover="allowDropAction()"></i>
            </div>
        </div>
    `;
    }

    markupForInputBox(name, value, label, text = "Enter Value", type = "text") {
        return `
        <div class="inputBox mb-6">
            <input class="placeholder-gray placeholder-opacity-30" name="${name}" type="${type}" id="${name}" required ${
                value && `value="${value}"`
            } placeholder="${text}"/>
            <label for="${name}">${label}</label>
        </div>`;
    }

    updateActionStatus(status) {
        document.querySelector(`[status="${this.actionId}"]`).innerHTML = `
        <i class="fa-solid fa-${STATUS[status].icon} text-[10px] font-bold text-${STATUS[status].color} rounded-full p-[3px] bg-neutral-500 flex items-center justify-center"></i>
    `;
    }
}

class IfConditionAction extends Action {
    constructor(actionId, parentActionId = null, childActionId = null) {
        super(
            actionId,
            "If condition",
            "New If Condition Action",
            "IF_CONDITION",
            parentActionId,
            childActionId,
            null,
            "network-wired",
        );

        this.trueActionId = null;
        this.falseActionId = null;
        this.condition = null;
        this.trueWrapperId = createId();
        this.falseWrapperId = createId();
    }

    #leftWrapperBox() {
        return `
            <div class="wrapper">
                <div class="flex flex-col group min-w-[295px]" id="${
                    this.trueWrapperId
                }" which-link="trueActionId">
                    <div class="flex relative justify-center self-end items-start w-[50%] min-h-[30px] border-solid border-t-2 border-l-2 border-neutral-500 rounded-tl-lg cursor-pointer">
                        <div class="absolute -left-0.5 top-2/4"> 
                            ${this.markupForDropBtn(this.trueWrapperId)} 
                        </div>
                    </div>
                </div>
                <div class="relative flex grow self-center min-h-[0px] border-solid border-l-2 border-neutral-500"></div>
                <div class="flex relative justify-center self-end items-start w-[50%] min-h-[10px] border-solid border-b-2 border-l-2 border-neutral-500 rounded-bl-lg"></div>
            </div>`;
    }

    #rightWrapperBox() {
        return `
        <div class="wrapper">
            <div class="flex flex-col group min-w-[295px]" id="${
                this.falseWrapperId
            }" which-link="falseActionId">
                <div class="flex relative justify-center self-start items-start w-[50%] min-h-[30px] border-solid border-t-2 border-r-2 border-neutral-500 rounded-tr-lg cursor-pointer">
                    <div class="absolute -right-0.5 top-2/4"> 
                        ${this.markupForDropBtn(this.falseWrapperId)} 
                    </div>
                </div>
            </div>
            <div class="relative flex grow self-center min-h-[0px] border-solid border-l-2 border-neutral-500"></div>
            <div class="flex relative justify-center self-start items-start w-[50%] min-h-[10px] border-solid border-b-2 border-r-2 border-neutral-500 rounded-br-lg"></div>
        </div>
    `;
    }

    markupForMainAction() {
        return `
        <div id="${this.actionId}">
            <div>
                <div class="flex flex-col justify-start flex-nowrap group">
                    <div class="flex relative self-center flex-col items-center">
                        <div>${this.markupForMainWrapper()}</div>
                    </div>
                    <div class="relative flex self-center min-h-[26px] border-solid border-l-2 border-neutral-500"></div>
                    <div class="flex justify-center relative z-10">
                        <div class="absolute self-center py-1 px-2 mt-[5px] -ml-[120px] text-[10px] tracking-wide font-light text-pure bg-neutral-600 rounded"> True </div>
                        <div class="absolute self-center py-1 px-2 mt-[5px] ml-[120px] text-[10px] tracking-wide font-light text-pure bg-neutral-600 rounded"> False </div>
                    </div>
                </div>
                <div class="flex justify-center items-stretch min-h-[140px]">
                    ${this.#leftWrapperBox()}
                    ${this.#rightWrapperBox()}
                </div>
                ${this.markupForDropBtn(null)}
            </div>
        </div>
    `;
    }

    createActionForm() {
        return `
        <div id="formWrapper"> 
            <h1 class="border-b border-neutral-500 flex items-center justify-center text-primary py-4">
                ${this.actionText}
            </h1>
            <form action="#" class="flex items-center p-4 mt-8 flex-col">
                ${this.markupForInputBox(
                    "actionName",
                    this.actionName,
                    "Action Name",
                    "Enter Action Name",
                )}
                ${this.markupForInputBox(
                    "condition",
                    this.condition,
                    "Condition",
                    "Enter Condition Ex : input.length > 10",
                )}
            </form>
            <button
                id="debug"
                class="btn bg-boxColor hidden items-center justify-center hover:bg-neutral-600 mb-4 ml-4" 
                onclick="debugWorkflow(${this.actionId})"
            >
                <span> Debug </span>
                <span class="ml-1 text-[10px] text-pure material-symbols-outlined">
                    bug_report
                </span>
            </button>
        </div>
    `;
    }

    saveActionForm() {
        let actionName = document.getElementById("actionName").value;
        let condition = document.getElementById("condition").value;
        this.actionName = actionName === "" ? this.actionName : actionName;
        this.condition = condition === "" ? this.condition : condition;
        document.querySelector(`[actionName="${this.actionId}"]`).innerHTML =
            this.actionName;
    }

    static getIntance(action) {
        let instance = new IfConditionAction(null);
        instance.actionId = action.actionId;
        instance.actionText = action.actionText;
        instance.actionName = action.actionName;
        instance.actionType = action.actionType;
        instance.parentActionId = action.parentActionId;
        instance.childActionId = action.childActionId;
        instance.data = action.data;
        instance.icon = action.icon;
        instance.trueActionId = action.trueActionId;
        instance.falseActionId = action.falseActionId;
        instance.condition = action.condition;
        instance.trueWrapperId = action.trueWrapperId;
        instance.falseWrapperId = action.falseWrapperId;
        return instance;
    }

    getObj() {
        return {
            actionId: this.actionId,
            actionText: this.actionText,
            actionName: this.actionName,
            actionType: this.actionType,
            parentActionId: this.parentActionId,
            childActionId: this.childActionId,
            data: this.data,
            icon: this.icon,
            trueActionId: this.trueActionId,
            falseActionId: this.falseActionId,
            condition: this.condition,
            trueWrapperId: this.trueWrapperId,
            falseWrapperId: this.falseWrapperId,
        };
    }

    markupForDebugWorkflow() {
        return `
        <div class="w-[650px]">
        <div class="flex items-center justify-center flex-col container text-pure">
            <div class="p-4 border border-gray-500 w-[100%] h-[500px] rounded-md">
                <div class="border-b border-gray-500 grid grid-cols-2 items-center justify-center">
                    <div class="p-4 border-r border-gray-500 flex flex-col">
                        <span class="text-primary">Action Name </span>
                        <span class="text-sm">${this.actionName}</span>
                    </div>
                    <div class="p-4 flex flex-col">
                        <span class="text-primary">Condition </span>
                        <span class="text-sm">
                            ${this.condition && this.condition}
                        </span>
                    </div>
                </div>
                <div class="border-b border-gray-500 grid grid-cols-2 items-center justify-center">
                    <div class="p-4 border-r border-gray-500 flex flex-col">
                        <span class="text-primary">True Condition Box Id</span>
                        <span class="text-sm">${this.trueActionId}</span>
                    </div>
                    <div class="p-4 flex flex-col">
                        <span class="text-primary">False Condition Box Id </span>
                        <span class="text-sm">${this.falseActionId}</span>
                    </div>
                </div>
                <div>
                    <div class="p-2 flex flex-col">
                        <span class="text-primary mb-2">Data</span>
                        <textarea class="p-3 text-sm bg-dark border border-gray-500 rounded-md outline-none" rows="12">${
                            this.data &&
                            JSON.stringify(this.data).slice(
                                0,
                                Math.min(
                                    JSON.stringify(this.data).length,
                                    1000,
                                ),
                            )
                        }...</textarea>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    }

    getNextActions(input, nextActions) {
        try {
            if (eval(this.condition))
                nextActions.push({ edge: this.trueActionId, data: input });
            else nextActions.push({ edge: this.falseActionId, data: input });
        } catch (error) {
            console.log(error);
            this.data = error.message;
            this.updateActionStatus("ERROR");
            return;
        }

        this.data = input;
        nextActions.push({ edge: this.childActionId, data: input });

        this.updateActionStatus("SUCCESS");
    }
}

class SwitchAction extends Action {
    constructor(actionId, parentActionId = null, childActionId = null) {
        super(
            actionId,
            "Switch Action",
            "New Switch Action",
            "SWITCH",
            parentActionId,
            childActionId,
            null,
            "toggle-off",
        );

        this.conditions = {
            [createId()]: {
                condition: "null",
                childActionId: null,
            },
        };

        this.leftActionId = null;
        this.leftWrapperId = createId();
        this.leftCondition = "null";

        this.defaultActionId = null;
        this.defaultWrapperId = createId();
    }

    #leftWrapperBox() {
        return `
        <div class="wrapper">
            <div class="flex flex-col group min-w-[295px]" id="${
                this.leftWrapperId
            }" which-link="leftActionId">
                <div class="flex relative justify-center items-start min-h-[30px] border-t-2 border-neutral-500 w-[calc(50%+1px)] border-l-2 rounded-tl-lg self-end">
                    <div class="absolute self-center py-1 px-2 -mt-[30px] text-[10px] tracking-wide font-light text-pure bg-neutral-600 rounded" id="write__condition__${
                        this.leftWrapperId
                    }"> 
                        ${this.leftCondition} 
                    </div>
                    <div class="absolute top-2/4 cursor-pointer left-0">
                        ${this.markupForDropBtn(this.leftWrapperId)} 
                    </div>
                </div>
            </div>
            <div class="relative flex grow self-center min-h-[0px] border-solid border-l-2 border-neutral-500"></div>
            <div class="flex relative justify-center items-start min-h-[10px] border-neutral-500 w-[calc(50%+1px)] self-end border-b-2 border-l-2 rounded-bl-lg"></div>
        </div>`;
    }

    #defaultWrapperBox() {
        return `
        <div class="wrapper">
            <div class="flex flex-col group min-w-[295px]" id="${
                this.defaultWrapperId
            }" which-link="defaultActionId">
                <div class="flex relative justify-center items-start min-h-[30px] w-[calc(50%+1px)] border-r-2 rounded-tr-lg self-start border-solid border-t-2 border-neutral-500">
                    <div class="absolute self-center py-1 px-2 -mt-[30px] text-[10px] tracking-wide font-light text-pure bg-neutral-600 rounded"> Default </div>
                    <div class="absolute top-2/4 right-0 cursor-pointer">
                        ${this.markupForDropBtn(this.defaultWrapperId)} 
                    </div>
                </div>
            </div>
            <div class="relative flex grow self-center min-h-[0px] border-solid border-x border-neutral-500"></div>
            <div class="flex relative justify-center items-start min-h-[10px] w-[calc(50%+1px)] self-start border-r-2 rounded-br-lg border-solid border-b-2 border-neutral-500"></div>
        </div>
    `;
    }

    #middleWrapperBox(caseId, condition) {
        return `
            <div class="wrapper" id="wrapper__${caseId}">
                <div class="flex flex-col group min-w-[295px]" actionId="${
                    this.actionId
                }" id="${caseId}" which-link="middleAction">
                    <div class="flex relative justify-center items-start min-h-[30px] border-t-2 border-neutral-500 w-full self-center after:contents-[ ] after:absolute after:min-h-[30px] after:border-l-2 after:border-neutral-500 after:-z-10">
                        <div class="absolute self-center py-1 px-2 -mt-[30px] text-[10px] tracking-wide font-light text-pure bg-neutral-600 rounded" id="write__condition__${caseId}"> 
                            ${condition}
                        </div>
                        <div class="absolute top-2/4 cursor-pointer inset-x-1/2">
                            ${this.markupForDropBtn(caseId)} 
                        </div>
                    </div>
                </div>
                <div class="relative flex grow self-center min-h-[0px] border-solid border-l-2 border-neutral-500"></div>
                <div class="flex relative justify-center items-start min-h-[10px] border-b-2 border-neutral-500 w-full self-center after:content-[ ] after:absolute after:min-h-[10px] after:border-l-2 after:border-neutral-500 after:-z-10"></div>
            </div>
        `;
    }

    #middleWrapperBoxes() {
        let markup = "";
        for (let key in this.conditions) {
            markup += this.#middleWrapperBox(
                key,
                this.conditions[key].condition,
            );
        }
        return markup;
    }

    markupForMainAction() {
        return `
        <div id="${this.actionId}">
            <div>
                <div class="flex flex-col justify-start flex-nowrap group">
                    <div class="flex relative self-center flex-col items-center">
                        <div>${this.markupForMainWrapper()}</div>
                    </div>
                    <div class="relative flex self-center min-h-[26px] border-solid border-l-2 border-neutral-500"></div>
                </div>
                <div class="flex justify-center items-stretch min-h-[140px]">
                    ${this.#leftWrapperBox()}
                    ${this.#middleWrapperBoxes()}
                    ${this.#defaultWrapperBox()}
                </div>
                ${this.markupForDropBtn(null)}
            </div>
        </div>
    `;
    }

    #markupForMiddleInputBox(
        caseId,
        value,
        label,
        text = "Enter Case Condition",
        type = "text",
    ) {
        return `
            <div class="flex items-center justify-center gap-2 mx-4 w-[290px]" actionId="${
                this.actionId
            }" id="input__${caseId}">
                <div class="inputBox mb-6">
                    <input class="placeholder-gray placeholder-opacity-30" type="${type}" id="case__${caseId}" required ${
                        value && `value="${value}"`
                    } placeholder="${text}"/>
                    <label for="caseId${caseId}">Case ${label}</label>
                </div>
                <button class="btn border border-gray/30 flex items-center justify-center p-1 mb-6" onclick="deleteSwitchCase(${caseId})">
                    <span class="text-[20px] text-danger material-symbols-outlined">delete</span>
                </button>
            </div>`;
    }

    addSwitchCase() {
        let lastWrapperId = null;
        for (let key in this.conditions) lastWrapperId = key;

        let form = document.getElementById("switchCases");
        let wrapper = document.getElementById(`wrapper__${lastWrapperId}`);

        let caseId = createId();
        this.conditions[caseId] = {
            condition: "null",
            childActionId: "null",
        };

        let markup = this.#markupForMiddleInputBox(
            caseId,
            null,
            Object.keys(this.conditions).length + 1,
        );
        form.insertAdjacentHTML("afterend", markup);

        let wrapperMarkup = this.#middleWrapperBox(caseId, null);
        wrapper.insertAdjacentHTML("afterend", wrapperMarkup);
    }

    #markupForCases() {
        let markup = "",
            cnt = 2;
        for (let key in this.conditions) {
            markup += this.#markupForMiddleInputBox(
                key,
                this.conditions[key].condition,
                cnt++,
            );
        }
        return markup;
    }

    deleteSwitchCase(caseId) {
        delete this.conditions[caseId];
        document.getElementById(`wrapper__${caseId}`).remove();
        document.getElementById(`input__${caseId}`).remove();
    }

    createActionForm() {
        return `
        <div id="formWrapper"> 
            <h1 class="border-b border-neutral-500 flex items-center justify-center text-primary py-4">
                ${this.actionText}
            </h1>
            <form class="flex items-center p-4 mt-8 flex-col" id="switchCases">
                ${this.markupForInputBox(
                    "actionName",
                    this.actionName,
                    "Action Name",
                    "Enter Action Name",
                )}
                ${this.markupForInputBox(
                    "leftCondition",
                    this.leftCondition,
                    "Case 1",
                    "Enter Case Conditon",
                )}
                ${this.#markupForCases()}
            </form>

            <div class="flex items-center justify-between w-full mb-8">
                <button class="btn border-[.5px] border-gray bg-neutral-800 flex items-center justify-center ml-4" onclick="addSwitchCase(${
                    this.actionId
                })"> 
                    <span> Add Cases </span>
                    <span class="ml-1 text-[12px] text-pure material-symbols-outlined">add_circle</span>
                </button>
                
                <button
                    id="debug"
                    class="btn border-[.5px] border-gray bg-neutral-800 flex items-center justify-center mr-4"
                    onclick="debugWorkflow(${this.actionId})"
                >
                    <span> Debug </span>
                    <span class="ml-1 text-[10px] text-pure material-symbols-outlined">
                        bug_report
                    </span>
                </button>
            </div>
        </div>
    `;
    }

    saveActionForm() {
        let actionNameValue = document.getElementById("actionName").value;
        let leftConditionValue = document.getElementById("leftCondition").value;

        this.actionName =
            actionNameValue === "" ? this.actionName : actionNameValue;

        this.leftCondition =
            leftConditionValue === "" ? "null" : leftConditionValue;

        for (let key in this.conditions) {
            let value = document.getElementById(`case__${key}`).value;
            this.conditions[key].condition =
                value === "" ? this.conditions[key].condition : value;
        }

        document.querySelector(`[actionName="${this.actionId}"]`).innerHTML =
            this.actionName;

        document.getElementById(
            `write__condition__${this.leftWrapperId}`,
        ).innerHTML = this.leftCondition;

        for (let key in this.conditions)
            document.getElementById(`write__condition__${key}`).innerHTML =
                this.conditions[key].condition;
    }

    static getIntance(action) {
        let instance = new IfConditionAction(null);
        instance.actionId = action.actionId;
        instance.actionText = action.actionText;
        instance.actionName = action.actionName;
        instance.actionType = action.actionType;
        instance.parentActionId = action.parentActionId;
        instance.childActionId = action.childActionId;
        instance.data = action.data;
        instance.icon = action.icon;
        instance.conditions = action.conditions;
        instance.leftActionId = action.leftActionId;
        instance.leftWrapperId = action.leftWrapperId;
        instance.leftCondition = action.leftCondition;
        instance.defaultWrapperId = action.defaultWrapperId;
        instance.defaultActionId = action.defaultActionId;
        return instance;
    }

    getObj() {
        return {
            actionId: this.actionId,
            actionText: this.actionText,
            actionName: this.actionName,
            actionType: this.actionType,
            parentActionId: this.parentActionId,
            childActionId: this.childActionId,
            data: this.data,
            icon: this.icon,
            conditions: this.conditions,
            leftActionId: this.leftActionId,
            leftWrapperId: this.leftWrapperId,
            leftCondition: this.leftCondition,
            defaultWrapperId: this.defaultWrapperId,
            defaultActionId: this.defaultActionId,
        };
    }

    markupForDebugWorkflow() {
        return `
        <div class="w-[650px]">
        <div class="flex items-center justify-center flex-col container text-pure">
            <div class="p-4 border border-gray-500 w-[100%] h-[500px] rounded-md">
                <div class="border-b border-gray-500 grid grid-cols-2 items-center justify-center">
                    <div class="p-4 border-r border-gray-500 flex flex-col">
                        <span class="text-primary">Action Name </span>
                        <span class="text-sm">${this.actionName}</span>
                    </div>
                    <div class="p-4 flex flex-col">
                        <span class="text-primary">Condition </span>
                        <span class="text-sm">
                            ${this.condition && this.condition}
                        </span>
                    </div>
                </div>
                <div class="border-b border-gray-500 grid grid-cols-2 items-center justify-center">
                    <div class="p-4 border-r border-gray-500 flex flex-col">
                        <span class="text-primary">True Condition Box Id</span>
                        <span class="text-sm">${this.trueActionId}</span>
                    </div>
                    <div class="p-4 flex flex-col">
                        <span class="text-primary">False Condition Box Id </span>
                        <span class="text-sm">${this.falseActionId}</span>
                    </div>
                </div>
                <div>
                    <div class="p-2 flex flex-col">
                        <span class="text-primary mb-2">Data</span>
                        <textarea class="p-3 text-sm bg-dark border border-gray-500 rounded-md outline-none" rows="12">${
                            this.data &&
                            JSON.stringify(this.data).slice(
                                0,
                                Math.min(
                                    JSON.stringify(this.data).length,
                                    1000,
                                ),
                            )
                        }...</textarea>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    }

    getNextActions(input, nextActions) {
        try {
            if (eval(this.leftCondition))
                nextActions.push({ edge: this.leftWrapperId, data: input });
            else if (eval(this.rightCondition))
                nextActions.push({ edge: this.rightWrapperId, data: input });
            else {
                for (let key in this.conditions) {
                    if (eval(this.conditions[key].condition)) {
                        nextActions.push({
                            edge: this.conditions[key].childActionId,
                            data: input,
                        });
                        break;
                    }
                }
            }
        } catch (error) {
            console.log(error);
            this.data = error.message;
            this.updateActionStatus("ERROR");
            return;
        }

        this.data = input;
        nextActions.push({ edge: this.childActionId, data: input });

        this.updateActionStatus("SUCCESS");
    }
}

function addSwitchCase(actionId) {
    let key = actionId.getAttribute("id");
    let action = ACTIONS.get(key);
    action.addSwitchCase();
}

function deleteSwitchCase(caseId) {
    let key = caseId.getAttribute("actionId");
    let caseKey = caseId.getAttribute("id");
    let action = ACTIONS.get(key);
    action.deleteSwitchCase(caseKey);
}
