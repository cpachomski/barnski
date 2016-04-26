window.addEventListener('load', init, false);


//#SCENE

var Colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x68c3c0,
	grass: 0x3D8020
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
	scene.fog = new THREE.Fog(0xe4e0ba, 100, 950);
	

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
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);

	// A directional light shines from a specific direction. 
	// It acts like the sun, that means that all the rays produced are parallel.
	shadowLight = new THREE.DirectionalLight(0xffffff, .9);

	shadowLight.position.set(150, 350, 350);

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

//#SEA

Sea = function() {
	var geom = new THREE.CylinderGeometry(600, 500, 1000, 20, 5, false, 4, 2*Math.PI);

	geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

	var mat = new THREE.MeshPhongMaterial({
		color: Colors.grass,
		transparent: true,
		opacity: 1,
		shading: THREE.FlatShading
	});

	this.mesh = new THREE.Mesh(geom,mat);

	this.mesh.receiveShadow = true;
};



var sea;

function createSea() {
	sea = new Sea();
	sea.mesh.position.y = -600;
	scene.add(sea.mesh);
}

function init() {
	console.log('loaded')
	createScene();
	createLights();
	createSea();
	// createBarn();
	// createGround();
	// createSky();
	renderer.render(scene, camera);
	// loop();
}




