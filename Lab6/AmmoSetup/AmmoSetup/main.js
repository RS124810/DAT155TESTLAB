import * as THREE from 'three';
import * as LOADER from 'Loader';
import  * as Controls from 'Control';

import {VRButton} from '../three/build/VRButton.js';
import {getHeightmapData} from "../three/build/utils.js";
import TextureSplattingMaterial from "../three/build/TextureSplattingMaterial.js";


let scene;
let camera;
let renderer;
let clock = new THREE.Clock();
let gravity = -9.81;
let physicsWorld;
let tmpTrans;
let tmpOrigin;
let tmpQuaternion;
let dynamicObjects = [];
let staticObjects = [];
let colGroupCube = 1, colGroupGround = 2, colGroupSphere = 4;
const loader = new LOADER.GLTFLoader();
const textureLoader = new THREE.TextureLoader();
let roadBaseColor;
let roadBaseStripColor;
let roadNormalMap;
let roadDispMap;
let roadRoughMap;
let roadAOM;

let terrainBaseColor;
let terrainNormalMap;
let terrainDispMap;
let terrainRoughMap;
let terrainAOM;

let RockGeometry;
let RockMaterial;
let RockGeometry2;
let RockMaterial2;
let RockMesh = [];
let counter = 0;
let carRigidBody;
let carMesh;
const STATE = { DISABLE_DEACTIVATION : 4 }

let TreeGeometry;
let TreeMaterial;
let LeafGeometry;
let LeafMaterial;
let ThreeMesh = [];

let CarGeometry
let CarMaterial;
let TireGeometry;
let TireMaterial;
let LightGeometry;
let LightMaterial;

let time = 0;
let objectTimePeriod = 0.2;
let timeNextSpawn = time + objectTimePeriod;
const maxNumObjects = 60;

let control;
let startAvalanche = false;
let spwanTrees = false;
const maxNumTrees = 10;
let NumTrees = 0;

const listener = new THREE.AudioListener();
const audioLoader = new THREE.AudioLoader();

let terrainData;

//initial js load
export function start() {

    setupGraphics();
    setupLights();
    setupPhysics();
    setupSkybox();
    setupTerrain();
    setupControls();
    loadTexture();
    loadRock();
    loadTree();
    loadCar();
    createRoad();
   // createCar();
    //animate();
}

