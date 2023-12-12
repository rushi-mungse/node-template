const workflowCodeModal = document.getElementById("workflowCodeModal");
const workflowCode = document.getElementById("workflowCode");

let codemirror = CodeMirror.fromTextArea(workflowCode, {
    lineNumbers: true,
    mode: "application/json",
    indentUnit: 2,
});

async function formateJson() {
    const data = codemirror.getValue();
    try {
        const format = await JSON.stringify(JSON.parse(data), null, 2);
        codemirror.setValue(format);
    } catch (error) {
        console.log(error);
    }
}

function makeObjectFromData(curActionId, parentActionId, data, arg) {
    if (!ACTIONS.has(curActionId)) return;
    let curAction = ACTIONS.get(curActionId);
    curAction.buildWorkflowCode(parentActionId, data, arg, makeObjectFromData);
}

async function openWorkflowCodeModal() {
    let data = {
        uid: UID,
        workflowName: WORKFLOW_NAME,
        createdAt: CREATED_AT,
        updatedAt: firebase.firestore.Timestamp.fromDate(new Date()),
        // root: ROOT_ACTION.actionId,
    };

    // for (let [key, action] of ACTIONS) data[key] = action.getObj();

    makeObjectFromData(ROOT_ACTION.actionId, null, data, "root");

    try {
        const format = await JSON.stringify(data, null, 2);
        codemirror.setValue(format);
    } catch (error) {
        console.log(error);
    }

    workflowCodeModal.classList.add("active");
}

function closeWorkflowCodeModal() {
    workflowCodeModal.classList.remove("active");
}

workflowCodeModal.addEventListener("click", function (e) {
    if (e.target !== this) return;
    closeDebugWorkflowModal();
});

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeDebugWorkflowModal();
});

async function saveWorkflowCodeModal() {
    const data = codemirror.getValue();
    try {
        const obj = await JSON.parse(data);
        ACTIONS.clear();
        await buildWorkflowUsingCode(null, obj.root, ACTIONS, "childActionId");
        ROOT = obj.root.actionId;
        console.log(ACTIONS);
        buildWorkflow({ workflowName: WORKFLOW_NAME }, false);
    } catch (error) {
        console.log(error);
        notify(
            "Something missing properties or syntax error in code!",
            "danger",
        );
    }
}

async function buildWorkflowUsingCode(parentActionId, data, map, arg) {
    if (!data) return;
    try {
        if (data.actionType === "HTTP_REQUEST") {
            await HTTPRequestAction.buildObjFromCode(
                parentActionId,
                data,
                map,
                buildWorkflowUsingCode,
                arg,
            );
        } else if (data.actionType === "SWITCH") {
            await SwitchAction.buildObjFromCode(
                parentActionId,
                data,
                map,
                buildWorkflowUsingCode,
                arg,
            );
        } else if (data.actionType === "IF_CONDITION") {
            await IfConditionAction.buildObjFromCode(
                parentActionId,
                data,
                map,
                buildWorkflowUsingCode,
                arg,
            );
        } else if (data.actionType === "FOR_LOOP") {
            await ForLoopAction.buildObjFromCode(
                parentActionId,
                data,
                map,
                buildWorkflowUsingCode,
                arg,
            );
        } else if (data.actionType === "LOOP_DATA") {
            await LoopDataAction.buildObjFromCode(
                parentActionId,
                data,
                map,
                buildWorkflowUsingCode,
                arg,
            );
        } else if (data.actionType === "NOTIFICATION") {
            await NotificationAction.buildObjFromCode(
                parentActionId,
                data,
                map,
                buildWorkflowUsingCode,
                arg,
            );
        } else if (data.actionType === "CONSOLE_LOG") {
            await ConsoleLogAction.buildObjFromCode(
                parentActionId,
                data,
                map,
                buildWorkflowUsingCode,
                arg,
            );
        } else if (data.actionType === "CODEBLOCK") {
            await CodeBlockAction.buildObjFromCode(
                parentActionId,
                data,
                map,
                buildWorkflowUsingCode,
                arg,
            );
        } else if (data.actionType === "WEBHOOK") {
            await WebhookAction.buildObjFromCode(
                parentActionId,
                data,
                map,
                buildWorkflowUsingCode,
                arg,
            );
        } else if (data.actionType === "SEND_EMAIL") {
            await SendEmailAction.buildObjFromCode(
                parentActionId,
                data,
                map,
                buildWorkflowUsingCode,
                arg,
            );
        }
    } catch (error) {
        console.log(error);
        notify("Something went wrong with workflow code!", "danger");
    }
}
