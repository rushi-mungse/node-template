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
        icon: "star",
        color: "warning",
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
                    <span class="material-symbols-outlined px-2 py-0.5 mr-0.5 rounded bg-primary text-[10px] text-pure">star</span>
                    <span class="text-pure mx-1 text-md">${this.actionText}</span>
                </div>
                <div class="text-gray text-[12px] px-2 whitespace-nowrap text-ellipsis overflow-hidden max-w-[160px] mt-[2px]" actionName="${this.actionId}">${this.actionName}</div>
            </div>
            <div class="flex items-center justify-between flex-col">
                <div status="${this.actionId}">
                    <i class="fa-solid fa-star text-[10px] font-bold text-warning rounded-full p-[3px] bg-neutral-500 flex items-center justify-center hover:bg-stone-600 transition-all"></i> 
                </div>
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
            <div class="relative select-none flex items-center justify-center">
                <span class="absolute material-symbols-outlined bg-primary rounded-full h-[12px] w-[12px] top-0.5 flex items-center justify-center text-pure text-xs opacity-100 transition-all delay-0 duration-150 group-hover:opacity-100" ondrop="dropAction(${this.actionId}, ${curActionId})" ondragover="allowDropAction()">add</span>
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

    markupForTailBtn(curActionId) {
        return `
            <div class="wrapper">
                <div class="relative flex self-center h-[26px] border-solid border-x border-neutral-500 cursor-pointer z-10">
                    <div class="relative select-none flex items-center justify-center">
                        <span class="absolute material-symbols-outlined bg-primary rounded-full h-[12px] w-[12px] top-1 flex items-center justify-center text-pure text-xs opacity-100 transition-all delay-0 duration-150 group-hover:opacity-100" ondrop="dropAction(${this.actionId}, ${curActionId})" ondragover="allowDropAction()">add</span>
                    </div>
                </div>
            </div
        `;
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
                    <div class="flex relative justify-center self-end items-start w-[calc(50%+1px)] min-h-[30px] border-solid border-t-2 border-l-2 border-neutral-500 rounded-tl-lg cursor-pointer">
                        <div class="absolute -left-0 flex items-center justify-center"> 
                            ${this.markupForDropBtn(this.trueWrapperId)} 
                        </div>
                    </div>
                </div>
                <div class="relative flex grow self-center min-h-[0px] border-solid border-l-2 border-neutral-500"></div>
                <div class="flex relative justify-center self-end items-start w-[calc(50%+1px)] min-h-[10px] border-solid border-b-2 border-l-2 border-neutral-500 rounded-bl-lg"></div>
            </div>`;
    }

    #rightWrapperBox() {
        return `
        <div class="wrapper">
            <div class="flex flex-col group min-w-[295px]" id="${
                this.falseWrapperId
            }" which-link="falseActionId">
                <div class="flex relative justify-center self-start items-start w-[calc(50%+1px)] min-h-[30px] border-solid border-t-2 border-r-2 border-neutral-500 rounded-tr-lg cursor-pointer">
                    <div class="absolute -right-0 flex items-center justify-center"> 
                        ${this.markupForDropBtn(this.falseWrapperId)} 
                    </div>
                </div>
            </div>
            <div class="relative flex grow self-center min-h-[0px] border-solid border-l-2 border-neutral-500"></div>
            <div class="flex relative justify-center self-start items-start w-[calc(50%+1px)] min-h-[10px] border-solid border-b-2 border-r-2 border-neutral-500 rounded-br-lg"></div>
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
                ${this.markupForTailBtn(null)}
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

    getWorflowCodeObj() {
        return {
            actionId: this.actionId,
            // actionText: this.actionText,
            actionName: this.actionName,
            actionType: this.actionType,
            parentActionId: this.parentActionId,
            childAction: null, // modify
            data: this.data,
            // icon: this.icon,
            trueAction: null, // modify
            falseAction: null, // modify
            condition: this.condition,
            // trueWrapperId: this.trueWrapperId,
            // falseWrapperId: this.falseWrapperId,
        };
    }

    buildWorkflowCode(parentActionId, data, arg, cb) {
        let output;
        if (Array.isArray(arg)) {
            data[arg[0]][arg[1]][arg[2]] = this.getWorflowCodeObj();
            output = data[arg[0]][arg[1]][arg[2]];
        } else {
            data[arg] = this.getWorflowCodeObj();
            output = data[arg];
        }

        output.parentActionId = parentActionId;
        cb(this.trueActionId, this.actionId, output, "trueAction");
        cb(this.falseActionId, this.actionId, output, "falseAction");
        cb(this.childActionId, this.actionId, output, "childAction");
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
                    <div class="absolute cursor-pointer left-0 flex items-center justify-center">
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
                    <div class="absolute right-0 cursor-pointer items-center justify-center flex">
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
                        <div class="absolute flex items-center justify-center cursor-pointer inset-x-1/2">
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
                ${this.markupForTailBtn(null)}
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
        let instance = new SwitchAction(null);
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

    getWorflowCodeObj() {
        let newConditions = {},
            cnt = 1;
        for (let key in this.conditions) {
            newConditions[`Case_${cnt}`] = {
                condition: this.conditions[key].condition,
                childAction: null,
            };
            cnt++;
        }

        return {
            actionId: this.actionId,
            // actionText: this.actionText,
            actionName: this.actionName,
            actionType: this.actionType,
            parentActionId: null,
            childAction: null, // modify
            data: this.data,
            // icon: this.icon,
            conditions: newConditions, // modify
            leftAction: null, // modify
            // leftWrapperId: this.leftWrapperId,
            leftCondition: this.leftCondition,
            // defaultWrapperId: this.defaultWrapperId,
            defaultAction: null, // modify
        };
    }

    buildWorkflowCode(parentActionId, data, arg, cb) {
        let output;
        if (Array.isArray(arg)) {
            data[arg[0]][arg[1]][arg[2]] = this.getWorflowCodeObj();
            output = data[arg[0]][arg[1]][arg[2]];
        } else {
            data[arg] = this.getWorflowCodeObj();
            output = data[arg];
        }

        output.parentActionId = parentActionId;

        cb(this.leftActionId, this.actionId, output, "leftAction");
        let cnt = 1;
        for (let id in this.conditions) {
            cb(this.conditions[id].childActionId, this.actionId, output, [
                "conditions",
                `Case_${cnt}`,
                "childAction",
            ]);
            cnt++;
        }
        cb(this.defaultActionId, this.actionId, output, "defaultAction");
        cb(this.childActionId, this.actionId, output, "childAction");
    }
}

