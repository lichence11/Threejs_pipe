/**
 * Created by Esri on 2015/10/23.
 */

var map,mapservice,featurelayer,mapview;
/**
 * Esri Dojo
 */
require([
    "esri/Map",
    "esri/layers/FeatureLayer",
    "esri/views/MapView",
    "dojo/dom-style",
    "dojo/request",
    "dojo/on",
    "dojo/dom",
    "dojo/domReady!"
],function(Map,FeatureLayer,MapView,domStyle,request,on,dom){
   /* featurelayer=new FeatureLayer({
        id:"pipe",
        url:"https://fangxun.arcgisonline.cn/arcgis/rest/services/Wuhan_pipe/MapServer/1",
        returnZ:true
    });
    map =new Map({
        basemap: 'topo'
    });
    map.add(featurelayer);
    mapview=new MapView({
        map:map,
        container:'container',
        center: [114.23, 30.58],
        zoom:10
    });
*/
    var renderer,scene,camera,line,light;
    var animating=false;
    var container=dom.byId("threeD_container");
    var container_width = domStyle.get(container,"width");
    var container_height = domStyle.get(container,"height");

    /**
     * ≥ı ºªØ3D test
     */
     function init3D(){
        initScene();
        initCamera();
        //camera.position.set(0,1000,0);
        camera.position.set(12733467.4879, 3586173.4560000002, 0);
        camera.up.x = 0;
        camera.up.y = 0;
        camera.up.z = 1;
        camera.lookAt({
            x : 12733467.4879,
            y : 3586173.4560000002,
            z : 100
        });
        scene.add(camera);
        initLight();
        light.position.set(100, 100, 200);
        scene.add(light);
        initRenderer();
        container.appendChild(renderer.domElement);

    }

    function initCamera(){
       camera=new THREE.PerspectiveCamera(45,container_width/container_height,1,10000);
    }
    function initLight(){
        light=new THREE.PointLight(0xFFFFFF);
    }
    function initRenderer(){
        renderer=new THREE.WebGLRenderer({antialias: true});//øπæ‚≥›
        renderer.setSize(container_width,container_height);
        renderer.setClearColor(0xFFFF00);
    }
    function initScene(){
        scene=new THREE.Scene();
    }
/*    function creatLine(){
        var geometry=new THREE.Geometry();
        var material=new THREE.LineBasicMaterial({ vertexColors: true });
        var color = new THREE.Color( 0xFF0000 );
        var color2 = new THREE.Color( 0xFF0000 );
        var point1=new THREE.Vector3(-100,0);
        var point2=new THREE.Vector3(100,0);
        geometry.vertices.push(point1);
        geometry.vertices.push(point2);
        geometry.colors.push(color,color2);
        line=new THREE.Line(geometry,material,THREE.LinePieces);
        scene.add(line);
    }*/


    function creatLine(vectors){
        var pipeline;
        var geometry=new THREE.Geometry();
        var material=new THREE.LineBasicMaterial({ vertexColors: true });
        var color = new THREE.Color( 0xFF0000 );
        var color2 = new THREE.Color( 0xFF0000 );
        for(var i=0;i<vectors.length;i++){
            var vector=vectors[i];
            for(var j=0;j<vector.length;j++){
               vector[j].push(0);
            }
            geometry.vertices.push(vector);
        }
        geometry.colors.push(color,color2);
        pipeline=new THREE.Line(geometry,material,THREE.LinePieces);
        scene.add(pipeline);
    }
    function creatLine3D(features){
        if (features!==null){
            //for (var pipe in features){
            //    var pipeLine=features[pipe].geometry.path;
            //}
            for(var i=0;i<features.length;i++){
                var pipeLine=features[i].geometry.paths;
                creatLine(pipeLine);
            }
        }
    }
    function getPipeJson(){
        var pipeFeatures;
        $.ajax({
            type:"GET",
            url: "https://fangxun.arcgisonline.cn/arcgis/rest/services/Wuhan_pipe/MapServer/1/query?f=json&where=1%3D1&returnGeometry=true&spatialRel=esriSpatialRelIntersects&outFields=objectid&outSR=102100&resultOffset=0&resultRecordCount=1000",
            success:function(result){
                var data=eval ("(" + result + ")");
                pipeFeatures=data.features;
                //return pipeFeatures;
                creatLine3D(pipeFeatures);
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){
                alert(errorThrown);
            }
        });
    }

    init3D();
    getPipeJson();
    //creatLine();
    //var pipe=getPipeJson();
    //CreatLine3D(pipe);
    scene.add(line);
    renderer.render(scene,camera);
});//esri dojo-end

