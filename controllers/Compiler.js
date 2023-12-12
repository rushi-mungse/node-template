const vm = require("vm");
class Compiler {
    async compileCode(req, res, next) {
        const { code, context } = req.body;
        if (!code) return res.json({ ok: false });
        console.log(code, context);

        // compile code
        const script = new vm.Script(code);
        const compiledCode = script.runInNewContext(context);

        return res.json({ data: compiledCode, ok: true });
    }
}

module.exports = new Compiler();
