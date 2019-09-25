/* 
Hershel Carbajal-Rodriguez
CS 307-Creative Scene
November 12, 2018

Scene inspired by artwork by Heikala, this model may not be used for
commercial purposes.

The origin is at the center of the head, and the hand is on the positive x
axis.

BUILT IN THREE JS VERISON:
http://cs.wellesley.edu/~cs307/threejs/lib/three-r80.js
*/


// SLEEPING PERSON *******************************************************

/* assembling the different parts of our sleeping human (the head and 
the hand).*/ 
function acarbajaSleepingPerson(params) {
    var body = new THREE.Object3D();

    addHand(body,params);
    addHead(body,params);

    return body;
}

// HAND **************************************************************

/* creates the base of the hand using a sphere geometry */
function createHandBase(params){
    var hand = new THREE.SphereGeometry(params.handRadius,params.detail,params.detail);
    
    var handMesh = new THREE.Mesh(hand,params.bodyMaterial);
    return handMesh;
}

/* creates a finger using a cylinder. this finger is positioned to
come from the center of the handbase sphere.*/
function createFinger(params){
    var finger = new THREE.CylinderGeometry(params.fingerRadius,
                                            params.fingerRadius,
                                            params.fingerRadius*6,
                                            params.detail);
    var fingerMesh = new THREE.Mesh(finger,params.bodyMaterial);
    fingerMesh.position.y = params.fingerRadius*(3); //scooting cylinder up for easier finger rotation
    return fingerMesh;
}

/* add finger, used in assembling the hand. We specify zrotation of the finger object
to get the desired finger of the hand (such as index finger, middle
finger, etc) */
function addFinger(zRotation,hand,params){
    var fingerFrame = new THREE.Object3D();
    var finger = createFinger(params);
    fingerFrame.add(finger);
    fingerFrame.rotation.z = zRotation;
    hand.add(fingerFrame);
}

/*adding the handbase*/
function addHandBase(body,params){
    var handFrame = new THREE.Object3D();
    var handBase = createHandBase(params);
    handFrame.add(handBase);

    body.add(handFrame);
    
}

/*This function puts our hand together. It is comprised of a base
sphere, where all of the fingers are added. The hand is then moved
away from the face.*/
function createHand(params){
    var hand = new THREE.Object3D();
    addHandBase(hand,params);
    
    // fingers for hand
    addFinger(Math.PI/12,hand,params); //index finger
    addFinger(Math.PI/4,hand,params);  //middle finger
    addFinger(-Math.PI/12,hand,params); //ring finger
    addFinger(-Math.PI/4,hand,params); //pinky
    addFinger(Math.PI/2,hand,params); //thumb
    
    //positioning hand to be away from face, and under the sheets
    hand.position.x=params.headRadius*3; 
    hand.position.y=-0.5;
    hand.position.z=-2;
    return hand;
}

/*We build a composed hand object (with a base and 5 fingers) and add
to the base acarbajaSleepingPerson object*/
function addHand(body,params){
    var handFrame = new THREE.Object3D();
    var model = createHand(params);
    handFrame.add(model);
    body.add(handFrame);
}

    
// HEAD *******************************************************************

/*makes a sphere and then to the sphere it adds, 1 nose, 2 eyes, 2 eyebrows, 
    and head hair using helper functions. the head object is returned*/
function createHead(params){
    var headBase = new THREE.Object3D();
    var head = new THREE.SphereGeometry(params.headRadius,params.detail,params.detail);
    var headMesh = new THREE.Mesh(head,params.bodyMaterial);
    
    headBase.add(headMesh);
    
    //adding all of the parts to headBase object
    addEye(headBase,params,1);
    addEye(headBase,params,-1);
    addEyebrow(headBase,params,1);
    addEyebrow(headBase,params,-1);
    addHair(headBase,params);
    addNose(headBase, params);
    
    return headBase;
}

/*creates a head frame and adds it to the person relative to
    the size of the body*/
function addHead(body,params){
    
    var headFrame = new THREE.Object3D();
    var head = createHead(params);
    
    headFrame.add(head);
    headFrame.rotation.y = Math.PI/6;
    body.add(headFrame);
}

/*makes an eye using a partial torus. Adds 3 eyelashes at varying
    angles using addLash*/