function loadTexture() {
    roadBaseColor = textureLoader.load('../Lab6/AmmoSetup/three/build/RoadTexture/Asphalt_006_COLOR.jpg');
    roadBaseColor.wrapS = roadBaseColor.wrapT = THREE.RepeatWrapping;
    roadBaseColor.offset.set( 0, 0 );
    roadBaseColor.repeat.set( 64, 2 );

    roadBaseStripColor = textureLoader.load('../Lab6/AmmoSetup/three/build/RoadTexture/Asphalt_006_COLOR.jpg');
    roadBaseStripColor.wrapS = roadBaseColor.wrapT = THREE.RepeatWrapping;
    roadBaseStripColor.offset.set( 0, 0 );
    roadBaseStripColor.repeat.set( 64, 0.1 );

    roadNormalMap = textureLoader.load('../Lab6/AmmoSetup/three/build/RoadTexture/Asphalt_006_NRM.jpg');
    roadNormalMap.wrapS = roadBaseColor.wrapT = THREE.RepeatWrapping;
    roadNormalMap.offset.set( 0, 0 );
    roadNormalMap.repeat.set( 64, 2 );

    roadDispMap = textureLoader.load('../Lab6/AmmoSetup/three/build/RoadTexture/Asphalt_006_DISP.png');
    roadDispMap.wrapS = roadBaseColor.wrapT = THREE.RepeatWrapping;
    roadDispMap.offset.set( 0, 0 );
    roadDispMap.repeat.set( 64, 2 );

    roadRoughMap = textureLoader.load('../Lab6/AmmoSetup/three/build/RoadTexture/Asphalt_006_ROUGH.jpg');
    roadRoughMap.wrapS = roadBaseColor.wrapT = THREE.RepeatWrapping;
    roadRoughMap.offset.set( 0, 0 );
    roadRoughMap.repeat.set( 64, 2 );

    roadAOM = textureLoader.load('../Lab6/AmmoSetup/three/build/RoadTexture/Asphalt_006_OCC.jpg');
    roadAOM.wrapS = roadBaseColor.wrapT = THREE.RepeatWrapping;
    roadAOM.offset.set( 0, 0 );
    roadAOM.repeat.set( 64, 2 );

    terrainBaseColor = textureLoader.load('../Lab6/AmmoSetup/three/build/Terrain/Rock_Moss_001_basecolor.jpg');
   // terrainBaseColor.repeat.set(1/Math.pow(2,128), 1/Math.pow(2,128));
    terrainNormalMap = textureLoader.load('../Lab6/AmmoSetup/three/build/Terrain/Rock_Moss_001_normal.jpg');
    terrainDispMap = textureLoader.load('../Lab6/AmmoSetup/three/build/Terrain/Rock_Moss_001_height.png');
    terrainRoughMap = textureLoader.load('../Lab6/AmmoSetup/three/build/Terrain/Rock_Moss_001_roughness.jpg');
    terrainAOM = textureLoader.load('../Lab6/AmmoSetup/three/build/Terrain/Rock_Moss_001_ambientOcclusion.jpg');

}
//setup graphics, scene, renderer, camera, vr
function setupGraphics() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x565656 );
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    renderer.setSize(window.innerWidth , window.innerHeight );
    document.body.appendChild(renderer.domElement);

    document.body.append(VRButton.createButton(renderer));
    renderer.xr.enabled = true;

    //OrbitControl (camera) start pos
    camera.position.z = 14;
    camera.position.y = 0.9;
    camera.position.x = -32;

    camera.add(listener);
    listener.setMasterVolume(0);

    //this part can be used to set a suitable VR camera start pos
    const cameraGroup = new THREE.Group();
    cameraGroup.position.set(0, -0.6, 1);
    cameraGroup.rotation.y = Math.PI;

    renderer.xr.addEventListener('sessionstart', function () {
        scene.add(cameraGroup);
        cameraGroup.add(camera);
        carMesh.add(cameraGroup);
    });
}

//setup orbital control
function setupControls(){

    control = new Controls.OrbitControls(camera, renderer.domElement );
    scene.add(camera);
}

function setupLights() {

    let light = new THREE.DirectionalLight( 0xFFFFFF );

    scene.add( light );
    light.position.set(-27, 100, 40);
    light.castShadow = true;
    //Set up shadow properties for the light
    light.shadow.mapSize.width = 4096; // default
    light.shadow.mapSize.height = 4096; // default
    light.shadow.camera.near = 0.1; // default
    light.shadow.camera.far = 1000; // default
    light.shadow.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(ambientLight);
}

//Setup physics, collision, gravity
function setupPhysics() {

    //Cant make new vectors in update physics - depletes memory
    tmpTrans = new Ammo.btTransform();
    tmpOrigin = new Ammo.btVector3();
    tmpQuaternion = new Ammo.btQuaternion();
    //tmpThreeWorldPos = new THREE.Vector3();
    //tmpThreeWorldRot = new THREE.Quaternion();

    let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(),
        dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration),
        broadphase = new Ammo.btDbvtBroadphase(),
        solver = new Ammo.btSequentialImpulseConstraintSolver();
    physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
    physicsWorld.setGravity(new Ammo.btVector3(0, gravity, 0));
}

