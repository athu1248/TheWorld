const cntry = document.querySelectorAll("path");
const modalClose = document.querySelectorAll("[data-close-button]");
const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");
const svg = document.getElementById("mapSVG");

var data;
function getJSONData() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhttp.responseText);
            data = response.countries; // data is array of js objects
            
        };
    };
    xhttp.open("GET", "countryData.json", true);
    xhttp.send();
}
getJSONData();

cntry.forEach(path1 => {
    path1.addEventListener('click', () =>{
        name1 = path1.getAttribute("data-name")
        openModal(modal, name1)
    });
    path1.addEventListener("mouseover", (e) =>{
        const dialog = document.getElementById("dialog");
        dialogName = path1.getAttribute("data-name");
        var X = e.pageX;
        var Y = e.pageY;
        openDialog(dialog, dialogName, X, Y);
    })
    path1.addEventListener("mouseout", () => {
        const dialog = document.getElementById("dialog");
        closeDialog(dialog);
    })
});

modalClose.forEach(button => {
    button.addEventListener('click', closeModal);
});

function openModal(modal, name1){
    if(modal==null) return;
    document.getElementById("modalCountryID").textContent = name1;
    putData(name1);
    modal.classList.add('active');
    overlay.classList.add('active');
}
function closeModal(){
    putData("");
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

overlay.addEventListener("click", closeModal);

function openDialog(dialog, dialogName, X, Y){
    if(dialog == null) return
    document.getElementById("dialogCountryID").textContent = dialogName
    dialog.classList.add('active');
    X = X+10;
    Y = Y+10;
    dialog.style.left = X.toString() + "px";
    dialog.style.top = Y.toString() + "px";
}

function closeDialog(dialog){
    if(dialog == null) return;
    dialog.classList.remove('active');
}

function putData(name1){
    for (i=0; i < data.length; i++) {
        if (data[i].name == name1){
            document.getElementById("countryCapital").textContent = data[i].capital;
            document.getElementById("countryFlag").setAttribute("src", data[i].flag);
            document.getElementById("countryPopu").textContent = data[i].population;
            document.getElementById("countryArea").textContent = data[i].area;
            break;
        }
    }
}
document.getElementById("zoomInBtn").addEventListener("click", zoomIn);
document.getElementById("zoomOutBtn").addEventListener("click", zoomOut);

function zoomIn(){
    var viewBoxData = document.getElementById("mapSVG").getAttribute("viewBox");
    var viewBoxDataArray = viewBoxData.split(" ")
    if (true){
        viewBoxDataArray[2] = (parseFloat(viewBoxDataArray[2]) / 2).toString(); // Doubling the view, i.e. halving the no. of pixels in viewport
        viewBoxDataArray[3] = (parseFloat(viewBoxDataArray[3]) / 2).toString();
        if(viewBoxDataArray[2] < 261.125 && viewBoxDataArray[3] < 115.25){
            viewBoxDataArray[2] = 261.125;
            viewBoxDataArray[3] = 115.25;
        } else {
            viewBoxDataArray[0] = (parseFloat(viewBoxDataArray[0]) + 0.5*parseFloat(viewBoxDataArray[2])).toString(); //X + 1/2(new view)
            viewBoxDataArray[1] = (parseFloat(viewBoxDataArray[1]) + 0.5*parseFloat(viewBoxDataArray[3])).toString();
        }
        
    }

    

    viewBoxData = "";
    for (let i = 0; i < viewBoxDataArray.length; i++) {
        viewBoxData = viewBoxData + viewBoxDataArray[i] + " ";
    }
    viewBoxData = viewBoxData.slice(0, viewBoxData.length-1);
    document.getElementById("mapSVG").setAttribute("viewBox", viewBoxData);
}

function zoomOut(){
    var viewBoxData = document.getElementById("mapSVG").getAttribute("viewBox");
    var viewBoxDataArray = viewBoxData.split(" ")
    if (true){
        viewBoxDataArray[0] = parseFloat(viewBoxDataArray[0]) - 0.5*parseFloat(viewBoxDataArray[2]); // X - 1/2(old view) reverse process of zoomIn()
        viewBoxDataArray[1] = parseFloat(viewBoxDataArray[1]) - 0.5*parseFloat(viewBoxDataArray[3]);
        viewBoxDataArray[2] = (parseFloat(viewBoxDataArray[2])*2).toString(); // Halving the view, i.e. doubling the no. of pixels in viewport
        viewBoxDataArray[3] = (parseFloat(viewBoxDataArray[3])*2).toString();
        if(viewBoxDataArray[2] > 2089 && viewBoxDataArray[3] > 922){
            viewBoxDataArray[2] = 2089;
            viewBoxDataArray[3] = 922
        }
    } 
    bound_controller(viewBoxDataArray);

    viewBoxData = "";
    for (let i = 0; i < viewBoxDataArray.length; i++) {
        viewBoxData = viewBoxData + viewBoxDataArray[i] + " ";
    }
    viewBoxData = viewBoxData.slice(0, viewBoxData.length-1);
    document.getElementById("mapSVG").setAttribute("viewBox", viewBoxData);
}

svg.addEventListener("mousedown", (down) =>{
  svg.addEventListener("mousemove", mousemove);
  svg.addEventListener("mouseup", mouseup);

});

function mousemove(e){
    svg.style.cursor = "move";
    var viewBoxData = svg.getAttribute("viewBox");
    var viewBoxArray = viewBoxData.split(" ");
    viewBoxArray[0] = ( parseFloat(viewBoxArray[0]) - e.movementX ).toString();
    viewBoxArray[1] = ( parseFloat(viewBoxArray[1]) - e.movementY ).toString();
    
    bound_controller(viewBoxArray);

    viewBoxData = "";
    for (let i = 0; i < viewBoxArray.length; i++) {
        viewBoxData = viewBoxData + viewBoxArray[i] + " "; // You cannot move more than the view at the end of svg
    } // Basically put the viewport on the svg at the end(height). The y value cannot exceed that
    viewBoxData = viewBoxData.slice(0, viewBoxData.length-1); // length -1 becuase of extra "" idk sooo
    svg.setAttribute("viewBox", viewBoxData);
}

function mouseup(){
    svg.style.cursor = "default";
    svg.removeEventListener("mousemove", mousemove);
    svg.removeEventListener("mouseup", mouseup);
}

function bound_controller(viewBoxArray){
    if (viewBoxArray[0] < 0){
      viewBoxArray[0] = (0).toString();
    } else if(viewBoxArray[0] > 2089-viewBoxArray[2]){
      viewBoxArray[0] = (2089-viewBoxArray[2]).toString(); // You cannot move more than the view at the end of svg
    } // Basically put the viewport on the svg at the end(width). The x value cannot exceed that
    if (viewBoxArray[1] < 0) {
      viewBoxArray[1] = (0).toString();
    } else if(viewBoxArray[1] > 922-viewBoxArray[3]){
      viewBoxArray[1] = (922-viewBoxArray[3]).toString();
    }
}
