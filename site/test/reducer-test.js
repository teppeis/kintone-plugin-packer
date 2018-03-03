'use strict';

const assert = require('assert');

const reducer = require('../reducer');
const {
  UPLOAD_PPK,
  UPLOAD_PLUGIN_START,
  UPLOAD_PLUGIN,
  CREATE_PLUGIN_ZIP_START,
  CREATE_PLUGIN_ZIP,
  UPLOAD_PLUGIN_FAILURE,
  CREATE_PLUGIN_ZIP_FAILURE,
  RESET,
} = require('../action');

const expectedInitialState = {
  contents: {
    data: null,
    name: null,
  },
  ppk: {
    data: null,
    name: null,
  },
  plugin: {
    id: null,
    url: {
      contents: null,
      ppk: null,
    },
  },
  error: null,
  loading: false,
};

describe('reducer', () => {
  describe('initial state', () => {
    it('should be initialized all values', () => {
      assert.deepStrictEqual(reducer(undefined, {type: 'INIT_TEST'}), expectedInitialState);
    });
  });
  describe('UPLOAD_PPK', () => {
    it('should update state.ppk with the payload', () => {
      const state = {
        ppk: null,
      };
      const ppk = {data: [], name: 'hgoe.ppk'};
      assert.deepStrictEqual(reducer(state, {type: UPLOAD_PPK, payload: ppk}), {
        ppk,
      });
    });
  });
  describe('UPLOAD_PLUGIN_START', () => {
    it('should reset state.contents and state.error', () => {
      const state = {
        contents: {
          data: 'hoge',
          name: 'bar',
        },
        ppk: {
          data: 'ok',
          name: 'okok',
        },
        error: 'hoge',
      };
      assert.deepStrictEqual(reducer(state, {type: UPLOAD_PLUGIN_START}), {
        contents: {
          data: null,
          name: null,
        },
        ppk: {
          data: 'ok',
          name: 'okok',
        },
        error: null,
      });
    });
  });
  describe('UPLOAD_PLUGIN', () => {
    it('should update satte.contents with payload', () => {
      const state = {
        contents: null,
      };
      const contents = {data: [], name: 'hoge.zip'};
      assert.deepStrictEqual(reducer(state, {type: UPLOAD_PLUGIN, payload: contents}), {
        contents,
      });
    });
  });
  describe('CREATE_PLUGIN_ZIP_START', () => {
    it('should reset state.plugin and state.error and update state.loging true', () => {
      const state = {
        contents: 'contents',
        ppk: 'ppk',
        plugin: {
          id: 'hoge',
          url: {
            contents: 'hogehoge',
            ppk: 'foo',
          },
        },
        error: 'error',
        loading: false,
      };
      assert.deepStrictEqual(reducer(state, {type: CREATE_PLUGIN_ZIP_START}), {
        contents: 'contents',
        ppk: 'ppk',
        plugin: expectedInitialState.plugin,
        error: null,
        loading: true,
      });
    });
  });
  describe('CREATE_PLUGIN_ZIP', () => {
    it('should update state.plugin and state.ppk if it is necessary, and update loading false', () => {
      const state = {
        ppk: {
          data: null,
          name: null,
        },
        plugin: {
          id: null,
          url: {
            contents: null,
            ppk: null,
          },
          loading: true,
        },
      };
      const action = {
        type: CREATE_PLUGIN_ZIP,
        payload: {
          privateKey: 'secret',
          plugin: 'plugin data',
          id: 'abcd',
        },
      };
      assert.deepStrictEqual(reducer(state, action), {
        ppk: {
          data: 'secret',
          name: 'abcd.ppk',
        },
        plugin: {
          id: 'abcd',
          url: {
            contents: [['plugin data'], {type: 'application/zip'}],
            ppk: [['secret'], {type: 'text/plain'}],
          },
        },
        loading: false,
      });
    });
  });
  describe('UPLOAD_PLUGIN_FAILURE and CREATE_PLUGIN_ZIP_FAILURE', () => {
    it('should update state.error and update state.loding false', () => {
      const state = {
        error: null,
        loading: true,
      };
      assert.deepStrictEqual(reducer(state, {type: UPLOAD_PLUGIN_FAILURE, payload: 'error'}), {
        error: 'error',
        loading: false,
      });
      assert.deepStrictEqual(reducer(state, {type: CREATE_PLUGIN_ZIP_FAILURE, payload: 'error'}), {
        error: 'error',
        loading: false,
      });
    });
  });
  describe('RESET', () => {
    it('should reset all values', () => {
      const state = 'dirty';
      assert.deepStrictEqual(reducer(state, {type: RESET}), expectedInitialState);
    });
  });
});
