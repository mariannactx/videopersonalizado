var passo1; var passo1_1;
var passo2; var passo2_2;
var passo3; var passo3_3;
var passo4; var passo4_4;
var popup1; var popup2;
var popup3; var popup4;
var x = 0;  var y;

//Pop-ups

function abrir1() {
    document.getElementById("popup1").style.display = 'block';
}       function fechar1() {
    document.getElementById("popup1").style.display = 'none';
}       function abrir2() {
    document.getElementById("popup2").style.display = 'block';
}       function fechar2() {
    document.getElementById("popup2").style.display = 'none';
}       function abrir3() {
    document.getElementById("popup3").style.display = 'block';
}       function fechar3() {
    document.getElementById("popup3").style.display = 'none';
}       function abrir4() {
    document.getElementById("popup4").style.display = 'block';
}       function fechar4() {
    document.getElementById("popup4").style.display = 'none';
}

//Esconder Divs
window.onload = function(){
    passo1_1 = document.getElementById("passo1_1");
    passo2_2 = document.getElementById("passo2_2");
    passo3_3 = document.getElementById("passo3_3");
    passo4_4 = document.getElementById("passo4_4");

    
    var esconde1 = document.getElementById("esconde1"); 
    esconde1.onclick = esconderDivPasso1;
    
    var esconde2 = document.getElementById("esconde2");
    esconde2.onclick = esconderDivPasso2;

    var esconde3 = document.getElementById("esconde3");
    esconde3.onclick = esconderDivPasso3;

    var esconde4 = document.getElementById("esconde4");
    esconde4.onclick = esconderDivPasso4;

}
function esconderDivPasso1(){
    passo1_1.classList.add("escondido");
}

function esconderDivPasso2(){
    passo2_2.classList.add("escondido");     
}

function esconderDivPasso3(){
    passo3_3.classList.add("escondido");
     
}

function esconderDivPasso4(){
    passo4_4.classList.add("escondido");     
}