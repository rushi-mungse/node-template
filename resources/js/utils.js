const db = firebase.firestore();

// create id
function createId() {
    var characters = "ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz";
    var lenString = 8;
    var randomstring = "";
    for (var i = 0; i < lenString; i++) {
        var rnum = Math.floor(Math.random() * characters.length);
        randomstring += characters.substring(rnum, rnum + 1);
    }
    return randomstring;
}

// notify for poping notifications
function notify(msg, status) {
    let notificationBox = document.getElementById("notificationBox");
    notificationBox.style.display = "flex";
    notificationBox.style.color =
        status === "none"
            ? "white"
            : status === "success"
              ? "#1fbe1f"
              : status === "warning"
                ? "orange"
                : "#ef3030";
    notificationBox.innerHTML = msg;
    setInterval(() => {
        notificationBox.style.display = "none";
    }, 5000);
}

function toggleDebugBtn() {
    let debugBtn = document.getElementById("debug");
    if(debugBtn) {
        if (!DEBUG_MODE) {
            debugBtn.classList.remove("flex");
            debugBtn.classList.add("hidden");
        } else {
            debugBtn.classList.remove("hidden");
            debugBtn.classList.add("flex");
        }
    }
}

function getAction(actionType) {
    let action = null, actionId = createId();
    if(actionType === 'IF_CONDITION') 
        action =  new IfConditionAction(actionId);
    ACTIONS.set(actionId, action)
    return action;
}