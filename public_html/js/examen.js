var xhttp, carg, text, selecProv, selecPob, pob;

var agenda = [];
var textCapturatAJAX;
var persones = {};
var persona = [];

persones = textCapturatAJAX.split("\n");

for (var i in persones) {
    persona = persones[i].split(",");
    var Obj = {nom:persona[0], cognom:persona[1], adreca:persona[2]};
    agenda.push(Obj);
}

//--------------------------------------- Carregar TXT ---------------------------------
function loadDocTXT() {
    selec = document.getElementById("selec");//Captura elements de l'índex
    selecRes = document.getElementById("selecRes");//Captura elements de l'índex
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.onreadystatechange = function () {
//        if (this.readyState == 4 && this.status == 200) {
        if (this.readyState === 4) {
            text = this.responseText;
            cargarSelecTXT();
        }
    };
    xhttp.open("GET", "txt/index.txt", true);//L'adreça del fitxer que carrega
    xhttp.send();
}

function cargarSelecTXT() {
    carg = text.split(",");
    for (var i in carg) {
//        selec.innerHTML += "<option name="+carg[i]+".txt onmousedown='inf('"+carg[i]+".txt')'>"+carg[i]+"</option>";
        selec.innerHTML += "<option value=txt/" + carg[i] + ".txt>" + carg[i] + "</option>";
    }
}

function infTXT() {
    //alert("dsdsd");
    var llista = document.getElementById("selec");
    var index = llista.selectedIndex;
    var opcioSelecc = llista.options[index];
    //alert(opcioSelecc.value);//Buscar el valor del value
    //alert(opcioSelecc.text);//Buscar el valor intern del text
    xhttp.onreadystatechange = function () {
//        if (this.readyState == 4 && this.status == 200) {
        if (this.readyState === 4) {
//            text = this.responseText;
            selecRes.innerHTML = this.responseText;
        }
    };
    xhttp.open("GET", opcioSelecc.value, true);
    xhttp.send();
}



//------------------------------- Carregar xml ------------------------------------
function loadDocXML() {
    selecProv = document.getElementById("selecProv");//Captura elements de l'índex
    selecPob = document.getElementById("selecPob");//Captura elements de l'índex
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.onreadystatechange = function () {
//        if (this.readyState == 4 && this.status == 200) {
        if (this.readyState === 4) {
            text = this.responseXML;
            cargarSelecXML();
        }
    };
    xhttp.open("GET", "xml/dades.xml", true);//L'adreça del fitxer que carrega
    xhttp.send();
}

function cargarSelecXML() {
    var i;
    var x = text.getElementsByTagName("provincia");
    for (i = 0; i < x.length; i++) {
//    for (i in x) {
        selecProv.innerHTML += "<option value=" +
                x[i].getElementsByTagName("nom")[0].childNodes[0].nodeValue + ">" +
                x[i].getElementsByTagName("nom")[0].childNodes[0].nodeValue + "</option>";
    }
}

function infXML() {
    selecPob.innerHTML = "";
    var llista = document.getElementById("selecProv");
    var index = llista.selectedIndex;
    var opcioSelecc = llista.options[index].value;

    //alert(opcioSelecc.value);//Buscar el valor del value
    //alert(opcioSelecc.text);//Buscar el valor intern del text
    xhttp.onreadystatechange = function () {
//        if (this.readyState == 4 && this.status == 200) {//Només en servidor
        if (this.readyState === 4) {
            pob = this.responseXML;
            cargarPob(opcioSelecc);
        }
    };
    xhttp.open("GET", "xml/dades.xml", true);
    xhttp.send();
}

function cargarPob(opcioSelecc) {
    var i;
    var x = pob.getElementsByTagName("provincia");
    for (i = 0; i < x.length; i++) {
        if (x[i].getElementsByTagName("nom")[0].childNodes[0].nodeValue === opcioSelecc) {
            var poblacions = x[i].getElementsByTagName("poblacio");
            var j;
            for (j = 0; j < poblacions.length; j++) {
                selecPob.innerHTML += "<option value=" +
                        poblacions[j].childNodes[0].nodeValue + ">" +
                        poblacions[j].childNodes[0].nodeValue + "</option>";
            }
        }
    }
}

//---------------------------- Indexed Data Base--------------------------------
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var db;
var dbName = "ProvaDB";
function startDB() {
    if (!window.indexedDB) {
        window.alert("El teu navegador no suporta IndexedDB.");
    }

    var request = indexedDB.open(dbName, 1);

    request.onerror = function (event) {
        console.log("request.onerror" + event.target.errorCode);
    };
    request.onupgradeneeded = function (event) {
        console.log("request.onupgradeneeded, we are creating a new version of the dataBase");
        db = event.target.result;
        var objectStore = db.createObjectStore("alumnes", {keyPath: "dni"});
        objectStore.createIndex("by_dni", "dni", {unique: true});
        // Create an index to search customers by name. We may have duplicates
        // so we can't use a unique index.
        objectStore.createIndex("by_name", "nom", {unique: false});

        // Create an index to search customers by email. We want to ensure that
        // no two customers have the same email, so use a unique index.
        objectStore.createIndex("by_email", "email", {unique: true});
    };
    request.onsuccess = function (event) {
        console.log("request.onsuccess, database opened, now we can add / remove / look for data in it!");
        db = event.target.result;
    };

}