function createEye(params){
    
    var eyeObject = new THREE.Object3D();
    
    addMainLash(eyeObject,params);
    
    addLash(eyeObject,(1/6)*Math.PI,params);
    addLash(eyeObject,0,params);
    addLash(eyeObject,-(1/6)*Math.PI,params);
    
    return eyeObject;
}

/* creates eye frame, puts it on the z axis of the
    head. we rotate the eyeframe on the x and y axis to move the object
    to the right location, and so
    the eye stays flushed to the head*/
function addEye(head,params,side){
 
    var eyeFrame = new THREE.Object3D();
    var eye = createEye(params);
    eye.position.z = params.headRadius;
    eyeFrame.rotation.set(params.eyeAngleX, 
                            side * params.eyeAngleY,
                            0);
    eyeFrame.add(eye);
    head.add(eyeFrame);

}

/* creates torus for the main part of the eyelash */
function createMainLash(params){
    var eyeGeom = new THREE.TorusGeometry(params.eyeRadius, params.eyeTube, 
                                            params.detail, params.detail, 
                                            params.eyeArc);
    var eyeMesh = new THREE.Mesh( eyeGeom, params.eyeLashMaterial );
    return eyeMesh;
}

/* adds main lash to eye object */
function addMainLash(eye,params){
    
    var mainlash = createMainLash(params);
    eye.add(mainlash);
}

/* creates eyelash cylinders. used in createEye */
function createEyelash(params,lashAngle){
    
    var eyelashGeom = new THREE.CylinderGeometry(params.eyeTube,
                                                    params.eyeTube,
                                                    params.eyelashLength,
                                                    params.detail);
    var eyelashMesh = new THREE.Mesh(eyelashGeom, params.eyeLashMaterial);
    eyelashMesh.rotation.z = lashAngle;
    
    return eyelashMesh;
}

/* rotates and positions eyelash to be placed ontop of mainlash */
function addLash(eye,lashAngle,params){
   var eyelash = createEyelash(params,lashAngle);
   
   // scooting down the eyelash so it starts at the same distance as the 
   // rim of the main eyelash (which is a torus), which is 
   // params.eyeRadius+ params.eyelashLength/2
   eyelash.position.x = (params.eyeRadius+ params.eyelashLength/2)*Math.sin(lashAngle);
   eyelash.position.y = -1*(params.eyeRadius+ params.eyelashLength/2)*Math.cos(lashAngle); 
   eye.add(eyelash);
    
}


 /* creates cone and returns it */
function createNose(params){
    var nose = new THREE.ConeGeometry(params.noseRadius,params.noseLength,
                                        params.detail);
                                        
    var noseMesh = new THREE.Mesh(nose,params.noseMaterial);
    return noseMesh;
}

/* we make sure the nose sits on the face and then we add
    it to our head*/
function addNose(head, params) {
    
    var noseFrame = new THREE.Object3D();
    var nose = createNose(params);
    nose.position.z = params.headRadius;
    noseFrame.add(nose);
    head.add(noseFrame);
    
}

/*creating a stretched out sphere and returns it */
function createEyebrow(params){
   var eyebrow = new THREE.SphereGeometry(params.eyebrowRadius,params.detail,
                                            params.detail);
   var eyebrowMesh = new THREE.Mesh(eyebrow,params.eyeBrowsMaterial);
   eyebrowMesh.scale.x = params.eyebrowXScalar;
   return eyebrowMesh;
}

/* adds eyebrows to head. we position the eyebrows above the eyes.
side controls which side of the face the eyebrow is placed on*/
function addEyebrow(head, params,side) {
    
   var eyebrowFrame = new THREE.Object3D();
   var eyebrow = createEyebrow(params);
   eyebrow.position.z = params.headRadius;

   eyebrow.rotation.z = Math.PI;
   
   eyebrowFrame.rotation.set(params.eyebrowAngleX, 
                            side * params.eyebrowAngleY,
                            0);
    eyebrowFrame.add(eyebrow);
    head.add(eyebrowFrame);
}

/* creates hair through making partial and scaled spheres.*/
function createHair(params){
    var hairFrame = new THREE.Object3D();
    
    addHairBase(hairFrame,params);
    addFringe(hairFrame,params);
    
    
    // creates a row of hair tufts across the back of the head
    var hairTuftAngle = Math.PI/2;
    
    while (hairTuftAngle <= (3/2)*Math.PI){
        addTuft(hairFrame,Math.PI/10,hairTuftAngle,params);
        hairTuftAngle += Math.PI/4
    }
    
    return hairFrame;
}

