const cntry = document.querySelectorAll("path");
const modalClose = document.querySelectorAll("[data-close-button]");
const overlay = document.getElementById("overlay");

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
        //alert(path1.getAttribute("data-name"));
        const modal = document.getElementById("modal");
        name1 = path1.getAttribute("data-name")
        openModal(modal, name1)
    });
    path1.addEventListener("mouseover", (e) =>{
        const dialog = document.getElementById("dialog");
        dialogName = path1.getAttribute("data-name");
        var X = e.x;
        var Y = e.y;
        openDialog(dialog, dialogName, X, Y);
    })
    path1.addEventListener("mouseout", () => {
        const dialog = document.getElementById("dialog");
        closeDialog(dialog);
    })
});

modalClose.forEach(button => {
    button.addEventListener('click', () =>{
        //alert(path1.getAttribute("data-name"));
        const modal = button.closest('.modal')
        closeModal(modal)
    });
});

function openModal(modal, name1){
    if(modal==null) return;
    document.getElementById("modalCountryID").textContent = name1;
    putData(name1);
    modal.classList.add('active');
    overlay.classList.add('active');
}
function closeModal(modal){
    if(modal==null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
}

function openDialog(dialog, dialogName, X, Y){
    if(dialog == null) return
    document.getElementById("dialogCountryID").textContent = dialogName
    dialog.classList.add('active');
    X = X + 10;
    Y = Y + 10;
    dialog.style.left = X.toString() + "px";
    dialog.style.top = Y.toString() + "px";
}

function closeDialog(dialog){
    if(dialog == null) return
    dialog.classList.remove('active')
    //Doesn't change values when modal is closed!
}

function putData(name1){
    for (i=0; i < data.length; i++) {
        if (data[i].name==name1){
            document.getElementById("countryCapital").textContent = data[i].capital;
            document.getElementById("countryFlag").setAttribute("src", data[i].flag);
            document.getElementById("countryPopu").textContent = data[i].population;
            document.getElementById("countryArea").textContent = data[i].area;
            break;
        }
    }
}


