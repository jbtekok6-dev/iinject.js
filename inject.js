var body = $response.body;

if (body) {
    body = body.replace(/<\/head>/i, `
<script>
(function() {

    // ===== TEST =====
    alert("INJECT JALAN");

    console.log("=== PROXY INJECT START ===");

    // ===== FAKE GM API =====
    window.GM_info = {};
    window.GM_addStyle = function(css){
        let s = document.createElement("style");
        s.innerHTML = css;
        document.head.appendChild(s);
    };
    window.GM_xmlhttpRequest = function(opt){
        fetch(opt.url, {method: opt.method || "GET"})
        .then(r => r.text())
        .then(t => opt.onload && opt.onload({responseText: t}));
    };
    window.GM_setValue = function(){};
    window.GM_getValue = function(){};

    // ===== HOOK FETCH =====
    const origFetch = window.fetch;
    window.fetch = function(...args){
        console.log("FETCH:", args);
        return origFetch.apply(this, args);
    };

    // ===== HOOK XHR =====
    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log("XHR:", arguments);
        return open.apply(this, arguments);
    };

    // ===== LOAD SCRIPT FUNCTION =====
    function loadKaurev() {
        console.log("Loading Kaurev script...");

        fetch("https://kaurev.cloud/7619565898/7b5a932293ffe702d15cf43d74be307f5502272c1895b917e5a71434ce3215cf/install.user.js")
        .then(r => r.text())
        .then(code => {
            console.log("Script fetched");
            try {
                eval(code);
                console.log("Script executed");
            } catch(e) {
                console.log("Eval error:", e);
            }
        })
        .catch(err => console.log("Fetch error:", err));
    }

    // ===== RETRY SYSTEM =====
    let attempts = 0;
    let maxAttempts = 5;

    function tryInject() {
        if (attempts >= maxAttempts) {
            console.log("Max attempts reached");
            return;
        }

        console.log("Inject attempt:", attempts);
        loadKaurev();

        attempts++;
        setTimeout(tryInject, 3000);
    }

    // ===== START =====
    function start() {
        console.log("Start inject engine");
        tryInject();
    }

    if (document.readyState === "complete") {
        setTimeout(start, 1000);
    } else {
        window.addEventListener("load", () => {
            setTimeout(start, 1000);
        });
    }

})();
</script>
</head>`);
}

$done({ body });
