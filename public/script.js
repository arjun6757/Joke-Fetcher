const catAny = document.querySelector("#category-any");
const catCustom = document.querySelector("#category-custom");
const safeBtn = document.querySelector("#safe-btn");
const flagBoxes = document.querySelectorAll(
    "input[type='checkbox'][name='flags']",
);
const categoryOps = document.querySelectorAll(
    "input[type='checkbox'][name='categories-option']",
);
const catChoices = document.querySelectorAll(
    "input[type='radio'][name='categories-choice']",
);
const refreshBtn = document.querySelector("#refresh-btn");
const contentContainer = document.querySelector(".content-container");
const setup = document.querySelector(".setup");
const delivery = document.querySelector(".delivery");

let choice = "any";
let options = [];
let flags = [];
let safe = false;

let state = {
    loading: false,
    setLoading: function (value) {
        if (typeof value !== "boolean") {
            console.error("loading value must be of type boolean");
            return;
        }
        contentContainer.classList.toggle("loading", value);
    },
};

initialLoading();

safeBtn.addEventListener("click", safeHandler);

catChoices.forEach((el) => {
    el.addEventListener("change", (e) => {
        if (e.target.value === "any") {
            choice = "any";
            disableCategoryOps();
        } else if (e.target.value === "custom") {
            choice = "custom";
            enableCategoryOps();
        }
    });
});

categoryOps.forEach((el) => {
    el.addEventListener("change", (e) => {
        if (e.target.checked) {
            options.push(e.target.value);
        }

        if (!e.target.checked && options.includes(e.target.value)) {
            options = options.filter((op) => op !== e.target.value);
        }
    });
});

flagBoxes.forEach((el) => {
    el.addEventListener("change", (e) => {
        if (e.target.checked) {
            flags.push(e.target.value);
        }

        if (!e.target.checked && flags.includes(e.target.value)) {
            flags = flags.filter((flag) => flag !== e.target.value);
        }
    });
});

refreshBtn.addEventListener("click", (e) => {
    fetchJokes();
});

function disableCategoryOps() {
    options = [];
    categoryOps.forEach((el) => {
        el.disabled = true;
    });
}

function enableCategoryOps() {
    categoryOps.forEach((el) => {
        el.disabled = false;
    });
}

function safeHandler() {
    if (safe) {
        safe = false;
        safeBtn.style.opacity = "100%";
    } else {
        safe = true;
        safeBtn.style.opacity = "70%";
    }
}

function initialLoading() {
    catAny.checked = true;
    disableCategoryOps();
    fetchJokes();
}

async function fetchJokes() {
    let category,
        url = "";

    if (!choice) {
        console.error("category choice can't be invalid");
    }

    if (choice === "any") {
        category = "any";
    } else {
        category = options.join(",");
    }

    url = `${api}/api/joke/${category}`;

    if (flags.length > 0) url += `?flags=${flags.join(",")}`;

    if (safe) {
        if (flags.length > 0) url += "&safe-mode";
        else url += "?safe-mode";
    }

    try {
        state.setLoading(true);
        const response = await fetch(url);
        if (!response.ok) {
            const result = await response.json();
            throw new Error(
                result.message || "Something went wrong while fetching joke",
            );
        }

        const result = await response.json();
        updateUI(result.data);
    } catch (error) {
        console.error(error);
        updateUI({ error: true, message: error.message || "Something went wrong while fetching the joke" })
    } finally {
        state.setLoading(false);
    }
}

function updateUI(data) {

    if(data.error) {
        contentContainer.innerHTML = `
                <h1 class="setup" >
                    ${data.message}
                </h1>
        `
    }

    if (data.setup && data.delivery) {
        contentContainer.innerHTML = `
                <h1 class="setup" >
                    ${data.setup}
                </h1>

                <h2 class="delivery" >
                    ${data.delivery}
                </h2>
        `;
    } else if (data.joke) {
        contentContainer.innerHTML = `
                <h1 class="setup">
                    ${data.joke}
                </h1>
        `;
    }
}

contentContainer.addEventListener("click", (e) => {
    // event delegations
    if (e.target && e.target.matches(".setup")) {
        if (!document.querySelector(".delivery")) return;
        document.querySelector(".setup").style.display = "none";
        document.querySelector(".delivery").style.display = "block";
    }

    if (e.target && e.target.matches(".delivery")) {
        document.querySelector(".delivery").style.display = "none";
        document.querySelector(".setup").style.display = "block";
    }
});
