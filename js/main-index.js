var allCand = []; //variavel onde guardaremos todos os candidatos

var sidenavStatus = 'all'; //onde o sidenav esta posicionado (all/trash/check)

async function main(){
    if (localStorage.getItem('user-Storage') === null) { //get do usuario principal    
        user = await axios.get('https://randomuser.me/api/?page=3&results=10&nat=br');
        localStorage.setItem('user-Storage',JSON.stringify(user));
    } else {
        user = JSON.parse(localStorage.getItem('user-Storage'));
    }
    processUser(user.data.results[0]);
    if (localStorage.getItem('allCand-Storage') === null) { //get dos candidatos
        for(var i = 0; i < 10; i++ ){
            allCand[i] = await axios.get('https://randomuser.me/api/?page=3&results=10&nat=br');
            allCand[i].data.results[0]['trash'] = false;
            allCand[i].data.results[0]['check'] = false;
            allCand[i].data.results[0]['id'] = 'cand' + i;
        }
        localStorage.setItem('allCand-Storage',JSON.stringify(allCand));
    } else {
        allCand = JSON.parse(localStorage.getItem('allCand-Storage'));
    }
    refreshCand();
    addSearch();
}

main();

function addListeners(){
    var CandImgElements = document.getElementsByClassName("img-cand");
    var CandNameElements = document.getElementsByClassName("name-cand");
    var trashElements = document.getElementsByClassName("trash-icon");
    var allElements = document.getElementsByClassName("all-icon");
    var checkElements = document.getElementsByClassName("check-icon");
    for(var i = 0; i < trashElements.length; i++){
        CandImgElements[i].addEventListener('click',showCand);
        CandNameElements[i].addEventListener('click',showCand);
        trashElements[i].addEventListener('click',setTrash);
        allElements[i].addEventListener('click',setAll);
        checkElements[i].addEventListener('click',setCheck);
    }
}

function setColorNav(){
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace("active", "");
    document.getElementById(sidenavStatus+"-nav").className = "active";
}

function trashList(){
    sidenavStatus = 'trash';
    setColorNav();
    refreshCand();
    document.getElementById("search").value = '';
}

function allList(){
    sidenavStatus = 'all';
    setColorNav();
    refreshCand();
    document.getElementById("search").value = '';
}

function checkList(){
    sidenavStatus = 'check';
    setColorNav();
    refreshCand();
    document.getElementById("search").value = '';
}

function refreshCand(){
    cleanCand();
    localStorage.setItem('allCand-Storage',JSON.stringify(allCand));
    if(sidenavStatus === 'all'){ 
        for(var i = 0; i < allCand.length; i++ ){
            if(!allCand[i].data.results[0].trash) //processar apenas os cadidatos do todos
            processCand(allCand[i].data.results[0]);
        }
    } else if (sidenavStatus === 'trash'){ 
        for(var i = 0; i < allCand.length; i++ ){
            if(allCand[i].data.results[0].trash) //processar apenas os cadidatos do lixo
            processCand(allCand[i].data.results[0]);
        }
    } else if (sidenavStatus === 'check'){
        for(var i = 0; i < allCand.length; i++ ){
            if(allCand[i].data.results[0].check) //processar apenas os cadidatos marcados com check
            processCand(allCand[i].data.results[0]);
        }
    }
    addListeners();  
}

function showCand(event){ //abrir a pagina onde mostra as principais informações do candidato
    // passamos o id do candidato a ser mostrado pelo url
    if(event.target.className == 'name-cand')
        window.location.href = "candidate.html?id=" + event.target.parentElement.id;
    else
        window.location.href = "candidate.html?id=" + event.target.parentElement.parentElement.id;
}

function setAll(event){
    var idCand = event.target.parentElement.parentElement.id;
    for(var i = 0; i < allCand.length; i++ ){
        if(allCand[i].data.results[0]['id'] === idCand) 
            allCand[i].data.results[0]['trash'] = false;
    }
    refreshCand();
}

