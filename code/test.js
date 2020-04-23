/* QUESTIONS */
window.addEventListener("load", startQuestion);
var d = document.querySelector("#dragArea");
//var t = document.getElementById("#textArea");
var xQ, yQ;
var questionCounter = 0;
var reachGoal = 0;
var xW, yW;
var numWalls = Math.floor(Math.random()*15);
var level = 1;

/* QUESTIONS */

function startQuestion() {
    xQ = 50;
    yQ = 50;
    setTranslate(xQ, yQ, goalBox);
    if(level <= 1) {
        document.getElementById("forLoop").style.visibility = "hidden";
    }
}

var nextButton = document.querySelector("#next");
nextButton.addEventListener("click", nextQuestion);

function nextQuestion() {
    reset();
    xQ = Math.floor(Math.random()*5);
    xQ = xQ * 50;
    
    yQ = Math.floor(Math.random()*5);
    yQ = yQ * 50;
    
    setTranslate(xQ, yQ, goalBox);
    questionCounter++;
    
    document.getElementById("test1").innerHTML = level + " " + questionCounter + " " + reachGoal;
    
    if(level >= 1) {
        document.getElementById("levelup").style.visibility = "visible";
        document.getElementById("forLoop").style.visibility = "visible";
    }
    
    numWalls = Math.floor(Math.random()*15);
    if(level > 2) {
        w.style.visibility = "visible";
        
        while(w.lastElementChild) {
            w.removeChild(w.lastElementChild);
        }
    
        for(var i = 0; i < numWalls; i++)
            createWalls();
    }
    document.getElementById("test2").innerHTML = document.getElementById("forLoop").style.visibility;
    
    if(questionCounter >= 3  && reachGoal >= 1) {
        levelUp();
    }
    
    //document.getElementById("test1").innerHTML = level + " " + questionCounter + " " + reachGoal;
}

/* LEVEL */

function levelUp() {
    reset();
    document.getElementById("levelup").style.visibility = "visible";
    level++;
    questionCounter = 0;
    reachGoal = 0;
}

var w = document.querySelector("#wall");

function createWalls() {
    var wallCln = w.cloneNode(false);
    document.getElementById("wall").appendChild(wallCln);
    
    xW = Math.floor(Math.random()*5);
    xW = xW * 50;

    yW = Math.floor(Math.random()*5);
    yW = yW * 50;
    setTranslate(xW, yW, wallCln);
}

/* RESET */

var resetButton = document.querySelector("#reset");
resetButton.addEventListener("click", reset);

function reset() {
    //document.getElementById("test").innerHTML = "RESET";
    var boxesArea = document.querySelector("#boxes");
    var elements = boxesArea.querySelectorAll("*[style]");
    
    for(var i = 0; i < elements.length; i++) {
        elements[i].remove();
    }
    
    document.getElementById("answerArea").style.background = "grey";
    listTranslation = [];
    dotPlayer.offsetLeft = 0;
    dotPlayer.offsetTop = 0;
    setTranslate(0,0, dotPlayer);
    xDotLoc = 0;
    yDotLoc = 0;
    goalBox.style.background = "white";
    loops = 1;
    wallOn = true;
    forOrder = [];
}

/* SWITCH EDITORS */
//var switchButton = document.querySelector("#switch");
//switchButton.addEventListener("click", switchEditor);
//
//function switchEditor() {
//    
//    if(window.getComputedStyle(d).visibility === "visible") {
//        d.style.visibility = "hidden";
//        t.style.visibility = "visible";
//    }
//    
//    if(window.getComputedStyle(d).visibility === "hidden") {
//        d.style.visibility = "visible";
//        t.style.visibility = "hidden";
//    }
//}


/* PLAY */
var playButton = document.querySelector("#play");
playButton.addEventListener("click", play);

function play() {
    document.getElementById("answerArea").style.background = "green";
    
(function theLoop (i) {
  setTimeout(function () {
    setTranslate.apply(null, listTranslation[listTranslation.length-i]);
    if (--i) {          // If i > 0, keep going
      theLoop(i);       // Call the loop again, and pass it the current value of i
    }
  }, 1000);
})(listTranslation.length);
}

/* DRAG */
var elem = null;
var dragItem = null;
var cln = null;
var listTranslation = [];
var dotPlayer = document.getElementById("dotMove");
var goalBox = document.getElementById("goal");

var active = false;
var endX, endY;
var startX, startY;
var xOffset = 0;
var yOffset = 0;

d.addEventListener("mouseover", pickElement);
d.addEventListener("mousedown", dragStart, false);
d.addEventListener("mouseup", dragEnd, false);
d.addEventListener("mousemove", drag, false);

