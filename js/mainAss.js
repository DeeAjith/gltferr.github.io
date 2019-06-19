"use strict";
var renderer, renderer2,
    scene, scene2, bog, element, div,
    camera,
    myCanvas = document.querySelector("#myCanvas");
var SHADOW_MAP_WIDTH = 2048,
    SHADOW_MAP_HEIGHT = 2048;

{

    //RENDERER
    renderer = new THREE.WebGLRenderer({
        canvas: myCanvas,
        antialias: true
    });
    renderer.info.reset();
    renderer.setClearColor(0x4a4a4a);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; //Shadow
    renderer.shadowMapSoft = true; // Shadow
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.gammaFactor = 1;
    document.body.appendChild(renderer.domElement);

    //CSS3D Renderer
    renderer2 = new THREE.CSS3DRenderer();
    renderer2.setSize(window.innerWidth, window.innerHeight);
    renderer2.domElement.style.position = 'absolute';
    renderer2.domElement.style.top = 0;
    document.body.appendChild(renderer2.domElement);

    //CAMERA
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    var controls = new THREE.OrbitControls(camera);
    controls.mouseButtons = {
        LEFT: THREE.MOUSE.LEFT,
        MIDDLE: THREE.MOUSE.MIDDLE,
        RIGHT: THREE.MOUSE.RIGHT
    }
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.5;
    controls.enableZoom = true;
    controls.enableDamping = true;
    controls.dampingFactor = 0.12;
    controls.rotateSpeed = 0.08;
    controls.maxPolarAngle = Math.PI / 2;
    camera.position.set(1.7, 1.2, 1.5);

    var raycaster = new THREE.Raycaster(); // Needed for object intersection
    var mouse = new THREE.Vector2(); //Needed for mouse coordinates
    //SCENE
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x4a4a4a, 1, 10);
    //Scene2
    scene2 = new THREE.Scene();
    //LIGHTS

    var skyColor = 0xB1E1FF; // light blue
    var groundColor = 0xB97A20; // brownish orange
    var intensity = 1;
    var light1 = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light1);
    var color = 0xFFFFFF;
    var intensity = 1;

    var light2 = new THREE.DirectionalLight(color, intensity);
    light2.position.set(5, 10, 2);
    light2.shadow.mapSize.width = 2048; // default
    light2.shadow.mapSize.height = 2048; // default
    light2.shadow.camera.near = 0.5; // default
    light2.shadow.camera.far = 500 // default
    light2.castShadow = true;
    light2.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000));
    light2.shadow.bias = -0.0001;
    light2.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    light2.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
    scene.add(light2);
    // scene.add(light.target);

    var dom = new THREEx.DomEvents(camera, renderer.domElement);

    var mss = (window.innerWidth / window.innerHeight) * .5;
    // console.log(mss); //console check

    var col = 16;
    var loader = new THREE.GLTFLoader();
    loader.load('/Gltf_example.gltf', function handle_load(gltf) {

        console.log(gltf);
        gltf.scene.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.receiveShadow = true;
                child.castShadow = true;
                child.material.transparent = true;
                child.material.opacity = 0.9;
            }
        } );
        scene.add( gltf.scene );

    }
);
    var geom = new THREE.PlaneGeometry(2000, 2000, .01);
    var mat = new THREE.ShadowMaterial({
        // color: 0x4a4a4a,
        side: THREE.DoubleSide
    });
    var shadowPlane = new THREE.Mesh(geom, mat);
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);
    shadowPlane.rotateX(-Math.PI / 2);

    //lable display on object
    function adiv() {
        // console.log("clicked")
        element = document.createElement('div');
        // element.setAttribute("src", "http://railmaniac.blogspot.com/2015/07/icf-detailed.html");
        element.innerHTML = 'Annotation of bogie in 3d floor.';
        element.className = 'three-div';

        //CSS Object
        div = new THREE.CSS3DObject(element);
        div.rotation.y = 45;
        div.position.y = bog.scale.y - .1;
        div.rotation.x = bog.position.z * 2;
        div.scale.x = bog.scale.x * .009;
        div.scale.y = bog.scale.y * .008;

        scene2.add(div);
    }

    //lable remove on object
    function rmdiv() {
        scene2.remove(div)
    }
    
    var domEvents = new THREEx.DomEvents(camera, renderer2.domElement)
    domEvents.addEventListener(bog, 'mouseover', function (event) {
        adiv();
    }, false)

    domEvents.addEventListener(bog, 'mouseout', function (event) {
        rmdiv();
    }, false)


    
    window.addEventListener('resize', onWindowResize, false);
}

render();
animate();

function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = (window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
}

function render() {
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    renderer2.render(scene2, camera);
}