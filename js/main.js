
// Definiciones estandar
var b2Vec2 = Box2D.Common.Math.b2Vec2
    , b2AABB = Box2D.Collision.b2AABB
    , b2BodyDef = Box2D.Dynamics.b2BodyDef
    , b2Body = Box2D.Dynamics.b2Body
    , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
    , b2Fixture = Box2D.Dynamics.b2Fixture
    , b2World = Box2D.Dynamics.b2World
    , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
    , b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
    , b2DebugDraw = Box2D.Dynamics.b2DebugDraw
    , b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
    , b2RevoluteJointDef =  Box2D.Dynamics.Joints.b2RevoluteJointDef
    , b2Shape = Box2D.Collision.Shapes.b2Shape
    ;

//Convert coordinates in canvas to box2d world
function get_real(p)
{
    return new b2Vec2(p.x + 0, canvas_height_m - p.y);
}    

// Inicio
function init() {
	var b2Vec2 = Box2D.Common.Math.b2Vec2;
	var b2AABB = Box2D.Collision.b2AABB;
	var b2BodyDef = Box2D.Dynamics.b2BodyDef;
	var b2Body = Box2D.Dynamics.b2Body;
	var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
	var b2Fixture = Box2D.Dynamics.b2Fixture;
	var b2World = Box2D.Dynamics.b2World;
	var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
	var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
	
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
     
	var worldScale = 30;
	
	var world = new b2World(new b2Vec2(0, 9),true);
	
	var canvasPosition = getElementPosition(canvas);
	
	debugDraw();             
	window.setInterval(update,1000/60);
	
	// Suelo
	var ground = createBox(640,30,320,480,b2Body.b2_staticBody,null);	
	createBox(640,30,320,0,b2Body.b2_staticBody,null);
	createBox(30,480,0,240,b2Body.b2_staticBody,null);
	createBox(30,480,640,240,b2Body.b2_staticBody,null);

	// EJEMPLOS REVOLUTION JOIN:
	// http://www.binarytides.com/revolute-joint-box2d-javascript/

	// Rueda
	//cw_createWheel(20, 1.0);
	var rueda1 = createBola(10, 10);
	var rueda2 = createBola(10, 10);

	// El buga!
	var buga = createBox(130,33,250, 250, b2Body.b2_dynamicBody, document.getElementById("crate"));		

	//create revolute joint between a and b (wheels)
	// Rueda atras
    var joint_def = new b2RevoluteJointDef();
    joint_def.bodyA = buga;
    joint_def.bodyB = rueda1;	

	//connect the centers - center in local coordinate - relative to body is 0,0
    joint_def.localAnchorA = new b2Vec2(-1.25, 0.4);
    joint_def.localAnchorB = new b2Vec2(0, 0);    

	joint_def.enableMotor = true;
    joint_def.motorSpeed = 25;
    joint_def.maxMotorTorque = 150;            

    world.CreateJoint(joint_def);    

    // Rueda alante
    joint_def.bodyA = buga;
    joint_def.bodyB = rueda2;	

    joint_def.enableMotor = false;

	//connect the centers - center in local coordinate - relative to body is 0,0
    joint_def.localAnchorA = new b2Vec2(1.25, 0.4);
    joint_def.localAnchorB = new b2Vec2(0, 0);        

   	//add the joint to the world
    world.CreateJoint(joint_def);    

    drawGround();


    // Aceleracion
    //buga.SetLinearVelocity( b2Vec2(1, 0) );
	
	document.addEventListener("mousedown",function(e){
		createBox(130,33,e.clientX-canvasPosition.x,e.clientY-canvasPosition.y,b2Body.b2_dynamicBody,document.getElementById("crate"));				
	});	

	function drawGround() {

		var x = 0;
		var y = 0;
		var inc = 0;
		var inc2 = 0;

		for (x=0 ; x<(640) ; x+=5)
		{
			createBox(5,5,x,390+( (Math.sin(inc)*2) + (Math.sin(inc2)*(inc*0.2)) ),b2Body.b2_staticBody,null);			
			inc += 0.1;
			inc2 += 0.4;
		}		
	}
	
	function createBox(width,height,pX,pY,type,data){
		var bodyDef = new b2BodyDef;
		var polygonShape = new b2PolygonShape;
		var fixtureDef = new b2FixtureDef;

		bodyDef.type = type;
		bodyDef.position.Set(pX/worldScale,pY/worldScale);
		bodyDef.userData=data;
		
		polygonShape.SetAsBox(width/2/worldScale,height/2/worldScale);
		
		fixtureDef.density = 2.0;
		fixtureDef.friction = 0.5;
		fixtureDef.restitution = 0.2;
		fixtureDef.shape = polygonShape;

		var body=world.CreateBody(bodyDef);
		body.CreateFixture(fixtureDef);

		return body;
	}

	function createBola(pX, pY) {

		var ballDef = new b2BodyDef;
		ballDef.type = b2Body.b2_dynamicBody;
		ballDef.position.Set(pX/worldScale,pY/worldScale);
		ballDef.userData = document.getElementById("rueda");
	  
		var fixture = new b2FixtureDef;
		fixture.density = 10;
		fixture.friction = 2.9;
		fixture.restitution = 0.1;
		fixture.shape =  new b2CircleShape(10/30); // Establecemos el radio (1m=30px)
	  
		var ball = world.CreateBody(ballDef)
		ball.CreateFixture(fixture);
	  
		// Generamos una velocidad aleatoria
		/*
		var velocityFactor = 30,
			randVelocity = Math.round(Math.random()*velocityFactor*2)-velocityFactor;
	  
		ball.SetLinearVelocity(new b2Vec2(randVelocity,0)) // Establecemos la velocidad con la que saldrá la bola
		*/

		return ball;
	}

	// Samples:
	// http://box2d-js.sourceforge.net/index2.html
	function addImageCircle() {
	    // create a fixed circle - this will have an image in it
	 	// create basic circle

		var bodyDef = new b2BodyDef;
		var fixtureDef = new b2FixtureDef;
		var polygonShape = new b2PolygonShape;

		var pX = 157;
		var pY = 200;
		var width = 17;
		var height = 17;

		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.position.Set(pX/worldScale,pY/worldScale);

		bodyDef.userData = document.getElementById("rueda");

		// Creamos el polígono
		polygonShape.SetAsBox(width/2/worldScale,height/2/worldScale);

		fixtureDef.density = 1.0;
		fixtureDef.friction = 0.5;
		fixtureDef.restitution = 0.5;
		fixtureDef.shape = polygonShape;

		var body=world.CreateBody(bodyDef);
		body.CreateFixture(fixtureDef);	 	

	 	/*
        var bodyDef = new b2BodyDef;
		var fixDef = new b2FixtureDef;
		fixDef.density = .5;
		fixDef.friction = 0.1;
		fixDef.restitution = 0.2;
		 
	    bodyDef.type = b2Body.b2_dynamicBody;
		scale = 1.0;
	    fixDef.shape = new b2CircleShape(scale);

		bodyDef.position.x = 150;
		bodyDef.position.y = 150;
        var data = { imgsrc: "img/rueda-base-png",
	    	 imgsize: 17,
		 bodysize: scale
    	}
		//bodyDef.userData = data;
		bodyDef.userData = document.getElementById("crate");
	    
		var body = world.CreateBody(bodyDef);
		body.CreateFixture(fixDef);
		body.GetBody().ApplyImpulse(
			new b2Vec2(100000,100000),
			body.GetBody().GetWorldCenter()
		);
		*/
	}		
	
	function debugDraw(){
		// Esto hace que se vean las lineas de debug
		
		var debugDraw = new b2DebugDraw();
		debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
		debugDraw.SetDrawScale(30.0);
		debugDraw.SetFillAlpha(0.0);
		debugDraw.SetLineThickness(0.0);
		debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
		world.SetDebugDraw(debugDraw);

	}
	
	function update() { 
		world.Step(1/60,10,10);
	     world.DrawDebugData();
	     for(var b = world.m_bodyList; b != null; b = b.m_next){
			if(b.GetUserData()){
				context.save();
				context.translate(b.GetPosition().x*worldScale,b.GetPosition().y*worldScale);
				context.rotate(b.GetAngle());
				context.drawImage(b.GetUserData(),-b.GetUserData().width/2,-b.GetUserData().height/2);
				context.restore();
			}
		}
	     world.ClearForces();
	};
	
	//http://js-tut.aardon.de/js-tut/tutorial/position.html
	function getElementPosition(element) {
		var elem=element, tagname="", x=0, y=0;
		while((typeof(elem) == "object") && (typeof(elem.tagName) != "undefined")) {
			y += elem.offsetTop;
			x += elem.offsetLeft;
			tagname = elem.tagName.toUpperCase();
			if(tagname == "BODY"){
				elem=0;
			}
			if(typeof(elem) == "object"){
				if(typeof(elem.offsetParent) == "object"){
					elem = elem.offsetParent;
				}
			}
		}
		return {x: x, y: y};
	}

};