function pickElement(e) {
    elem = document.elementFromPoint(e.clientX, e.clientY).closest("div div");
    cln = elem.cloneNode(true);
    
    if(elem.closest("#boxes") != null) {
        dragItem = elem;
    }
    
}

function dragStart(e) {
    xOffset = 0;
    yOffset = 0;
    elem.parentNode.append(cln);

    startX = e.clientX - xOffset;
    startY = e.clientY - yOffset;

  if (e.target === dragItem) {
    active = true;
  }
}

function dragEnd() {
  startX = endX;
  startY = endY;

  active = false;
}

function drag(e) {
  if (active) {

    e.preventDefault();

    endX = e.clientX - startX;
    endY = e.clientY - startY;

    xOffset = endX;
    yOffset = endY;

    setTranslate(endX, endY, dragItem);
  }
}

function setTranslate(xPos, yPos, el) {
  el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
  if(el.id == "dotMove") {
      checkAns(goalBox.offsetLeft + xQ, goalBox.offsetTop + yQ, dotPlayer.offsetLeft + xPos,  dotPlayer.offsetTop + yPos);
      
      if(level > 2) {
      var nodes = w.childNodes;
      nodes[0] = document.getElementById("wall");
       for(var i=0; i<nodes.length; i++) {
            if(checkWalls(nodes[i].offsetLeft + xW, nodes[i].offsetTop + yW, dotPlayer.offsetLeft + xPos,  dotPlayer.offsetTop + yPos, i))
                break;
        }
      }
  }
    
    
}

/* DRAG - MAKE MOVES */

d.addEventListener("mouseup", movePlayer);
var xDotLoc = 0;
var yDotLoc = 0;
var loops = 1;
var n =  1;
var forHeight = 150;
var forOrder = [];

function movePlayer () {
    var classElem = elem.className;
    elem.hidden = true;
    var belowArea = document.elementFromPoint(event.clientX, event.clientY);
    elem.hidden = false;
    var safezone = false;
    var forActive = false;
    
    if(classElem == "square")  {
        var a = document.elementFromPoint(event.clientX, event.clientY).innerHTML;
    }
    
    if(belowArea.id == "answerArea" || belowArea.id == "forLoop"){
        safezone = true;
    }
    
    
    if(a.search("for") > - 1 && belowArea.id == "answerArea") {
        n = document.querySelector("#loopNum").innerHTML;
        forActive = true;
    }
    else {
        forActive = false;
    }
    
    if(belowArea.id == "forLoop") {
        forActive = true;
        forHeight += 50;
        belowArea.style.height = forHeight +"px";
    }
    
    if(forActive) {
        loops = parseInt(n);
        forActive = false;
    }
    
    while(elem.lastChild && !safezone) {
        elem.parentNode.removeChild(elem);
    }
    

    
        if(a.search("moveRight()") > -1 && safezone) {
            xDotLoc += 50;
        }

        if(a.search("moveLeft()") > -1 && safezone) {
            xDotLoc -= 50;
        }

        if(a.search("moveUp()") > -1 && safezone) {
            yDotLoc -= 50;
        }

        if(a.search("moveDown()") > -1 && safezone) {
            yDotLoc += 50;
        }
        
        if(loops > 1) {
            forOrder.push([xDotLoc, yDotLoc, dotPlayer]);
            document.getElementById("test3").innerHTML = "Placed in forLoop " + listTranslation.length;
            for(var l = 1; l <= loops; l++)
                listTranslation.push(null);
            
            addOrder = false;
        }
    
        while(loops > 0) {
            if(loops == 1) {
                listTranslation.push([xDotLoc, yDotLoc, dotPlayer]);
                document.getElementById("test3").innerHTML = "Placed in list " + listTranslation.length;
            }
            else {
                var index = listTranslation.indexOf(null);
                document.getElementById("test2").innerHTML = index;

                for(var o = 0; o < forOrder.length; o++) {
                    listTranslation[index] = forOrder[o];
                }
            } 
            
            loops--;
        }
    
    if(loops == 0) {
        loops = 1;
        forOrder = [];
    }
}

/* VALIDATION */
function checkAns(gLeft, gTop, xPos, yPos) {
    if(gTop == yPos && gLeft == xPos) {
        goalBox.style.background = "green";
        reachGoal++;
    }
}

function checkWalls(wLeft, wTop, xPos, yPos, i) {
    if( i == 0 ) {
        wLeft = 75;
        wTop = 0;
    }
    document.getElementById("test3").innerHTML = i + " : " + wLeft + " " + wTop + " " + xPos + " " + yPos;
    if(wTop <= yPos + 50 && wTop >= yPos-8  && wLeft <= xPos + 50 && wLeft >= xPos ) {
        goalBox.style.background = "red";
        return true;
    }
    return false;
}

/* TEXT */