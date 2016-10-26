define(['exports', 'react', 'PVWStyle/ReactWidgets/FileBrowserWidget.mcss', '../ActionListWidget'], function (exports, _react, _FileBrowserWidget, _ActionListWidget) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _FileBrowserWidget2 = _interopRequireDefault(_FileBrowserWidget);

  var _ActionListWidget2 = _interopRequireDefault(_ActionListWidget);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _react2.default.createClass({

    displayName: 'FileBrowserWidget',

    propTypes: {
      directories: _react2.default.PropTypes.array.isRequired,
      files: _react2.default.PropTypes.array.isRequired,
      groups: _react2.default.PropTypes.array.isRequired,
      onAction: _react2.default.PropTypes.func,
      path: _react2.default.PropTypes.array.isRequired
    },

    getInitialState: function getInitialState() {
      return {
        list: []
      };
    },
    componentDidMount: function componentDidMount() {
      this.processProps(this.props);
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      this.processProps(nextProps);
    },
    onAction: function onAction(name, action, data) {
      if (this.props.onAction) {
        this.props.onAction(action, name, data.length ? JSON.parse(atob(data)) : null);
      }
    },
    onPathChange: function onPathChange(event) {
      var target = event.target;
      while (target.localName !== 'li') {
        target = target.parentNode;
      }
      if (this.props.onAction) {
        var path = [];
        var pathSize = Number(target.dataset.idx);
        while (path.length <= pathSize) {
          path.push(this.props.path[path.length]);
        }
        this.props.onAction('path', path.join('/'), path);
      }
    },
    processProps: function processProps(props) {
      var list = [];
      props.directories.forEach(function (name) {
        list.push({ name: name, icon: _FileBrowserWidget2.default.folderIcon, action: 'directory' });
      });
      props.groups.forEach(function (g) {
        list.push({
          name: g.label,
          icon: _FileBrowserWidget2.default.groupIcon,
          action: 'group',
          data: btoa(JSON.stringify(g.files))
        });
      });
      props.files.forEach(function (name) {
        list.push({ name: name, icon: _FileBrowserWidget2.default.fileIcon, action: 'file' });
      });
      this.setState({ list: list });
    },
    render: function render() {
      var _this = this;

      return _react2.default.createElement(
        'div',
        { className: _FileBrowserWidget2.default.container },
        _react2.default.createElement(
          'ul',
          { className: _FileBrowserWidget2.default.breadcrumb },
          this.props.path.map(function (name, idx) {
            return _react2.default.createElement(
              'li',
              { className: _FileBrowserWidget2.default.breadcrumbItem, key: idx, 'data-idx': idx, title: name, onClick: _this.onPathChange },
              _react2.default.createElement('i', { className: _FileBrowserWidget2.default.breadcrumbFolderIcon }),
              _react2.default.createElement(
                'span',
                { className: _FileBrowserWidget2.default.breadcrumbLabel },
                name
              )
            );
          })
        ),
        _react2.default.createElement(_ActionListWidget2.default, { list: this.state.list, onClick: this.onAction })
      );
    }
  });
});