

import * as THREE from '../node_modules/three/build/three.module.js';

import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from '../node_modules/three/examples/jsm/loaders/RGBELoader.js';
import { RoughnessMipmapper } from '../node_modules/three/examples/jsm/utils/RoughnessMipmapper.js';

var container, controls;
var camera, scene, renderer;

init();
render();

function init() {

	container = document.createElement( 'div' );	
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 50 );
	camera.position.set( 0, 1, 5 );
	
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );
	
	var light = new THREE.DirectionalLight( 0xffffff, 1.0 );
	light.position.set(10,13,10);	
	scene.add(light);
			// use of RoughnessMipmapper is optional
			

	var loader = new GLTFLoader().setPath( 'model/' );
	loader.load( 'scene.gltf', function ( gltf ) {
		
		let cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 512, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );
		let gCubeCam = new THREE.CubeCamera(0.1, 10, cubeRenderTarget);
		gCubeCam.update( renderer, scene );


		gltf.scene.scale.set(0.1, 0.1, 0.1);
		
		gltf.scene.traverse( function ( child ) {

			if ( child.isMesh ) {
	 			child.castShadow = true;	
	 			child.receiveShadow = true;	
				child.material.envMap = gCubeCam.renderTarget.texture;
				child.material.needsUpdate = true;				
			}

		} );

		scene.add( gltf.scene );

		render();
	},
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	});

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1;
	renderer.outputEncoding = THREE.sRGBEncoding;
	
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
	
	container.appendChild( renderer.domElement );

	renderer.domElement.style.width = '100%';
	renderer.domElement.style.height = '100%';
	renderer.domElement.style.outline = 'none';

	controls = new OrbitControls( camera, renderer.domElement );
	controls.addEventListener( 'change', render ); // use if there is no animation loop
	controls.minDistance = 0.1;
	controls.maxDistance = 100;
	controls.target.set( 0, 0.3, 0 );
	controls.update();

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.domElement.style.width = '100%';
	renderer.domElement.style.height = '100%';
	
	render();

}

//

function render() {

	renderer.render( scene, camera );

}




