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
    if (debugBtn) {
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
    let action = null,
        actionId = createId();
    if (actionType === "IF_CONDITION") action = new IfConditionAction(actionId);
    ACTIONS.set(actionId, action);
    return action;
}

async function getNextActions(action, input) {
    let nextActions = [];
    action.getNextActions(input, nextActions);
    return nextActions;
}

class HTTPRequest {
    constructor(action) {
        this.url = action?.url;
        this.method = action?.method;
        this.body = action?.body;
        this.authentication = action?.authentication;
        this.headers = action?.headers;
        this.user = action?.user;
        this.password = action?.password;
        this.auth = action?.auth;
    }

    async #request() {
        try {
            const data = await axios({
                url: this.url,
                ...(this.body && { body: this.body }),
                headers: {
                    ...(this.authentication && {
                        Authorization: `Bearer ${this.authentication}`,
                    }),
                    ...this.headers,
                },
                ...(this.auth && {
                    auth: {
                        username: this.user,
                        password: this.password,
                    },
                }),
            });
            return { ok: true, data: data.data };
        } catch (error) {
            console.log("Fetch error:", error);
            return { ok: false, data: null };
        }
    }

    async httpRequest() {
        return await this.#request();
    }

    async webhookRequest(url, method, body) {
        this.url = url;
        this.method = method;
        this.body = body;
        return await this.httpRequest();
    }
}

function createInstance(actionObj) {
    switch (actionObj.actionType) {
        case "HTTP_REQUEST":
            return HTTPRequestAction.getIntance(actionObj);
        case "IF_CONDITION":
            return IfConditionAction.getIntance(actionObj);
        case "FOR_LOOP":
            return ForLoopAction.getIntance(actionObj);
        case "LOOP_DATA":
            return LoopDataAction.getIntance(actionObj);
        case "SWITCH":
            return SwitchAction.getIntance(actionObj);
        case "VARIABLE":
            return VariableAction.getIntance(actionObj);
        case "NOTIFICATION":
            return NotificationAction.getIntance(actionObj);
        case "CONSOLE_LOG":
            return ConsoleLogAction.getIntance(actionObj);
        case "CODE_BLOCK":
            return CodeBlockAction.getIntance(actionObj);
        case "WEBHOOK":
            return WebhookAction.getIntance(actionObj);
        case "SEND_EMAIL":
            return SendEmailAction.getIntance(actionObj);
    }
}