function setCheck(event){
    var idCand = event.target.parentElement.parentElement.id;
    for(var i = 0; i < allCand.length; i++ ){
        if(allCand[i].data.results[0]['id'] === idCand) 
            if(allCand[i].data.results[0]['check']) 
                allCand[i].data.results[0]['check'] = false;
            else
                allCand[i].data.results[0]['check'] = true;
    }
    refreshCand();
}

function setTrash(event){
    var idCand = event.target.parentElement.parentElement.id;
    for(var i = 0; i < allCand.length; i++ ){
        if(allCand[i].data.results[0]['id'] === idCand) 
            allCand[i].data.results[0]['trash'] = true;
    }
    refreshCand();
}

function processUser(data){
    document.getElementById('user-img').src = data.picture.thumbnail;
}

function cleanCand(){ //limpa toda a ul de candidatos
    var ulElement = document.getElementById('list-candidates');
    ulElement.innerText = '';
}

function processCand(data){
    var ulElement = document.getElementById('list-candidates');
    ulElement.insertAdjacentHTML('beforeend',
            "<li id=\""+ data.id +"\" class=\"cand\">" + "<div class=\"circle-cand\">" + 
            "<img class=\"img-cand\" src=\"" + data.picture.thumbnail +"\">" + "</div>" +
            "<span class=\"name-cand\">" + titleize(data.name.first) + "</span>" +
            "<span class=\"mail-cand\">" + data.email + "</span>" +
            "<span>" + data.phone + "</span>" +
            "<span>" + titleize(data.location.city) +" - "+ titleize(data.location.state) + "</span>" +
            "<div class=\"option-cand\">" + renderIcons(data) + "<div/>");
}

function renderIcons(data){
    return "<i class=\"fas fa-trash cand-icon trash-icon\"></i>" + 
            "<i class=\"fas fa-border-all cand-icon all-icon\"></i>" +
            "<i " + processCheck(data) + " class=\"fas fa-check cand-icon check-icon\"></i>"
}

function processCheck(data){ //coloca o icone de check do candidato verde
    if(data.check)
        return "style=\"color:#aec000\""
}

function filterCand(cand) { 
    var inputSearchElement = document.getElementById("search");
    var inputSearchValue = inputSearchElement.value;
    //filtra o canditado pelo nome ou pelo email
    return (cand.data.results[0].name.first.toUpperCase().includes(inputSearchValue.toUpperCase()) ||
            cand.data.results[0].email.toUpperCase().includes(inputSearchValue.toUpperCase()));
}

function onFilterCand(){
    var dataCand = JSON.parse(JSON.stringify(allCand));
    console.log(dataCand);
    dataCand = dataCand.filter(filterCand);
    refreshCandSearch(dataCand);
}

function addSearch(){
    var searchElement = document.getElementById("search");
    searchElement.addEventListener('keyup',onFilterCand);
}

// diferença dessa função com a refreshCand() é que nessa 
// ira processar apenas os candidatos que estão na tela atual
function refreshCandSearch(data){ 
    cleanCand();
    if(sidenavStatus === 'all'){
        for(var i = 0; i < data.length; i++ ){
            if(!data[i].data.results[0].trash) // alllist
            processCand(data[i].data.results[0]);
        }
    } else if (sidenavStatus === 'trash'){
        for(var i = 0; i < data.length; i++ ){
            if(data[i].data.results[0].trash) // trashlist
            processCand(data[i].data.results[0]);
        }
    } else if (sidenavStatus === 'check'){
        for(var i = 0; i < data.length; i++ ){
            if(data[i].data.results[0].check) // checklist
            processCand(data[i].data.results[0]);
        }
    }
    addListeners();  
}

function titleize(name){ //coloca maiusculo na primeira letra da palavra
    return name[0].toUpperCase() + name.slice(1)
}