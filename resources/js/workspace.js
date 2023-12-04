const headerLinks = document.querySelectorAll("#headerLinks a");
headerLinks.forEach((link) => link.classList.remove("activeHeaderLink"));

let ACTIONS = new Map();
let currentActionType = "HTTP_REQUEST";
let initialMouseX = 0, initialMouseY = 0, isTransposing = false;
const ROOT_ACTION = getAction("IF_CONDITION"); // TODO: Change starting action
const searchParams = new URLSearchParams(window.location.search);
const workflowId = searchParams.get("workflowId");

const workspace = document.getElementById("workspace");
let actionAndControlsForm = document.getElementById("actionAndControlsForm");
let actionAndControlsFormWrapper = document.getElementById("actionAndControlsFormWrapper");
workspace.innerHTML = ROOT_ACTION.markupForMainAction();

let WORKFLOW_NAME, UID, ROOT, CREATED_AT, DEBUG_MODE = false, RUN_CODE = true;

function dragAction(event) {
    currentActionType = event.target.getAttribute("actionType");
    console.log(currentActionType)
}

function dropAction(parentEl, wrapperEl) {
    let curAction = getAction(currentActionType), markup = curAction.markupForMainAction();
    let parentId = parentEl.getAttribute("id"), parentAction = ACTIONS.get(parentId), parentChildId = null;

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
};

function openActionForm(element) {
    if (actionAndControlsForm.style.display === "flex") closeActionForm();

    var key =
        element.length > 0
            ? element[0].getAttribute("id")
            : element.getAttribute("id");

    actionAndControlsFormWrapper.setAttribute('actionKey', key);
    let markup = ACTIONS.get(key).createActionForm();
    actionAndControlsFormWrapper.innerHTML = markup;
    actionAndControlsForm.style.display = "flex";

    toggleDebugBtn();
};

function closeActionForm() {
    actionAndControlsFormWrapper.innerHTML = "";
    actionAndControlsFormWrapper.removeAttribute('actionKey');
    actionAndControlsForm.style.display = "none";
};

function saveActionForm() {
    let actionKey = actionAndControlsFormWrapper.getAttribute("actionKey");
    if (!actionKey) {
        alert('actionKey not found!');
        return;
    }
    ACTIONS.get(actionKey).saveActionForm();
    closeActionForm();
};

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
    let toggleActionBoxIcon = document.getElementById("toggleActionsAndControlsIcon");
    let flag = toggleActionBtn.getAttribute("flag");

    toggleActionBtn.setAttribute("flag", flag === "true" ? "false" : "true");
    actionBox.style.display = flag === "true" ? "none" : "block";
    toggleActionBoxIcon.innerText = flag === "true" ? "menu" : "close";
    toggleActionBtn.classList.remove(
        flag === "true" ? "text-danger" : "text-success"
    );
    toggleActionBtn.classList.add(
        flag === "true" ? "text-success" : "text-danger"
    );
}



async function dfs(root, input) {
    if (!ACTIONS.has(root)) return;
    let action = ACTIONS.get(root);
    const nextActions = await getNextActions(action, input);
    (typeof nextActions !== "undefined" ? nextActions : []).map(
        async (next) => await dfs(next.edge, next.data)
    );
    return;
}

function runWorkflows() {
    RUN_CODE = true;
    for (let [key, value] of ACTIONS) value.updateStatus("WARNING");
    dfs(ROOT_ACTION.boxId, null);
}

