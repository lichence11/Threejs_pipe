/**
 * Created by liwb on 2015/10/23.
 */

//var map,mapservice,featurelayer,mapview;
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
    featurelayer=new FeatureLayer({
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
    var renderer,scene,camera,light;
    var container=dom.byId("threeD_container");
    var container_width = domStyle.get(container,"width");
    var container_height = domStyle.get(container,"height");
    var leftTop={},leftButtom={},rightTop={},rightButtom={},center={};//定义一个面的四个顶点和中心点
    /**
     * 初始化3D test
     */
     function init3D(){
        initScene();
        initCamera();
        camera.position.x = 12730;
        camera.position.y = 10;
        camera.position.z = 3577;
        scene.add(camera);
/*        initLight();
        light.position.set(100, 100, 200);
        scene.add(light);*/
        initRenderer();
        container.appendChild(renderer.domElement);
        var object = new THREE.AxisHelper( 10 );
        object.position.set( 12627.6596503,  0,-3579.7126349500004 );
        scene.add( object );

    }

    function initCamera(){
       camera=new THREE.PerspectiveCamera(45,container_width/container_height,1,10000);
    }
    function initLight(){
        light=new THREE.PointLight(0xFFFFFF);
    }
    function initRenderer(){
        renderer=new THREE.WebGLRenderer({antialias: true});//抗锯齿
        renderer.setSize(container_width,container_height);
        renderer.setClearColor(0xFFFFFF);
    }
    function initScene(){
        scene=new THREE.Scene();
    }

    function creatLine(vectors){
        var pipeline;
        var geometry=new THREE.Geometry();
        var material=new THREE.LineBasicMaterial({ vertexColors: true });
        var color = new THREE.Color( 0xFF0000 );
        for(var i=0;i<vectors.length;i++){
            var vector=vectors[i];
            for(var j=0;j<vector.length;j++){
                var point=new THREE.Vector3(vector[j][0]/1000,0,-1*vector[j][1]/1000);
                /*if(j===0){
                    leftTop.x= vector[j][0]/1000;leftTop.y=vector[j][1]/1000;
                    leftButtom.x= vector[j][0]/1000;leftButtom.y=vector[j][1]/1000;
                    rightTop.x= vector[j][0]/1000;rightTop.y=vector[j][1]/1000;
                    rightButtom.x= vector[j][0]/1000;rightButtom.y=vector[j][1]/1000;
                }else{
                    if(leftTop.x>vector[j][0]/1000){leftTop.x=vector[j][0]/1000;}
                    if(leftTop.y<vector[j][0]/1000){leftTop.y=vector[j][1]/1000;}
                    if(leftButtom.x>vector[j][0]/1000){leftButtom.x=vector[j][0]/1000;}
                    if(leftButtom.y>vector[j][1]/1000){leftButtom.y=vector[j][1]/1000;}
                    if(rightTop.x<vector[j][0]/1000){rightTop.x=vector[j][0]/1000;}
                    if(rightTop.y<vector[j][1]/1000){rightTop.y=vector[j][1]/1000;}
                    if(rightButtom.x<vector[j][0]/1000){rightButtom.x=vector[j][0]/1000;}
                    if(rightButtom.y>vector[j][1]/1000){rightButtom.y=vector[j][1]/1000;}
                }*/
                geometry.vertices.push(point);
                geometry.colors.push(color);
            }
        }
        pipeline=new THREE.Line(geometry,material);
        scene.add(pipeline);
    }
    function creatLine3D(features){
        if (features!==null){
            for(var i=0;i<features.length;i++){
                var points=features[i].geometry.paths;
                creatLine(points);
            }
        }
/*        center.x=(rightTop.x+leftTop.x)/2;
        center.y=(rightTop.y+rightButtom.y)/2*/
        
    }
    function getPipeJson(){
        var pipeFeatures;
        $.ajax({
            type:"GET",
            url: "https://fangxun.arcgisonline.cn/arcgis/rest/services/Wuhan_pipe/MapServer/1/query?f=json&where=1%3D1&returnGeometry=true&spatialRel=esriSpatialRelIntersects&outFields=objectid&outSR=102100&resultOffset=0&resultRecordCount=1000",
            //url:"test.json",
            success:function(result){
                var data=eval ("(" + result + ")");
                pipeFeatures=data.features;
                creatLine3D(pipeFeatures);
                renderer.render(scene,camera);
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){
                alert(errorThrown);
            }
        });
    }

    init3D();
    getPipeJson();

    var cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
    //var cameraControls = new THREE.OrbitControls( camera);
    cameraControls.target.set( 12727.6596503, 0 , -3579.7126349500004);
    //cameraControls.target.set( 0, 0, 0 );
    //cameraControls.target.x=center.x;
    //cameraControls.target.y=center.y;
    cameraControls.addEventListener( 'change', render );

    function render(){
        renderer.render(scene, camera);
    }



});//esri dojo-end

