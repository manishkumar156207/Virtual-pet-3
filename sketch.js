var dog, dogHappy, dogSad, garden, washroom, bedroom;
var db, foodS, foodStock, currentTime;
var fedTime, lastFed, feed, addFood, foodObj;
var gameState, readStock;

function preload(){
    dogSad = loadImage("images/Dog.png");
    dogHappy = loadImage("images/happydog.png");
    garden = loadImage("Images/Garden.png");
    washroom = loadImage("Images/Wash Room.png");
    bedroom = loadImage("Images/Bed Room.png");  
}
function setup() {
  createCanvas(1000, 500);
  foodObj = new Food();

  db = firebase.database();
  dog = createSprite(800, 200, 10, 10);
  dog.addImage(dogSad);
  dog.scale = 0.2

  readState=db.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
  db.ref('fedTime').on("value", function(data){
    lastFed = data.val();
  })
  feed = createButton("FEED");
  feed.position(600, 30);
  feed.mousePressed(feedDog);

  addFood = createButton("ADD FOOD");
  addFood.position(700, 30);
  addFood.mousePressed(addFood);

foodStock = db.ref('Food');
foodStock.on("value", readStock);
}

function draw() {  
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    dog.addImage(dogSad);
   }
   
  drawSprites();
  
} 
function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS)
}
function feedDog(){
  dog.addImage(dogHappy)
  foodObj.updateFoodStock(foodObj.getFoodStock()-1)
  db.ref('/').update({
    Food:foodObj.getFoodStock(), 
    fedTime:hour(),
    gameState:"Hungry"
  })
  }

function addFood(){
  foodS++
  db.ref('/').update({
    Food:foodS
  })
}
function update(state){
  db.ref('/').update({
    gameState:state
  })
}