function setupSkybox() {
    let skyboxMaterial = [];
    //../three/build/Skybox/bluecloud_lf.jpg
    let textFT = new THREE.TextureLoader().load('../Lab6/AmmoSetup/three/build/Skybox/bluecloud_ft.jpg');
    let textBK = new THREE.TextureLoader().load('../Lab6/AmmoSetup/three/build/Skybox/bluecloud_bk.jpg');
    let textUP = new THREE.TextureLoader().load('../Lab6/AmmoSetup/three/build/Skybox/bluecloud_up.jpg');
    let textDN = new THREE.TextureLoader().load('../Lab6/AmmoSetup/three/build/Skybox/bluecloud_dn.jpg');
    let textRT = new THREE.TextureLoader().load('../Lab6/AmmoSetup/three/build/Skybox/bluecloud_rt.jpg');
    let textLT = new THREE.TextureLoader().load('../Lab6/AmmoSetup/three/build/Skybox/bluecloud_lf.jpg');

    skyboxMaterial.push(new THREE.MeshBasicMaterial({map: textFT}));
    skyboxMaterial.push(new THREE.MeshBasicMaterial({map: textBK}));
    skyboxMaterial.push(new THREE.MeshBasicMaterial({map: textUP}));
    skyboxMaterial.push(new THREE.MeshBasicMaterial({map: textDN}));
    skyboxMaterial.push(new THREE.MeshBasicMaterial({map: textRT}));
    skyboxMaterial.push(new THREE.MeshBasicMaterial({map: textLT}));

    //Flip normals so we see backside
    for (let i = 0; i<skyboxMaterial.length;i++){
        skyboxMaterial[i].side = THREE.BackSide;
    }

    let boxGeometry = new THREE.BoxGeometry(128,128,128);
    let skybox = new THREE.Mesh(boxGeometry, skyboxMaterial);

    scene.add(skybox);
}
//Fade sound inn/out function
function SetSound(counter) {

    if (counter < 40 && listener.getMasterVolume() < 1){
        listener.setMasterVolume(listener.getMasterVolume() +0.008); //Float between 0 and 1
    }
    if (counter >= maxNumObjects && listener.getMasterVolume() > 0){
        listener.setMasterVolume(listener.getMasterVolume() -0.002); //Float between 0 and 1
    }
}

//Start the simulation when user press the red button
export function activate(){
    if (!startAvalanche) {
        startAvalanche = true;
        cloneRock();
        console.log("Run");

        const AvalanceAudio = new THREE.Audio(listener);
        audioLoader.load('../Lab6/AmmoSetup/three/build/Audio/earth-rumble.mp3', function ( buffer ) {
            AvalanceAudio.setBuffer( buffer );
            AvalanceAudio.setLoop(false);
            AvalanceAudio.setVolume(1); // Volume between 0 and 1!
            AvalanceAudio.play();
        });
    }
}

//Adds 10 trees when user press the green button
export function spawnTrees(){
    if (spwanTrees){
        spwanTrees = false;
        console.log("More trees")
        NumTrees = 0;
    }
    if (!spwanTrees) {
        spwanTrees = true;
        console.log("Running trees");
    }
}

//Loads and build the rock model, note loader is heavy on resources
function loadRock()
{
    loader.load(
        // resource URL
        '../Lab6/AmmoSetup/three/build/models/Rock1Complete.glb',
        // called when the resource is loaded
        function ( gltf ) {
            const model = gltf.scene;

            console.log("Rock data = ");
            console.log(model.children[0])

            RockGeometry = model.children[0].geometry;
            RockMaterial = model.children[0].material;


        },
        // called while loading is progressing
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        // called when loading has errors
        function ( error ) {
            console.log( 'An error happened' );
        }
    );
    loader.load(
        // resource URL
        '../Lab6/AmmoSetup/three/build/models/Rock2Complete.glb',
        // called when the resource is loaded
        function ( gltf ) {
            const model2 = gltf.scene;

            console.log("Rock data = ");
            console.log(model2.children[0])

            RockGeometry2 = model2.children[0].geometry;
            RockMaterial2 = model2.children[0].material;


        },
        // called while loading is progressing
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        // called when loading has errors
        function ( error ) {
            console.log( 'An error happened' );
        }
    );
}

//Clones the rock in an array to reuse our model
//note this function crashes if called before Rock is 100% loaded
function cloneRock() {
    for (let i=0; i<maxNumObjects; i+=2){
               RockMesh[i] = new THREE.Mesh (RockGeometry,RockMaterial);
    }
    for (let i=1; i<maxNumObjects; i+=2){
        RockMesh[i] = new THREE.Mesh (RockGeometry2,RockMaterial2);
    }
}

