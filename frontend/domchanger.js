var DomChanger = {}

DomChanger.displaySuggestions = function(urls, k) {
    if (!urls || urls.length == 0) {
        return
    }
    var n = k || 5
    console.log("Displaying new suggestions!");
    var container = document.getElementById("list-container");
    var items = container.childNodes;
    var l = items.length;
    for (var i = 0; i < l; i++) {
        container.removeChild(items[0]);
    }
    for (var i in urls) {
        if (i >= n) {
            break
        }
        var url = urls[i];
        var newDiv = document.createElement("li");
        newDiv.innerHTML = '<a href=http://' + url + '>' + url + '</a>';
        newDiv.setAttribute('class', 'list-group-item');
        container.appendChild(newDiv);
    }
}

DomChanger.displaySettings = function (opt) {
    var container = document.getElementById("list-container");
    var items = container.childNodes;
    var l = items.length;
    for (var i = 0; i < l; i++) {
        container.removeChild(items[0]);
    }

    var settings = document.getElementById("setting-values");
    var newDiv = document.createElement("input");
    newDiv.setAttribute('id', 'ex1');
    newDiv.setAttribute('data-slider-id', 'ex1Slider');
    newDiv.setAttribute('data-slider-min', '3');
    newDiv.setAttribute('data-slider-max', '7');
    newDiv.setAttribute('data-slider-step', '1');
    newDiv.setAttribute('data-slider-value', opt.numTabs);
    settings.appendChild(newDiv);
}


$(document).ready(function(){
    console.log("Ready!!");
});

