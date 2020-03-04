$(() => {
    init()
})
var chart;

// 初始化
const init = () => {

    chart = echarts.init(document.getElementById('main'))

    // var origin = [113.923029, 22.520231, 0];


    var origin = [120.66092090621764, 28.010845855663625, 0]

    option = {
        mapbox3D: {
            center: origin,
            zoom: 14,
            pitch: 60,
            heading: 41,
            altitudeScale: 2,
            // 地图
            style: {
                "version": 8,
                "sources": {
                    "raster-tiles": {
                        "type": "raster",
                        'tiles': [
                            // "http://192.168.0.123:6080/arcgis/rest/services/DT1022/MapServer/WMTS/tile/1.0.0/MyM/default/default028mm/{z}/{y}/{x}.png"
                            "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/WMTS/tile/1.0.0/MyM/default/default028mm/{z}/{y}/{x}.png"
                        ],
                        'tileSize': 256
                    }
                },
                "layers": [{
                    "id": "simple-tiles",
                    "type": "raster",
                    "source": "raster-tiles",
                    "minzoom": 0,
                    "maxzoom": 22
                }]
            },
            postEffect: {
                enable: true,
                FXAA: {
                    enable: true
                }
            }
        },
        series: [
            {
                // 流动道路线
                type: 'lines3D',

                coordinateSystem: 'mapbox3D',

                effect: {
                    show: true,
                    period: 2,
                    trailWidth: 3,
                    trailLength: 0.3,
                    trailOpacity: 1
                },

                blendMode: 'lighter',

                polyline: true,

                lineStyle: {
                    width: 0.1,
                    color: 'rgb(94, 201, 35)',
                    opacity: 0.
                },

                data: Line
            }
        ]
    }

    chart.setOption(option)


    // 获取mapbox
    var map = chart.getModel().getComponent('mapbox3D').getMapbox()

    var buildingPics = []


    // 创建精细模型
    const createModelLayer = (mOrigin, mUrl, mId) => {
        var modelRotate = [Math.PI / 2, 0, 0]

        var modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(mOrigin)

        var modelTransform = {
            translateX: modelAsMercatorCoordinate.x,
            translateY: modelAsMercatorCoordinate.y,
            translateZ: modelAsMercatorCoordinate.z,
            rotateX: modelRotate[0],
            rotateY: modelRotate[1],
            rotateZ: modelRotate[2],

            scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
        }

        var THREE = window.THREE;

        return customLayer = {
            // id: `3d-model`,
            id: mId,
            type: 'custom',
            renderingMode: '3d',
            onAdd: function (map, gl) {
                this.camera = new THREE.Camera();
                this.scene = new THREE.Scene();

                var directionalLight = new THREE.DirectionalLight(0xffffff);
                directionalLight.position.set(0, -70, 100).normalize();
                this.scene.add(directionalLight);

                var directionalLight2 = new THREE.DirectionalLight(0xffffff);
                directionalLight2.position.set(0, 0, 0).normalize();
                this.scene.add(directionalLight2);

                var loader = new THREE.GLTFLoader();

                loader.load(mUrl, (
                    function (gltf) {
                        this.scene.add(gltf.scene);
                    }).bind(this));

                this.map = map;

                this.renderer = new THREE.WebGLRenderer({
                    canvas: map.getCanvas(),
                    context: gl,
                    antialias: true
                });

                this.renderer.autoClear = false;
            },
            render: function (gl, matrix) {
                var rotationX = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), modelTransform
                    .rotateX);
                var rotationY = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), modelTransform
                    .rotateY);
                var rotationZ = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 0, 1), modelTransform
                    .rotateZ);

                var m = new THREE.Matrix4().fromArray(matrix);
                var l = new THREE.Matrix4().makeTranslation(modelTransform.translateX, modelTransform
                        .translateY, modelTransform.translateZ)
                    .scale(new THREE.Vector3(modelTransform.scale, -modelTransform.scale, modelTransform.scale))
                    .multiply(rotationX)
                    .multiply(rotationY)
                    .multiply(rotationZ);

                this.camera.projectionMatrix = m.multiply(l);
                this.renderer.state.reset();
                this.renderer.render(this.scene, this.camera);
                this.map.triggerRepaint();
            }
        }
    }


    // 创建白模
    const createBaseModel = (mId) => {
        var promise = new Promise((resolve, reject) => {

            map.addLayer({
                'id': `baseModel${mId}`,
                'type': 'fill-extrusion',
                'source': {
                    'type': 'geojson',

                    'data': `./assets/f${mId}.geojson`
                },
                'paint': {
                    'fill-extrusion-color': 'rgba(162, 169, 183, 1)',
                    'fill-extrusion-height': ['get', 'e3'],
                }
            })

            resolve()
        })
        return promise
    }


    // 加载商务楼名字图片
    const buildPicLoad = () => {
        var promise = new Promise((resolve, reject) => {

            for (let item of builgNames.features) {
                map.loadImage(`./img/name_pic/${item.attributes.固定id}.png`,
                    (error, image) => {
                        if (error) throw error
                        map.addImage(
                            `name${item.attributes.固定id}`,
                            image
                        )

                    })
            }
            resolve()

        })
        return promise
    }

    // 创建商务楼名字图片
    const addBuildPic = () => {
        var promise = new Promise((resolve, reject) => {

            map.addLayer({
                "id": "buildNamePic",
                "type": "symbol",
                "source": {
                    "type": "geojson",
                    'data': './assets/buildNames.geojson'
                },
                "layout": {
                    "icon-image": 'name{固定id}',
                    "icon-offset": [0, -10],
                    "icon-anchor": "bottom",
                    "icon-size": 1
                }
            });

            resolve()
        })
        return promise
    }



    // 创建范围面
    const createPolygon = (name, radius) => {
        var promise = new Promise((resolve, reject) => {

            map.addLayer({
                'id': 'sm500',
                'type': 'fill-extrusion',
                'source': {
                    'type': 'geojson',
                    'data': './assets/sm500.geojson'
                },
                'paint': {
                    'fill-extrusion-color': 'rgb(255, 0, 0)',
                    'fill-extrusion-opacity': 0.3
                }
            })


            resolve()
        })
        return promise
    }


    // 加载周边查询图片
    const arroundPicLoad = () => {
        var promise = new Promise((resolve, reject) => {

            // for (let item of builgNames.features) {

            // map.loadImage(`./img/name_pic/${item.attributes.固定id}.png`,

            map.loadImage(`./img/arround_pic/park.png`,

                (error, image) => {
                    if (error) throw error
                    map.addImage(
                        `park`,
                        image
                    )

                })

            // }

            resolve()

        })
        return promise
    }



    // 创建周边查询图片
    const addArroundPic = () => {
        var promise = new Promise((resolve, reject) => {

            map.addLayer({
                "id": "arroundPic",
                "type": "symbol",
                "source": {
                    "type": "geojson",
                    'data': './assets/sm500poi.geojson'
                },
                "layout": {
                    "icon-image": 'park',
                    "icon-offset": [0, -10],
                    "icon-anchor": "bottom",
                    "icon-size": 0.7
                }
            });

            resolve()
        })
        return promise
    }


    let modelList = []

    // 添加精模
    const addModelLayers = () => {
        var promise = new Promise((resolve, reject) => {

            map.addLayer(createModelLayer(
                    [120.66092090621764, 28.010845855663625, 0],
                    './assets/models/fazhan1.gltf',
                    'fazhan1'
                ))
                .setLayoutProperty('fazhan1', 'visibility', 'none')

            map.addLayer(createModelLayer(
                    [120.66092090621764, 28.010845855663625, 16],
                    './assets/models/fazhan2.gltf',
                    'fazhan2'
                ))
                .setLayoutProperty('fazhan2', 'visibility', 'none')

            map.addLayer(createModelLayer(
                    [120.66692090621764, 28.010845855663625, 0],
                    './assets/models/xincheng.gltf',
                    'xincheng'
                ))
                .setLayoutProperty('xincheng', 'visibility', 'none')

            map.addLayer(createModelLayer(
                    [120.66692090621764, 28.010845855663625, 0],
                    './assets/models/chengyuan.gltf',
                    'chengyuan'
                ))
                .setLayoutProperty('chengyuan', 'visibility', 'none')

            map.addLayer(createModelLayer(
                    [120.66692090621764, 28.010845855663625, 0],
                    './assets/models/shimao.gltf',
                    'shimao'
                ))
                .setLayoutProperty('shimao', 'visibility', 'none')


            modelList = [
                'fazhan1',
                'fazhan2',
                'xincheng',
                'chengyuan',
                'shimao'
            ]



            resolve()
        })
        return promise
    }




    map.on('style.load', () => {

        // 分块顺序加载白模
        createBaseModel(1).then(() => {
            return createBaseModel(2)
        }).then(() => {
            return createBaseModel(3)
        }).then(() => {
            return createBaseModel(4)
        }).then(() => {
            return createBaseModel(5)
        }).then(() => {
            return buildPicLoad()
        }).then(() => {
            return addBuildPic()
        })




        addModelLayers()



        // map.addLayer({
        //     'id': 'baseModel1',
        //     'type': 'fill-extrusion',
        //     'source': {
        //         'type': 'geojson',
        //         // 'data': './assets/buildings.geojson'
        //         // 'data': './assets/lcBuildings.geojson'

        //         'data': './assets/f1.geojson'
        //     },
        //     'paint': {
        //         // See the Mapbox Style Specification for details on data expressions.
        //         // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions

        //         // Get the fill-extrusion-color from the source 'color' property.
        //         // 'fill-extrusion-color': ['get', 'color'],

        //         'fill-extrusion-color': 'rgba(162, 169, 183, 1)',


        //         // 'fill-extrusion-color': 'rgb(255, 0, 0)',

        //         // Get fill-extrusion-height from the source 'height' property.
        //         'fill-extrusion-height': ['get', 'e3'],

        //         // Get fill-extrusion-base from the source 'base_height' property.
        //         // 'fill-extrusion-base': ['get', 'base_height'],

        //         // Make extrusions slightly opaque for see through indoor walls.
        //         // 'fill-extrusion-opacity': 0.5
        //     }
        // })



        map.addLayer({
            'id': 'swl',
            'type': 'fill-extrusion',
            'source': {
                'type': 'geojson',
                'data': './assets/swl2.geojson'
            },
            'paint': {
                'fill-extrusion-color': ['get', 'color'],
                'fill-extrusion-height': ['get', 'e6']
            }
        })



        // map.addLayer({
        //     'id': 'sm500',
        //     'type': 'fill-extrusion',
        //     'source': {
        //         'type': 'geojson',
        //         'data': './assets/sm500.geojson'
        //     },
        //     'paint': {
        //         'fill-extrusion-color': 'rgba(255, 0, 0, 0.3)'
        //     }
        // })






        // map.addLayer(createModelLayer(
        //     [120.66092090621764, 28.010845855663625, 16],
        //     './assets/models/songtai.gltf'
        // ))


        // map.addLayer(createModelLayer(
        //     [120.66092090621764, 28.010845855663625, 0],
        //     './assets/models/zhixin.gltf'
        // ))






        map.on('click', function (e) {

            console.log('e', e)
            // set bbox as 5px reactangle area around clicked point
            // var bbox = [
            //     [e.point.x - 5, e.point.y - 5],
            //     [e.point.x + 5, e.point.y + 5]
            // ];
            var features = map.queryRenderedFeatures(e.point, {
                layers: ['swl']

                // layers: ['swl', 'baseModel1']
            });

            console.log('features', features)



            if (features.length) {
                createPolygon('世贸', 500)
                    .then(() => {
                        return arroundPicLoad()
                    }).then(() => {
                        return addArroundPic()
                    })
            }


        })



        // 随机定位
        document.getElementById('fly').addEventListener('click', () => {
            // Fly to a random location by offsetting the point -74.50, 40
            // by up to 5 degrees.
            map.flyTo({
                // center: [
                //     origin[0] + (Math.random() - 0.5) * 0.05,
                //     origin[1] + (Math.random() - 0.5) * 0.05
                // ],
                // zoom: Math.floor(Math.random() * (15 - 12)) + 12

                center: [120.660578621, 28.0100676270001],
                zoom: 16
            })
        })



        let changeTag = true


        // // 切换
        document.getElementById('change').addEventListener('click', () => {
            map.setLayoutProperty('swl', 'visibility',
                changeTag ? 'none' : 'visible')



            map.setLayoutProperty('buildNamePic', 'visibility',
                changeTag ? 'none' : 'visible')


            modelList.map(item => {
                map.setLayoutProperty(item, 'visibility',
                    changeTag ? 'visible' : 'none')
            })



            changeTag = !changeTag

        })

    })

}