function loadTree()
{
    loader.load(
        // resource URL
        '../Lab6/AmmoSetup/three/build/models/TreeTexturedComplete.glb',
        // called when the resource is loaded
        function ( gltf ) {
            const modeltree = gltf.scene;

            console.log(modeltree.children[0].children[0].geometry);
            TreeGeometry = modeltree.children[0].geometry;
            TreeMaterial = modeltree.children[0].material;
            LeafGeometry = modeltree.children[0].children[0].geometry;
            LeafMaterial = modeltree.children[0].children[0].material;


        },
        // called while loading is progressing
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        // called when loading has errors
        function ( error ) {
            console.log( 'An error happened' );
        }
    );
}

function loadCar()
{
    loader.load(
        // resource URL
        '../Lab6/AmmoSetup/three/build/models/SimpleCar.glb',
        // called when the resource is loaded
        function ( gltf ) {
            const modelCar = gltf.scene;
            console.log("Car data:");
            console.log(modelCar.children[0]);
            console.log(modelCar.children[1]);
            console.log(modelCar.children[2]);


            CarGeometry = modelCar.children[0].geometry;
            CarMaterial = modelCar.children[0].material;
            LightGeometry = modelCar.children[1].geometry;
            LightMaterial = modelCar.children[1].material;
            TireGeometry = modelCar.children[2].geometry;
            TireMaterial = modelCar.children[2].material;

            createCar();
            animate();


        },
        // called while loading is progressing
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        // called when loading has errors
        function ( error ) {
            console.log( 'An error happened' );
        }
    );
}

//Builds rocks, not cubes, from the array of models and add physics to them
function setupRocks(counter) {

    //nr of different rock sizes
    const rockNrOfSizes = 5;
    const RockMassScaler = 3000;
    //CUBE
    let size =(Math.ceil( Math.random() * rockNrOfSizes ))*0.04; // 0,2 scaled down rock size
    //let hafeSize = size*1; //addjusting rigidbody to better fit real rock

    //THREE
    function isOdd(num) { return num % 2;}
    //console.log(isOdd(counter))
    //let Rocks = new THREE.Object3D();

    //picks model from array, apply scale and adds physics
    let Rocks = RockMesh[counter];
    //black rocks
    if (isOdd(counter) == 0) {
        Rocks.scale.set(size, size, size);
    }else{
        Rocks.scale.set(size*4, size*4, size*4);
    }

            //AMMO
            //Math.random() * 128 - 64
            let mass = size*RockMassScaler;
            console.log("Stein " + (counter+1) + " veier " + mass + " kg")
            let boxPos = {x: Math.random() * 2  , y: 27, z: Math.random() * 1 + 3};
            let boxQuat = {x: 2, y: 0, z: 2, w: 1}; // Quat = rotate

            let transform = new Ammo.btTransform();
            transform.setIdentity();
            transform.setOrigin(new Ammo.btVector3(boxPos.x, boxPos.y, boxPos.z));
            transform.setRotation(new Ammo.btQuaternion(boxQuat.x, boxQuat.y, boxQuat.z, boxQuat.w));
            let motionState = new Ammo.btDefaultMotionState(transform);

    //Manually scale new physic body from rocks
    let geo;
    if (isOdd(counter) == 0) {
        geo = new Float32Array (Rocks.geometry.getAttribute('position').array);
        for (let i = 0; i < geo.length; i++){
        geo[i] = geo[i]*(size);
        }
    }else{
        geo = new Float32Array (Rocks.geometry.getAttribute('position').array);
        for (let i = 0; i < geo.length; i++){
            geo[i] = geo[i]*(size*4)
        }
    }

    // new empty ammo shape
    const shape = new Ammo.btConvexHullShape();

//new ammo triangles
    let triangle, triangle_mesh = new Ammo.btTriangleMesh;

//new ammo vectors
    let vectA = new Ammo.btVector3(0,0,0);
    let vectB = new Ammo.btVector3(0,0,0);
    let vectC = new Ammo.btVector3(0,0,0);

//retrieve vertices positions from object
    let verticesPos = geo;
    let triangles = [];
    for ( let i = 0; i < verticesPos.length; i += 3 ) {
        triangles.push({ x:verticesPos[i], y:verticesPos[i+1], z:verticesPos[i+2] })
    }

//use triangles data to draw ammo shape
    for ( let i = 0; i < triangles.length-3; i += 3 ) {

        vectA.setX(triangles[i].x);
        vectA.setY(triangles[i].y);
        vectA.setZ(triangles[i].z);
        shape.addPoint(vectA,true);

        vectB.setX(triangles[i+1].x);
        vectB.setY(triangles[i+1].y);
        vectB.setZ(triangles[i+1].z);
        shape.addPoint(vectB,true);

        vectC.setX(triangles[i+2].x);
        vectC.setY(triangles[i+2].y);
        vectC.setZ(triangles[i+2].z);
        shape.addPoint(vectC,true);

        triangle_mesh.addTriangle( vectA, vectB, vectC, true );
    }

            shape.setMargin(0.05);
            let localInertia = new Ammo.btVector3(0, 0, 0);
            shape.calculateLocalInertia(mass, localInertia);
            let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);

            let boxRigidBody = new Ammo.btRigidBody (rbInfo);
            boxRigidBody.setRestitution(0.1);
            boxRigidBody.setFriction(0.5);
            physicsWorld.addRigidBody(boxRigidBody);

            //work
            dynamicObjects.push(Rocks); //keep in dynamic objects array
            Rocks.castShadow = true;
            scene.add(Rocks);
            Rocks.userData.physicsBody = boxRigidBody;

}

