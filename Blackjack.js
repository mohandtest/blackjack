//Definerer arrayer og variabler
let kort = [2,3,4,5,6,7,8,9,10,10,10,10,11]
let kortTekst = [" to"," tre"," fire"," fem"," seks"," sju"," åtte"," ni"," ti"," knekt"," dronning"," konge"," ess"]
let mineHender=[];
let dataHender=[];
let mineHenderIndexer=[];
let mineHenderStreng=[];
let TrekkEllerStå;

//Definer DOM elementer
let nyttSpill = document.querySelector("#nyttSpill");
let mineKort = document.querySelector("#mineHender")
let dataKort = document.querySelector("#dataHender")
let trekk = document.querySelector("#trekk")
let stå = document.querySelector("#stå")
let melding = document.querySelector("#melding")
let seiersmelding = document.querySelector("#seierEllerTap")
let loading = document.querySelector("#loading")



//Funksjoner jeg bruker

//En funksjon som indexer et random kort fra lista og returnerer det randomme kortet
randomKort = () => {
    window.index = Math.floor(Math.random() * kort.length)
    return kort[window.index]
}

//En funksjon for å summere arrayet
summer = (array) => {
    return array.reduce(function(a, b) { return a + b; }, 0)
}

//En promise som gjør det mulig å få programmet til å sove
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


//Noen mindre funksjoner for funksjonalitet i koden (brukt på knappene)
function ståFunksjon(){
    TrekkEllerStå = 0
}
function trekkFunksjon(){
    TrekkEllerStå = 1
}
async function load(){
for (let i = 0; i < 3; i++){
	    loading.innerHTML = "."
	    await sleep(100)
	    loading.innerHTML = ".."
	    await sleep(100)
	    loading.innerHTML = "..."
	    await sleep(100)
}
loading.innerHTML = ""
}

//En funksjon som tar indexen fra kortene og bruker den for å finne navnet på kortene [10,10,10,10,"11"] = ["ti","knekt","dronning","konge","ess"]
function kortTilTekst(array,counterarray) {
    array.forEach(element => {
    counterarray.push(kortTekst[element])
})}


// Selve spillet. Async brykes for å få programmet til å skjønne at en promise skal brukes.
async function blackjack() {
    melding.innerHTML = "Kortene er blitt delt ut"

	//gi to kort til hver av spillerene
	for(let i=0;i<2;i++){
	    mineHender.push(randomKort())
        mineHenderIndexer.push(window.index)
	    dataHender.push(randomKort())
    }

    //Sortere dataens kort og røpe en av dem
    dataHender.sort(function(a, b){return a - b})
    dataKort.innerHTML = 'Du kan se et av dealerens kort: ' + dataHender[Math.floor(Math.random() * dataHender.length)]

    //Sortere egne kort og gjøre dem om til tekst
    mineHender.sort(function(a, b){return a - b})
    mineHenderIndexer.sort(function(a, b){return a - b})
    kortTilTekst(mineHenderIndexer,mineHenderStreng)
    mineKort.innerHTML = mineHenderStreng + ". Sum: " + summer(mineHender)

    //Tenkte dette var fancy i ett spill fordi det viser brukeren at programmet bruker tid på å tenke ettersome melding.innerhtml vil endre seg
    //Brukes senere for å forhindre crashing, altså er det nødvendig.
    load()
    await sleep(1000)

	//Vise spilleren kortene sine. Venter på at spilleren bruker knappene.
    while(summer(mineHender) <= 21){
        //Sorterer
        mineHender.sort(function(a, b){return a - b})
        mineKort.innerHTML = mineHenderStreng + ". Sum: " + summer(mineHender) 
        melding.innerHTML = 'Vil du stå eller trekke?'
         

        //Hvis ikke vil programmet crashe
        await sleep(50)

        //Trekk eller stå logikk for knappene.
        if(TrekkEllerStå==0){
            break 
        } else if(TrekkEllerStå==1){
            mineHenderIndexer=[];
            mineHender.push(randomKort())
            mineHenderIndexer.push(window.index)
            mineHenderIndexer.sort(function(a, b){return a - b})
            kortTilTekst(mineHenderIndexer,mineHenderStreng)
            TrekkEllerStå = null;
        }
        if(summer(mineHender) == 21){
            break
        }
    }
    //Refresher minekort html'en
    mineKort.innerHTML = mineHenderStreng + ". Sum: " + summer(mineHender);       
    
    //Dataen må ha noe som er høyere enn 17. Men den vil ikke trekke mer hvis den kan se at spilleren har noe høyere enn 21
    while(summer(dataHender) < 17){
        if (summer(mineHender) > 21){
            break
        }
        else{
            dataHender.push(randomKort())
        }
    }

    //Gir brukeren noe tid samtidig som jeg ville bruke noe fancy loading greie
    melding.innerHTML = 'Er du spent på resultatet?'
    load()
    await sleep(1000)
    melding.innerHTML = `Summen av kortene til dealeren er ${summer(dataHender)} og dine er ${summer(mineHender)}`

    //seiers logikk
    if(summer(dataHender) > 21){
        seiersmelding.innerHTML='Du vant!'
    } else if(summer(dataHender) > summer(mineHender)){
        seiersmelding.innerHTML='Du tapte!'
    } else if(summer(mineHender) > 21){
        seiersmelding.innerHTML='Du tapte!'
    } else if(summer(mineHender) > summer(dataHender)){
        seiersmelding.innerHTML='Du vant!'
    } else if(summer(mineHender) == summer(dataHender)){
        seiersmelding.innerHTML='Uavgjort!'
    }   
}


blackjack()

//Resetter alle variabler for å starte spillet på nytt med knappen.
function nyttSpillFunksjon() {
    seiersmelding.innerHTML = ""
    melding.innerHTML = ""
    mineKort.innerHTML = ""
    dataKort.innerHTML = ""
    loading.innerHTML = ""
    mineHender = [];
    dataHender = [];
    mineHenderIndexer=[];
    mineHenderStreng=[];
    TrekkEllerStå = null;
    window.index = null;
    blackjack()
}