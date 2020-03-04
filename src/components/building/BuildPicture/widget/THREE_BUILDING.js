const THREE = window.THREE;
/**
 * THREE_BUILDING
 * create by eds 2019/9/30
 */
export default class dynamicContext {
  /**
   * @param {*} view 父图层
   * @param {*} tools   工具集
   */
  constructor(view, tools) {
    this.renderer = null;
    this.camera = null;
    this.scene = null;
    this.view = view;
    this.tools = tools;
    this.meshArray = [];
    this._building = [
      {
        cityName: "ball",
        //  MeshStandardMaterial 用更高的运算代价获取光照效果
        cylinderColor: new THREE.MeshStandardMaterial({
          // color: new THREE.Color("#FFD700").getHex(),
          // flatShading: true
          map: new THREE.TextureLoader().load(
            "https://s3-us-west-2.amazonaws.com/s.cdpn.io/53148/rock-texture.jpg"
          )
        }),
        latitude: 28.013124071964272,
        longitude: 120.68883488437124
      }
    ];
  }
  setup(context) {
    this.renderer = new THREE.WebGLRenderer({
      context: context.gl,
      premultipliedAlpha: false,
      alpha: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(context.camera.fullWidth, context.camera.fullHeight);
    this.renderer.autoClearDepth = false;
    this.renderer.autoClearStencil = false;
    this.renderer.autoClearColor = false;
    // setup the three.js scene
    this.scene = new THREE.Scene();
    this._createCamera(context);
    this._createLights();
    this._createObjects();
    this.scene.add(new THREE.AxesHelper(9000000));
    context.resetWebGLState();
  }
  render(context) {
    const { externalRenderers } = this.tools;
    this._updateCamera(context);
    this._updateLights(context);
    this._updateObjects(context);
    // draw the scene
    this.renderer.state.reset(); //.resetGLState()已被弃用，替换为.state.reset()
    this.renderer.render(this.scene, this.camera);
    // as we want to smoothly animate the ISS movement, immediately request a re-render
    externalRenderers.requestRender(this.view);
    // cleanup
    context.resetWebGLState();
  }
  _createCamera(context) {
    var cam = context.camera;
    this.camera = new THREE.PerspectiveCamera(
      cam.fovY,
      cam.aspect,
      cam.near,
      cam.far
    );
  }
  _createLights() {
    this.ambient = new THREE.AmbientLight();
    this.scene.add(this.ambient);
    this.sun = new THREE.DirectionalLight();
    this.scene.add(this.sun);
  }
  //创建三维物体
  _createObjects() {
    const { externalRenderers, SpatialReference } = this.tools;
    var _building = this._building;
    var _build = null;
    var transform = null;
    var geometry4cylinder = null;
    var geoData = null;
    var material4cylinder = null;
    var mesh4cylinder = null;
    var cylinderColor = null;
    for (let i = 0; i < _building.length; i++) {
      _build = _building[i];
      geometry4cylinder = new THREE.SphereBufferGeometry(300);
      cylinderColor = _build.cylinderColor;
      mesh4cylinder = new THREE.Mesh(geometry4cylinder, cylinderColor);
      geoData = [];
      geoData.push(_build.longitude);
      geoData.push(_build.latitude);
      geoData.push(400);
      transform = new THREE.Matrix4();
      transform.fromArray(
        externalRenderers.renderCoordinateTransformAt(
          this.view,
          geoData,
          SpatialReference.WGS84,
          new Array(1)
        )
      );
      mesh4cylinder.position.set(
        transform.elements[12],
        transform.elements[13],
        transform.elements[14]
      );
      mesh4cylinder.rotation.z = -Math.asin(
        Math.cos((geoData[1] / 180) * Math.PI) *
          Math.cos((geoData[0] / 180) * Math.PI)
      );
      mesh4cylinder.rotation.x = Math.atan(
        Math.tan((geoData[1] / 180) * Math.PI) /
          Math.sin((geoData[0] / 180) * Math.PI)
      );
      this.scene.add(mesh4cylinder);
      this.meshArray.push({
        mesh: mesh4cylinder,
      });
    }
  }
  //更新三维物体
  _updateObjects(context) {
    var speed = 10;
    var heightTemp = null;
    var radiusTemp = null;
    var meshArray = this.meshArray;
    var _forceBuild = null;
    var meshObj = null;
    for (var i = 0; i < meshArray.length; i++) {
      _forceBuild = meshArray[i];
      meshObj = _forceBuild.mesh;
      meshObj.rotation.x += 0.1;
      //meshObj.rotation.y += 0.1;
    }
  }
  _updateCamera(context) {
    var cam = context.camera;
    this.camera.position.set(cam.eye[0], cam.eye[1], cam.eye[2]);
    this.camera.up.set(cam.up[0], cam.up[1], cam.up[2]);
    this.camera.lookAt(
      new THREE.Vector3(cam.center[0], cam.center[1], cam.center[2])
    );
    this.camera.projectionMatrix.fromArray(cam.projectionMatrix);
  }
  _updateLights(context) {
    var light = context.sunLight;
    this.sun.position.set(
      light.direction[0],
      light.direction[1],
      light.direction[2]
    );
    this.sun.intensity = light.diffuse.intensity;
    this.sun.color = new THREE.Color(
      light.diffuse.color[0],
      light.diffuse.color[1],
      light.diffuse.color[2]
    );
    this.ambient.intensity = light.ambient.intensity;
    this.ambient.color = new THREE.Color(
      light.ambient.color[0],
      light.ambient.color[1],
      light.ambient.color[2]
    );
  }
}