class ForLoopAction extends Action {
    constructor(actionId, parentActionId = null, childActionId = null) {
        super(
            actionId,
            "For Loop",
            "New For Loop Action",
            "FOR_LOOP",
            parentActionId,
            childActionId,
            null,
            "network-wired",
        );

        this.rightActionId = null;
        this.rightWrapperId = createId();
        this.startValue = "1";
        this.endValue = "10";
        this.step = "1";
    }

    #leftWrapperBox() {
        return `
        <div class="wrapper">
            <div class="flex flex-col group min-w-[295px]">
                <div class="flex relative justify-center self-end items-start w-[calc(50%+1px)] min-h-[30px] border-solid border-t-2 border-l-2 border-neutral-500 rounded-tl-lg cursor-pointer">
                </div>
            </div>
            <div class="relative flex grow self-center min-h-[0px] border-solid border-l-2 border-neutral-500"></div>
            <div class="flex relative justify-center self-end items-start w-[calc(50%+1px)] min-h-[10px] border-solid border-b-2 border-l-2 border-neutral-500 rounded-bl-lg"></div>
        </div>
    `;
    }

    #rightWrapperBox() {
        return `
            <div class="wrapper">
                <div class="flex flex-col group min-w-[295px]" id="${
                    this.rightWrapperId
                }" which-link="rightActionId">
                    <div class="flex relative justify-center self-start items-start w-[calc(50%+1px)] min-h-[30px] border-solid border-t-2 border-r-2 border-neutral-500 rounded-tr-lg cursor-pointer">
                        <div class="absolute right-0 flex items-center justify-center"> 
                            ${this.markupForDropBtn(this.rightWrapperId)} 
                        </div>
                    </div>
                </div>
                <div class="relative flex grow self-center min-h-[0px] border-solid border-l-2 border-neutral-500"></div>
                <div class="flex relative justify-center self-start items-start w-[calc(50%+1px)] min-h-[10px] border-solid border-b-2 border-r-2 border-neutral-500 rounded-br-lg"></div>
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
                        <div class="absolut self-center py-1 px-2 top-1 text-[10px] tracking-wide font-light text-pure bg-neutral-600 rounded" for-loop="${
                            this.actionId
                        }"> 
                            Loop from ${this.startValue} to ${
                                this.endValue
                            } with step ${this.step}</div>            
                        </div>
                    </div>
                </div>
                <div class="flex justify-center items-stretch min-h-[140px]">
                    ${this.#leftWrapperBox()}
                    ${this.#rightWrapperBox()}
                </div>
                ${this.markupForTailBtn(null)}
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
                    "startValue",
                    this.startValue,
                    "Start Value",
                )}
                ${this.markupForInputBox(
                    "endValue",
                    this.endValue,
                    "End Value",
                )}
                ${this.markupForInputBox("step", this.step, "Step Value")}
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
        let startValue = document.getElementById("startValue").value;
        let endValue = document.getElementById("endValue").value;
        let step = document.getElementById("step").value;

        this.actionName = actionName === "" ? this.actionName : actionName;
        this.startValue = startValue === "" ? this.startValue : startValue;
        this.endValue = endValue === "" ? this.endValue : endValue;
        this.step = step === "" ? this.step : step;

        document.querySelector(`[actionName="${this.actionId}"]`).innerHTML =
            this.actionName;

        document.querySelector(`[for-loop="${this.actionId}"]`).innerHTML =
            `Loop from ${this.startValue} to ${this.endValue} with step ${this.step}`;
    }

    static getIntance(action) {
        let instance = new ForLoopAction(null);
        instance.actionId = action.actionId;
        instance.actionText = action.actionText;
        instance.actionName = action.actionName;
        instance.actionType = action.actionType;
        instance.parentActionId = action.parentActionId;
        instance.childActionId = action.childActionId;
        instance.data = action.data;
        instance.icon = action.icon;
        instance.rightActionId = action.rightActionId;
        instance.rightWrapperId = action.rightWrapperId;
        instance.endValue = action.endValue;
        instance.step = action.step;
        instance.startValue = action.startValue;
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
            rightActionId: this.rightActionId,
            rightWrapperId: this.rightWrapperId,
            step: this.step,
            endValue: this.endValue,
            startValue: this.startValue,
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
        nextActions.push({ edge: this.rightActionId, data: input });
        nextActions.push({ edge: this.childActionId, data: input });
        this.data = input;
        this.updateActionStatus("SUCCESS");
    }

    getWorflowCodeObj() {
        return {
            actionId: this.actionId,
            // actionText: this.actionText,
            actionName: this.actionName,
            actionType: this.actionType,
            parentActionId: null,
            childAction: null,
            data: this.data,
            // icon: this.icon,
            rightAction: null,
            // rightWrapperId: this.rightWrapperId,
            step: this.step,
            endValue: this.endValue,
            startValue: this.startValue,
        };
    }

    buildWorkflowCode(parentActionId, data, arg, cb) {
        let output;
        if (Array.isArray(arg)) {
            data[arg[0]][arg[1]][arg[2]] = this.getWorflowCodeObj();
            output = data[arg[0]][arg[1]][arg[2]];
        } else {
            data[arg] = this.getWorflowCodeObj();
            output = data[arg];
        }

        output.parentActionId = parentActionId;
        cb(this.rightActionId, this.actionId, output, "rightAction");
        cb(this.childActionId, this.actionId, output, "childAction");
    }
}

class LoopDataAction extends Action {
    constructor(actionId, parentActionId = null, childActionId = null) {
        super(
            actionId,
            "Loop Data",
            "New Loop Data Action",
            "LOOP_DATA",
            parentActionId,
            childActionId,
            null,
            "network-wired",
        );

        this.rightActionId = null;
        this.rightWrapperId = createId();
        this.dataForLoop = null;
    }

    #leftWrapperBox() {
        return `
        <div class="wrapper">
            <div class="flex flex-col group min-w-[295px]">
                <div class="flex relative justify-center self-end items-start w-[calc(50%+1px)] min-h-[30px] border-solid border-t-2 border-l-2 border-neutral-500 rounded-tl-lg cursor-pointer">
                </div>
            </div>
            <div class="relative flex grow self-center min-h-[0px] border-solid border-l-2 border-neutral-500"></div>
            <div class="flex relative justify-center self-end items-start w-[calc(50%+1px)] min-h-[10px] border-solid border-b-2 border-l-2 border-neutral-500 rounded-bl-lg"></div>
        </div>
    `;
    }

    #rightWrapperBox() {
        return `
            <div class="wrapper">
                <div class="flex flex-col group min-w-[295px]" id="${
                    this.rightWrapperId
                }" which-link="rightActionId">
                    <div class="flex relative justify-center self-start items-start w-[calc(50%+1px)] min-h-[30px] border-solid border-t-2 border-r-2 border-neutral-500 rounded-tr-lg cursor-pointer">
                        <div class="absolute right-0 flex items-center justify-center"> 
                            ${this.markupForDropBtn(this.rightWrapperId)} 
                        </div>
                    </div>
                </div>
                <div class="relative flex grow self-center min-h-[0px] border-solid border-l-2 border-neutral-500"></div>
                <div class="flex relative justify-center self-start items-start w-[calc(50%+1px)] min-h-[10px] border-solid border-b-2 border-r-2 border-neutral-500 rounded-br-lg"></div>
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
                </div>
                <div class="flex justify-center items-stretch min-h-[140px]">
                    ${this.#leftWrapperBox()}
                    ${this.#rightWrapperBox()}
                </div>
                ${this.markupForTailBtn(null)}
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
                    "dataForLoop",
                    this.dataForLoop,
                    "Data Variable",
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
        let dataForLoop = document.getElementById("dataForLoop").value;

        this.actionName = actionName === "" ? this.actionName : actionName;
        this.dataForLoop = dataForLoop === "" ? this.dataForLoop : dataForLoop;

        document.querySelector(`[actionName="${this.actionId}"]`).innerHTML =
            this.actionName;
    }

    static getIntance(action) {
        let instance = new LoopDataAction(null);
        instance.actionId = action.actionId;
        instance.actionText = action.actionText;
        instance.actionName = action.actionName;
        instance.actionType = action.actionType;
        instance.parentActionId = action.parentActionId;
        instance.childActionId = action.childActionId;
        instance.data = action.data;
        instance.icon = action.icon;
        instance.rightActionId = action.rightActionId;
        instance.rightWrapperId = action.rightWrapperId;
        instance.dataForLoop = action.dataForLoop;
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
            rightActionId: this.rightActionId,
            rightWrapperId: this.rightWrapperId,
            dataForLoop: this.dataForLoop,
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
        nextActions.push({ edge: this.rightActionId, data: input });
        nextActions.push({ edge: this.childActionId, data: input });
        this.data = input;
        this.updateActionStatus("SUCCESS");
    }

    getWorflowCodeObj() {
        return {
            actionId: this.actionId,
            // actionText: this.actionText,
            actionName: this.actionName,
            actionType: this.actionType,
            parentActionId: null,
            childAction: null,
            data: this.data,
            // icon: this.icon,
            rightAction: null,
            // rightWrapperId: this.rightWrapperId,
            dataForLoop: this.dataForLoop,
        };
    }

    buildWorkflowCode(parentActionId, data, arg, cb) {
        let output;
        if (Array.isArray(arg)) {
            data[arg[0]][arg[1]][arg[2]] = this.getWorflowCodeObj();
            output = data[arg[0]][arg[1]][arg[2]];
        } else {
            data[arg] = this.getWorflowCodeObj();
            output = data[arg];
        }

        output.parentActionId = parentActionId;
        cb(this.rightActionId, this.actionId, output, "rightAction");
        cb(this.childActionId, this.actionId, output, "childAction");
    }
}

