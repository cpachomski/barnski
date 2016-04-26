Sea = function() {
	var geom = THREE.CylinderGeometry(600,600,800,40,10);

	geom.applyMatrix(new THREE.Matrix4().makeRotationX(-MATH.PI/2));

	var mat = new THREE.MeshPhongMaterial({
		color: Colors.blue,
		transparent: true,
		opacity: .6,
		shading: TREE.FlatShading
	});
}