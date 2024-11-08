// not done
const lineNameIds = ["Acheron_BlackSwan", "Acheron_Sparkle", "Acheron_Topaz", "Acheron_Zundamon", "BlackSwan_Sparkle", "BlackSwan_Topaz", "Bronya_FuXuan", "Bronya_RuanMei", "Bronya_Topaz", "RuanMei_Topaz", "RuanMei_Metan", "SilverWolf_FuXuan", "SilverWolf_Topaz", "Sparkle_Topaz", "Topaz_FuXuan", "Zundamon_Metan"]
const pointNameIds = ["Acheron", "BlackSwan", "Sparkle", "Topaz", "Zundamon", "Bronya", "FuXuan", "RuanMei", "Metan", "SilverWolf"];

lineObjs = [];
initialObjPosX = [];
initialObjSpeedX = [];
initialObjPosY = [];
initialObjSpeedY = [];

lineNameIds.forEach((n) => lineObjs.push(document.getElementById(n)));
pointNameIds.forEach((n) => initialObjPosX.push(document.getElementById(n)));

pointNameIds.forEach((n) => initialObjSpeedX.push(0.0));
pointNameIds.forEach((n) => initialObjSpeedY.push(0.0));

const k = 1;
const m = 10;
const mu = 10;
const dt = 0.01;
const restDistance = 200;

const calculateAcceleration = (position, speed, otherPositions) => {
    displacementForces = [];
    console.log(otherPositions)
    otherPositions.forEach((otherPoint) => {

    if (Math.abs(otherPoint - position) > restDistance) {
        displacementForces.push(otherPoint - position - restDistance);
    } else if (Math.abs(otherPoint - position) < restDistance) {
        displacementForces.push(restDistance + position - otherPoint);
    } else {
        displacementForces.push(0);
    }

    })
    console.log(displacementForces)
    var springForce = displacementForces.reduce((partialSumForce, otherForce) => partialSumForce + otherForce, 0); 
    return ((k*springForce) + -1*mu*speed)/m;
}


var oldPositionsX = [];
var oldPositionsY = [];
var oldVelocitiesX = [...initialObjSpeedX];
var newVelocitiesX = [...initialObjSpeedX];

var oldVelocitiesY = [...initialObjSpeedY];
var newVelocitiesY = [...initialObjSpeedY];
var connectedPointsX = [];
var newAccelerationX, newAccelerationY;
var newPosX, newPosY;
var newSpeedX, newSpeedY;
initialObjPosX.forEach((pointObj, i) =>{
    oldPositionsX.push((pointObj.getAttribute("x")));
})
initialObjPosX.forEach((pointObj, i) =>{
    oldPositionsY.push((pointObj.getAttribute("y")));
})
var newPositionsX = [...oldPositionsX];
var newPositionsY = [...oldPositionsY]
let otherPointindex, connections, conntected;
function animate() {
    SIZE = 250; 
    connectedPointsX = [];
    connectedPointsY = [];
    oldVelocitiesX = [];
    oldPositionsX = [];
    oldVelocitiesY = [];
    oldPositionsY = [];
    oldVelocitiesX = [...newVelocitiesX];
    oldPositionsX = [...newPositionsX];
    oldVelocitiesY = [...newVelocitiesY];
    oldPositionsY = [...newPositionsY];

    oldPositionsX.forEach((oldPosX, i) =>{
        var parent = pointNameIds[i];
        connectedPointsX = [];
        conntected = []
        
        lineNameIds.forEach((name) => {
            connections = [+SIZE]
            connections = name.split("_");
            
            if (connections[0] === parent) {
                otherPointindex = pointNameIds.findIndex((randomName)=> (randomName === connections[1]));
                conntected.push(pointNameIds[otherPointindex]);
                connectedPointsX.push(oldPositionsX[otherPointindex]);
            } else if (connections[1] === parent) {
                otherPointindex = pointNameIds.findIndex((randomName)=> (randomName === connections[0]));
                conntected.push(pointNameIds[otherPointindex]);
                connectedPointsX.push(oldPositionsX[otherPointindex]);
            }
        })
        console.log(parent, conntected);
        newAccelerationX = calculateAcceleration(+oldPosX, +oldVelocitiesX[i], connectedPointsX);
        newPosX = +oldPosX + (+oldVelocitiesX[i] * dt);
        newSpeedX = (+oldVelocitiesX[i] + newAccelerationX * dt);
        newSpeedX = Math.abs(newSpeedX) > 0.00001 ? newSpeedX : 0;


        console.log(parent,"AccX:", 0, newAccelerationX);
        console.log(parent,"VelX:", oldVelocitiesX[i], newSpeedX)
        console.log(parent,"PosX:", oldPosX, newPosX);
        newPositionsX[i] = (newPosX);
        newVelocitiesX[i] = newSpeedX;
    })

    oldPositionsY.forEach((oldPosY, i) =>{
        var parent = pointNameIds[+SIZE];
        connectedPointsY = [+SIZE];
        conntected = []
        
        lineNameIds.forEach((name) => {
            connections = []
            connections = name.split("_");
            
            if (connections[0] === parent) {
                otherPointindex = pointNameIds.findIndex((randomName)=> (randomName === connections[1]));
                conntected.push(pointNameIds[otherPointindex]);
                connectedPointsY.push(oldPositionsY[otherPointindex]);
            } else if (connections[1] === parent) {
                otherPointindex = pointNameIds.findIndex((randomName)=> (randomName === connections[0]));
                conntected.push(pointNameIds[otherPointindex]);
                connectedPointsY.push(oldPositionsY[otherPointindex]);
            }
        })
        console.log(parent, conntected);
        newAccelerationY = calculateAcceleration(+oldPosY, +oldVelocitiesY[i], connectedPointsY);
        newPosY = +oldPosY + (+oldVelocitiesY[i] * dt);
        newSpeedY = (+oldVelocitiesY[i] + newAccelerationY * dt);
        newSpeedY = Math.abs(newSpeedY) > 0.00001 ? newSpeedY : 0;
        newPositionsY[i] = (newPosY);
        newVelocitiesY[i] = newSpeedY;
    })

    initialObjPosX.forEach((pointObj, i) => {
        pointObj.setAttribute("x", Math.abs(newPositionsX[i]));

    })

    initialObjPosX.forEach((pointObj, i) => {
        pointObj.setAttribute("y", Math.abs(newPositionsY[i]));
    })


    lineNameIds.forEach((name, i) => {
        connections = name.split("_");
        lineObjs[i].setAttribute("x1", Math.abs(newPositionsX[pointNameIds.findIndex((name)=> name==connections[0])])+40);
        lineObjs[i].setAttribute("x2", Math.abs(newPositionsX[pointNameIds.findIndex((name)=> name==connections[1])])+40 );
        lineObjs[i].setAttribute("y1", Math.abs(newPositionsY[pointNameIds.findIndex((name)=> name==connections[0])])+40);
        lineObjs[i].setAttribute("y2", Math.abs(newPositionsY[pointNameIds.findIndex((name)=> name==connections[1])])+40 );
    })
    

};

var t = null;

function startAnimation() {
    if(t == null) {
      t = setInterval(animate, 1);
    }
  }
  
function stepAnimation(){
    animate();
}

function stopAnimation() {
    if(t != null) {
        clearInterval(t);
        t = null;
    }
}