const workflowCodeModal = document.getElementById('workflowCodeModal');

function openWorkflowCodeModal() {
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
    
}