//Setup ground

class TerrainGeometry extends THREE.PlaneGeometry {
    constructor(size, resolution, height, image) {
        super(size, size, resolution - 1, resolution - 1);

        this.rotateX((Math.PI / 180) * -90);

        terrainData = getHeightmapData(image, resolution);
        for (let i = 0; i < terrainData.length; i++) {
            this.attributes.position.setY(i, terrainData[i] * height);
        }
    }
}

function setupTerrain()
{

    const terrainImage = new Image();
    terrainImage.onload = () => {

        const size = 128;
        const str = 128;  //32, 64, 128, 256 etc
        const height = 40;

        const geometry = new TerrainGeometry(size, 128, height, terrainImage);
        const grass = new THREE.TextureLoader().load('../Lab6/AmmoSetup/three/build/images/grass.png');
        const rock = new THREE.TextureLoader().load('../Lab6/AmmoSetup/three/build/images/rock.png');
        const alphaMap = new THREE.TextureLoader().load('../Lab6/AmmoSetup/three/build/images/terrain.png');

        grass.wrapS = THREE.RepeatWrapping;
        grass.wrapT = THREE.RepeatWrapping;

        grass.repeat.multiplyScalar(str / 8);

        rock.wrapS = THREE.RepeatWrapping;
        rock.wrapT = THREE.RepeatWrapping;

        rock.repeat.multiplyScalar(str / 8);

        const material = new TextureSplattingMaterial({
            color: THREE.Color.NAMES.white,
            colorMaps: [grass, rock],
            alphaMaps: [alphaMap],
        });
        //new Terrain map
        const terrainMaterial = new THREE.MeshStandardMaterial({
             map: terrainBaseColor,
             normalmap: terrainNormalMap,
             displacementmap: terrainDispMap,
             roughnessMap: terrainRoughMap,
             aoMap: terrainAOM
            }
        );

        const terrain = new THREE.Mesh(geometry, material);
        terrain.receiveShadow = true;

        // This parameter is not really used, since we are using PHY_FLOAT height data type and hence it is ignored
        let heightScale = 1;

        // Up axis = 0 for X, 1 for Y, 2 for Z. Normally 1 = Y is used.
        let upAxis = 1;

        // hdt, height data type. "PHY_FLOAT" is used. Possible values are "PHY_FLOAT", "PHY_UCHAR", "PHY_SHORT"
        let hdt = "PHY_FLOAT";

        // Set this to your needs (inverts the triangles)
        let flipQuadEdges = false;

        // Creates height data buffer in Ammo heap
       let ammoHeightData = Ammo._malloc( 4 * size * size );

        // Copy the javascript height data array to the Ammo one.
        let p = 0;
        let p2 = 0;
        for ( let j = 0; j < size; j ++ ) {
            for ( let i = 0; i < size; i ++ ) {

                // write 32-bit float data to memory
                Ammo.HEAPF32[ammoHeightData + p2 >> 2] = terrainData[ p ];

                p ++;

                // 4 bytes/float
                p2 += 4;
            }
        }
        //set max/min hight
        let terrainMaxHeight = height/2;
        let terrainMinHeight = -height/2;

        // Creates the heightfield physics shape
        let heightFieldShape = new Ammo.btHeightfieldTerrainShape(

            size,
            size,

            ammoHeightData,

            heightScale,
            terrainMinHeight,
            terrainMaxHeight,

            upAxis,
            hdt,
            flipQuadEdges
        );

        //we want to scale y to our hight
        heightFieldShape.setLocalScaling( new Ammo.btVector3( 1, height, 1 ) ); //X,Y,Z

        heightFieldShape.setMargin(0.005);

        let groundPos = {x: 0, y: 0, z: 0};
        let groundQuat = {x: 0, y: 0, z: 0, w: 1};
        let mass = 0;

        let transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(groundPos.x, groundPos.y, groundPos.z));
        transform.setRotation(new Ammo.btQuaternion(groundQuat.x, groundQuat.y, groundQuat.z, groundQuat.w));

        let motionState = new Ammo.btDefaultMotionState(transform);

        let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, heightFieldShape, 0);
        let terrainRigidBody = new Ammo.btRigidBody(rbInfo);
        physicsWorld.addRigidBody(terrainRigidBody, colGroupGround, colGroupCube);

        terrain.userData.physicsBody = terrainRigidBody;
        staticObjects.push(terrain);
        scene.add(terrain);

    };

    terrainImage.src = '../Lab6/AmmoSetup/three/build/images/terrain.png';
}