async function getNextActions(action, input) {
    let nextActions = [];
    if (action.id === "HTTP_REQUEST") {
        const http = new HTTPRequest(action);
        let { data, ok } = await http.httpRequest();
        if (!ok) {
            action.updateStatus("ERROR");
            notify("Something Went Wrong!", "danger");
            action.debug = "ERROR ACCURED!";
            return nextActions;
        }
        action.debugData = data;
        nextActions.push({ edge: action.nextBoxId, data });
    } else if (action.id === "IF_CONDITION") {
        if (eval(action.condition))
            nextActions.push({ edge: action.trueConditionBoxId, data: input });
        else
            nextActions.push({ edge: action.falseConditionBoxId, data: input });
        action.debugData = input;
        nextActions.push({ edge: action.nextBoxId, data: input });
    } else if (action.id === "FOR_LOOP") {
        nextActions.push({ edge: action.rightBoxId, data: input });
        nextActions.push({ edge: action.nextBoxId, data: input });
        action.debugData = input;
    } else if (action.id === "LOOP_DATA") {
        let data = eval(action.data);
        if (typeof data === "object") {
            data.forEach((item) => {
                nextActions.push({ edge: action.rightBoxId, data: item });
            });
        }
        action.debugData = input;
        nextActions.push({ edge: action.nextBoxId, data: input });
    } else if (action.id === "SWITCH") {
        let cases = action.cases,
            defaultCase = action.defaultCase;
        let isCaseValid = false;
        for (let i = 0; i < cases.length; i++) {
            if (isCaseValid) break;
            if (eval(action.conditions[i])) {
                nextActions.push({ edge: cases[i], data: input });
                isCaseValid = true;
            }
        }
        action.debugData = input;
        if (!isCaseValid) nextActions.push({ edge: defaultCase, data: input });
        nextActions.push({ edge: action.nextBoxId, data: input });
    } else if (action.id === "VARIABLE") {
        nextActions.push({ edge: action.nextBoxId, data: input });
        action.debugData = input;
    } else if (action.id === "NOTIFICATION") {
        notify(action.notification, action.type);
        nextActions.push({ edge: action.nextBoxId, data: input });
        action.debugData = input;
    } else if (action.id === "CONSOLE_LOG") {
        let res = eval(action.consoleLogData);
        console.log(res);
        if (typeof res !== "object") {
            action.updateStatus("ERROR");
            notify("Something went wrong!", "danger");
            action.debugData = "ERROR ACCURED!";
            return nextActions;
        }
        console.log(res);
        action.debugData = input;
        nextActions.push({ edge: action.nextBoxId, data: input });
    } else if (action.id === "CODE_BLOCK") {
        try {
            let code = action.code;
            let context = {};
            for (const key in action.context) {
                if (
                    typeof eval(action.context[key].value) === "undefined" ||
                    !eval(action.context[key].value)
                ) {
                    notify("Pass parameter valid!", "danger");
                    action.debugData = "ERROR ACCURED!";
                    return;
                }
                context[action.context[key].key] = eval(
                    action.context[key].value
                );
            }
            const data = await axios.post("/api/compiler", { code, context });
            // console.log(data.data);
            action.debugData = data;
            nextActions.push({ edge: action.nextBoxId, data: data.data });
        } catch (error) {
            console.log(error);
            notify("Something Went Wrong!", "danger");
            action.debugData = error;
            return;
        }
    } else if (action.id === "WEBHOOK") {
        let url = action.url;
        let method = action.method;
        let body = input;
        const http = new HTTPRequest(null);
        let { data, ok } = await http.webhookRequest(url, method, body);
        if (!ok) {
            action.updateStatus("ERROR");
            notify("Something went wrong!", "danger");
            action.debugData = "ERROR ACCURED!";
            return nextActions;
        }
        action.debugData = data;
        nextActions.push({ edge: action.nextBoxId, data });
    } else if (action.id === "SendEmail") {
        let html = action.html,
            to = action.to,
            from = action.from,
            subject = action.subject;

        try {
            const { data } = await axios.post("/api/send-email", {
                html,
                to,
                from,
                subject,
            });

            if (!data.ok) {
                action.updateStatus("ERROR");
                notify("Something went wrong!", "danger");
                action.debugData = "ERROR ACCURED!";
                return nextActions;
            }
            action.debugData = input;
            nextActions.push({ edge: action.nextBoxId, data: input });
        } catch (error) {
            console.log(error);
            action.updateStatus("ERROR");
            notify("Something went wrong!", "danger");
            action.debugData = "ERROR ACCURED!";
            return nextActions;
        }
    }
    action.updateStatus("SUCCESS");
    return nextActions;
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
                        WORKFLOW_NAME = doc.data().workflowsName;
                        CREATED_AT = doc.data().createdAt;
                        ROOT = doc.data().root;
                        buildWorkflows(doc.data());
                    } else {
                        console.log("No such document!");
                    }
                })
                .catch((error) => {
                    console.log("Error getting document:", error);
                });
        } else {
            location.replace("/");
        }
    });
}
// init();

