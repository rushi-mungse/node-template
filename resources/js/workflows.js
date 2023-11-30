const db = firebase.firestore();

const headerLinks = document.querySelectorAll("#headerLinks a");
headerLinks.forEach((link) => link.classList.remove("activeHeaderLink"));
headerLinks[1].classList.add("activeHeaderLink");

let allWorkflows = document.getElementById("allWorkflows");


// change location for perticular workflows
function enterIntoWorkflows(workflowsId) {
    location.replace(`/workflows/${workflowsId}`);
}

// create table body for workflows list
function createTableBody(workflowsId, data, type) {
    let tr = document.createElement("tr");
    tr.id = workflowsId;
    tr.classList = "cursor-pointer hover:bg-zinc-700 transition-all";
    tr.onclick = () => enterIntoWorkflows(workflowsId, data);

    let td1 = document.createElement("td");
    td1.classList = "px-6 py-4 whitespace-nowrap text-sm";
    td1.innerText = data.workflowsName;

    let td2 = document.createElement("td");
    td2.classList = "px-6 py-4 whitespace-nowrap text-sm";

    let span2 = document.createElement("span");
    span2.classList =
        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800";
    span2.innerHTML = type;
    td2.appendChild(span2);

    let td3 = document.createElement("td");
    td3.classList = "px-6 py-4 whitespace-nowrap text-sm";

    let span3 = document.createElement("span");
    span3.classList =
        "text-[14px] font-bold text-danger rounded-md w-[40px] p-2 bg-boxColor flex items-center justify-center hover:bg-zinc-500 transition-all";

    let i = document.createElement("i");
    i.classList = "fa-solid fa-trash text-[12px] text-danger";
    i.style.color = "#ff7782";

    span3.appendChild(i);
    td3.appendChild(span3);

    span3.onclick = (e) => {
        e.stopPropagation();
        deleteWorkflows(workflowsId);
    };

    tr.append(td1, td2, td3);
    return tr;
}

// get all workflows
async function getAllWorkflows() {
    await firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            db.collection("workflows")
                .where("uid", "==", user.uid)
                .onSnapshot((snapshot) => {
                    allWorkflows.innerHTML = "";
                    snapshot.forEach(function (doc) {
                        allWorkflows.insertAdjacentElement(
                            "beforeend",
                            createTableBody(doc.id, doc.data(), "active"),
                        );
                    });
                });
        } else {
            location.replace("/");
        }
    });
}
getAllWorkflows();

// open create workflows form
function openWorkflowsForm() {
    document.getElementById("workflowsForm").style.display = "flex";
}

// close create workflows form
function closeWorkflowsForm() {
    document.getElementById("workflowsForm").style.display = "none";
}

// create new workflows
async function createNewWorkflows() {
    let value = document.getElementById("workflowsName").value;
    if (!value) return notify("Workflow Name is required!", "danger");
    await firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            let rootId = createId();
            let body = {
                workflowsName: value,
                uid: user.uid,
                root: rootId,
                createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
            };
            body[rootId] = hTTPRequestObj(new HTTPRequestAction(rootId));
            db.collection("workflows")
                .add(body)
                .then((docRef) => {
                    closeWorkflowsModel();
                    document.getElementById("workflowsName").value = "";
                    location.replace(`/workflows?workflowsId=${docRef.id}`);
                    return;
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                    notify("Someting went wrong!", "danger");
                });
        } else {
            location.replace("/");
        }
    });
}

// Delete workflows
async function deleteWorkflows(workflowsId) {
    await db
        .collection("workflows")
        .doc(workflowsId)
        .delete()
        .then(() => {
            notify("Document successfully deleted!", "suceess");
        })
        .catch((error) => {
            notify("Someting went wrong!", "suceess");
            console.error("Error removing document: ", error);
        });
}