/* adds composite hair object to body */
function addHair(body,params){
    var hairFrame = new THREE.Object3D();
    var hair = createHair(params);
    hairFrame.add(hair);
    
    body.add(hairFrame);
    
}

 /* this is a partial sphere where all of the hair tufts will go
    on top of*/
function createHairBase(params){
    var hair = new THREE.SphereGeometry(params.headRadius + 0.1, //add 0.1 so we dont overlap meshes
                                        params.detail,
                                        params.detail,
                                        0,
                                        (7/6)*Math.PI) //hair stops at forehead
                                        
    var hairMesh = new THREE.Mesh(hair,params.hairMaterial);
    hairMesh.rotation.y = Math.PI; //so hair is on the back of head, not the front
    hairMesh.rotation.z = Math.PI/2; //hair wraps around vertically
    return hairMesh;
}

/* adds hairbase to head */
function addHairBase(head,params){
    var hairFrame = new THREE.Object3D();
    var hairMesh = createHairBase(params);
    hairFrame.add(hairMesh);
    head.add(hairFrame);
}

/*Creates bangs for our sleeping human. The bangs are positioned above
the human's right eye.*/
function createFringe(params){
    var fringe = new THREE.SphereGeometry(params.headRadius/4, params.detail, params.detail);
    var fringeMesh = new THREE.Mesh(fringe, params.hairMaterial);
    fringeMesh.scale.x = 2;
    fringeMesh.position.z = params.headRadius;
    
    return fringeMesh;
}

/*Adding our fringe to the head.*/
function addFringe(head,params){
    var fringeFrame = new THREE.Object3D();
    var fringeMesh = createFringe(params);

    fringeFrame.add(fringeMesh);
    fringeFrame.rotation.x = -Math.PI/3;
    fringeFrame.rotation.y = -Math.PI/7;
    
    head.add(fringeFrame);
}

/*creates a stretched out sphere that will serve as a tuft of hair*/
function createTuft(params){
    var tuft = new THREE.SphereGeometry(params.headRadius/2,
                                        params.detail,
                                        params.detail);
    var tuftMesh = new THREE.Mesh(tuft,params.hairMaterial);
    
    tuftMesh.scale.x = 1.6;
    tuftMesh.scale.y = 1.1;

    return tuftMesh;
}

/*Creates a tuft and then positions it to the desired part of the head
by rotating the frame*/
function addTuft(head,tuftAngleX,tuftAngleY,params){
    var frame = new THREE.Object3D();
    var tuft = createTuft(params);
    
    tuft.position.z = params.headRadius;
    
    frame.add(tuft);

    frame.rotation.y = tuftAngleY;
    frame.rotation.x = tuftAngleX;
    
    head.add(frame);
}


// FURNITURE ********************************************************************

/*Our bedding is comprised of a plane geometry for the sheets, and
a bezier surface for the comforter. */
function displayBed(textures,params) {
    
    // BED FRAME ===============================================================
    var planeGeom = new THREE.PlaneGeometry(16,32);
    var planeMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff,
                                                 map: textures[0]} );
    var planeMesh = new THREE.Mesh(planeGeom, planeMaterial);
    planeMesh.position.set(2,-10,-3); //moving plane so human is sleeping at the top middle
    scene.add(planeMesh);
    
    // COMFORTER ===============================================================
    var topToBottom = [
    [ [0,0,0],  [4,0,8],  [8,0,6],  [16,0,0] ],
    [ [0,-8,0], [4,-8,10],  [8,-8,0],  [16,-8,0] ],
    [ [0,-16,0], [4,-16,15],  [8,-16,0],  [16,-16,0] ],
    [ [0,-32,0],  [4,-32,0], [8,-32,0], [16,-32,0] ],
    ];

    var surfGeom = new THREE.BezierSurfaceGeometry( topToBottom.reverse(), 10, 10 );
    var surfMat  = new THREE.MeshLambertMaterial( { color: 0xffffff,
                                              map: textures[1]} );
    
    var surf = new THREE.Mesh( surfGeom, surfMat );
    surf.position.set(-6,-1,-3); //moving so it is on top of human
    scene.add(surf);

    
    TW.render();
   
}


