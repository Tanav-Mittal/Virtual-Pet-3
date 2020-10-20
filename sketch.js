var dog, happyDog, database, foodS, foodStock
var Imgdog,ImgHappydog
var feed, adFood
var fedTime, lastFed
var foodObj
var changeGameState,readGameState
var bedroomIMG,gardenIMG,washroomIMG
var currentTime
var gameState = "Hungry"


function preload()
{
  Imgdog = loadImage("dogImg.png")
  ImgHappydog = loadImage("dogImg1.png")

  bedroomIMG = loadImage("Bed Room.png")
  gardenIMG = loadImage("Garden.png")
  washroomIMG = loadImage("Wash Room.png")
}

function setup() {
  database = firebase.database();
  createCanvas(700,500);
  
  dog = createSprite(500,250,10,10)
  dog.addImage(Imgdog);
  dog.scale = 0.3

  foodStock = database.ref('Food')
  foodStock.on("value",readStock)

  foodObj = new Food()

  feed = createButton("Feed the dog")
  feed.position(600,95)
  feed.mousePressed(feedDog)

  adFood = createButton("Add food")
  adFood.position(700,95)
  adFood.mousePressed(addFood)

  readGameState = database.ref('gameState')
  readGameState.on("value",function(data)
  {
    gameState = data.val()
  })
  
}


function draw() {  
  background(46,139,87)

  foodObj.display();

  fedTime = database.ref('FeedTime')
  fedTime.on("value",function(data)
  {
    lastFed = data.val();
  })

  fill(255,255,254)
  textSize(15)
  if(lastFed>=12)
  {
    text("Last Feed: "+lastFed % 12 + " PM",325,30)
  }
  else if(lastFed === 0)
  {
    text("Last Feed : 12 AM",325,30)
  }
 else 
 {
   text("Last Feed : " + lastFed + "AM",325,30)
 }

 if(gameState != "Hungry")
 {
   feed.hide();
   adFood.hide();
   dog.remove()
 }
 else
 {
  feed.show()
  adFood.show()
  dog.addImage(Imgdog)
 }

 currentTime = hour();
 if(currentTime == (lastFed+1))
 {
   update("Playing")
   foodObj.garden();
 }
  else if(currentTime==(lastFed+2))
  {
    update("Sleeping")
    foodObj.bedroom()
  }
  else if(currentTime>(lastFed+2) && currentTime <= (lastFed+4))
  {
    update("Bathing")
    foodObj.washroom()
  }
  else
  {
    update("Hungry")
    foodObj.display();
    dog.addImage(Imgdog)
  }

  drawSprites();
}

function readStock(data)
{
  foodS = data.val()
  foodObj.updateFoodStock(foodS)
}


function feedDog()
{
  dog.addImage(ImgHappydog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update(
    {
      Food:foodObj.getFoodStock(),
      FeedTime:hour()
    }
  )
}

function addFood()
{
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state)
{
  database.ref('/').update({
    gameState:state
  })
}