class ConsoleLogAction extends Action {
    constructor(actionId, parentActionId = null, childActionId = null) {
        super(
            actionId,
            "Console Log",
            "New Console Log Action",
            "CONSOLE_LOG",
            parentActionId,
            childActionId,
            null,
            "star",
        );

        this.consoleLogData = null;
    }

    markupForMainAction() {
        return `
        <div id="${this.actionId}">
            <div>
                <div class="flex flex-col justify-start flex-nowrap group">
                    <div class="flex relative self-center flex-col items-center">
                        <div>${this.markupForMainWrapper()}</div>
                    </div>
                </div>
                ${this.markupForTailBtn(null)}
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
                    "dataVariable",
                    this.consoleLogData,
                    "Data Variable",
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
        let consoleLogData = document.getElementById("dataVariable").value;

        this.actionName = actionName === "" ? this.actionName : actionName;
        this.consoleLogData =
            consoleLogData === "" ? this.consoleLogData : consoleLogData;

        document.querySelector(`[actionName="${this.actionId}"]`).innerHTML =
            this.actionName;
    }

    static getIntance(action) {
        let instance = new ConsoleLogAction(null);
        instance.actionId = action.actionId;
        instance.actionText = action.actionText;
        instance.actionName = action.actionName;
        instance.actionType = action.actionType;
        instance.parentActionId = action.parentActionId;
        instance.childActionId = action.childActionId;
        instance.data = action.data;
        instance.icon = action.icon;
        instance.consoleLogData = action.consoleLogData;
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
            consoleLogData: this.consoleLogData,
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
            if (eval(this.consoleLogData)) {
                console.log(eval(this.consoleLogData));
            }
            this.data = input;
            this.updateActionStatus("SUCCESS");
            nextActions.push({ edge: this.childActionId, data: input });
        } catch (error) {
            console.log(error);
            return notify("Something went wrong!", "danger");
        }
    }

    getWorflowCodeObj() {
        return {
            actionId: this.actionId,
            // actionText: this.actionText,
            actionName: this.actionName,
            actionType: this.actionType,
            parentActionId: null,
            childAction: null,
            data: this.data,
            // icon: this.icon,
            consoleLogData: this.consoleLogData,
        };
    }

    buildWorkflowCode(parentActionId, data, arg, cb) {
        let output;
        if (Array.isArray(arg)) {
            data[arg[0]][arg[1]][arg[2]] = this.getWorflowCodeObj();
            output = data[arg[0]][arg[1]][arg[2]];
        } else {
            data[arg] = this.getWorflowCodeObj();
            output = data[arg];
        }

        output.parentActionId = parentActionId;
        cb(this.childActionId, this.actionId, output, "childAction");
    }
}

class NotificationAction extends Action {
    constructor(actionId, parentActionId = null, childActionId = null) {
        super(
            actionId,
            "Notification",
            "New Notification",
            "NOTIFICATION",
            parentActionId,
            childActionId,
            null,
            "star",
        );

        this.notification = "🔥 New Notification Message!";
        this.type = "none";
    }

    markupForMainAction() {
        return `
        <div id="${this.actionId}">
            <div>
                <div class="flex flex-col justify-start flex-nowrap group">
                    <div class="flex relative self-center flex-col items-center">
                        <div>${this.markupForMainWrapper()}</div>
                    </div>
                </div>
                ${this.markupForTailBtn(null)}
            </div>
        </div>
    `;
    }

    #createSelectInputBox() {
        return `
            <div class="inputBox">
                <select id="notificationType" name="notificationType">
                    <option value="none" ${
                        this.type === "none" ? "selected" : ""
                    }>NONE</option>
                    <option value="success" ${
                        this.type === "success" ? "selected" : ""
                    }>SUCCESS</option>
                    <option value="warning" ${
                        this.type === "warning" ? "selected" : ""
                    }>WARNING</option>
                    <option value="danger" ${
                        this.type === "danger" ? "selected" : ""
                    }>ERROR</option>
                </select>
                <label for="methods">Select Type</label>
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
                    "notification",
                    this.notification,
                    "Notification Msg",
                )}
                ${this.#createSelectInputBox()}
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
        let notification = document.getElementById("notification").value;

        this.actionName = actionName === "" ? this.actionName : actionName;
        this.notification =
            notification === "" ? this.notification : notification;

        this.type = document.getElementById("notificationType").value;
        document.querySelector(`[actionName="${this.actionId}"]`).innerHTML =
            this.actionName;
    }

    static getIntance(action) {
        let instance = new NotificationAction(null);
        instance.actionId = action.actionId;
        instance.actionText = action.actionText;
        instance.actionName = action.actionName;
        instance.actionType = action.actionType;
        instance.parentActionId = action.parentActionId;
        instance.childActionId = action.childActionId;
        instance.data = action.data;
        instance.icon = action.icon;
        instance.notification = action.notification;
        instance.type = action.type;
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
            notification: this.notification,
            type: this.type,
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
        notify(this.notification, this.type);
        this.data = input;
        nextActions.push({ edge: this.childActionId, data: input });
        this.updateActionStatus("SUCCESS");
    }

    getWorflowCodeObj() {
        return {
            actionId: this.actionId,
            // actionText: this.actionText,
            actionName: this.actionName,
            actionType: this.actionType,
            parentActionId: null,
            childAction: null,
            data: this.data,
            // icon: this.icon,
            notification: this.notification,
            type: this.type,
        };
    }

    buildWorkflowCode(parentActionId, data, arg, cb) {
        let output;
        if (Array.isArray(arg)) {
            data[arg[0]][arg[1]][arg[2]] = this.getWorflowCodeObj();
            output = data[arg[0]][arg[1]][arg[2]];
        } else {
            data[arg] = this.getWorflowCodeObj();
            output = data[arg];
        }

        output.parentActionId = parentActionId;
        cb(this.childActionId, this.actionId, output, "childAction");
    }
}

