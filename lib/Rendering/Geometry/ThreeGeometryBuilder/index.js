define(['exports', 'three', './TrackballControls'], function (exports, _three, _TrackballControls) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _three2 = _interopRequireDefault(_three);

  var _TrackballControls2 = _interopRequireDefault(_TrackballControls);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  // ********************************************************************
  // * Convenience function to generate colors from scalar array and LUT
  // *******************************************************************
  function updateFieldColorBuffer(lut, fieldData, buf) {
    // var buf = new Float32Array(fieldData.length * 3);
    for (var i = 0; i < fieldData.length; ++i) {
      var idx = i * 3,
          color = lut.getColor(fieldData[i]);
      buf[idx] = color[0];
      buf[idx + 1] = color[1];
      buf[idx + 2] = color[2];
    }
    return buf;
  }

  // *******************************************************************
  // * Convenience function to generate the correct number of empties
  // *******************************************************************
  function updateGreyColorBuffer(buf) {
    for (var i = 0; i < buf.length; ++i) {
      buf[i] = 0.5;
    }
    return buf;
  }

  var ThreeGeometryBuilder = function () {
    function ThreeGeometryBuilder(lutMgr, geometryDataModel, pipelineModel, queryDataModel) {
      var _this = this;

      _classCallCheck(this, ThreeGeometryBuilder);

      this.meshMap = {};

      this.firstSceneLoad = true;
      this.lookupTableManager = lutMgr;
      this.geometryDataModel = geometryDataModel;
      this.pipelineModel = pipelineModel;
      this.queryDataModel = queryDataModel;
      this.layerMap = this.queryDataModel.originalData.Geometry.layer_map;
      this.fieldMap = this.queryDataModel.originalData.CompositePipeline.fields;
      this.maxSize = queryDataModel.originalData.Geometry.object_size;

      // Handle pipeline color change
      var updatePipeline = function updatePipeline(pipelineQuery, envelope) {
        var size = pipelineQuery.length;

        for (var i = 0; i < size; i += 2) {
          var objectName = _this.layerMap[pipelineQuery[i]],
              fieldName = _this.fieldMap[pipelineQuery[i + 1]];
          // if (fieldName !== '_') {
          if (fieldName) {
            _this.geometryDataModel.colorGeometryBy(objectName, fieldName);
            _this.updateObjectVisibility(objectName, true);
          } else {
            _this.updateObjectVisibility(objectName, false);
          }
        }

        _this.queryDataModel.fetchData();
      };
      this.pipelineModel.onChange(updatePipeline);

      // Handle data fetching
      this.queryDataModel.onDataChange(function (data, envelope) {
        if (data.scene) {
          _this.geometryDataModel.loadScene(data.scene.data);

          if (_this.firstSceneLoad) {
            _this.firstSceneLoad = false;
            updatePipeline(_this.pipelineModel.getPipelineQuery());
          }
        }
      });

      // Handle LookupTable change
      this.lookupTableManager.addFields(this.queryDataModel.originalData.Geometry.ranges, this.queryDataModel.originalData.LookupTables);
      this.lookupTableManager.onChange(function (data, envelope) {
        _this.updateColoring(data.change, data.lut);
      });

      // Scene management
      this.camera = new _three2.default.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.z = 50;

      this.scene = new _three2.default.Scene();
      this.scene.add(this.camera);

      this.dirLight = new _three2.default.DirectionalLight(0xffffff);
      this.dirLight.position.set(200, 200, 1000).normalize();

      // this.dirLight2 = new THREE.DirectionalLight( 0xffffff );
      // this.dirLight2.position.set( 200, -200, 1000).normalize();

      this.camera.add(this.dirLight);
      this.camera.add(this.dirLight.target);

      // this.camera.add( this.dirLight2 );
      // this.camera.add( this.dirLight2.target );

      this.geometryBuilderSubscription = this.geometryDataModel.onGeometryReady(function (data, envelope) {
        _this.updateGeometry(data);
      });
    }

    _createClass(ThreeGeometryBuilder, [{
      key: 'destroy',
      value: function destroy() {
        // Remove listener
        if (this.geometryBuilderSubscription) {
          this.geometryBuilderSubscription.unsubscribe();
          this.geometryBuilderSubscription = null;
        }
      }
    }, {
      key: 'configureRenderer',
      value: function configureRenderer(canvas) {
        var _this2 = this;

        this.renderer = new _three2.default.WebGLRenderer({
          canvas: canvas
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.controls = new _TrackballControls2.default(this.camera, canvas);
        this.controls.rotateSpeed = 5.0;
        this.controls.zoomSpeed = 20;
        this.controls.panSpeed = 2;
        this.controls.noZoom = false;
        this.controls.noPan = false;
        this.controls.staticMoving = true;
        this.controls.dynamicDampingFactor = 0.3;

        // Create a render() method that can be called from anywhere
        this.render = function () {
          requestAnimationFrame(_this2.render);
          _this2.controls.update();
          _this2.renderer.render(_this2.scene, _this2.camera);
        };

        this.queryDataModel.fetchData();
      }
    }, {
      key: 'updateColoring',
      value: function updateColoring(whatChanged, lookupTable) {
        for (var name in this.meshMap) {
          var renderInfo = this.meshMap[name];
          if (renderInfo.colorArrayName === lookupTable.name) {
            var colors = updateFieldColorBuffer(lookupTable, renderInfo.fieldData, renderInfo.colorBuffer);
            renderInfo.mesh.geometry.addAttribute('color', new _three2.default.BufferAttribute(colors, 3));
          }
        }
      }
    }, {
      key: 'updateGeometry',
      value: function updateGeometry(geo) {
        if (!this.meshMap.hasOwnProperty(geo.name)) {
          // Create new Geometry
          var pSize = this.maxSize[geo.name].points,
              iSize = this.maxSize[geo.name].index,
              geom = new _three2.default.BufferGeometry(),
              material = new _three2.default.MeshPhongMaterial({
            color: 0xdddddd,
            specular: 0x444444,
            shininess: 10,
            side: _three2.default.DoubleSide,
            vertexColors: _three2.default.VertexColors,
            shading: _three2.default.FlatShading
          }),
              colorBuffer = new Float32Array(pSize * 3);

          // Add object to the scene
          var sceneObject = new _three2.default.Mesh(geom, material);
          this.scene.add(sceneObject);

          // Register geometry
          this.meshMap[geo.name] = {
            mesh: sceneObject,
            material: material,
            colorBuffer: colorBuffer
          };

          // Allocate max size object
          var pArray = new Float32Array(pSize * 3),
              iArray = new Uint32Array(iSize);

          for (var i = 0; i < pSize; i++) {
            pArray[i] = Math.random();
          }
          for (var _i = 0; _i < iSize; _i++) {
            iArray[_i] = _i % pSize;
          }

          geom.addAttribute('position', new _three2.default.BufferAttribute(pArray, 3));
          geom.setIndex(new _three2.default.BufferAttribute(iArray, 1));
          geom.addAttribute('color', new _three2.default.BufferAttribute(colorBuffer, 3));

          geom.computeFaceNormals();
          // geom.computeVertexNormals();

          this.renderer.render(this.scene, this.camera);
        } else {
          var renderInfo = this.meshMap[geo.name],
              geometry = renderInfo.mesh.geometry;

          var colors = renderInfo.colorBuffer;

          if (geometry.vertices && geo.points.length !== geometry.vertices.length) {
            console.log('********  We may have a problem here, new point count = ', geo.points.length, ', old point count = ', geometry.vertices.length);
            // FIXME: Allocate new color buffer here
          }

          // geometry.setIndex( new THREE.BufferAttribute( geo.index, 1 ) );
          var index = geometry.getIndex(),
              pos = geometry.getAttribute('position'),
              color = geometry.getAttribute('color');

          if (index) {
            index.array = geo.index;
            index.needsUpdate = true;
          }

          if (pos) {
            pos.array = geo.points;
            pos.needsUpdate = true;
          }

          geometry.computeFaceNormals();
          // geometry.computeVertexNormals();
          // geometry.normalizeNormals();

          if (geo.hasOwnProperty('field')) {
            renderInfo.colorArrayName = geo.fieldName;
            renderInfo.fieldData = geo.field;
            colors = updateFieldColorBuffer(this.lookupTableManager.getLookupTable(geo.fieldName), geo.field, colors);
          } else {
            renderInfo.colorArrayName = null;
            renderInfo.fieldData = null;
            colors = updateGreyColorBuffer(colors);
          }

          if (color) {
            color.array = colors;
            color.needsUpdate = true;
          }

          geometry.computeBoundingBox();
        }
      }
    }, {
      key: 'updateObjectVisibility',
      value: function updateObjectVisibility(name, visibility) {
        if (this.meshMap[name]) {
          this.meshMap[name].mesh.visible = visibility;
        }
      }
    }, {
      key: 'resetCamera',
      value: function resetCamera() {
        // Get bounds
        var bbox = new _three2.default.Box3();
        for (var meshName in this.meshMap) {
          var mesh = this.meshMap[meshName].mesh;
          mesh.geometry.computeBoundingBox();
          bbox.expandByPoint(mesh.geometry.boundingBox.min).expandByPoint(mesh.geometry.boundingBox.max);
        }

        var _bbox$getBoundingSphe = bbox.getBoundingSphere();

        var center = _bbox$getBoundingSphe.center;
        var radius = _bbox$getBoundingSphe.radius;

        this.controls.resetCamera(center, radius);
      }
    }, {
      key: 'updateSize',
      value: function updateSize(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);

        this.controls.handleResize();
      }
    }]);

    return ThreeGeometryBuilder;
  }();

  exports.default = ThreeGeometryBuilder;
});