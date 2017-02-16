'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

;

var Panel = function (_React$Component) {
  _inherits(Panel, _React$Component);

  function Panel() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, Panel);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Panel.__proto__ || Object.getPrototypeOf(Panel)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      loading: true,
      scenarios: {},
      dropdownValue: "",
      error: null,
      baseUrl: {}
    }, _this.setScenario = function (_ref2) {
      var dropdownValue = _ref2.value;


      chrome.runtime.sendMessage({ debug: true, dropdownValue: dropdownValue });

      _this.setState({
        dropdownValue: dropdownValue
      }, _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var scenarioUrl, resp;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                scenarioUrl = url.format(_extends({}, _this.state.baseUrl, { pathname: 'scenario' }));
                _context.prev = 1;
                _context.next = 4;
                return fetch(scenarioUrl, {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    scenario: dropdownValue
                  })
                });

              case 4:
                resp = _context.sent;


                if (resp.ok) {
                  chrome.devtools.inspectedWindow.reload(null);
                }
                _context.next = 11;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context['catch'](1);

                _this.setState({
                  error: _context.t0
                });

              case 11:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this2, [[1, 8]]);
      })));
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Panel, [{
    key: 'normalizeScenarios',
    value: function normalizeScenarios(scenarios) {
      var normalized = [];
      for (var key in scenarios) {
        normalized.push({
          label: key,
          value: key
        });
      }

      return normalized;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this3 = this;

      var tabId = chrome.devtools.inspectedWindow.tabId;

      chrome.runtime.sendMessage({ tabId: tabId }, function () {
        var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(res) {
          var tabUrl, baseUrl, scenariosUrl, resp, body, keys;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  tabUrl = url.parse(res.url);
                  baseUrl = {
                    host: tabUrl.host,
                    port: tabUrl.port,
                    protocol: tabUrl.protocol
                  };
                  scenariosUrl = url.format(_extends({}, baseUrl, { pathname: 'scenarios' }));


                  chrome.runtime.sendMessage({ debug: true, url: scenariosUrl });

                  _context2.prev = 4;
                  _context2.next = 7;
                  return fetch(scenariosUrl, {
                    headers: {
                      Accept: 'application/json'
                    },
                    mode: 'cors'
                  });

                case 7:
                  resp = _context2.sent;
                  _context2.next = 10;
                  return resp.json();

                case 10:
                  body = _context2.sent;
                  keys = Object.keys(body);


                  _this3.setState({
                    loading: false,
                    scenarios: body,
                    dropdownValue: keys[0],
                    baseUrl: baseUrl
                  });
                  _context2.next = 19;
                  break;

                case 15:
                  _context2.prev = 15;
                  _context2.t0 = _context2['catch'](4);

                  chrome.runtime.sendMessage({ debug: true, error: JSON.stringify(_context2.t0.stack, null, 4) });

                  _this3.setState({
                    error: _context2.t0
                  });

                case 19:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, _this3, [[4, 15]]);
        }));

        return function (_x) {
          return _ref4.apply(this, arguments);
        };
      }());
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.state.error) {
        return React.createElement(
          'pre',
          null,
          this.state.error.message
        );
      }

      if (this.state.loading) {
        return React.createElement(
          'p',
          null,
          'loading...'
        );
      }

      return React.createElement(
        'div',
        { className: 'pad' },
        React.createElement(Dropdown, {
          id: 'scenarios',
          label: 'Scenarios',
          options: this.normalizeScenarios(this.state.scenarios),
          value: this.state.dropdownValue,
          onChange: this.setScenario
        })
      );
    }
  }]);

  return Panel;
}(React.Component);