class WebhookAction extends Action {
    constructor(actionId, parentActionId = null, childActionId = null) {
        super(
            actionId,
            "Webhook",
            "New Webhook Action",
            "WEBHOOK",
            parentActionId,
            childActionId,
            null,
            "star",
        );

        this.url = "";
        this.method = "GET";
    }

    markupForMainAction() {
        return `
        <div id="${this.actionId}">
            <div>
                <div class="flex flex-col justify-start flex-nowrap group">
                    <div class="flex relative self-center flex-col items-center">
                        <div>${this.markupForMainWrapper()}</div>
                    </div>
                </div>
                ${this.markupForTailBtn(null)}
            </div>
        </div>
    `;
    }

    #createSelectInputBox() {
        return `
            <div class="inputBox">
                <select id="method" name="method">
                    <option value="GET" ${
                        this.method === "GET" ? "selected" : ""
                    }>GET</option>
                    <option value="POST" ${
                        this.method === "POST" ? "selected" : ""
                    }>POST</option>
                </select>
                <label for="methods">Select Method</label>
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
                ${this.markupForInputBox("url", this.url, "Webhook api url")}
                ${this.#createSelectInputBox()}
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
        let url = document.getElementById("url").value;

        this.actionName = actionName === "" ? this.actionName : actionName;
        this.url = url === "" ? this.url : url;
        this.method = document.getElementById("method").value;

        document.querySelector(`[actionName="${this.actionId}"]`).innerHTML =
            this.actionName;
    }

    static getIntance(action) {
        let instance = new WebhookAction(null);
        instance.actionId = action.actionId;
        instance.actionText = action.actionText;
        instance.actionName = action.actionName;
        instance.actionType = action.actionType;
        instance.parentActionId = action.parentActionId;
        instance.childActionId = action.childActionId;
        instance.data = action.data;
        instance.icon = action.icon;
        instance.url = action.url;
        instance.method = action.method;
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
            url: this.url,
            method: this.method,
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

    async getNextActions(input, nextActions) {
        let url = this.url;
        let method = this.method;
        this.data = input;

        try {
            const http = new HTTPRequest(null);
            let { data } = await http.webhookRequest(url, method, this.data);
            console.log(data);
            this.data = data;
            this.updateActionStatus("SUCCESS");
            nextActions.push({ edge: this.childActionId, input: data });
        } catch (error) {
            console.log(error);
            this.updateActionStatus("ERROR");
            notify("Something went wrong!", "danger");
            this.data = "ERROR ACCURED!";
            return;
        }
    }

    getWorflowCodeObj() {
        return {
            actionId: this.actionId,
            // actionText: this.actionText,
            actionName: this.actionName,
            actionType: this.actionType,
            parentActionId: null,
            childAction: null,
            data: this.data,
            // icon: this.icon,
            url: this.url,
            method: this.method,
        };
    }

    buildWorkflowCode(parentActionId, data, arg, cb) {
        let output;
        if (Array.isArray(arg)) {
            data[arg[0]][arg[1]][arg[2]] = this.getWorflowCodeObj();
            output = data[arg[0]][arg[1]][arg[2]];
        } else {
            data[arg] = this.getWorflowCodeObj();
            output = data[arg];
        }

        output.parentActionId = parentActionId;
        cb(this.childActionId, this.actionId, output, "childAction");
    }
}

class CodeBlockAction extends Action {
    constructor(actionId, parentActionId = null, childActionId = null) {
        super(
            actionId,
            "Codeblock",
            "New Codeblock Action",
            "CODE_BLOCK",
            parentActionId,
            childActionId,
            null,
            "star",
        );

        this.code = "";
        this.context = {};
    }

    markupForMainAction() {
        return `
        <div id="${this.actionId}">
            <div>
                <div class="flex flex-col justify-start flex-nowrap group">
                    <div class="flex relative self-center flex-col items-center">
                        <div>${this.markupForMainWrapper()}</div>
                    </div>
                </div>
                ${this.markupForTailBtn(null)}
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
            </form>
            <div>
                <button class="btn bg-boxColor flex items-center justify-center hover:bg-neutral-600 ml-4 mb-4" onclick="openCodeBlock(${
                    this.actionId
                })"> 
                    <span class="mr-1 text-[14px] text-warning material-symbols-outlined">code</span>
                    <span> Write Code </span>
                </button> 
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
        </div>
    `;
    }

    saveActionForm() {
        let actionName = document.getElementById("actionName").value;

        this.actionName = actionName === "" ? this.actionName : actionName;

        document.querySelector(`[actionName="${this.actionId}"]`).innerHTML =
            this.actionName;
    }

    static getIntance(action) {
        let instance = new CodeBlockAction(null);
        instance.actionId = action.actionId;
        instance.actionText = action.actionText;
        instance.actionName = action.actionName;
        instance.actionType = action.actionType;
        instance.parentActionId = action.parentActionId;
        instance.childActionId = action.childActionId;
        instance.data = action.data;
        instance.icon = action.icon;
        instance.code = action.code;
        instance.context = action.context;
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
            code: this.code,
            context: this.context,
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

    async getNextActions(input, nextActions) {
        try {
            let code = this.code;
            let context = {};
            for (const key in this.context) {
                if (
                    typeof eval(this.context[key].value) === "undefined" ||
                    !eval(this.context[key].value)
                ) {
                    this.updateActionStatus("ERROR");
                    notify("Pass parameter values valid!", "danger");
                    this.data = "ERROR ACCURED!";
                    return;
                }
                context[this.context[key].key] = eval(this.context[key].value);
            }

            const data = await axios.post("/api/compiler", { code, context });
            this.data = data;
            this.updateActionStatus("SUCCESS");
            nextActions.push({ edge: this.childActionId, data: data.data });
        } catch (error) {
            console.log(error);
            notify("Something Went Wrong!", "danger");
            action.data = error;
            return;
        }
    }

    getWorflowCodeObj() {
        return {
            actionId: this.actionId,
            // actionText: this.actionText,
            actionName: this.actionName,
            actionType: this.actionType,
            parentActionId: null,
            childAction: null,
            data: this.data,
            // icon: this.icon,
            code: this.code,
            context: this.context,
        };
    }

    buildWorkflowCode(parentActionId, data, arg, cb) {
        let output;
        if (Array.isArray(arg)) {
            data[arg[0]][arg[1]][arg[2]] = this.getWorflowCodeObj();
            output = data[arg[0]][arg[1]][arg[2]];
        } else {
            data[arg] = this.getWorflowCodeObj();
            output = data[arg];
        }

        output.parentActionId = parentActionId;
        cb(this.childActionId, this.actionId, output, "childAction");
    }
}

class SendEmailAction extends Action {
    constructor(actionId, parentActionId = null, childActionId = null) {
        super(
            actionId,
            "Send Email",
            "New Send Email Action",
            "SEND_EMAIL",
            parentActionId,
            childActionId,
            null,
            "star",
        );

        this.to = "";
        this.from = "";
        this.subject = "";
        this.html = "";
    }

    markupForMainAction() {
        return `
        <div id="${this.actionId}">
            <div>
                <div class="flex flex-col justify-start flex-nowrap group">
                    <div class="flex relative self-center flex-col items-center">
                        <div>${this.markupForMainWrapper()}</div>
                    </div>
                </div>
                ${this.markupForTailBtn(null)}
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
                ${this.markupForInputBox("from", this.from, "From")}
                ${this.markupForInputBox("to", this.to, "To")}
                ${this.markupForInputBox("subject", this.subject, "Subject")}
                ${this.markupForInputBox("html", this.subject, "Html Content")}
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
        let subject = document.getElementById("subject").value;
        let html = document.getElementById("html").value;
        let to = document.getElementById("to").value;
        let from = document.getElementById("from").value;

        this.actionName = actionName === "" ? this.actionName : actionName;
        this.subject = subject === "" ? this.subject : subject;
        this.html = html === "" ? this.html : html;
        this.to = to === "" ? this.to : to;
        this.from = from === "" ? this.from : from;

        document.querySelector(`[actionName="${this.actionId}"]`).innerHTML =
            this.actionName;
    }

    static getIntance(action) {
        let instance = new SendEmailAction(null);
        instance.actionId = action.actionId;
        instance.actionText = action.actionText;
        instance.actionName = action.actionName;
        instance.actionType = action.actionType;
        instance.parentActionId = action.parentActionId;
        instance.childActionId = action.childActionId;
        instance.data = action.data;
        instance.icon = action.icon;
        instance.to = action.to;
        instance.from = action.from;
        instance.subject = action.subject;
        instance.html = action.html;
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
            to: this.to,
            from: this.from,
            subject: this.subject,
            html: this.html,
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

    async getNextActions(input, nextActions) {
        let html = this.html,
            to = this.to,
            from = this.from,
            subject = this.subject;

        try {
            const { data } = await axios.post("/api/send-email", {
                html,
                to,
                from,
                subject,
            });

            if (!data.ok) {
                this.updateActionStatus("ERROR");
                notify("Something went wrong!", "danger");
                this.data = "ERROR ACCURED!";
                return;
            }

            this.data = input;
            nextActions.push({ edge: this.childActionId, data: input });
        } catch (error) {
            console.log(error);
            this.updateActionStatus("ERROR");
            notify("Something went wrong!", "danger");
            this.data = "ERROR ACCURED!";
        }
    }

    getWorflowCodeObj() {
        return {
            actionId: this.actionId,
            // actionText: this.actionText,
            actionName: this.actionName,
            actionType: this.actionType,
            parentAction: null,
            childAction: null,
            data: this.data,
            // icon: this.icon,
            to: this.to,
            from: this.from,
            subject: this.subject,
            html: this.html,
        };
    }

    buildWorkflowCode(parentActionId, data, arg, cb) {
        let output;
        if (Array.isArray(arg)) {
            data[arg[0]][arg[1]][arg[2]] = this.getWorflowCodeObj();
            output = data[arg[0]][arg[1]][arg[2]];
        } else {
            data[arg] = this.getWorflowCodeObj();
            output = data[arg];
        }

        output.parentActionId = parentActionId;
        cb(this.childActionId, this.actionId, output, "childAction");
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
