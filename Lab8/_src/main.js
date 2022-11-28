var SwitchCSS = /** @class */ (function () {
    function SwitchCSS(btn1ID, btn2ID, css1Src, css2Src, styleID) {
        this.btn1 = document.querySelector(btn1ID);
        this.btn2 = document.querySelector(btn2ID);
        this.style = document.querySelector(styleID);
        this.css1 = css1Src;
        this.css2 = css2Src;
        if (this.btn1 == null || this.btn2 == null) {
            throw "Constructor: Cannot find button 1 or button 2!";
        }
        if (this.style == null) {
            throw "Constructor: Cannot find style link!";
        }
        this.state = 1;
    }
    SwitchCSS.prototype.addEvent = function () {
        if (this.btn1 != null && this.btn2 != null) {
            this.btn1.addEventListener("click", this.switchCss.bind(this));
            this.btn2.addEventListener("click", this.switchCss.bind(this));
        }
        else {
            throw "addEvent: Cannot find button 1 or button 2!";
        }
    };
    SwitchCSS.prototype.switchCss = function () {
        if (this.style == null) {
            throw "switchCss: Cannot find style link!";
        }
        if (this.btn1 == null) {
            throw "switchCss:  Cannot find btn1!";
        }
        if (this.btn2 == null) {
            throw "switchCss:  Cannot find btn2!";
        }
        if (this.state == 1) {
            this.style.href = this.css2;
            this.state = 2;
            this.btn1.disabled = true;
            this.btn2.disabled = false;
        }
        else {
            this.style.href = this.css1;
            this.state = 1;
            this.btn1.disabled = false;
            this.btn2.disabled = true;
        }
    };
    return SwitchCSS;
}());
var btn1ID = "#CSS1";
var css1Src = "./css/style.css";
var css2Src = "./css/style2.css";
var btn2ID = "#CSS2";
var styleID = "#style";
try {
    var scss = new SwitchCSS(btn1ID, btn2ID, css1Src, css2Src, styleID);
    scss.addEvent();
}
catch (e) {
    console.error(e);
}
