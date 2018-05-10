// Connecting to ROS
// -----------------
var ros = new ROSLIB.Ros();

// If there is an error on the backend, an 'error' emit will be emitted.
ros.on('error', function(error) {
    document.getElementById('connecting').style.display = 'none';
    document.getElementById('connected').style.display = 'none';
    document.getElementById('closed').style.display = 'none';
    document.getElementById('error').style.display = 'inline';
    console.log(error);
});

// Find out exactly when we made a connection.
ros.on('connection', function() {
    console.log('Connection made!');
    document.getElementById('connecting').style.display = 'none';
    document.getElementById('error').style.display = 'none';
    document.getElementById('closed').style.display = 'none';
    document.getElementById('connected').style.display = 'inline';
});

ros.on('close', function() {
    console.log('Connection closed.');
    document.getElementById('connecting').style.display = 'none';
    document.getElementById('connected').style.display = 'none';
    document.getElementById('closed').style.display = 'inline';
});

// Create a connection to the rosbridge WebSocket server.
ros.connect('ws://localhost:9090');

//Subscribing to a Topic
//----------------------

// Like when publishing a topic, we first create a Topic object with details of the topic's name
// and message type. Note that we can call publish or subscribe on the same topic object.
var listener = new ROSLIB.Topic({
    ros: ros,
    name: '/tf',
    messageType: 'tf2_msgs/TFMessage'
});

var i = 1;
var optitrackTransform = "";
var x;
var y;
var z;
var w;
var trans_x;
var trans_y;
var trans_z;

function subscribe() {
    listener.subscribe(function(message) {
        message.transforms.forEach(topic => {
            if (topic.child_frame_id == "Part") {
                optitrackTransform = topic;
                document.getElementById("translation_x").innerHTML = optitrackTransform.transform.translation.x;
                document.getElementById("translation_y").innerHTML = optitrackTransform.transform.translation.y;
                document.getElementById("translation_z").innerHTML = optitrackTransform.transform.translation.z;
                document.getElementById("rotation_x").innerHTML = optitrackTransform.transform.rotation.x;
                document.getElementById("rotation_y").innerHTML = optitrackTransform.transform.rotation.y;
                document.getElementById("rotation_z").innerHTML = optitrackTransform.transform.rotation.z;
                document.getElementById("rotation_w").innerHTML = optitrackTransform.transform.rotation.w;
                x = optitrackTransform.transform.rotation.x;
                y = optitrackTransform.transform.rotation.y;
                z = optitrackTransform.transform.rotation.z;
                w = optitrackTransform.transform.rotation.w;
                trans_x = optitrackTransform.transform.translation.x;
                trans_y = optitrackTransform.transform.translation.y;
                trans_z = optitrackTransform.transform.translation.z;
            }
        });
    });
}

function unsubscribe() {
    listener.unsubscribe();
}

// main scene with camera
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.x = 0;
camera.position.y = 5;
camera.position.z = 10;

// put everything into the main div
var renderer = new THREE.WebGLRenderer();
container = document.getElementById('main');
renderer.setSize($(container).width(), $(container).height());
document.getElementById("3d").appendChild(renderer.domElement);

// rotate scene with mouse
controls = new THREE.OrbitControls(camera, renderer.domElement);


// create a cube for the optitrack object
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({
    color: 0x00ff00
});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// create a grid
var size = 10;
var divisions = 10;
var gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);




var animate = function() {
    requestAnimationFrame(animate);

    cube.quaternion.x = x;
    cube.quaternion.y = y;
    cube.quaternion.z = z;
    cube.quaternion.w = w;

    cube.position.x = trans_x;
    cube.position.y = trans_y;
    cube.position.z = trans_z;

    renderer.render(scene, camera);
};

animate();
