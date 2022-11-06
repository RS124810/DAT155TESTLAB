import * as THREE from 'three';
import * as LOADER from 'Loader';
import  * as Controls from 'Control';

import {VRButton} from '../three/build/VRButton.js';
import * as SkeletonUtils from "../three/examples/jsm/utils/SkeletonUtils.js";
import {getHeightmapData} from "../three/build/utils.js";


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
let Rock;
let RockGeometry;
let RockMaterial;
let RockMesh = [];
let counter = 0;

let time = 0;
let objectTimePeriod = 0.2;
let timeNextSpawn = time + objectTimePeriod;
const maxNumObjects = 50;

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
   // setupGround();
    //setupGround2();
    setupTerrain();
    setupControls();
    loadRock();
    animate();
}

//setup graphics, scene, renderer, camera, vr
function setupGraphics() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x565656 );
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    renderer.setSize(window.innerWidth - 10, window.innerHeight - 10);
    document.body.appendChild(renderer.domElement);

    document.body.append(VRButton.createButton(renderer));
    renderer.xr.enabled = true;
    //OrbitControl start poss
    camera.position.z = -80;
    camera.position.y = 40;
    camera.position.x = 0;
    camera.add(listener);

    //this part can be used to set a suitable VR camera start pos
    const cameraGroup = new THREE.Group();
    cameraGroup.position.set(50, -10, 0);
    cameraGroup.rotation.y = -4.715;

    renderer.xr.addEventListener('sessionstart', function () {
        scene.add(cameraGroup);
        cameraGroup.add(camera);
    });
}

//setup orbital control
function setupControls(){

    control = new Controls.OrbitControls(camera, renderer.domElement );
    scene.add(camera);
}

