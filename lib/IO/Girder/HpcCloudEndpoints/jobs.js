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
    // GET /jobs List all jobs for a given user

    getJobs: function getJobs(offset, limit) {
      if (offset && limit) {
        return busy(client._.get('/jobs?offset=' + offset + '&limit=' + limit));
      } else if (offset) {
        return busy(client._.get('/jobs?offset=' + offset));
      } else if (limit) {
        return busy(client._.get('/jobs?limit=' + limit));
      }

      return busy(client._.get('/jobs'));
    },


    // POST /jobs Create a new job
    createJob: function createJob(params) {
      return busy(client._.post('/jobs', params));
    },


    // GET /jobs/{id} Get a job
    getJob: function getJob(id) {
      return busy(client._.post('/jobs/' + id));
    },


    // PATCH /jobs/{id} Update the job
    updateJob: function updateJob(id, params) {
      return busy(client._.patch('/jobs/' + id, params));
    },


    // DELETE /jobs/{id} Delete a job
    deleteJob: function deleteJob(id) {
      return busy(client._.delete('/jobs/' + id));
    },


    // GET /jobs/{id}/log Get log entries for job
    getJobLog: function getJobLog(id, offset) {
      if (offset) {
        return busy(client._.get('/jobs/' + id + '/log?offset=' + offset));
      }
      return busy(client._.get('/jobs/' + id + '/log'));
    },


    // GET /jobs/{id}/output Get output entries for job
    getJobOutput: function getJobOutput(id, path, offset) {
      if (offset) {
        return busy(client._.get('/jobs/' + id + '/output?path=' + path + '&offset=' + offset));
      }
      return busy(client._.get('/jobs/' + id + '/output?path=' + path));
    },


    // GET /jobs/{id}/status Get the status of a job
    getJobStatus: function getJobStatus(id) {
      return busy(client._.get('/jobs/' + id + '/status'));
    },


    // PUT /jobs/{id}/terminate Terminate a job
    terminateJob: function terminateJob(id) {
      return busy(client._.put('/jobs/' + id + '/terminate'));
    }
  };
};