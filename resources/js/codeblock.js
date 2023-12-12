// Code editor setup
let editor = document.getElementById("editor");

let codemirror1 = CodeMirror.fromTextArea(editor, {
    lineNumbers: true,
    mode: "text/javascript",
    indentUnit: 2,
});

// close codeblock form
function closeCodeblockForm() {
    let codeblock = document.getElementById("codeblockModal");
    codeblock.classList.remove("active");
}

// save codeblcok form
function saveCodeblockForm() {
    let codeblock = document.getElementById("codeblockModal");
    let parameterOpsBox = document.getElementById("parameterOpsBox");

    let key = codeblock.getAttribute("key");
    let code = codemirror1.getValue();

    let action = ACTIONS.get(key);
    action.code = code;

    parameterOpsBox.childNodes.forEach((child) => {
        let childId = child.getAttribute("id");
        let key = document.getElementById(`parameterKey${childId}`).value;
        let value = document.getElementById(`parameterValue${childId}`).value;
        action.context[childId].key = key;
        action.context[childId].value = value;
    });

    closeCodeblockForm();
    closeActionForm();
}

// open codeblock form
function openCodeBlock(el) {
    closeActionForm();

    let codeblock = document.getElementById("codeblockModal");
    codeblock.classList.add("active");

    let parameterOpsBox = document.getElementById("parameterOpsBox");
    parameterOpsBox.innerHTML = "";

    let id = el.getAttribute("id");
    let action = ACTIONS.get(id);

    codeblock.setAttribute("key", id);

    document.getElementById("actionName_").value = action.actionName;

    codemirror1.setValue(action.code);

    for (const key in action.context) {
        parameterOpsBox.insertAdjacentHTML(
            "beforeend",
            getMarkupForParameterOption(
                key,
                action.context[key].key,
                action.context[key].value,
            ),
        );
    }
}

// add, remove and markup
function getMarkupForParameterOption(id, key = null, value = null) {
    return `<div class="flex mt-2 items-center grid-cols-11 gap-2 justify-center" id="${id}">
      <div class="inputBoxSecondary col-span-5">
          <input class="placeholder-gray-500 placeholder-opacity-30" name="key" type="text" id="parameterKey${id}" required placeholder="Enter Key" ${
              key && `value="${key}"`
          }/>
          <label for="parameterKey${id}">Key</label>
      </div>
      <div class="inputBoxSecondary col-span-5">
          <input class="placeholder-gray-500 placeholder-opacity-30" name="value" type="text" id="parameterValue${id}" required placeholder="Enter Value" ${
              value && `value="${value}"`
          }/>
          <label for="parameterValue${id}">Value</label>
      </div>
      <button class="btn bg-boxColor hover:bg-neutral-600 mb-5 flex items-center justify-center p-2.5" parameterId="${id}" onclick="removeParameterOptions(event)">
          <span class="text-[20px] text-danger material-symbols-outlined" parameterId="${id}">delete</span>
      </button>
    </div>`;
}

function addParameterOptions(key = null, value = null) {
    let codeblock = document.getElementById("codeblockModal");
    let actionId = codeblock.getAttribute("key");

    let parameterOpsBox = document.getElementById("parameterOpsBox");
    let id = createId();
    parameterOpsBox.insertAdjacentHTML(
        "beforeend",
        getMarkupForParameterOption(id, key, value),
    );
    let action = ACTIONS.get(actionId);
    if (action.context === undefined) action.context = { [id]: { key, value } };
    else action.context[id] = { key, value };

    console.log(action);
}

function removeParameterOptions(btn) {
    let codeblock = document.getElementById("codeblockModal");
    let key = codeblock.getAttribute("key");
    let id = btn.target.getAttribute("parameterId");
    let action = ACTIONS.get(key);
    if (action.context.hasOwnProperty([id])) delete action.context[id];
    document.getElementById(id).remove();
}