/*This function works much the same as displayBed. However,
we also make 4 plane geometries to make 2 bedroom posters, a window, and a wall.
We also add some text using a TextGeometry.*/
function displayFurniture(textures,params) {
    
    // BED FRAME ===============================================================
    var planeGeom = new THREE.PlaneGeometry(16,32);
    var planeMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff,
                                                 map: textures[0]} );
    var planeMesh = new THREE.Mesh(planeGeom, planeMaterial);
    planeMesh.position.set(2,-10,-3); //moving plane so human is sleeping at the top middle
    scene.add(planeMesh);
    
    // COMFORTER ===============================================================
    var topToBottom = [
    [ [0,0,0],  [4,0,8],  [8,0,6],  [16,0,0] ],
    [ [0,-8,0], [4,-8,10],  [8,-8,0],  [16,-8,0] ],
    [ [0,-16,0], [4,-16,15],  [8,-16,0],  [16,-16,0] ],
    [ [0,-32,0],  [4,-32,0], [8,-32,0], [16,-32,0] ],
    ];

    var surfGeom = new THREE.BezierSurfaceGeometry( topToBottom.reverse(), 10, 10 );
    var surfMat  = new THREE.MeshLambertMaterial( { color: 0xffffff,
                                              map: textures[1]} );
    
    var surf = new THREE.Mesh( surfGeom, surfMat );
    surf.position.set(-6,-1,-3); //moving so it is on top of human
    scene.add(surf);
    
    // WALL AND PICTURES =======================================================
    // WINDOW image 
    var windowGeom = new THREE.PlaneGeometry(20,10);
    var windowMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff,
                                                 map: textures[2]} ); 
    var windowMesh = new THREE.Mesh(windowGeom, windowMaterial);
    windowMesh.rotation.x = Math.PI/2; //move so on z axis
    windowMesh.position.set(3,5,5); //moving plane so it is on top of the human
    scene.add(windowMesh);
    
      // MARINA poster
    var marinaGeom = new THREE.PlaneGeometry(12,7);
    var marinaMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff,
                                                 map: textures[4]} ); 
    var marinaMesh = new THREE.Mesh(marinaGeom, marinaMaterial);
    marinaMesh.rotation.x = Math.PI/2;
    marinaMesh.position.set(-3,5,15); // on the wall, to the left
    scene.add(marinaMesh);
    
      // JOE JOHNSON AND KARINA MANTA photo
    var jakGeom = new THREE.PlaneGeometry(10,8);
    var jakMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff,
                                                 map: textures[5]} ); 
    var jakMesh = new THREE.Mesh(jakGeom, jakMaterial);
    jakMesh.rotation.x = Math.PI/2;
    jakMesh.position.set(10,5,17); // on the wall, to the right
    scene.add(jakMesh);
    
    
     // WALL 
    var wallGeom = new THREE.PlaneGeometry(30,40);
    var wallMaterial = new THREE.MeshLambertMaterial({color: "#ffc3e1"})
    var wallMesh = new THREE.Mesh(wallGeom, wallMaterial);
    wallMesh.rotation.x = Math.PI/2;
    wallMesh.position.set(3,5.1,20-3); //bed PlaneGeom is on the z=-3 plane
    // ^ offset so wall is behind human, behind the pictures, and 
    // flushed with the bed
    scene.add(wallMesh);
    
    
    // TEXT ==================================================================
    
    var loader = new THREE.FontLoader();
    path = 'https://cs.wellesley.edu/~cs307/threejs/r80/examples/fonts/';
  
   loader.load(
   path + 'helvetiker_regular.typeface.json',
   function (font) {
      var textGeom = new THREE.TextGeometry('see you in space, cowboy', 
                                            {font: font,
                                             size: .7,
                                             height: .5,
                                            } );
      var textMat = new THREE.MeshBasicMaterial({color: 0x0000ff});
      var textObj = new THREE.Mesh(textGeom, textMat);
      textObj.position.set(-8,5,22); // positioning on top of marina poster
      textObj.rotation.x=Math.PI/2;
      textObj.rotation.z = -Math.PI/12;
      scene.add(textObj);
    
   } );

    
    TW.render();
   
}

