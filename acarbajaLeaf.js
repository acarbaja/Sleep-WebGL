/* This leaf is placed at (0,0,0). It is made by mapping an image of a 
// transparent leaf onto a transparent double-sides bezier surface,
// which makes it seem like the leaf image is a cutout.
The box is created by the user setting x,y, and z boundaries. In order
for the box to be placed onto the scene in a certain position, the user
must also specify position parameters.

Every leaf will be generated either within bounds or on the boundary itself.

The leaf is approximately 3x4x2, with the stem pointing out of the screen
BUILT IN THREE JS VERISON:
http://cs.wellesley.edu/~cs307/threejs/lib/three-r80.js

Inspiration for random range: https://www.w3schools.com/js/js_random.asp

*/

/* 
This function makes a leaf by creating a saddle-like bezier surface,
and mapping a transparent leaf cut-out texture to it. It returns the leaf
surface object.
*/
function acarbajaLeaf(textures){
    
    
    // bezier surface to map leaf image onto. this surface is like a saddle
    var topToBottom = [ 
    [ [0,0,0],  [1,0,0],  [2,0,0],  [3,0,0] ],
    [ [0,2,1], [1,0,1],  [2,0,1],  [3,2,1] ],
    [ [0,2,2], [1,0,2],  [2,0,2],  [3,2,2] ],
    [ [0,0,4],  [1,0,4], [2,0,4], [3,2,4] ],
    ];


    var surfGeom = new THREE.BezierSurfaceGeometry( topToBottom.reverse(), 10, 10 );
    var surfMat  = new THREE.MeshPhongMaterial({color: "#f2af55",
                                                 shininess: 20,
                                                 transparent: true,
                                                 side: THREE.DoubleSide,
                                                 map: textures[3] 
    });

    var surf = new THREE.Mesh( surfGeom, surfMat );
    
    return surf;

}

/*This function generates leaves within or on the designated 3D-bounded
area. This function works by generating a random x,y, and z value within or on
the designated x,y,z boundaries. The function adds every new leaf to the scene
and then renders.
*/
function displayLeaves(params,texture){

    // for every leaf
    for (var i=0;i<params.numLeaves;i++){
        var randX = (Math.random() * params.width) ; //generate a random coord
        var randY = (Math.random() * params.height) ;
        var randZ = (Math.random() * params.depth) ;
        
        
        var randXrotation = Math.random() * Math.PI //generate random rotation
        var randYrotation = Math.random() * Math.PI
        var randZrotation = Math.random() * Math.PI
        
        var leaf = acarbajaLeaf(texture);
        leaf.position.set(randX + params.xCoord ,randY + params.yCoord,randZ + params.zCoord);
        leaf.rotation.set(randXrotation,randYrotation,randZrotation);
        
        scene.add(leaf);
        
    }
  

    TW.render();
}