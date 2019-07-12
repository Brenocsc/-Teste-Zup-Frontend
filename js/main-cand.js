var allCand = []; //variavel onde guardaremos todos os candidatos

var candidate //candidato que está sendo mostrado as informações na pagina

function main(){
    allCand = JSON.parse(localStorage.getItem('allCand-Storage'));
    var id = location.href.split("=").pop(); //pega o id do candidato pelo url
    candidate = findCand(id);
    processRectInfo();
}

main();

function findCand(id){
    for(var i = 0; i < allCand.length; i++ ){
        if(allCand[i].data.results[0].id === id )
            return allCand[i].data.results[0];
    }
}

function processRectInfo(){
    var divElement = document.getElementById('rect-info');
    divElement.insertAdjacentHTML('beforeend',
        "<div id=\"rect-header\"> <div id=\"circle-img\">" +
        "<img src=\""+ candidate.picture.large +"\"> </div> </div>" +
        "<span id=\"intro\">Hi, My name is</span> <h1 id=\"title\">" + 
        titleize(candidate.name.first) + " " + titleize(candidate.name.last) +
        "<\h1> <div id=\"options-info\">" +
        "<i id=\"opt1\" class=\"opt-icon far fa-user active\"></i>" +
        "<i id=\"opt2\" class=\"opt-icon far fa-envelope\"></i>" +
        "<i id=\"opt3\" class=\"opt-icon far fa-calendar-alt\"></i>" +
        "<i id=\"opt4\" class=\"opt-icon far fa-map\"></i>" +
        "<i id=\"opt5\" class=\"opt-icon fas fa-mobile-alt\"></i>" +
        "<i id=\"opt6\" class=\"opt-icon fas fa-key\"></i> </div>")
    addListeners();
}

function addListeners(){
    var iElements = document.getElementsByClassName('opt-icon');
    for(var i = 0; i < iElements.length; i++ ){
        iElements[i].addEventListener("mouseover", setOptInfo);
    }
}

function titleize(name){ //coloca maiusculo na primeira letra da palavra
    return name[0].toUpperCase() + name.slice(1)
}

function setOptInfo(event){
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    var h1Element = document.getElementById('title');
    var spanElement = document.getElementById('intro');
    console.log(h1Element);
    if(event.target.id === 'opt1'){
        event.target.className += " active";
        spanElement.innerHTML = "Hi, My name is"
        h1Element.innerHTML = titleize(candidate.name.first) + " " + titleize(candidate.name.last)
    } else if(event.target.id === 'opt2'){
        event.target.className += " active";
        spanElement.innerHTML = "My email address is"
        h1Element.innerHTML = candidate.email
    } else if(event.target.id === 'opt3'){
        event.target.className += " active";
        spanElement.innerHTML = "My birthday is"
        h1Element.innerHTML = candidate.dob.date.split("T")[0];
    } else if(event.target.id === 'opt4'){
        event.target.className += " active";
        spanElement.innerHTML = "My address is"
        h1Element.innerHTML = titleize(candidate.location.city) + " " + titleize(candidate.location.state)
    } else if(event.target.id === 'opt5'){
        event.target.className += " active";
        spanElement.innerHTML = "My phone number is"
        h1Element.innerHTML = candidate.cell
    } else if(event.target.id === 'opt6'){
        event.target.className += " active";
        spanElement.innerHTML = "My password is"
        h1Element.innerHTML = candidate.login.password
    }
}
