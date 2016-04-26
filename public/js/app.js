window.addEventListener('load', init, false);


//#SCENE

var Colors = {
	red:0xf25346,
	white:0xffffff,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x68c3c0,
	grass: 0x3D8020,
	yellow: 0xF6E559,
	black: 0x333333
};

var scene,
	camera,
	fieldOfView,
	aspectRatio,
	nearPlane,
	farPlane,
	HEIGHT,
	WIDTH,
	renderer,
	container;


function createScene() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;

	//create scene with fog effect
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0xe4e0ba, 100, 500);
	

	aspectRatio = WIDTH / HEIGHT;
	fieldOfView = 60;
	nearPlane = 1;
	farPlane = 10000;

	camera = new THREE.PerspectiveCamera (
		fieldOfView,
		aspectRatio,
		nearPlane,
		farPlane );

	//set camera position
	camera.position.x = 0;
	camera.position.y = 100;
	camera.position.z = 200;

	//create renderer
	renderer = new THREE.WebGLRenderer ({
		//allow transparency to show background gradient
		alpha: true,
		antialias: true
	});

	renderer.setSize(WIDTH, HEIGHT);

	//enable shadow rendering
	renderer.shadowMap.enabled = true;

	container = document.getElementById('world');

	container.appendChild(renderer.domElement);

	window.addEventListener('resize', handleWindowResize, false);

};

function handleWindowResize() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}



//#LIGHTING

var hemisphereLight,
 	shadowLight;

function createLights() {
	// A hemisphere light is a gradient colored light; 
	// the first parameter is the sky color, the second parameter is the ground color, 
	// the third parameter is the intensity of the light
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .8);

	// A directional light shines from a specific direction. 
	// It acts like the sun, that means that all the rays produced are parallel.
	shadowLight = new THREE.DirectionalLight(0xffffff, .8);

	shadowLight.position.set(100, 150, 100);

	shadowLight.castShadow = true;

	//define visible area of projected shadow
	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;


	//define shadow resolution
	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;

	//activate lights
	scene.add(hemisphereLight);
	scene.add(shadowLight);

	console.log(scene);

}

//#Ground

Ground = function() {
	var geom = new THREE.CylinderGeometry(550,500,400,100,20);

	geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

	var mat = new THREE.MeshPhongMaterial({
		color: Colors.blue,
		transparent: true,
		opacity: 1,
		shading: THREE.FlatShading
	});

	this.mesh = new THREE.Mesh(geom,mat);

	this.mesh.receiveShadow = true;
};

var ground;

function createGround() {
	ground = new Ground();
	ground.mesh.position.y = -600;
	scene.add(ground.mesh);
}

//#CLOUDS

Cloud = function() {
	//container to hold cloud parts
	this.mesh = new THREE.Object3D();

	var geom = new THREE.SphereGeometry(5,9,32);
	var mat = new THREE.MeshPhongMaterial({
		color: Colors.white
	});

	var nBlocks = 25 + Math.floor(Math.random() * 2);

	for ( var i = 0; i < nBlocks; i++ ) {

		var m = new THREE.Mesh(geom, mat);

		//randomly set position/rotation of cube
		m.position.x = i*.6;
		m.position.y = Math.random() * 3;
		m.position.z = Math.random() * 20;
		m.rotation.z = Math.random() * Math.PI * 2;
		m.rotation.y = Math.random() * Math.PI * 2;

		//randomly set size of cube
		var s = .1 + Math.random() * .8;
		m.scale.set(s,s,s);

		//allow cube to cast and receive shadows
		m.castShadow = true;
		m.receiveShadow = true;

		this.mesh.add(m);
	}
};

//#SKY
Sky = function() {
	this.mesh = new THREE.Object3D();
	this.nClouds = 40;

	//to distribute cloud evenly, place them according to uniform angle
	var stepAngle = Math.PI*2 / this.nClouds;

	for ( var i = 0; i < this.nClouds; i++ ) {
		var c = new Cloud();
		//set rotation/position of each cloud
		var a = stepAngle * i; //final angle of cloud
		var h = 750 + Math.random() * 200 // distance between center of the axis and the cloud itself

		//convert polar coordinates into cartesian
		c.mesh.position.y = Math.sin(a) * h;
		c.mesh.position.x = Math.cos(a) * h;

		//rotate the cloud according to its position
		c.mesh.rotation.z = a + Math.PI / 2

		//position clouds at random depths throughout scene
		var s = 1 + Math.random() * 2;
		c.mesh.scale.set(s,s,s);


		//add mesh of each cloud to scene
		this.mesh.add(c.mesh)
	}
}