// save workflows
async function saveWorkflow() {
    let data = {
        uid: UID,
        workflowsName: WORKFLOW_NAME,
        createdAt: CREATED_AT,
        updatedAt: firebase.firestore.Timestamp.fromDate(new Date()),
        root: ROOT_ACTION.actionId,
    };

    for (let [key, value] of ACTIONS) data[key] = getObj(value);
    console.log(data);
    try {
        await db.collection("workflows").doc(workflowsId).delete();
        await db.collection("workflows").doc(workflowsId).set(data);
    } catch (error) {
        notify("Something Went Wrong!", "danger");
    }
    notify("▶︎ Successfully Saved!", "success");
}

function buildWorkflows(data) {
    document.getElementById("workflowsName").innerText = data.workflowsName;
    for (let key in data)
        if (typeof data[key] === "object" && data[key].hasOwnProperty("id"))
            ACTIONS.set(data[key].boxId, createActionClass(data[key]));
    ROOT_ACTION = ACTIONS.get(ROOT);
    TRANSPOSING_ELEMENT.innerHTML += ROOT_ACTION.createActionBox();
    buildWorkflowsWithDFS(ROOT_ACTION.nextBoxId, ROOT_ACTION.boxId, true);
}

function buildWorkflowsWithDFS(curId, parId, flag) {
    if (!ACTIONS.has(curId)) return;
    let action = ACTIONS.get(curId);
    if (flag) {
        let prevElement = document.getElementById(parId);
        prevElement?.insertAdjacentHTML("afterend", action.createActionBox());
    } else {
        let curElement = document.getElementById(curId);
        curElement.innerHTML += action.createActionBox();
    }

    if (action.id === "HTTP_REQUEST") {
        buildWorkflowsWithDFS(action.nextBoxId, curId, true);
    } else if (action.id === "IF_CONDITION") {
        buildWorkflowsWithDFS(action.trueConditionBoxId, curId, false);
        buildWorkflowsWithDFS(action.falseConditionBoxId, curId, false);
        buildWorkflowsWithDFS(action.nextBoxId, curId, true);
    } else if (action.id === "FOR_LOOP") {
        buildWorkflowsWithDFS(action.rightBoxId, curId, false);
        buildWorkflowsWithDFS(action.nextBoxId, curId, true);
    } else if (action.id === "LOOP_DATA") {
        buildWorkflowsWithDFS(action.rightBoxId, curId, false);
        buildWorkflowsWithDFS(action.nextBoxId, curId, true);
    } else if (action.id === "SWITCH") {
        for (let i = 0; i < action.cases.length; i++) {
            buildWorkflowsWithDFS(action.cases[i], curId, false);
        }
        buildWorkflowsWithDFS(action.defaultCase, curId, false);
        buildWorkflowsWithDFS(action.nextBoxId, curId, true);
    } else if (action.id === "VARIABLE") {
        buildWorkflowsWithDFS(action.nextBoxId, curId, true);
    } else if (action.id === "NOTIFICATION") {
        buildWorkflowsWithDFS(action.nextBoxId, curId, true);
    } else if (action.id === "CONSOLE_LOG") {
        buildWorkflowsWithDFS(action.nextBoxId, curId, true);
    } else if (action.id === "CODE_BLOCK") {
        buildWorkflowsWithDFS(action.nextBoxId, curId, true);
    } else if (action.id === "WEBHOOK") {
        buildWorkflowsWithDFS(action.nextBoxId, curId, true);
    }
}


