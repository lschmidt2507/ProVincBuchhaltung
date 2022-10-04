"use strict";

document.getElementById('file').addEventListener('change', handleFileSelect, false);
var selDiv = document.getElementById("showFiles");
var button = document.getElementById("fileButton");
button.disabled = true;
button.title = "Keine Dateien ausgewählt";

function handleFileSelect(e) {
  if (!e.target.files) return;
  selDiv.innerHTML = "";
  var files = e.target.files;

  if (files.length == 0) {
    button.disabled = true;
    button.title = "Keine Dateien ausgewählt";
  }

  var allJSON = true;
  var allJPG = true;

  for (var i = 0; i < files.length; i++) {
    var f = files[i];

    if (document.getElementById('file').name == "file[]") {
      if (f.type == "image/jpeg") {
        selDiv.innerHTML += "<tr><td>" + f.name + "</td><td class='text-success font-weight-bold' >" + f.type + "</td></tr>";
      } else {
        allJPG = false;
        selDiv.innerHTML += "<tr><td>" + f.name + "</td><td class='text-danger font-weight-bold'>" + f.type + "</td></tr>";
      }

      ;

      if (!allJPG) {
        button.disabled = true;
        button.title = "Alle Dateien müssen im JPG Format sein";
      } else {
        button.disabled = false;
        button.title = "";
      }
    } else {
      if (f.type == "application/json") {
        selDiv.innerHTML += "<tr><td>" + f.name + "</td><td class='text-success font-weight-bold' >" + f.type + "</td></tr>";
      } else {
        allJSON = false;
        selDiv.innerHTML += "<tr><td>" + f.name + "</td><td class='text-danger font-weight-bold'>" + f.type + "</td></tr>";
      }

      ;

      if (!allJSON) {
        button.disabled = true;
        button.title = "Alle Dateien müssen im JSON Format sein";
      } else {
        button.disabled = false;
        button.title = "";
      }
    }
  }
}