<!--
Copyright 2021 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
  <div class="monitor_container">
    <div class="manage_container"
         v-if="pageSelected === PAGES.selection">
      <div class="header">
        <div>
          <md-button class="md-icon-button"
                     v-tooltip="'start all devices'"
                     @click="startAllMonitoring">
            <md-icon class="md-primary">play_arrow</md-icon>
          </md-button>

          <md-button class="md-icon-button"
                     v-tooltip="'restart all devices'"
                     @click="restartAllMonitoring">
            <md-icon class="md-primary">replay</md-icon>
          </md-button>

          <md-button class="md-icon-button md-accent"
                     v-tooltip="'stop all devices'"
                     @click="stopAllMonitoring">
            <md-icon class="md-accent">stop</md-icon>
          </md-button>

          <md-button class="md-primary"
                     @click="changeTimeSeries(true)">Save all time series
          </md-button>

          <md-button class="md-accent"
                     @click="changeTimeSeries(false)">Stop saving all time
            series</md-button>
        </div>
      </div>

      <div class="devices_list md-scrollbar">
        <monitor-component v-for="network in networks"
                           :key="network.id"
                           :ref="network.id"
                           :network="network"
                           :contextId="context.id"
                           :graph="graph"></monitor-component>

      </div>
    </div>

    <div class="state"
         v-else-if="pageSelected === PAGES.loading">
      <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    </div>

    <div class="state"
         v-else-if="pageSelected === PAGES.error">
      <md-icon class="md-size-5x">close</md-icon>
    </div>

  </div>
</template>

<script>
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { SpinalBmsNetwork } from "spinal-model-bmsnetwork";

import MonitorComponent from "../components/deviceMonitor.vue";

export default {
  name: "createPCVueNetworkPanel",
  data() {
    this.PAGES = {
      selection: 0,
      loading: 1,
      creation: 2,
      success: 3,
      error: 4,
    };

    return {
      networks: [],
      pageSelected: this.PAGES.creation,
      context: undefined,
      gaph: undefined,
    };
  },
  components: {
    "monitor-component": MonitorComponent,
  },
  methods: {
    async opened({ context, graph, selectedNode }) {
      this.pageSelected = this.PAGES.loading;

      this.context = context;
      this.graph = graph;

      this.getNetwork(context.get(), selectedNode.get())
        .then((result) => {
          this.networks = result;
          this.pageSelected = this.PAGES.selection;
        })
        .catch(() => {
          this.pageSelected = this.PAGES.error;
        });
    },

    closed() {},

    getNetwork(context, selectedNode) {
      if (selectedNode.type === SpinalBmsNetwork.nodeTypeName) {
        return Promise.resolve([selectedNode]);
      }

      return SpinalGraphService.findInContext(
        selectedNode.id,
        context.id,
        (node) => {
          if (node.getType().get() === SpinalBmsNetwork.nodeTypeName) {
            SpinalGraphService._addNode(node);
            return true;
          }
          return false;
        }
      ).then((result) => {
        return result.map((el) => el.get());
      });
    },

    startAllMonitoring() {
      this.networks.forEach((network) => {
        const networkId = network.id;
        const [ref] = this.$refs[networkId];
        if (ref) {
          ref.startMonitoring();
        }
      });
    },

    restartAllMonitoring() {
      this.networks.forEach((network) => {
        const networkId = network.id;
        const [ref] = this.$refs[networkId];
        if (ref) {
          ref.restartMonitoring();
        }
      });
    },

    stopAllMonitoring() {
      this.networks.forEach((network) => {
        const networkId = network.id;
        const [ref] = this.$refs[networkId];
        if (ref) {
          ref.stopMonitoring();
        }
      });
    },

    changeTimeSeries(value) {
      this.networks.forEach((network) => {
        const networkId = network.id;
        const [ref] = this.$refs[networkId];
        if (ref) {
          ref.updateTimeSeries(value);
        }
      });
    },
  },
};
</script>

<style scoped>
.panel_container {
  width: 100%;
  height: 100%;
}

.panel_container .states {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.panel_container .states .content {
  width: 30%;
  height: 30%;
  text-align: center;
}

.panel_container .states .content .title {
  font-size: 2em;
  margin-bottom: 20px;
}
</style>

