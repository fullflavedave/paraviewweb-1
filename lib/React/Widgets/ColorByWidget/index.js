define(['exports', 'react', 'PVWStyle/ReactWidgets/ColorByWidget.mcss', './AdvancedView'], function (exports, _react, _ColorByWidget, _AdvancedView) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _ColorByWidget2 = _interopRequireDefault(_ColorByWidget);

  var _AdvancedView2 = _interopRequireDefault(_AdvancedView);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  var SEP = ':|:';

  function doubleToHex(number) {
    var str = Math.floor(number * 255).toString(16);
    while (str.length < 2) {
      str = '0' + str;
    }
    return str;
  }

  exports.default = _react2.default.createClass({

    displayName: 'ColorByWidget',

    propTypes: {
      className: _react2.default.PropTypes.string,
      max: _react2.default.PropTypes.number,
      min: _react2.default.PropTypes.number,
      onChange: _react2.default.PropTypes.func,
      presets: _react2.default.PropTypes.object,
      representation: _react2.default.PropTypes.object,
      scalarBar: _react2.default.PropTypes.string,
      source: _react2.default.PropTypes.object,
      opacityPoints: _react2.default.PropTypes.array,
      onOpacityPointsChange: _react2.default.PropTypes.func,
      opacityEditorSize: _react2.default.PropTypes.array
    },

    getDefaultProps: function getDefaultProps() {
      return {
        min: 0,
        max: 1
      };
    },
    getInitialState: function getInitialState() {
      return {
        advancedView: false,
        colorValue: SEP,
        colorValues: [],
        representationValue: '',
        representationValues: [],
        scalarBarVisible: false,
        solidColor: '#fff'
      };
    },
    componentWillMount: function componentWillMount() {
      this.updateState(this.props);
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      this.updateState(nextProps);
    },
    onRepresentationChange: function onRepresentationChange(event) {
      var representationValue = event.target.value;
      this.setState({ representationValue: representationValue });
      if (this.props.onChange) {
        this.props.onChange({
          type: 'propertyChange',
          changeSet: [{
            id: this.props.representation.id,
            name: 'Representation',
            value: representationValue
          }]
        });
      }
    },
    onColorChange: function onColorChange(event) {
      var scalarBarVisible = this.state.scalarBarVisible;
      var colorValue = event.target.value;

      var _colorValue$split = colorValue.split(SEP);

      var _colorValue$split2 = _slicedToArray(_colorValue$split, 2);

      var arrayLocation = _colorValue$split2[0];
      var arrayName = _colorValue$split2[1];

      var colorMode = arrayName ? 'array' : 'SOLID';
      var vectorMode = 'Magnitude';
      var vectorComponent = 0;
      var rescale = false;

      if (colorMode === 'SOLID') {
        scalarBarVisible = false;
      }

      this.setState({ colorValue: colorValue, scalarBarVisible: scalarBarVisible, colorMode: colorMode });
      if (this.props.onChange) {
        this.props.onChange({
          type: 'colorBy',
          representation: this.props.representation.id,
          arrayLocation: arrayLocation,
          arrayName: arrayName,
          colorMode: colorMode,
          vectorMode: vectorMode,
          vectorComponent: vectorComponent,
          rescale: rescale
        });
      }
    },
    updateState: function updateState(props) {
      if (!props.source || !props.representation) {
        return;
      }

      var extractRepProp = function extractRepProp(p) {
        return p.name === 'Representation';
      };
      var removeFieldArray = function removeFieldArray(a) {
        return a.location !== 'FIELDS';
      };
      var representationValues = props.representation.ui.filter(extractRepProp)[0].values;
      var representationValue = props.representation.properties.filter(extractRepProp)[0].value;
      var colorValues = [{ name: 'Solid color' }].concat(props.source.data.arrays.filter(removeFieldArray));
      var colorValue = props.representation.colorBy.array.filter(function (v, i) {
        return i < 2;
      }).join(SEP);
      var scalarBarVisible = !!props.representation.colorBy.scalarBar;
      var solidColor = '#' + props.representation.colorBy.color.map(doubleToHex).join('');

      var colorMode = colorValue.split(SEP)[1] ? 'array' : 'SOLID';

      this.setState({
        representationValues: representationValues,
        representationValue: representationValue,
        colorValues: colorValues,
        colorValue: colorValue,
        scalarBarVisible: scalarBarVisible,
        solidColor: solidColor,
        colorMode: colorMode
      });
    },
    toggleScalarBar: function toggleScalarBar() {
      var scalarBarVisible = !this.state.scalarBarVisible;

      if (this.state.colorMode === 'SOLID') {
        scalarBarVisible = false;
      }

      this.setState({ scalarBarVisible: scalarBarVisible });
      if (this.props.onChange) {
        this.props.onChange({
          type: 'scalarBar',
          source: this.props.source.id,
          representation: this.props.representation.id,
          visible: scalarBarVisible
        });
      }
    },
    toggleAdvancedView: function toggleAdvancedView() {
      var advancedView = !this.state.advancedView;
      this.setState({ advancedView: advancedView });
    },
    render: function render() {
      if (!this.props.source || !this.props.representation) {
        return null;
      }

      return _react2.default.createElement(
        'div',
        { className: [_ColorByWidget2.default.container, this.props.className].join(' ') },
        _react2.default.createElement(
          'div',
          { className: _ColorByWidget2.default.line },
          _react2.default.createElement('i', { className: _ColorByWidget2.default.representationIcon }),
          _react2.default.createElement(
            'select',
            {
              className: _ColorByWidget2.default.input,
              value: this.state.representationValue,
              onChange: this.onRepresentationChange
            },
            this.state.representationValues.map(function (v, idx) {
              return _react2.default.createElement(
                'option',
                { key: idx, value: v },
                v
              );
            })
          )
        ),
        _react2.default.createElement(
          'div',
          { className: _ColorByWidget2.default.line },
          _react2.default.createElement('i', { className: _ColorByWidget2.default.colorIcon }),
          _react2.default.createElement(
            'select',
            {
              className: _ColorByWidget2.default.input,
              value: this.state.colorValue,
              onChange: this.onColorChange
            },
            this.state.colorValues.map(function (c, idx) {
              return _react2.default.createElement(
                'option',
                { key: idx, value: c.location ? [c.location, c.name].join(SEP) : '' },
                c.location ? '(' + (c.location === 'POINTS' ? 'p' : 'c') + c.size + ') ' + c.name : c.name
              );
            })
          )
        ),
        _react2.default.createElement(
          'div',
          { className: _ColorByWidget2.default.line },
          _react2.default.createElement('i', {
            onClick: this.toggleAdvancedView,
            className: this.state.advancedView ? _ColorByWidget2.default.advanceIconOn : _ColorByWidget2.default.advanceIconOff
          }),
          this.props.scalarBar && this.state.colorValue && this.state.colorValue.split(SEP)[1].length ? _react2.default.createElement('img', {
            onClick: this.toggleScalarBar,
            className: _ColorByWidget2.default.scalarBar,
            src: 'data:image/png;base64,' + this.props.scalarBar,
            alt: 'ScalarBar'
          }) : _react2.default.createElement('div', { className: _ColorByWidget2.default.scalarBar, style: { backgroundColor: this.state.solidColor } }),
          _react2.default.createElement('i', {
            onClick: this.toggleScalarBar,
            className: this.state.scalarBarVisible ? _ColorByWidget2.default.scalarBarIconOn : _ColorByWidget2.default.scalarBarIconOff
          })
        ),
        _react2.default.createElement(_AdvancedView2.default, _extends({ visible: this.state.advancedView }, this.props))
      );
    }
  });
});