//Spawn Trees
function Trees (){

    let radius = 0.05;
    let height = 2;
    //THREE
   // const treeGeometry = new THREE.CylinderGeometry(radius,radius,height,16,1);
    //const treeMaterial = new THREE.MeshPhongMaterial( { color: 0x331800  } );
    let tree = new THREE.Group();
    let treeS = new THREE.Mesh( TreeGeometry, TreeMaterial )
    treeS.castShadow = true;
    let treeL = new THREE.Mesh( LeafGeometry, LeafMaterial )
    treeL.castShadow = true;
    tree.add(treeS);
    tree.add(treeL);
    //const tree = new THREE.Mesh( TreeGeometry, TreeMaterial );
    //console.log(tree);
    tree.scale.set(0.7 , 0.7, 0.7)

    //AMMO
    let mass = 2000;
    //Math.random() * 128 - 64
    let groundPos = {x: Math.random() * 6 -26, y: 0.18, z: Math.random() * 18 +0};
    let groundQuat = {x: 0, y: 0, z: 0, w: 1};

    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(groundPos.x, groundPos.y, groundPos.z));
    transform.setRotation(new Ammo.btQuaternion(groundQuat.x, groundQuat.y, groundQuat.z, groundQuat.w));
    let motionState = new Ammo.btDefaultMotionState(transform);
    //let Shape = new Ammo.btCylinderShape(new Ammo.btVector3(radius, height*0.5, radius));
    let Shape = new Ammo.btBoxShape(new Ammo.btVector3(0.15, 0.25, 0.15));
    Shape.setMargin(0.05);
    let localInertia = new Ammo.btVector3(0, 0, 0);
    Shape.calculateLocalInertia(mass, localInertia);
    let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, Shape, localInertia);
    let treeRigidBody = new Ammo.btRigidBody (rbInfo);
    treeRigidBody.setRestitution(0.1);
    treeRigidBody.setFriction(0.5);
    physicsWorld.addRigidBody(treeRigidBody);
    tree.userData.physicsBody = treeRigidBody;
    /*
    let groundRigidBody = new Ammo.btRigidBody(rbInfo);
    groundRigidBody.setRestitution(0.1);
    groundRigidBody.setFriction(0.5);
    physicsWorld.addRigidBody(groundRigidBody, colGroupGround, colGroupCube);
    tree.userData.physicsBody = groundRigidBody;
    */
    tree.receiveShadow = false;
    dynamicObjects.push(tree);
    //staticObjects.push(tree);
    scene.add( tree );

    console.log("Tree "+ NumTrees)
}

