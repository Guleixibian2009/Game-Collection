import Storage      from "../../utils/Storage.js";
import Utils        from "../../utils/Utils.js";



/**
 * Snake High Scores
 */
export default class HighScores {

    /**
     * Snake High Scores constructor
     */
    constructor() {
        this.level     = 0;
        this.data      = null;
        this.total     = 0;
        this.maxScores = 5;
        this.isFocused = false;

        /** @type {HTMLInputElement} */
        this.input     = document.querySelector(".input input");

        /** @type {HTMLElement} */
        this.scores    = document.querySelector(".scores");

        /** @type {HTMLElement} */
        this.none      = document.querySelector(".none");

        this.input.onfocus = () => this.isFocused = true;
        this.input.onblur  = () => this.isFocused = false;
    }



    /**
     * Creates the high scores for the given mode
     * @param {Number} level
     * @returns {Void}
     */
    create(level) {
        this.level = level;
        this.data  = new Storage(`snake.hs.${this.level}`);
        this.total = this.data.get("total") || 0;
    }

    /**
     * Show the Scores for the given mode
     * @param {Number} level
     * @returns {Void}
     */
    show(level) {
        this.scores.innerHTML = "";
        this.create(level);
        this.showHideNone(this.total === 0);

        if (this.total > 0) {
            this.displayScores();
        }
    }

    /**
     * Create each score line and place it in the DOM
     * @returns {Void}
     */
    displayScores() {
        for (let i = 1; i <= this.total; i += 1) {
            const data = this.data.get(i);
            const div  = document.createElement("DIV");

            div.className = "highScore";
            div.innerHTML = `
                <div class="hsName">${data.name}</div>
                <div class="hsScore">${Utils.formatNumber(data.score, ",")}</div>
            `;
            this.scores.appendChild(div);
        }
    }



    /**
     * Tries to save a score, when possible
     * @param {Number} level
     * @param {Number} score
     * @returns {Boolean}
     */
    save(level, score) {
        if (this.input.value) {
            this.create(level);
            this.saveData(score);

            this.show(this.level);
            return true;
        }
        return false;
    }

    /**
     * Gets the scores and adds the new one in the right position, updating the total, when possible
     * @param {Number} score
     * @returns {Void}
     */
    saveData(score) {
        const data   = [];
        const actual = {
            name  : this.input.value,
            score : score
        };
        let saved = false;

        for (let i = 1; i <= this.total; i += 1) {
            const hs = this.data.get(i);
            if (!saved && hs.score < actual.score) {
                data.push(actual);
                saved = true;
            }
            if (data.length <= this.maxScores) {
                data.push(hs);
            }
        }
        if (!saved && data.length <= this.maxScores) {
            data.push(actual);
        }

        this.data.set("total", data.length);
        data.forEach((element, index) => {
            this.data.set(index + 1, element);
        });
    }



    /**
     * Shows or hides the no results element
     * @param {Boolean} show
     * @returns {Void}
     */
    showHideNone(show) {
        this.none.style.display = show ? "block" : "none";
    }

    /**
     * Sets the input value and focus it
     * @returns {Void}
     */
    setInput() {
        this.input.value = "";
        this.input.focus();
    }
}
