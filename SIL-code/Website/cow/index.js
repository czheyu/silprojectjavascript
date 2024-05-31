var cows;
var cowmultiplier;
var money;
var rawbeef;
var steak;




var cowimgs = []
var width;
var timelastclicked;

function updateCowDisplay(){
  const cowdisplay = document.getElementById("cowdisplay");
  cowdisplay.innerHTML="Cows: "+cows.toLocaleString();
}

function updateMoneyDisplay(){
  const moneydisplay = document.getElementById("moneydisplay");
  moneydisplay.innerHTML="Money: "+money.toLocaleString();
}

function updateCowFarmDisplay(){
  const cowfarmdisplay = document.getElementById("cowfarmdisplay");
  cowfarmdisplay.innerHTML="cowfarm(how much cows u get per click): "+cowmultiplier.toLocaleString();
}

function updateRawBeefDisplay(){
  const rawbeefdisplay = document.getElementById("rawbeefdisplay");
  rawbeefdisplay.innerHTML="rawbeef: "+rawbeef.toLocaleString();
}

function updateSteakDisplay(){
  const steakdisplay = document.getElementById("steakdisplay");
  steakdisplay.innerHTML="steak: "+steak.toLocaleString();
}

function butcher(){
  if(cows<=0){return}



  rawbeef += (Math.floor(Math.random()*4)+8)*cows;
  cows = 0

  updateCowDisplay();
  updateRawBeefDisplay()
  const slashaudio = new Audio("https://czheyuchatapp.onrender.com/cow/slash.mp3");

  slashaudio.play();
}

async function cook(btn){
  if(rawbeef<=0){return}
  let cooking = rawbeef;
  rawbeef = 0
  updateRawBeefDisplay()
  updateSteakDisplay()
  const cookaudio = new Audio("https://czheyuchatapp.onrender.com/cow/steak.mp3");

  cookaudio.play();

  btn.disabled = true;
  btn.innerHTML = "cooking batch of "+cooking
  const progress = document.getElementById('cookprogress');
  for (let i = 0;i<50;i++){
    progress.style.width = i*2+"%";
    await sleep(14*1000/50)
  }

  steak += cooking;

  updateRawBeefDisplay()
  updateSteakDisplay()
  btn.disabled = false;
  btn.innerHTML = "Cook"
  progress.style.width = "0%";
}

function sell(){
  money+=rawbeef*1+steak*5;
  rawbeef = 0
  steak= 0
  updateSteakDisplay()
  updateRawBeefDisplay()
  updateMoneyDisplay()

}

async function clicked(){
  console.log("clicked")
  if(timelastclicked != undefined){
    if(timelastclicked+50 > Date.now()){
      //console.log(timelastclicked+50 < Date.now())
      return
    }
  }
  timelastclicked = Date.now()
  //console.log("registed")
  const mooaudio = new Audio("https://czheyuchatapp.onrender.com/cow/moo.mp3");

  mooaudio.play();

  cows += cowmultiplier
  updateCowDisplay()
  updateMoneyDisplay()


  const cowbtn = document.getElementsByClassName("cowbtn")[0]
  //console.log((width *0.8).toFixed(0)+"px")
  cowbtn.style.width= (width *0.8).toFixed(0)+"px"

  let secs = 150
  let options = [1,2,3,5,10]
  let num = options[Math.floor(Math.random() * options.length)]
  for (let i = 0; i < num; i++){
    clickeffect(cowbtn)
    await sleep(secs/num)
  }
  cowbtn.style.width= width+"px"
  //console.log("set back to "+width+"px")
}

async function clickeffect(cowbtn){
  let cowid = generatecowimgid();
  let element = `
  <div id="${await cowid}" class="cowparticle" style="
        left: ${Math.floor(Math.random()*80)}%;
        top:${Math.floor(Math.random()*80)}%;
        width:${Math.floor(Math.random()*10)+5}%;">
  <img src="https://czheyuchatapp.onrender.com/cow/cow.png">
  </div>`


  cowbtn.innerHTML += element
  for(let i = 0; i < 50; i++){
    let cowparticle = document.getElementById(cowid)
    cowparticle.style.opacity = 1-(1/50*i)**2
    await sleep(1000/50)

  }
  let cowimg = document.getElementById(cowid)
  //console.log(cowimg)
  cowimg.remove()
}


async function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generatecowimgid(){
  let id = Math.floor(Math.random() * 10000)
  while (cowimgs.includes(id)){
    id = Math.floor(Math.random() * 10000)
  }
  return id
}

function upgrade(upgrade){
  if(upgrade!="farm"){return}
  if(spend(500)){
    cowmultiplier+=1
  }
  updateCowFarmDisplay()
  updateMoneyDisplay()
}

function spend(amount){
  if (money>=amount){
    money-=amount
    updateMoneyDisplay()
    return true
  }
  return false
}

function reset(){
  cows = 0
  cowmultiplier = 1
  money = 0
  rawbeef = 0
  steak = 0
  updateCowDisplay()
  updateCowFarmDisplay()
  updateMoneyDisplay()
  updateRawBeefDisplay()
  updateSteakDisplay()

}

window.onload = function (){
  width = document.getElementsByClassName("cowbtn")[0].getBoundingClientRect().width.toFixed(0)
  let data = localStorage.getItem("data");
  if(data=="null"||!data||data=="undefined"){
    cows = 0;
    cowmultiplier = 1;
    money= 0
    rawbeef = 0
    steak = 0
  }else{
    let parsed_data = JSON.parse(data)
    cows = parsed_data.cows
    cowmultiplier = parsed_data.cowmultiplier
    money = parsed_data.money
    rawbeef = parsed_data.rawbeef
    steak = parsed_data.steak

  }
  updateCowDisplay()
  updateCowFarmDisplay()
  updateMoneyDisplay()
  updateRawBeefDisplay()
  updateSteakDisplay()

  setInterval(function(){localStorage.setItem("data",JSON.stringify({money:money,cows:cows,cowmultiplier:cowmultiplier,rawbeef:rawbeef,steak:steak}))},1000)
}