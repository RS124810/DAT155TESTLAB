import * as THREE from 'three';
import * as LOADER from 'Loader';
import  * as Controls from 'Control';

import {VRButton} from '../three/build/VRButton.js';
import * as SkeletonUtils from "../three/examples/jsm/utils/SkeletonUtils.js";


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
let RockMesh = [];
let counter = 0;

let time = 0;
let objectTimePeriod = 0.2;
let timeNextSpawn = time + objectTimePeriod;
const maxNumObjects = 150;

let control;
let startAvalanche = false;

export function start() {

    setupGraphics();
    setupLights();
    setupPhysics();
    setupGround();
    setupGround2();
    setupControls();
    loadRock();
    animate();

}

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
    camera.position.z = 0;
    camera.position.y = -9;
    camera.position.x = 50;

    //this part can be used to set a suitable VR camera start pos
    const cameraGroup = new THREE.Group();
    cameraGroup.position.set(50, -10, 0);
    cameraGroup.rotation.y = -4.715;

    renderer.xr.addEventListener('sessionstart', function () {
        scene.add(cameraGroup);
        cameraGroup.add(camera);
    });
}

function setupControls(){

    control = new Controls.OrbitControls(camera, renderer.domElement );
    scene.add(camera);
}

function setupLights() {
    let hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    hemiLight.position.set( 0, 300, 0 );
    scene.add( hemiLight );

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

export function activate(){
    startAvalanche = true;
    cloneRock();
    console.log("Run");
}

function loadRock()
{
    loader.load(
        // resource URL
        '../three/build/models/Rock3LowPolyCentered.glb',
        // called when the resource is loaded
        function ( gltf ) {
            const model = gltf.scene;
            Rock = model;

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
//note this function crashes if called before Rock is 100% loaded
function cloneRock() {
    for (let i=0; i<maxNumObjects; i++){
        RockMesh[i] = SkeletonUtils.clone(Rock);
        console.log("Stein nr "+ RockMesh.length + " er " +RockMesh[i] );s
    }
}

function setupCube(counter) {

    const rockNrOfSizes = 10;
    //CUBE
    let size =(Math.ceil( Math.random() * rockNrOfSizes ))*0.2; // 0,2 scaled down rock size
    let hafeSize = size*1; //addjusting rigidbody to better fit real rock

    //THREE
    //const cubeGeometry = new THREE.BoxGeometry(size, size, size);

    console.log(counter)
    //let Rocks = new THREE.Object3D();
    let Rocks = RockMesh[counter];
        Rocks.scale.set(size, size, size);
            //AMMO
            let mass = size*100;
            let boxPos = {x: -24, y: 90, z: Math.random() * 60 - 30};
            let boxQuat = {x: 2, y: 0, z: 2, w: 1}; // Quat = rotate


            let transform = new Ammo.btTransform();
            transform.setIdentity();
            transform.setOrigin(new Ammo.btVector3(boxPos.x, boxPos.y, boxPos.z));
            transform.setRotation(new Ammo.btQuaternion(boxQuat.x, boxQuat.y, boxQuat.z, boxQuat.w));
            let motionState = new Ammo.btDefaultMotionState(transform);
            let boxShape = new Ammo.btBoxShape(new Ammo.btVector3(hafeSize, hafeSize, hafeSize));

            boxShape.setMargin(0.05);
            let localInertia = new Ammo.btVector3(0, 0, 0);
            boxShape.calculateLocalInertia(mass, localInertia);
            let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, boxShape, localInertia);
            /*
            let boxRigidBody = new Ammo.btRigidBody(rbInfo);
            boxRigidBody.setRestitution(0.1);
            boxRigidBody.setFriction(0.5);
            physicsWorld.addRigidBody(boxRigidBody, colGroupCube, colGroupGround);
            */
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
    //cube.position.y = 5;
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

    //cube.position.y = 5;
    staticObjects.push(ground);
    scene.add( ground );
    ground.userData.physicsBody = groundRigidBody;
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

        if (dynamicObjects.length < maxNumObjects && time > timeNextSpawn && startAvalanche) {

            setupCube(counter);
            counter++;
            timeNextSpawn = time + objectTimePeriod;
        }
        updatePhysics(deltaTime);
        time += deltaTime;
        control.update(deltaTime);
        renderer.render(scene, camera);
    });
}
/*
requestAnimationFrame(animate);
    let deltaTime = clock.getDelta();

    if (dynamicObjects.length < maxNumObjects && time > timeNextSpawn && startAvalanche) {
        setupCube();
       // setupSphere();
        timeNextSpawn = time + objectTimePeriod;
    }
    updatePhysics(deltaTime);
    time += deltaTime;

    control.update( deltaTime);

    renderer.render(scene, camera);
 */
