let ACTIONS = new Map();
let currentActionType = "HTTP_REQUEST";
let initialMouseX = 0,
    initialMouseY = 0,
    isTransposing = false;
let ROOT_ACTION;
const searchParams = new URLSearchParams(window.location.search);
const workflowId = searchParams.get("workflowId");

const workspace = document.getElementById("workspace");
let actionAndControlsForm = document.getElementById("actionAndControlsForm");
let actionAndControlsFormWrapper = document.getElementById(
    "actionAndControlsFormWrapper",
);
// workspace.innerHTML = ROOT_ACTION.markupForMainAction();

let WORKFLOW_NAME,
    UID,
    ROOT,
    CREATED_AT,
    DEBUG_MODE = false,
    RUN_CODE = false;

function dragAction(event) {
    currentActionType = event.target.getAttribute("actionType");
}

function dropAction(parentEl, wrapperEl) {
    let curAction = getAction(currentActionType),
        markup = curAction.markupForMainAction();
    let parentId = parentEl.getAttribute("id"),
        parentAction = ACTIONS.get(parentId),
        parentChildId = null;

    if (wrapperEl === null) {
        // build connection in three action [parentEl, curActionEl, childActionEl]
        parentChildId = parentAction.childActionId;
        parentAction.childActionId = curAction.actionId;
        curAction.parentActionId = parentId;
        curAction.childActionId = parentChildId;
        parentEl.insertAdjacentHTML("afterend", markup);
    } else {
        let whichLink = wrapperEl.getAttribute("which-link");
        if (whichLink === "case") {
        } else if (whichLink === "trueAction") {
            parentChildId = parentAction.trueActionId;
            parentAction.trueActionId = curAction.actionId;
            curAction.parentActionId = parentId;
            curAction.childActionId = parentChildId;
        } else if (whichLink === "falseAction") {
            parentChildId = parentAction.falseActionId;
            parentAction.falseActionId = curAction.actionId;
            curAction.parentActionId = parentId;
            curAction.childActionId = parentChildId;
        } else if (whichLink === "rightBoxId") {
        } else if (whichLink === "defaultCase") {
        }
        wrapperEl.innerHTML += markup;
    }
}

function allowDropAction() {
    event.preventDefault();
}

function openActionForm(element) {
    if (actionAndControlsForm.style.display === "flex") closeActionForm();

    var key =
        element.length > 0
            ? element[0].getAttribute("id")
            : element.getAttribute("id");

    actionAndControlsFormWrapper.setAttribute("actionKey", key);
    let markup = ACTIONS.get(key).createActionForm();
    actionAndControlsFormWrapper.innerHTML = markup;
    actionAndControlsForm.style.display = "flex";

    toggleDebugBtn();
}

function closeActionForm() {
    actionAndControlsFormWrapper.innerHTML = "";
    actionAndControlsFormWrapper.removeAttribute("actionKey");
    actionAndControlsForm.style.display = "none";
}

function saveActionForm() {
    let actionKey = actionAndControlsFormWrapper.getAttribute("actionKey");
    if (!actionKey) {
        alert("actionKey not found!");
        return;
    }
    ACTIONS.get(actionKey).saveActionForm();
    closeActionForm();
}

document.addEventListener("wheel", (event) => {
    if (!event.ctrlKey) return;
    let zoom = +workspace.getAttribute("data-scale");
    let x = workspace.getAttribute("data-x");
    let y = workspace.getAttribute("data-y");
    zoom += event.deltaY > 0 ? 0.02 : -0.02;
    if (zoom > 0.5 && zoom < 2) {
        workspace.style.transform = `translate(${x}px, ${y}px) scale(${zoom})`;
        workspace.setAttribute("data-scale", zoom);
    }
});

workspace.addEventListener("mousedown", (event) => {
    if (event.buttons === 4) {
        let x = +workspace.getAttribute("data-x");
        let y = +workspace.getAttribute("data-y");
        initialMouseX = event.clientX - x;
        initialMouseY = event.clientY - y;
        isTransposing = true;
    }
});

