'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var /* eslint-disable no-underscore-dangle */
  client = _ref.client;
  var filterQuery = _ref.filterQuery;
  var mustContain = _ref.mustContain;
  var busy = _ref.busy;

  return {

    // POST /taskflows Create the taskflow

    createTaskflow: function createTaskflow(taskFlowClass) {
      return busy(client._.post('/taskflows', {
        taskFlowClass: taskFlowClass
      }));
    },


    // GET /taskflows/{id} Get a taskflow
    getTaskflow: function getTaskflow(id, path) {
      if (path) {
        return busy(client._.get('/taskflows/' + id + '?path=' + path));
      }
      return busy(client._.get('/taskflows/' + id));
    },


    // PATCH /taskflows/{id} Update the taskflow
    updateTaskflow: function updateTaskflow(id, params) {
      return busy(client._.patch('/taskflows/' + id, params));
    },


    // DELETE /taskflows/{id} Delete the taskflow
    deleteTaskflow: function deleteTaskflow(id) {
      return busy(client._.delete('/taskflows/' + id));
    },


    // GET /taskflows/{id}/log Get log entries for taskflow
    getTaskflowLog: function getTaskflowLog(id) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      if (offset !== 0) {
        return busy(client._.get('/taskflows/' + id + '/log?offset=' + offset));
      }
      return busy(client._.get('/taskflows/' + id + '/log'));
    },


    // PUT /taskflows/{id}/start Start the taskflow
    startTaskflow: function startTaskflow(id, cluster) {
      return busy(client._.put('/taskflows/' + id + '/start', cluster));
    },


    // GET /taskflows/{id}/status Get the taskflow status
    getTaskflowStatus: function getTaskflowStatus(id) {
      return busy(client._.get('/taskflows/' + id + '/status'));
    },


    // GET /taskflows/{id}/tasks Get all the tasks associated with this taskflow
    getTaskflowTasks: function getTaskflowTasks(id) {
      return busy(client._.get('/taskflows/' + id + '/tasks'));
    },


    // POST /taskflows/{id}/tasks Create a new task associated with this flow
    createNewTaskForTaskflow: function createNewTaskForTaskflow(id, params) {
      return busy(client._.post('/taskflows/' + id + '/tasks', params));
    },


    // PUT /taskflows/{id}/terminate Terminate the taskflow
    endTaskflow: function endTaskflow(id) {
      return busy(client._.put('/taskflows/' + id + '/terminate'));
    }
  };
};