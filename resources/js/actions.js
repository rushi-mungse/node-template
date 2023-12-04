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

    markupForDropBtn(curActionId = null) {
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
        <div class="inputBox">
            <input class="placeholder-gray placeholder-opacity-30" name="${name}" type="${type}" id="${name}" required ${
                value && `value="${value}"`
            } placeholder="${text}"/>
            <label for="${name}">${label}</label>
        </div>`;
    }

    markupForActionStatus(status) {
        document.querySelector(`[status="${this.boxId}"]`).innerHTML = `
        <i class="fa-solid fa-${STATUS[status].icon} text-[14px] font-bold text-${STATUS[status].color} rounded-full p-[1px] bg-neutral-500 flex items-center justify-center"></i>
    `;
    }
}

class IfConditionAction extends Action {
    constructor(
        actionId,
        parentActionId = null,
        childActionId = null,
        trueActionId = null,
        falseActionId = null,
    ) {
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

        this.trueActionId = trueActionId;
        this.falseActionId = falseActionId;
        this.condition = null;
    }

    #leftWrapperBox() {
        let trueActionWrapperId = createId();
        return `
            <div class="wrapper">
                <div class="flex flex-col group min-w-[295px]" id="${trueActionWrapperId}" which-link="trueAction">
                    <div class="flex relative justify-center self-end items-start w-[50%] min-h-[30px] border-solid border-t-2 border-l-2 border-neutral-500 rounded-tl-lg cursor-pointer">
                        <div class="absolute -left-0.5 top-2/4"> 
                            ${this.markupForDropBtn(trueActionWrapperId)} 
                        </div>
                    </div>
                </div>
                <div class="relative flex grow self-center min-h-[0px] border-solid border-l-2 border-neutral-500"></div>
                <div class="flex relative justify-center self-end items-start w-[50%] min-h-[10px] border-solid border-b-2 border-l-2 border-neutral-500 rounded-bl-lg"></div>
            </div>`;
    }

    #rightWrapperBox() {
        let falseActionWrapperId = createId();
        return `
        <div class="wrapper">
            <div class="flex flex-col group min-w-[295px]" id="${falseActionWrapperId}" which-link="falseAction">
                <div class="flex relative justify-center self-start items-start w-[50%] min-h-[30px] border-solid border-t-2 border-r-2 border-neutral-500 rounded-tr-lg cursor-pointer">
                    <div class="absolute -right-0.5 top-2/4"> 
                        ${this.markupForDropBtn(falseActionWrapperId)} 
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
        return instance;
    }

    static getObj(action) {
        return {
            actionId: action.actionId,
            actionText: action.actionText,
            actionName: action.actionName,
            actionType: action.actionType,
            parentActionId: action.parentActionId,
            childActionId: action.childActionId,
            data: action.data,
            icon: action.icon,
            trueActionId: action.trueActionId,
            falseActionId: action.falseActionId,
            condition: action.condition,
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
                        <span class="text-sm">IF CONDITION</span>
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
}
