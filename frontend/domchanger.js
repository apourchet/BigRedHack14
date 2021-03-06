var DomChanger = {}

DomChanger.displaySuggestions = function(urls, k) {
    if (!urls || urls.length == 0) {
        document.getElementById("list-container").style.display="block";
        document.getElementById("setting-values").style.display="none";
        document.getElementById("no-display").style.display="block";
        DomChanger.removeSuggestions()
        return
    }
    document.getElementById("list-container").style.display="block";
    document.getElementById("no-display").style.display="none";
    document.getElementById("setting-values").style.display="none";

    var n = k || 5
    DomChanger.removeSuggestions();
    var container = document.getElementById("list-container");
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

DomChanger.removeSuggestions = function() {
    var container = document.getElementById("list-container");
    var items = container.childNodes;
    var l = items.length;
    for (var i = 0; i < l; i++) {
        container.removeChild(items[0]);
    }
}


DomChanger.displaySettings = function (opt) {
    document.getElementById("list-container").style.display="none";
    document.getElementById("no-display").style.display="none";
    document.getElementById("setting-values").style.display="block";

    var settings = document.getElementById("setting-values");
    var items = settings.childNodes;
    var l = items.length;
    for (var i = 0; i < l; i++) {
        settings.removeChild(items[0]);
    }

    var settings = document.getElementById("setting-values");
    var newDiv = document.createElement("h4");
    newDiv.innerHTML = "Number of Suggestions"
    settings.appendChild(newDiv);

    var newDiv = document.createElement("p");
    newDiv.innerHTML = "Number of windows to display"
    settings.appendChild(newDiv);

    var newDiv = document.createElement("input");
    newDiv.setAttribute('id', 'ex1');
    newDiv.setAttribute('data-slider-id', 'ex1Slider');
    newDiv.setAttribute('data-slider-min', '3');
    newDiv.setAttribute('data-slider-max', '7');
    newDiv.setAttribute('data-slider-step', '1');
    newDiv.setAttribute('data-slider-value', opt.numTabs);
    settings.appendChild(newDiv);

    var newDiv = document.createElement("h4");
    newDiv.setAttribute('style', 'margin-top: 18px')
    newDiv.innerHTML = "Distance Priority"
    settings.appendChild(newDiv);

    var newDiv = document.createElement("p");
    newDiv.innerHTML = "Radius scales with value"
    settings.appendChild(newDiv);

    var newDiv = document.createElement("input");
    newDiv.setAttribute('id', 'ex2');
    newDiv.setAttribute('data-slider-id', 'ex2Slider');
    newDiv.setAttribute('data-slider-min', '1');
    newDiv.setAttribute('data-slider-max', '10');
    newDiv.setAttribute('data-slider-step', '1');
    newDiv.setAttribute('data-slider-value', opt.distPriority);
    settings.appendChild(newDiv);

    var newDiv = document.createElement("h4");
    newDiv.setAttribute('style', 'margin-top: 18px')
    newDiv.innerHTML = "Time Priority"
    settings.appendChild(newDiv);

    var newDiv = document.createElement("p");
    newDiv.innerHTML = "Time frame scales with value"
    settings.appendChild(newDiv);

    var newDiv = document.createElement("input");
    newDiv.setAttribute('id', 'ex3');
    newDiv.setAttribute('data-slider-id', 'ex3Slider');
    newDiv.setAttribute('data-slider-min', '1');
    newDiv.setAttribute('data-slider-max', '10');
    newDiv.setAttribute('data-slider-step', '1');
    newDiv.setAttribute('data-slider-value', opt.timePriority);
    settings.appendChild(newDiv);

    var newDiv = document.createElement("p");
    settings.appendChild(newDiv);


    var newDiv = document.createElement("button");
    newDiv.setAttribute('class', 'btn btn-danger');
    newDiv.setAttribute('id', 'saveButton');
    newDiv.setAttribute('style', 'margin-top: 10px; margin-bottom: 15px');
    $(newDiv).click(function(){savePreferences(opt)});
    newDiv.innerHTML = "Save"
    settings.appendChild(newDiv);

    $('#ex1').slider({
        formatter: function(value) {
            return 'Current value: ' + value;
        }
    });
    $('#ex2').slider({
        formatter: function(value) {
            return 'Current value: ' + value;
        }
    });
    $('#ex3').slider({
        formatter: function(value) {
            return 'Current value: ' + value;
        }
    });
}

function savePreferences(opt) {
    var mySlider = $("#ex1").slider();
    var value = mySlider.slider('getValue');
    opt.numTabs = value;

    var mySlider = $("#ex2").slider();
    var value = mySlider.slider('getValue');
    opt.distPriority = value;

    var mySlider = $("#ex3").slider();
    var value = mySlider.slider('getValue');
    opt.timePriority = value;

    setSuggestionOptions(opt);
}

$(document).ready(function(){
    console.log("Ready!!");
});