var sky;

function createSky() {
	sky = new Sky();
	sky.mesh.position.y = -700;
	scene.add(sky.mesh);
}

//#MagicSchoolbus
var Bus = function() {
	this.mesh = new THREE.Object3D();


	//create the main bus
	var geomChasis = new THREE.BoxGeometry(75, 25, 25, 1, 1, 1);
	var matChasis = new THREE.MeshPhongMaterial({color: Colors.yellow, shading: THREE.FlatShading});
	var chasis = new THREE.Mesh(geomChasis, matChasis);
	chasis.castShadow = true;
	chasis.receiveShadow = true;
	this.mesh.add(chasis);

	//create the front engine sections
	var geomHood = new THREE.BoxGeometry(25,15,25,1,1,1);
	var matHood = new THREE.MeshPhongMaterial({color: Colors.yellow, shading: THREE.FlatShading});
	var hood = new THREE.Mesh(geomHood, matHood);
	hood.position.x = 40;
	hood.position.y = -5;
	hood.position.z = 0;
	hood.castShadow = true;
	chasis.receiveShadow = true;
	this.mesh.add(hood)

	// create tires
	var geomTire = new THREE.BoxGeometry(10,10,2,1,1,1);
	var matTire = new THREE.MeshPhongMaterial({color: Colors.black, shading: THREE.FlatShading});
	this.frontRightTire = new THREE.Mesh(geomTire, matTire);
	this.frontLeftTire = new THREE.Mesh(geomTire, matTire);
	this.backRightTire = new THREE.Mesh(geomTire, matTire);
	this.backLeftTire = new THREE.Mesh(geomTire, matTire);

	//positionTires and add to mesh

	
	this.frontRightTire.position.x = 30;
	this.frontRightTire.position.y = -12;
	this.frontRightTire.position.z = 14;
	this.frontRightTire.castShadow = true;
	this.frontRightTire.receiveShadow = true;

	this.frontLeftTire.position.x = 30;
	this.frontLeftTire.position.y = -12;
	this.frontLeftTire.position.z = -14;
	this.frontLeftTire.castShadow = true;
	this.frontLeftTire.receiveShadow = true;

	this.backRightTire.position.x = -20;
	this.backRightTire.position.y = -12;
	this.backRightTire.position.z = 14;
	this.backRightTire.castShadow = true;
	this.backRightTire.receiveShadow = true;


	this.backLeftTire.position.x = -20;
	this.backLeftTire.position.y = -12;
	this.backLeftTire.position.z = -14;
	this.backLeftTire.castShadow = true;
	this.backLeftTire.receiveShadow = true;

	this.mesh.add(this.frontRightTire);
	this.mesh.add(this.frontLeftTire);
	this.mesh.add(this.backRightTire);
	this.mesh.add(this.backLeftTire);
}


var bus;

function createBus() {
	bus = new Bus();
	bus.mesh.position.y = 25;
	scene.add(bus.mesh);
};

function updateBus() {
	var targetX = normalize(mousePos.x, -1, 1, -100, 100);
	var targetY = normalize(mousePos.y, -1, 1, 25, 175);

	bus.mesh.position.y = targetY;
	bus.mesh.position.x = targetX;
	bus.frontRightTire.rotation.z -= .2;
	bus.frontLeftTire.rotation.z -= .2;
	bus.backRightTire.rotation.z -= .2;
	bus.backLeftTire.rotation.z -= .2;
};

function rotateBusX(){
	bus.mesh.rotation.y += .2;
}

function normalize(v, vmin, vmax, tmin, tmax) {
	var nv = Math.max(Math.min(v,vmax), vmin);
	var dv = vmax-vmin;
	var pc = (nv-vmin)/dv;
	var dt = tmax-tmin;
	var tv = tmin + (pc*dt);
	return tv;
}

function loop() {
	
	updateBus();

	renderer.render(scene, camera);
	requestAnimationFrame(loop);
};


var mousePos= { x:0, y:0 };

function handleMouseMove(e) {
	var tx = -1 + (e.clientX / WIDTH) *2;
	var ty = -1 + (e.clientY / HEIGHT) *2;
	mousePos = {x:tx, y:ty};
}

function handleClick() {
	rotateBusX();
}

function init() {
	console.log('loaded')
	createScene();
	createLights();
	createGround();
	createBus();
	createSky();


	// createBarn();
	// createGround();
	document.addEventListener('mousemove', handleMouseMove, false);
	document.addEventListener('click', handleClick, false);
	loop();
}




