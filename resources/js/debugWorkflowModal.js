let debugWorkflowModal = document.getElementById("debugWorkflowsModal");

// open create workflows form
function openDebugWorkflowModal() {
    debugWorkflowModal.classList.add("active");
}

// close create workflows form
function closeDebugWorkflowModal() {
    debugWorkflowModal.classList.remove("active");
}

debugWorkflowsModal.addEventListener("click", function (e) {
    if (e.target !== this) return;
    closeDebugWorkflowModal();
});

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeDebugWorkflowModal();
});


function toggleDebugModal() {
    DEBUG_MODE = !DEBUG_MODE;
    if (!RUN_CODE) alert('Please run workflow at least ones!')

    let btn = document.getElementById("debugMode");
    
    if (DEBUG_MODE) btn.style.background = "green";
    else btn.style.background = "transparent";

    toggleDebugBtn();
}

function debugWorkflow(actionEl) {
    let key = actionEl.getAttribute("id");
    let action = ACTIONS.get(key);

    let debugData = document.getElementById("debugData");
    let markup = action.markupForDebugWorkflow();
    debugData.innerHTML = markup;

    openDebugWorkflowModal();
}