function setupLights() {
    let hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    hemiLight.position.set( 0, 300, 0 );
    //scene.add( hemiLight );

    let light = new THREE.DirectionalLight( 0xFFFFFF );

    scene.add( light );
    light.position.set(-10, 100, -50);
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
//Fade sound inn function
function SetSound(counter) {

    if (counter<40){
        listener.setMasterVolume(counter/40); //Float between 0 and 1
        //log(listener.getMasterVolume());
    }
}

//Start the simulation when user press the red button
export function activate(){
    if (!startAvalanche) {
        startAvalanche = true;
        cloneRock();
        console.log("Run");

        const AvalanceAudio = new THREE.Audio(listener);
        audioLoader.load('../three/build/Audio/earth-rumble.mp3', function ( buffer ) {
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
        '../three/build/models/Rock3LowPolyCentered.glb',
        // called when the resource is loaded
        function ( gltf ) {
            const model = gltf.scene;
            //Rock = model;
            //console.log(model.children[0].geometry);
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
}

//Clones the rock in an array to reuse our model
//note this function crashes if called before Rock is 100% loaded
function cloneRock() {
    for (let i=0; i<maxNumObjects; i++){
       // RockMesh[i] = SkeletonUtils.clone(Rock);
        RockMesh[i] = new THREE.Mesh (RockGeometry,RockMaterial);

    }
}

//Builds rocks, not cubes, from the array of models and add physics to them
function setupCube(counter) {

    //nr of different rock sizes
    const rockNrOfSizes = 10;
    //CUBE
    let size =(Math.ceil( Math.random() * rockNrOfSizes ))*0.02; // 0,2 scaled down rock size
    //let hafeSize = size*1; //addjusting rigidbody to better fit real rock

    //THREE

    console.log(counter)
    //let Rocks = new THREE.Object3D();

    //picks model from array, apply scale and adds physics
    let Rocks = RockMesh[counter];
        Rocks.scale.set(size, size, size);

            //AMMO
            let mass = size*100;
            let boxPos = {x: Math.random() * 128 - 64, y: 50, z: Math.random() * 128 - 64};
            let boxQuat = {x: 2, y: 0, z: 2, w: 1}; // Quat = rotate

            let transform = new Ammo.btTransform();
            transform.setIdentity();
            transform.setOrigin(new Ammo.btVector3(boxPos.x, boxPos.y, boxPos.z));
            transform.setRotation(new Ammo.btQuaternion(boxQuat.x, boxQuat.y, boxQuat.z, boxQuat.w));
            let motionState = new Ammo.btDefaultMotionState(transform);
            //let boxShape = new Ammo.btBoxShape(new Ammo.btVector3(size, size, size));

    //Manually scale new physic body from rocks
    let geo = new Float32Array (Rocks.geometry.getAttribute('position').array);
    for (let i = 0; i < geo.length; i++){
        geo[i] = geo[i]*(size);
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
            Rocks.castShadow = false;
            scene.add(Rocks);
            Rocks.userData.physicsBody = boxRigidBody;

}

//Setup ground

class TerrainGeometry extends THREE.PlaneGeometry {
    constructor(size, resolution, height, image) {
        super(size, size, resolution - 1, resolution - 1);

        this.rotateX((Math.PI / 180) * -90);

        terrainData = getHeightmapData(image, resolution);
        //console.log(terrainData)
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
        const height = 40;

        const geometry = new TerrainGeometry(128, 128, height, terrainImage);
        //console.log(geometry)
        const grass = new THREE.TextureLoader().load('../three/build/images/grass.png');
        const rock = new THREE.TextureLoader().load('../three/build/images/rock.png');
        const alphaMap = new THREE.TextureLoader().load('../three/build/images/terrain.png');

        grass.wrapS = THREE.RepeatWrapping;
        grass.wrapT = THREE.RepeatWrapping;

        grass.repeat.multiplyScalar(size / 8);

        const material = new THREE.MeshStandardMaterial();
        material.map = grass;

        const terrain = new THREE.Mesh(geometry, material);


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
        console.log(terrainData)
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

        heightFieldShape.setLocalScaling( new Ammo.btVector3( 1, height, 1 ) ); //X,Y,Z

        heightFieldShape.setMargin(0.05);

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

        terrain.receiveShadow = false;


        terrain.userData.physicsBody = terrainRigidBody;
        staticObjects.push(terrain);
        scene.add(terrain);

    };

    terrainImage.src = '../three/build/images/terrain.png';
}

function setupGround(){

    //GROUND

    //AMMO
    let mass = 0;
    let groundPos = {x: -10, y: 14, z: 0};
    let groundQuat = {x: 0, y: 0, z: 2, w: 1};

    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(groundPos.x, groundPos.y, groundPos.z));
    transform.setRotation(new Ammo.btQuaternion(groundQuat.x, groundQuat.y, groundQuat.z, groundQuat.w));

    let motionState = new Ammo.btDefaultMotionState(transform);
    let groundShape = new Ammo.btBoxShape(new Ammo.btVector3(100, 0.5, 140));
    groundShape.setMargin(0.05);
    let localInertia = new Ammo.btVector3(0, 0, 0);
    groundShape.calculateLocalInertia(mass, localInertia);
    let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, groundShape, localInertia);
    let groundRigidBody = new Ammo.btRigidBody(rbInfo);
    groundRigidBody.setRestitution(0.1);
    groundRigidBody.setFriction(0.5);
    physicsWorld.addRigidBody(groundRigidBody, colGroupGround, colGroupCube);

    //THREE
    const groundGeometry = new THREE.BoxGeometry( 60, 1, 280 );
    const groundMaterial = new THREE.MeshPhongMaterial( { color: 0x5C4033 } );
    const ground = new THREE.Mesh( groundGeometry, groundMaterial );
    ground.receiveShadow = false;
    staticObjects.push(ground);
    scene.add( ground );
    ground.userData.physicsBody = groundRigidBody;
}

function setupGround2(){

    //GROUND

    //AMMO
    let mass = 0;
    let groundPos = {x: 47, y: -10, z: 0};
    let groundQuat = {x: 0, y: 0, z: 0, w: 1};

    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(groundPos.x, groundPos.y, groundPos.z));
    transform.setRotation(new Ammo.btQuaternion(groundQuat.x, groundQuat.y, groundQuat.z, groundQuat.w));
    let motionState = new Ammo.btDefaultMotionState(transform);
    let groundShape = new Ammo.btBoxShape(new Ammo.btVector3(40, 0.5, 100));
    groundShape.setMargin(0.05);
    let localInertia = new Ammo.btVector3(0, 0, 0);
    groundShape.calculateLocalInertia(mass, localInertia);
    let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, groundShape, localInertia);
    let groundRigidBody = new Ammo.btRigidBody(rbInfo);
    groundRigidBody.setRestitution(0.1);
    groundRigidBody.setFriction(0.5);
    physicsWorld.addRigidBody(groundRigidBody, colGroupGround, colGroupCube);

    //THREE
    const groundGeometry = new THREE.BoxGeometry( 80, 1, 200 );
    const groundMaterial = new THREE.MeshPhongMaterial( { color: 0x006400 } );
    const ground = new THREE.Mesh( groundGeometry, groundMaterial );

    ground.receiveShadow = false;
    staticObjects.push(ground);
    scene.add( ground );
    ground.userData.physicsBody = groundRigidBody;
}

//Spawn Trees
function Trees (){

    let radius = 0.3;
    let height = 8;
    //THREE
    const treeGeometry = new THREE.CylinderGeometry(radius,radius,height,32,1);
    const treeMaterial = new THREE.MeshPhongMaterial( { color: 0x331800  } );
    const tree = new THREE.Mesh( treeGeometry, treeMaterial );

    let mass = 500;
    let groundPos = {x: Math.random() * 128 - 64, y: 44, z: Math.random() * 128 - 64};
    let groundQuat = {x: 0, y: 0, z: 0, w: 1};

    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(groundPos.x, groundPos.y, groundPos.z));
    transform.setRotation(new Ammo.btQuaternion(groundQuat.x, groundQuat.y, groundQuat.z, groundQuat.w));
    let motionState = new Ammo.btDefaultMotionState(transform);
    //let Shape = new Ammo.btCylinderShape(new Ammo.btVector3(radius, height*0.5, radius));
    let Shape = new Ammo.btBoxShape(new Ammo.btVector3(0.5, 4, 0.5));
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

function animate() {

    //requestAnimationFrame(animate);
    renderer.setAnimationLoop( function () {

        let deltaTime = clock.getDelta();

        if (counter < maxNumObjects && time > timeNextSpawn && startAvalanche) {

            setupCube(counter);
            SetSound(counter);
            counter++;
            timeNextSpawn = time + objectTimePeriod;
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
