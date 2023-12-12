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

function saveWorkflowCodeModal() {
    const data = codemirror.getValue();
    try {
        const obj = JSON.parse(data);
        console.log(obj);
    } catch (error) {
        console.log(error);
        return notiry(
            "Something missing properties or syntax error in code!",
            "danger",
        );
    }
}
