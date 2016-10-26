define(['react', 'react-dom', '..', '../../../../React/Widgets/SvgIconWidget', 'babel-polyfill'], function (_react, _reactDom, _, _SvgIconWidget) {
  'use strict';

  var _react2 = _interopRequireDefault(_react);

  var _reactDom2 = _interopRequireDefault(_reactDom);

  var _2 = _interopRequireDefault(_);

  var _SvgIconWidget2 = _interopRequireDefault(_SvgIconWidget);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var legendEntries = ['Aashish', 'Alex', 'Alexis', 'Alvaro', 'Andinet', 'Andrew', 'Ann', 'Anthony', 'Arslan', 'Bailey', 'Benjamin', 'Berk', 'Betsy', 'Bill', 'Brad', 'Bradley', 'Brenda', 'Brian', 'Charles', 'Charles', 'Chengjiang', 'Chet', 'Christopher', 'Claudine', 'Cory', 'Curtis', 'Dan', 'Daniel', 'David', 'Deborah', 'Deepak', 'Dhanannjay', 'Doruk', 'Dzenan', 'Eran', 'Eric', 'Francois', 'Heather', 'Hyun Jae', 'Jacob', 'Jake', 'Jamie', 'Janet', 'Jared', 'Jason', 'Javier', 'Jean-Christophe', 'Jeffrey', 'Johan', 'John', 'Jonathan', 'Joseph', 'Katherine', 'Kathleen', 'Keith', 'Kenneth', 'Kerri', 'Kevin', 'Linus', 'Lisa', 'Lucas', 'Marcus', 'Matt', 'Matthew', 'Max', 'Meredith', 'Michael', 'Michelle', 'Omar', 'Patrick', 'Paul', 'Reid', 'Robert', 'Roddy', 'Ronald', 'Roni', 'Russell', 'Sandy', 'Sankhesh', 'Scott', 'Sebastien', 'Shawn', 'Stephen', 'Sujin', 'Sumedha', 'Tami', 'Theresa', 'Thomas Joseph', 'Timothy (Tim)', 'Tristan', 'Veronica (Vicki)', 'William (Will)', 'Yumin', 'Yvette', 'Zach', 'Zachary', 'Zhaohui'];

  var optionIdx = 0;
  var priorityOptions = [['colors'], ['shapes'], ['shapes', 'colors'], ['colors', 'shapes'], []];

  var legend = _2.default.newInstance({ legendEntries: legendEntries });
  var container = document.querySelector('.content');
  //

  function next() {
    optionIdx = (optionIdx + 1) % priorityOptions.length;
    legend.assignLegend(priorityOptions[optionIdx]);
    _reactDom2.default.render(_react2.default.createElement(
      'ul',
      null,
      _react2.default.createElement(
        'li',
        null,
        priorityOptions[optionIdx].join(', ')
      ),
      legendEntries.map(function (name, idx) {
        return _react2.default.createElement(
          'li',
          { key: idx },
          _react2.default.createElement(_SvgIconWidget2.default, {
            icon: legend.getLegend(name).shape,
            width: '20px',
            height: '20px',
            style: { fill: legend.getLegend(name).color }
          }),
          name
        );
      })
    ), container);
  }

  setInterval(next, 5000);
  next();

  document.body.style.margin = '10px';
});