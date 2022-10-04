window.addEventListener('load', function () {
    console.log("updating");
    var anchors = document.getElementsByTagName("a");

    for (var i = 0; i < anchors.length; i++) {
        anchors[i].href = "./index.php/?url=" + anchors[i].href
    }

  })
var scrolling=false;

function pageScroll() {
    var scrollInput = document.getElementById("scrollSpeed");
    window.scrollBy(0,1);
    if (scrolling && scrollInput.value > 0){
        scrolldelay = setTimeout(pageScroll,210-2*scrollInput.value);
    }
}
function autoscrollStart(){
    var scrollInput = document.getElementById("scrollSpeed");
    if (scrollInput.value==null){
        alert("Bitte Geschwindigkeit eingeben")
    }else{
        scrolling=true;
        pageScroll()
    }
    
}

function autoscrollStop(){
    scrolling=false;
}

var transpose=0;

function transposeVal(dir,val){
    if(val.substring(0,2)=="C#"){
        if (dir==-1){
            return "C"+val.substring(2);
        }else{
            return "D"+val.substring(2);
        }
    }else if(val.substring(0,2)=="D#"){
        if (dir==-1){
            return "D"+val.substring(2);
        }else{
            return "E"+val.substring(2);
        }
    }else if(val.substring(0,2)=="E#"){
        if (dir==-1){
            return "E"+val.substring(2);
        }else{
            return "F#"+val.substring(2);
        }
    }else if(val.substring(0,2)=="F#"){
        if (dir==-1){
            return "F"+val.substring(2);
        }else{
            return "G"+val.substring(2);
        }
    }else if(val.substring(0,2)=="G#"){
        if (dir==-1){
            return "G"+val.substring(2);
        }else{
            return "A"+val.substring(2);
        }
    }else if(val.substring(0,2)=="A#"){
        if (dir==-1){
            return "A"+val.substring(2);
        }else{
            return "B"+val.substring(2);
        }
    }else if(val.substring(0,2)=="B#"){
        if (dir==-1){
            return "B"+val.substring(2);
        }else{
            return "C"+val.substring(2);
        }
    }
    return val;
}

function transposeUp(){
    var chords = document.getElementsByClassName("_3PpPJ");

    for (var i = 0; i < chords.length; i++) {
        var newSpan=document.createElement("span");
        newSpan.innerHTML=chords[0].innerHTML;
        newSpan.classList.add("customChord");
        chords[0].replaceWith(newSpan);
    }
    
    var anchors = document.getElementsByClassName("customChord");

    for (var i = 0; i < anchors.length; i++) {
        var old = anchors[i].textContent
        var new_val = transposeVal(1,old); 
        anchors[i].innerHTML = new_val;
    }
    transpose+=1;
    document.getElementById("transpose").innerHTML=transpose;
}

function transposeDown(){
    var anchors = document.getElementsByClassName("customChord");

    for (var i = 0; i < anchors.length; i++) {
        var old = anchors[i].innerHTML
        var new_val = transposeVal(-1,old); 
        anchors[i].innerHTML = new_val;
    }
    transpose-=1;
    document.getElementById("transpose").innerHTML=transpose;
}

