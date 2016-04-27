
			
			var container, camera, controls, scene, renderer;
			var objects = [], plane;

			var raycaster = new THREE.Raycaster();
			var mouse = new THREE.Vector2(),
			offset = new THREE.Vector3(),
			INTERSECTED, SELECTED;

			init();
			animate();

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
				camera.position.z = 1000;

				controls = new THREE.TrackballControls( camera );
				controls.rotateSpeed = 1.0;
				controls.zoomSpeed = 1.2;
				controls.panSpeed = 0.8;
				controls.noZoom = false;
				controls.noPan = false;
				controls.staticMoving = true;
				controls.dynamicDampingFactor = 0.3;

				scene = new THREE.Scene();

				scene.add( new THREE.AmbientLight( 0x101010 ) );

				var light = new THREE.SpotLight( 0xffffff, 1.5 );
				light.position.set( 0, 500, 2000 );
				light.castShadow = true;

				light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 200, 10000 ) );
				light.shadow.bias = - 0.00022;

				light.shadow.mapSize.width = 2048;
				light.shadow.mapSize.height = 2048;

				scene.add( light );


				for ( var i = 0; i < 300; i ++ ) {
					var radius = Math.random() * 10;
					var geometry = new THREE.SphereGeometry( radius, 32, 32 );
					var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0x333333 } ) );

					object.position.x = Math.random() * 100
					object.position.y = Math.random() * 100
					object.position.z = Math.random() * 100

					object.castShadow = true;
					object.receiveShadow = true;

					scene.add( object );

					objects.push( object );

				}

				plane = new THREE.Mesh(
					new THREE.PlaneBufferGeometry( 2000, 2000, 8, 8 ),
					new THREE.MeshBasicMaterial( { visible: false } )
				);
				scene.add( plane );

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setClearColor( 0xf0f0f0 );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.sortObjects = false;

				renderer.shadowMap.enabled = true;
				renderer.shadowMap.type = THREE.PCFShadowMap;

				container.appendChild( renderer.domElement );

				var info = document.createElement( 'div' );
				info.style.position = 'absolute';
				info.style.top = '10px';
				info.style.width = '100%';
				info.style.textAlign = 'center';
				info.innerHTML = '<a href="http://threejs.org" target="_blank">three.js</a> webgl - draggable cubes';
				container.appendChild( info );

				renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
				renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
				renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function onDocumentMouseMove( event ) {

				event.preventDefault();

				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

				//

				raycaster.setFromCamera( mouse, camera );

				if ( SELECTED ) {

					var intersects = raycaster.intersectObject( plane );

					if ( intersects.length > 0 ) {

						SELECTED.position.copy( intersects[ 0 ].point.sub( offset ) );

					}

					return;

				}

				var intersects = raycaster.intersectObjects( objects );

				if ( intersects.length > 0 ) {

					if ( INTERSECTED != intersects[ 0 ].object ) {

						if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

						INTERSECTED = intersects[ 0 ].object;
						INTERSECTED.currentHex = INTERSECTED.material.color.getHex();

						plane.position.copy( INTERSECTED.position );
						plane.lookAt( camera.position );

					}

					container.style.cursor = 'pointer';

				} else {

					if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

					INTERSECTED = null;

					container.style.cursor = 'auto';

				}

			}

			function onDocumentMouseDown( event ) {

				event.preventDefault();

				raycaster.setFromCamera( mouse, camera );

				var intersects = raycaster.intersectObjects( objects );

				if ( intersects.length > 0 ) {

					controls.enabled = false;

					SELECTED = intersects[ 0 ].object;

					var intersects = raycaster.intersectObject( plane );

					if ( intersects.length > 0 ) {

						offset.copy( intersects[ 0 ].point ).sub( plane.position );

					}

					container.style.cursor = 'move';

				}

			}

			function onDocumentMouseUp( event ) {

				event.preventDefault();

				controls.enabled = true;

				if ( INTERSECTED ) {

					plane.position.copy( INTERSECTED.position );

					SELECTED = null;

				}

				container.style.cursor = 'auto';

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();
			}

			function render() {

				controls.update();

				renderer.render( scene, camera );

			}