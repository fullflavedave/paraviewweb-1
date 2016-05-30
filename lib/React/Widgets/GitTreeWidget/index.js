'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _SizeHelper = require('../../../Common/Misc/SizeHelper');

var _SizeHelper2 = _interopRequireDefault(_SizeHelper);

var _GitTreeWidget = require('PVWStyle/ReactWidgets/GitTreeWidget.mcss');

var _GitTreeWidget2 = _interopRequireDefault(_GitTreeWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function sortById(a, b) {
  return Number(a.id) < Number(b.id);
}

function generateModel(list, rootId) {
  var model = {
    // Temporary structures
    tree: _defineProperty({}, rootId, []),
    map: {},
    leaves: [],

    // Helper variables
    rootId: rootId,
    y: 0,

    // Results
    nodes: [],
    forks: [],
    branches: [],
    actives: []
  };

  list.forEach(function (el) {
    // Make sure we don't share the same reference
    // with the outside world.
    var node = Object.assign({}, el);

    // Register node as a child of its parent
    if (!model.tree.hasOwnProperty(node.parent)) {
      model.tree[node.parent] = [node];
    } else {
      model.tree[node.parent].push(node);
    }

    // Register node to easily find it later by its 'id'
    model.map[node.id] = node;
  });

  // Sort the children of the root
  model.tree[rootId].sort(sortById);

  // All set for the processing
  return model;
}

function assignNodePosition(model, node, x) {
  // Get children if any
  var children = model.tree[node.id];

  // Expand node with position information
  node.x = x;
  node.y = model.y++;

  // Register node in the list
  model.nodes.push(node);

  // Process children
  if (!children || children.length === 0) {
    // This node is a leaf, keep track of it for future processing
    model.leaves.push(node);
  } else {
    // Garanty unique branching order logic
    children.sort(sortById);

    // Move down the tree with the most right side of the tree
    children.forEach(function (child, index) {
      assignNodePosition(model, child, x + children.length - index - 1);
    });
  }
}

function extractBranchesAndForks(model, leaf) {
  var x = leaf.x;
  var y = leaf.y;
  var rootId = model.rootId;
  var map = model.map;
  var branches = model.branches;
  var forks = model.forks;
  var branch = { x: x, y: y };
  var currentNode = leaf;

  // Move currentNode to the top before fork while stretching the branch
  while (currentNode.parent !== rootId && map[currentNode.parent].x === branch.x) {
    currentNode = map[currentNode.parent];
    branch.to = currentNode.y;
  }

  // Do we really have a new branch?
  if (typeof branch.to !== 'undefined' && branch.to !== branch.y) {
    branches.push(branch);
  }

  // Do we have a fork?
  if (currentNode.parent !== rootId) {
    forks.push({
      x: map[currentNode.parent].x,
      y: map[currentNode.parent].y,
      toX: currentNode.x,
      toY: currentNode.y
    });
  }
}

function fillActives(model) {
  var activeIds = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
  var nodes = model.nodes;
  var actives = model.actives;

  // Fill the actives list with the position instead of ids

  nodes.forEach(function (node) {
    if (activeIds.indexOf(node.id) !== -1) {
      actives.push(node.y);
    }
  });
}

exports.default = _react2.default.createClass({
  displayName: 'GitTreeWidget',

  propTypes: {
    activeCircleStrokeColor: _react2.default.PropTypes.string,
    actives: _react2.default.PropTypes.array,
    deltaX: _react2.default.PropTypes.number,
    deltaY: _react2.default.PropTypes.number,
    enableDelete: _react2.default.PropTypes.bool,
    fontSize: _react2.default.PropTypes.number,
    margin: _react2.default.PropTypes.number,
    multiselect: _react2.default.PropTypes.bool,
    nodes: _react2.default.PropTypes.array,
    notVisibleCircleFillColor: _react2.default.PropTypes.string,
    offset: _react2.default.PropTypes.number,
    onChange: _react2.default.PropTypes.func,
    palette: _react2.default.PropTypes.array,
    radius: _react2.default.PropTypes.number,
    rootId: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number, _react2.default.PropTypes.instanceOf(null)]),
    // this could have some problematic effect
    stroke: _react2.default.PropTypes.number,
    style: _react2.default.PropTypes.object,
    textColor: _react2.default.PropTypes.array,
    textWeight: _react2.default.PropTypes.array,
    width: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number])
  },

  getDefaultProps: function getDefaultProps() {
    return {
      nodes: [],
      actives: [],
      style: {},

      enableDelete: false,
      deltaX: 20,
      deltaY: 30,
      fontSize: 16,
      margin: 3,
      multiselect: false,
      offset: 15,
      palette: ['#e1002a', '#417dc0', '#1d9a57', '#e9bc2f', '#9b3880'],
      radius: 6,
      rootId: '0',
      stroke: 3,
      width: 500,
      activeCircleStrokeColor: 'black', // if 'null', the branch color will be used
      notVisibleCircleFillColor: 'white', // if 'null', the branch color will be used
      textColor: ['black', 'white'], // Normal, Active
      textWeight: ['normal', 'bold'] };
  },
  // Normal, Active
  getInitialState: function getInitialState() {
    return {
      actives: [],
      nodes: [],
      branches: [],
      forks: []
    };
  },
  componentWillMount: function componentWillMount() {
    this.processData(this.props.nodes, this.props.actives);
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this.processData(nextProps.nodes, nextProps.actives);
  },
  processData: function processData(list) {
    var activeIds = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
    var model = generateModel(list, this.props.rootId);
    var tree = model.tree;
    var leaves = model.leaves;
    var rootId = model.rootId;
    var nodes = model.nodes;
    var branches = model.branches;
    var forks = model.forks;
    var actives = model.actives;

    // Assign each node position starting from the root

    tree[rootId].forEach(function (rootNode) {
      return assignNodePosition(model, rootNode, 0);
    });

    // Update active list
    fillActives(model, activeIds);

    // Create branches and forks starting from the leaves
    leaves.forEach(function (leaf) {
      return extractBranchesAndForks(model, leaf);
    });

    // Sort forks for better rendering
    forks.sort(function (a, b) {
      return a.toX > b.toX;
    });

    // Save computed structure to state
    this.setState({ nodes: nodes, branches: branches, forks: forks, actives: actives, leaves: leaves });
  },
  toggleActive: function toggleActive(event) {
    var _this = this;

    var _state = this.state;
    var actives = _state.actives;
    var nodes = _state.nodes;


    if (event.target.nodeName !== 'circle' && !event.target.classList.contains(_GitTreeWidget2.default.iconText)) {
      var size = _SizeHelper2.default.getSize(_reactDom2.default.findDOMNode(this));
      var deltaY = this.props.deltaY;
      // Firefox vs Chrome/Safari// Firefox vs Chrome/Safari
      var originTop = size.clientRect.y || size.clientRect.top;
      var yVal = Math.floor((event.clientY - originTop) / deltaY);
      var index = actives.indexOf(yVal);

      // command key for osx, control key for windows
      if (this.props.multiselect && (event.metaKey || event.ctrlKey)) {
        if (index === -1) {
          actives.push(yVal);
        } else {
          actives.splice(index, 1);
        }
      } else {
        actives = [yVal];
      }
      this.setState({ actives: actives });

      if (this.props.onChange) {
        (function () {
          var changeSet = [],
              active = true;

          actives.forEach(function (idx) {
            var _nodes$idx = nodes[idx];
            var id = _nodes$idx.id;
            var parent = _nodes$idx.parent;
            var name = _nodes$idx.name;
            var visible = _nodes$idx.visible;

            changeSet.push({ id: id, parent: parent, name: name, visible: visible, active: active });
          });

          _this.props.onChange({ type: 'active', changeSet: changeSet });
        })();
      }
    }
  },
  toggleVisibility: function toggleVisibility(event) {
    var yVal = parseInt(event.currentTarget.attributes['data-id'].value, 10);
    var _state2 = this.state;
    var actives = _state2.actives;
    var nodes = _state2.nodes;
    var node = nodes[yVal];

    node.visible = !node.visible;
    this.setState({ nodes: nodes });

    if (this.props.onChange) {
      var id = node.id;
      var parent = node.parent;
      var name = node.name;
      var visible = node.visible;
      var active = actives.indexOf(yVal) !== -1;
      var changeSet = [{ id: id, parent: parent, name: name, visible: visible, active: active }];

      this.props.onChange({ type: 'visibility', changeSet: changeSet });
    }
  },
  deleteNode: function deleteNode(event) {
    if (this.props.onChange) {
      var yVal = parseInt(event.currentTarget.attributes['data-id'].value, 10);
      var _state$nodes$yVal = this.state.nodes[yVal];
      var id = _state$nodes$yVal.id;
      var parent = _state$nodes$yVal.parent;
      var name = _state$nodes$yVal.name;
      var visible = _state$nodes$yVal.visible;
      var changeSet = [{ id: id, parent: parent, name: name, visible: visible }];

      this.props.onChange({ type: 'delete', changeSet: changeSet });
    }
  },
  renderNodes: function renderNodes() {
    var _this2 = this;

    return this.state.nodes.map(function (el, index) {
      var _props = _this2.props;
      var activeCircleStrokeColor = _props.activeCircleStrokeColor;
      var deltaX = _props.deltaX;
      var deltaY = _props.deltaY;
      var fontSize = _props.fontSize;
      var notVisibleCircleFillColor = _props.notVisibleCircleFillColor;
      var offset = _props.offset;
      var palette = _props.palette;
      var radius = _props.radius;
      var stroke = _props.stroke;
      var textColor = _props.textColor;
      var textWeight = _props.textWeight;
      var isActive = _this2.state.actives.includes(index);
      var isVisible = !!el.visible;
      var branchColor = palette[el.x % palette.length];

      // Styles
      var currentTextColor = textColor[isActive ? 1 : 0];
      var weight = textWeight[isActive ? 1 : 0];
      var strokeColor = isActive ? activeCircleStrokeColor : branchColor || branchColor;
      var fillColor = isVisible ? branchColor : notVisibleCircleFillColor || branchColor;

      // Positions
      var cx = deltaX * el.x + offset,
          cy = deltaY * el.y + deltaY / 2,
          tx = cx + radius * 2,
          ty = cy + radius - 1;

      return _react2.default.createElement(
        'g',
        { key: 'node-' + index, className: _GitTreeWidget2.default.cursor },
        _react2.default.createElement('circle', {
          'data-id': el.y,
          cx: cx,
          cy: cy,
          r: radius,
          stroke: strokeColor,
          strokeWidth: stroke,
          fill: fillColor,
          onClick: _this2.toggleVisibility
        }),
        _react2.default.createElement(
          'text',
          {
            className: _GitTreeWidget2.default.regularText,
            'data-id': el.y,
            x: tx,
            y: ty,
            fill: currentTextColor,
            fontWeight: weight,
            fontSize: fontSize
          },
          el.name
        )
      );
    });
  },
  renderBranches: function renderBranches() {
    var _props2 = this.props;
    var deltaX = _props2.deltaX;
    var deltaY = _props2.deltaY;
    var offset = _props2.offset;
    var palette = _props2.palette;
    var stroke = _props2.stroke;


    return this.state.branches.map(function (el, index) {
      var x1 = deltaX * el.x + offset,
          y1 = deltaY * el.y + deltaY / 2,
          y2 = deltaY * el.to + deltaY / 2,
          strokeColor = palette[el.x % palette.length];

      return _react2.default.createElement('path', {
        key: 'branch-' + index,
        d: 'M' + x1 + ',' + y1 + ' L' + x1 + ',' + y2,
        stroke: strokeColor,
        strokeWidth: stroke
      });
    });
  },
  renderForks: function renderForks() {
    var _props3 = this.props;
    var deltaX = _props3.deltaX;
    var deltaY = _props3.deltaY;
    var offset = _props3.offset;
    var palette = _props3.palette;
    var radius = _props3.radius;
    var stroke = _props3.stroke;


    return this.state.forks.map(function (el, index) {
      var x1 = deltaX * el.x + offset,
          y1 = deltaY * el.y + deltaY / 2 + radius,
          x2 = deltaX * el.toX + offset,
          y2 = deltaY * el.toY + deltaY / 2 + radius,
          strokeColor = palette[el.toX % palette.length],
          dPath = 'M' + x1 + ',' + y1 + ' ' + ('Q' + x1 + ',' + (y1 + deltaY / 3) + ',' + (x1 + x2) / 2 + ',' + (y1 + deltaY / 3) + ' ') + ('T' + x2 + ',' + (y1 + deltaY) + ' L' + x2 + ',' + y2);

      return _react2.default.createElement('path', {
        key: 'fork-' + index,
        d: dPath,
        stroke: strokeColor,
        strokeWidth: stroke,
        fill: 'transparent'
      });
    });
  },
  renderActives: function renderActives() {
    var _this3 = this;

    var _props4 = this.props;
    var margin = _props4.margin;
    var deltaY = _props4.deltaY;


    return this.state.actives.map(function (el, index) {
      return _react2.default.createElement('rect', {
        key: 'active-' + index,
        'data-id': _this3.state.nodes[el].y,
        x: '-50',
        width: '1000',
        fill: '#999',
        y: el * deltaY + margin / 2,
        height: deltaY - margin
      });
    });
  },
  renderDeleteActions: function renderDeleteActions() {
    var _this4 = this;

    if (!this.props.enableDelete) {
      return null;
    }

    var _props5 = this.props;
    var deltaY = _props5.deltaY;
    var width = _props5.width;
    var offset = _props5.offset;
    var textColor = _props5.textColor;
    var radius = _props5.radius;


    return this.state.leaves.map(function (node, idx) {
      var isActive = _this4.state.actives.includes(node.y),
          currentTextColor = textColor[isActive ? 1 : 0];

      return _react2.default.createElement(
        'text',
        {
          key: 'delete-' + idx,
          className: _GitTreeWidget2.default.iconText,
          onClick: _this4.deleteNode,
          'data-id': node.y,
          x: Number(width) - offset - 10,
          y: deltaY * node.y + deltaY / 2 + radius - 1,
          fill: currentTextColor
        },
        ''
      );
    });
  },
  render: function render() {
    return _react2.default.createElement(
      'svg',
      {
        style: this.props.style,
        width: this.props.width,
        height: this.props.deltaY * this.state.nodes.length + 'px',
        onClick: this.toggleActive
      },
      this.renderActives(),
      this.renderBranches(),
      this.renderForks(),
      this.renderNodes(),
      this.renderDeleteActions()
    );
  }
});