function updatePhysics(deltaTime) {
    // Step physics world:
    physicsWorld.stepSimulation(deltaTime, 10);

    // Update dynamic bodies (cube)
    for (let i = 0; i < dynamicObjects.length; i++) {
        let objThree = dynamicObjects[i];
        let objAmmo = objThree.userData.physicsBody;
        let ms = objAmmo.getMotionState();
        if (ms) {
            ms.getWorldTransform(tmpTrans);
            let p = tmpTrans.getOrigin();
            let q = tmpTrans.getRotation();
            objThree.position.set(p.x(), p.y(), p.z());
            objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
        }
    }
    // Update static bodies (ground)
    for (let i = 0; i < staticObjects.length; i++) {
        let objThree = staticObjects[i];
        let objAmmo = objThree.userData.physicsBody;
        let ms = objAmmo.getMotionState();
        if (ms) {
            ms.getWorldTransform(tmpTrans);
            let p = tmpTrans.getOrigin();
            let q = tmpTrans.getRotation();
            objThree.position.set(p.x(), p.y(), p.z());
            objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
        }
    }
}

function createRoad(){

    //THREE.JS
    //const roadGeometry = new THREE.BoxGeometry(64, 0.1, 1);
    const roadGeometry = new THREE.BoxGeometry(64, 0.1, 2,128,128,128);
    const roadMaterial = new THREE.MeshStandardMaterial({
            color: 0x565656,
            map: roadBaseColor,
            normalmap: roadNormalMap,
            displacementmap: roadDispMap,
            roughnessMap: roadRoughMap,
            aoMap: roadAOM
        }
    );

    const roadStripGeometry = new THREE.BoxGeometry(64, 0.1, 0.1,128,128,128);
    const roadStripMaterial = new THREE.MeshStandardMaterial({
        map: roadBaseStripColor,
        color: 0xFFFFFF,
        normalmap: roadNormalMap,
        displacementmap: roadDispMap,
        roughnessMap: roadRoughMap,
        aoMap: roadAOM
    });

    const roadStripMesh = new THREE.Mesh(roadStripGeometry,roadStripMaterial)
    const roadStripMesh2 = new THREE.Mesh(roadStripGeometry,roadStripMaterial)
    const roadMesh = new THREE.Mesh(roadGeometry, roadMaterial);

    roadMesh.receiveShadow = true;

    roadStripMesh.position.set(-26.2,0.001,0);
    roadStripMesh.rotation.y = Math.PI/2;
    scene.add(roadStripMesh);
    roadStripMesh2.position.set(-27.8,0.001,0);
    roadStripMesh2.rotation.y = Math.PI/2;
    scene.add(roadStripMesh2);
    //roadMesh.position.set(-20, 0, 0);
    //roadMesh.rotation.y = Math.PI/2;
    //roadMesh.rotation.x = -Math.PI/2;


    //AMMO
    let mass = 0;
    let roadMeshPos = {x: -27, y: 0, z: 0};
    let roadMeshQuat = {x: 0, y: 1, z: 0, w: 1};

    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(roadMeshPos.x, roadMeshPos.y, roadMeshPos.z));
    transform.setRotation(new Ammo.btQuaternion(roadMeshQuat.x, roadMeshQuat.y, roadMeshQuat.z, roadMeshQuat.w));

    let motionState = new Ammo.btDefaultMotionState(transform);

    let roadShape = new Ammo.btBoxShape(new Ammo.btVector3(32, 0.05, 0.5));
    roadShape.setMargin(0.05);
    let localInertia = new Ammo.btVector3(0, 0, 0);
    roadShape.calculateLocalInertia(mass, localInertia);
    let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, roadShape, localInertia);
    let roadRigidBody = new Ammo.btRigidBody(rbInfo);
    roadRigidBody.setRestitution(0.1);
    roadRigidBody.setFriction(0.5);
    physicsWorld.addRigidBody(roadRigidBody);

    roadMesh.userData.physicsBody = roadRigidBody;
    staticObjects.push(roadMesh);
    scene.add(roadMesh);

}
function moveCar(speed){

    let impulse = new Ammo.btVector3(0, 0, speed);
    carMesh.userData.physicsBody.setLinearVelocity(impulse);
   //console.log(carMesh.position.x)


}
function createCar(){
     //THREE
    // const carGeometry = new THREE.BoxGeometry(1,1,1);
    // const carMaterial = new THREE.MeshPhongMaterial({
    //     color: 0xff0000
    // });
    // carMesh = new THREE.Mesh(CarGeometry, CarMaterial);

    carMesh = new THREE.Group();
    carMesh.scale.set(0.3, 0.3,0.3);
    carMesh.add(new THREE.Mesh( CarGeometry, CarMaterial ));
    carMesh.add(new THREE.Mesh( LightGeometry, LightMaterial ));
    carMesh.add(new THREE.Mesh( TireGeometry, TireMaterial ));
    carMesh.children[0].castShadow = true;
    carMesh.children[0].material.transparent = true;

     //AMMO
    let mass = 100;
    let carMeshPos = {x: -27, y: 0.5, z: -16};
    let carMeshQuat = {x: 0, y: 90, z: 0, w: 1};

    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(carMeshPos.x, carMeshPos.y, carMeshPos.z));
    transform.setRotation(new Ammo.btQuaternion(carMeshQuat.x, carMeshQuat.y, carMeshQuat.z, carMeshQuat.w));

    let motionState = new Ammo.btDefaultMotionState(transform);

    let carShape = new Ammo.btBoxShape(new Ammo.btVector3(0.5, 0.35, 0.5));
    carShape.setMargin(0.05);
    let localInertia = new Ammo.btVector3(0, 0, 0);
    carShape.calculateLocalInertia(mass, localInertia);
    let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, carShape, localInertia);
    carRigidBody = new Ammo.btRigidBody(rbInfo);
    carRigidBody.setRestitution(0.1);
    carRigidBody.setFriction(0.5);
    physicsWorld.addRigidBody(carRigidBody);



    carRigidBody.setActivationState( STATE.DISABLE_DEACTIVATION );
    carMesh.userData.physicsBody = carRigidBody;
    //console.log(carMesh.position);
    carMesh.receiveShadow = false;
    staticObjects.push(carMesh);
    scene.add(carMesh);
}

function animate() {


    //requestAnimationFrame(animate);
    renderer.setAnimationLoop( function () {

        if(carMesh.position.z < 18 && startAvalanche && carMesh.position.x >-27.05){
            moveCar(3.3);
        }else if(carMesh.position.z >=-21  && startAvalanche && carMesh.position.x >-27.05 && carMesh.position.z<23.8){
            moveCar(2);
        }


        let deltaTime = clock.getDelta();

        if (counter < maxNumObjects && time > timeNextSpawn && startAvalanche) {

            setupRocks(counter);
            counter++;
            timeNextSpawn = time + objectTimePeriod;
        }
        if (startAvalanche){
            SetSound(counter);
        }
        if (spwanTrees && maxNumTrees > NumTrees ){
            NumTrees++
            Trees();
        }
        updatePhysics(deltaTime);
        time += deltaTime;
        control.update(deltaTime);
        renderer.render(scene, camera);
    });

}