function deleteDB() {

    var request = indexedDB.deleteDatabase("ProvaDB");
    request.onsuccess = function (event) {
        console.log("Base de dades esborrada");
    };
}

function addData() {

    var transaction = db.transaction(["alumnes"], "readwrite");
    transaction.oncomplete = function (event) {
        console.log("Transacció Completa!");
    };
    transaction.onerror = function (event) {
        console.log("transaction.onerror errcode=" + event.target.error.name);
    };

    var objectStore = transaction.objectStore("alumnes");
    var alumne = {};
    alumne.dni = document.getElementById("dni").value;
    alumne.nom = document.getElementById("nom").value;
    alumne.cognom = document.getElementById("cognom").value;
    alumne.email = document.getElementById("correu").value;
    var request = objectStore.add(alumne);
    //var request = objectStore.add({dni: "44444444H", nom: "Peter", cognom: "Parker", email: "peter@cdm.dom"});
    request.onsuccess = function (event) {
        console.log("Dades afegides correctament.");
    };
    request.onerror = function (event) {
        console.log("request.onerror, no es poden inserir dades, errcode = " + event.target.error.name);
    };
}

function deleteData() {
    var transaction = db.transaction(["alumnes"], "readwrite");
    transaction.oncomplete = function (event) {
        console.log("Transacció Completa!");
    };
    transaction.onerror = function (event) {
        console.log("transaction.onerror errcode=" + event.target.error.name);
    };
    var objectStore = transaction.objectStore("alumnes");
    var request = objectStore.delete(document.getElementById("nomc").value);

}

function cercarData() {
    var transaction = db.transaction(["alumnes"], "readwrite");
    transaction.oncomplete = function (event) {
        console.log("Transacció Completa!");
    };
    transaction.onerror = function (event) {
        console.log("transaction.onerror errcode=" + event.target.error.name);
    };
    var objectStore = transaction.objectStore("alumnes");
    var index = objectStore.index("by_name");
    var request = index.get(document.getElementById("nomc").value);
    request.onsuccess = function (event) {
        // Do something with the request.result!
        //alert("Name for SSN 444-44-4444 is " + request.result.dni);
        var taula = document.getElementById("cercaTaula");
        taula.innerHTML = "<tr><td>DNI</td><td>Nom</td><td>Cognoms</td><td>email</td></tr>";
//        var cursor = event.target.result;
//        var alumne = cursor.value;
        var alumne = request.result;
        //alert("Name for SSN " + cursor.key + " is " + cursor.value.nom);
        taula.innerHTML += "<tr><td>" + alumne.dni + "</td><td>" + alumne.nom + "</td><td>" + alumne.cognom + "</td><td>" + alumne.email + "</td></tr>";
    };

}

function llistarAlumnes() {
    var objectStore = db.transaction("alumnes").objectStore("alumnes");
    var taula = document.getElementById("llistaTaula");
    taula.innerHTML = "<tr><td>DNI</td><td>Nom</td><td>Cognoms</td><td>email</td></tr>";
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            var alumne = cursor.value;
            //alert("Name for SSN " + cursor.key + " is " + cursor.value.nom);
            taula.innerHTML += "<tr><td>" + alumne.dni + "</td><td>" + alumne.nom + "</td><td>" + alumne.cognom + "</td><td>" + alumne.email + "</td></tr>";
            cursor.continue();
        } else {
            //alert("No more entries!");
            taula.innerHTML += "<tr><td>Fin de entrades</td></tr>";
        }
    };
}

function carregarAlumnes() {
    var objectStore = db.transaction(["alumnes"], "readwrite").objectStore("alumnes");
    var taula = document.getElementById("taula");
    taula.innerHTML = "";

    objectStore.openCursor().onsuccess = function (event) {

        var cursor = event.target.result;
        if (cursor) {
            var alumne = cursor.value;
            taula.innerHTML += "<tr><td width='400'><a class='enllaç' onclick='cercarAlumneID(" + alumne.dni + ")'>" + alumne.cognom + ", " + alumne.nom + "</a></td><td align='center' width='100'><a class='boto' onclick='cercarAlumneID(" + alumne.dni + ")'>Consulta</a></td></td><td align='center' width='100'><a class='boto' href=''>Nova</a></td><td align='center' width='100'><a class='boto' href=''>Nou</a></td><td align='center' width='100'><a class='boto' onclick='eliminarAlumne(" + alumne.dni + ")'>Eliminar</a></td></tr>";
            cursor.continue();

        }
    };//Vigila aquest semi-colon
}

