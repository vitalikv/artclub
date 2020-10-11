

import * as THREE from '../node_modules/three/build/three.module.js';

import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from '../node_modules/three/examples/jsm/loaders/RGBELoader.js';
import { RoughnessMipmapper } from '../node_modules/three/examples/jsm/utils/RoughnessMipmapper.js';

let container, controls;
let camera, scene, renderer;

let infProg = {};
infProg.scene = null;
infProg.material = [];
infProg.dirLight = null;


init();
render();
setElemRP();


function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.domElement.style.width = '100%';
	renderer.domElement.style.height = '100%';
	
	render();

}



function render() {

	renderer.render( scene, camera );

}


function init() {

	container = document.createElement( 'div' );	
	document.body.appendChild( container );
	
	container.style.position = 'fixed';
	container.style.width = '100%';
	container.style.height = '100%';
	container.style.top = 0;
	container.style.left = 0;	

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 50 );
	camera.position.set( 0, 1, 5 );
	
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );
	
	let dirLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
	dirLight.castShadow = true;
	dirLight.position.set(0,1,5);	
	scene.add(dirLight);
	
	infProg.dirLight = dirLight;
	
	let dirLightHelper = new THREE.DirectionalLightHelper( dirLight, 10, 0xff0000 );
	scene.add( dirLightHelper );	
	
	if(1==2)
	{
		var geometry = new THREE.BoxGeometry( 0.5, 3, 0.5 );
		var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
		var cube = new THREE.Mesh( geometry, material );
		cube.castShadow = true;	
		cube.receiveShadow = true;	
		cube.position.z = 1;
		scene.add( cube );	
	}	
			

	let loader = new GLTFLoader().setPath( 'model/' );
	loader.load( 'scene.gltf', function ( gltf ) {
		
		let cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 512, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );
		let gCubeCam = new THREE.CubeCamera(0.1, 10, cubeRenderTarget);
		gCubeCam.update( renderer, scene );
		gCubeCam.renderTarget.texture.outputEncoding = THREE.sRGBEncoding;

		gltf.scene.scale.set(0.1, 0.1, 0.1);
		
		infProg.scene = gltf.scene;
		
		gltf.scene.traverse( function ( child ) {

			if ( child.isMesh ) {
	 			child.castShadow = true;	
	 			child.receiveShadow = true;	
				child.material.envMap = gCubeCam.renderTarget.texture;
				child.material.needsUpdate = true;	

				addMaterialObjToList({material: child.material});
			}

		} );


		let elemLoad = document.querySelector('[nameId="progress_wrap"]');
		elemLoad.style.display = "none";
		
		scene.add( gltf.scene );
		
		setDefaultMaterial();

		render();
	},
	function ( xhr ) {

		//console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

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


function addMaterialObjToList(params)
{
	let exist = false;
	let material = params.material;
	
	for (let i = 0; i < infProg.material.length; i++)
	{
		if(material == infProg.material[i]) 
		{
			exist = true;
			break;
		}
	}
	
	if(!exist) infProg.material[infProg.material.length] = material;
}



function setDefaultMaterial()
{
	if(infProg.material.length == 0) return;
	
	inputMetalness({value: infProg.material[0].metalness});
	inputRoughness({value: infProg.material[0].roughness});
	inputEnvMapIntensity({value: infProg.material[0].envMapIntensity});
	inputDirLight({value: 1});
}



function setElemRP()
{
	let input1 = document.querySelector('[nameId="input_metalness"]');
	input1.onmousemove = function(e) { inputMetalness({value: input1.value}); };	
	//input1.ontouchmove = function(e){ inputMetalness({value: input1.value});  }
	
	let input2 = document.querySelector('[nameId="input_roughness"]');
	input2.onmousemove = function(e) { inputRoughness({value: input2.value}); }	
	//input2.ontouchmove = function(e){ inputRoughness({value: input2.value});  }

	let input3 = document.querySelector('[nameId="input_envMapIntensity"]');
	input3.onmousemove = function(e) { inputEnvMapIntensity({value: input3.value}); }	
	//input3.ontouchmove = function(e){ inputEnvMapIntensity({value: input3.value});  }

	let input4 = document.querySelector('[nameId="input_dirLight"]');
	input4.onmousemove = function(e) { inputDirLight({value: input4.value}); }

	let input5 = document.querySelector('[nameId="input_toneMapping"]');
	input5.onmousemove = function(e) { setToneMapping({value: input5.value}); }	
}



function inputEnvMapIntensity(params)
{
	if(infProg.material.length == 0) return;
	
	let value = params.value;						
	
	let input = document.querySelector('[nameId="input_envMapIntensity"]');
	input.value = value;
	
	let elem = document.querySelector('[nameId="txt_envMapIntensity"]');
	elem.innerText = 'envMapIntensity '+ value;
	
	infProg.material[0].envMapIntensity = value;
	infProg.material[0].needsUpdate = true;
	
	render();	
}




function inputMetalness(params)
{
	if(infProg.material.length == 0) return;

	let value = params.value;						

	let input = document.querySelector('[nameId="input_metalness"]');
	input.value = value;
	
	let elem = document.querySelector('[nameId="txt_metalness"]');
	elem.innerText = 'metalness '+ value;
	
	infProg.material[0].metalness = value;
	infProg.material[0].needsUpdate = true;
	
	render();	
}


function inputRoughness(params)
{
	if(infProg.material.length == 0) return;
	
	let value = params.value;						
	
	let input = document.querySelector('[nameId="input_roughness"]');
	input.value = value;
	
	let elem = document.querySelector('[nameId="txt_roughness"]');
	elem.innerText = 'roughness '+ value;
	
	infProg.material[0].roughness = value;
	infProg.material[0].needsUpdate = true;
	
	render();	
}


function inputDirLight(params)
{
	if(!infProg.dirLight) return;
	
	let value = params.value;						
	
	let input = document.querySelector('[nameId="input_dirLight"]');
	input.value = value;
	
	let elem = document.querySelector('[nameId="txt_dirLight"]');
	elem.innerText = 'lightIntensity '+ value;
	
	infProg.dirLight.intensity = value;
	
	render();	
}



function setToneMapping(params)
{
	let value = params.value;						
	
	let input = document.querySelector('[nameId="input_toneMapping"]');
	input.value = value;
	
	let elem = document.querySelector('[nameId="txt_toneMapping"]');
	elem.innerText = 'toneMapping '+ value;	
	
	renderer.toneMappingExposure = value;					
	
	render();	
}