document.addEventListener("mousemove", (event) => {
    let zoom = +workspace.getAttribute("data-scale");
    if (isTransposing) {
        const deltaX = event.clientX - initialMouseX;
        const deltaY = event.clientY - initialMouseY;
        workspace.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${zoom})`;
        workspace.setAttribute("data-x", deltaX);
        workspace.setAttribute("data-y", deltaY);
    }
});

document.addEventListener("mouseup", () => {
    if (isTransposing) {
        initialMouseX = 0;
        initialMouseY = 0;
        isTransposing = false;
    }
});

function resetWorkflowPosition() {
    workspace.style.transform = `translate(${0}px, ${0}px) scale(${1})`;
    workspace.setAttribute("data-scale", 1);
    workspace.setAttribute("data-x", 0);
    workspace.setAttribute("data-y", 0);
}

function toggleActionsAndControls() {
    let toggleActionBtn = document.getElementById("toggleActionsAndControls");
    let actionBox = document.getElementById("actionsAndControlsWrapper");
    let toggleActionBoxIcon = document.getElementById(
        "toggleActionsAndControlsIcon",
    );
    let flag = toggleActionBtn.getAttribute("flag");

    toggleActionBtn.setAttribute("flag", flag === "true" ? "false" : "true");
    actionBox.style.display = flag === "true" ? "none" : "block";
    toggleActionBoxIcon.innerText = flag === "true" ? "menu" : "close";
    toggleActionBtn.classList.remove(
        flag === "true" ? "text-danger" : "text-success",
    );
    toggleActionBtn.classList.add(
        flag === "true" ? "text-success" : "text-danger",
    );
}

async function dfs(root, input) {
    if (!ACTIONS.has(root)) return;
    let action = ACTIONS.get(root);
    console.log(action);
    const nextActions = await getNextActions(action, input);
    (typeof nextActions !== "undefined" ? nextActions : []).map(
        async (next) => await dfs(next.edge, next.data),
    );
}

function runWorkflow() {
    RUN_CODE = true;
    console.log(ACTIONS);
    for (let [_, value] of ACTIONS) value.updateActionStatus("WARNING");
    dfs(ROOT_ACTION.actionId, null);
}

async function saveWorkflow() {
    let data = {
        uid: UID,
        workflowName: WORKFLOW_NAME,
        createdAt: CREATED_AT,
        updatedAt: firebase.firestore.Timestamp.fromDate(new Date()),
        root: ROOT_ACTION.actionId,
    };

    for (let [key, action] of ACTIONS) data[key] = action.getObj();
    console.log(data);

    try {
        await db.collection("workflows").doc(workflowId).delete();
        await db.collection("workflows").doc(workflowId).set(data);
    } catch (error) {
        console.log(error);
        notify("Something Went Wrong!", "danger");
    }
    notify("▶︎ Successfully Saved!", "success");
}

// delete action and control
function deleteAction(id) {
    let key = id.length > 0 ? id[0].getAttribute("id") : id.getAttribute("id");
    if (id.length > 0) id = id[1];

    let action = ACTIONS.get(key);
    let parentActionId = action.parentActionId;
    let childActionId = action.childActionId;

    if (ACTIONS.has(parentActionId) && childActionId) {
        let parent = ACTIONS.get(parentActionId);
        parent.childActionId = childActionId;
    }

    ACTIONS.delete(key);
    saveWorkflow();
    notify("➢ Deleted Successfully", "success");
    id.remove();
    event.stopPropagation();
}

async function init() {
    await firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            db.collection("workflows")
                .doc(workflowId)
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        UID = doc.data().uid;
                        WORKFLOW_NAME = doc.data().workflowName;
                        CREATED_AT = doc.data().createdAt;
                        ROOT = doc.data().root;
                        buildWorkflow(doc.data());
                    } else {
                        console.log("No such document!");
                        notify("No such document found!", "danger");
                    }
                })
                .catch((error) => {
                    notify("Error getting document", "danger");
                    console.log("Error getting document:", error);
                });
        } else {
            location.replace("/");
        }
    });
}

function buildWorkflow(data) {
    document.getElementById("workflowNameWrapper").style.display = "flex";
    document.getElementById("workflowName").innerText = data.workflowName;
    for (let key in data)
        if (
            typeof data[key] === "object" &&
            data[key].hasOwnProperty("actionId")
        )
            ACTIONS.set(data[key].actionId, createInstance(data[key]));
    ROOT_ACTION = ACTIONS.get(ROOT);
    workspace.innerHTML = ROOT_ACTION.markupForMainAction();

    dfsForBuildWorkflow(ROOT_ACTION.trueActionId, ROOT_ACTION.trueWrapperId);
    dfsForBuildWorkflow(ROOT_ACTION.falseActionId, ROOT_ACTION.falseWrapperId);
    dfsForBuildWorkflow(ROOT_ACTION.childActionId, ROOT_ACTION.actionId);
}

function dfsForBuildWorkflow(curActionId, wrapperActionId) {
    if (!ACTIONS.has(curActionId)) return;

    let action = ACTIONS.get(curActionId);
    let wrapperEl = document.getElementById(wrapperActionId);
    wrapperEl.insertAdjacentHTML("afterend", action.markupForMainAction());

    if (action.id === "IF_CONDITION") {
        dfsForBuildWorkflow(action.trueActionId, action.trueWrapperId);
        dfsForBuildWorkflow(action.falseActionId, action.falseWrapperId);
    } else if (action.id === "FOR_LOOP")
        dfsForBuildWorkflow(
            action.rightSideActionId,
            action.rightSideWrapperId,
        );
    else if (action.id === "LOOP_DATA")
        dfsForBuildWorkflow(
            action.rightSideActionId,
            action.rightSideWrapperId,
        );
    else if (action.id === "SWITCH") {
        for (let i = 0; i < action.cases.length; i++)
            dfsForBuildWorkflow(action.cases[i], action.caseWrapperIds[i]);
        dfsForBuildWorkflow(action.defaultCase, action.defaultCaseWrapperId);
    }
}

init();
