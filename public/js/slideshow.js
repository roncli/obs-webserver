document.addEventListener("DOMContentLoaded", function(ev) {
    var images = [
        "images/crypt.png",
        "images/descent.png",
        "images/diablo3.png",
        "images/overwatch.png",
        "images/sl0.png",
        "images/wow.png"
    ],
        index = 0,

        fx = function() {
            var bg = document.querySelector(".background"), newBg;
            
            bg.classList.remove("animate");
            newBg = bg.cloneNode(true);
            bg.parentNode.replaceChild(newBg, bg);
            document.querySelector(".bgImage").src = images[index];
            newBg.classList.add("animate");
            index++;
            if (index >= images.length) {
                index = 0;
            }
            setTimeout(fx, 8000);
        };

    fx();
});
