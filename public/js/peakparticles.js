console.log('running');

var stats,
	camera,
	controls,
	scene,
	renderer,
	objects = [],
	plane,
	world;


function createScene() {
	//creating scene
	world = document.getElementById('world')
	scene = new THREE.Scene();


	//add lighting
	scene.add( new THREE.AmbientLight( 0x030303 ) );

	var light = new THREE.SpotLight( 0xffffff, 1.5 );
	light.position.set( 0, 400, 2000 );
	light.castShadow = true;

	light.shadow = new THREE.LightShadow ( new THREE.PerspectiveCamera ( 50, 1, 200, 10000 ) );
	light.shadow.bias = -0.00022;
	light.shadow.mapSize.height = 2048;
	light.shadow.mapSize.width = 2048;

	scene.add(light);

	

	for (var i = 0; i < 200; i++) {

		var sphereRadius = Math.random() * 10
		var geometry = new THREE.SphereBufferGeometry( sphereRadius, 32, 32 );
		var mat = new THREE.MeshLambertMaterial ( { color: 0x333333 } );
		var sphere = new THREE.Mesh( geometry, mat );

		sphere.position.x = Math.random() * 1000 - 500;
		sphere.position.y = Math.random() * 600 - 300;
		sphere.position.z = Math.random() * 800 - 400;

		sphere.castShadow = true;
		sphere.receiveShadow = true;

		scene.add(sphere);
		objects.push(sphere);
	}

	plane = new THREE.Mesh(
		new THREE.PlaneBufferGeometry( 2000, 2000, 8, 8),
		new THREE.MeshBasicMaterial( { visible: false } )
	);

	scene.add(plane)

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setClearColor(0xf0f0f0);
	renderer.setPixelRatio( window.devicePixelRatio);
	renderer.setSize( window.innerWidth, window.innerHeight);
	renderer.sortObjects = false;

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;

	world.appendChild( renderer.domElement );

	renderer.domElement.addEventListener( 'mousemove', handleMouseMove, false);
	renderer.domElement.addEventListener( 'mouseDown', handleMouseDown, false);
	renderer.domeElement.addEventListener( 'mouseup', handleMouseUp, false);
}



createScene();

