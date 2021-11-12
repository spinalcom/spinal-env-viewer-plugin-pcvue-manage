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
  <div class="panel_container">
    <upload-component v-if="state === STATES.initial"
                      :network="network"
                      @save="save"></upload-component>

    <div class="states"
         v-else>
      <div class="content">
        <div class="title">{{state | capitalize}}</div>

        <div class="icon"
             v-if="state === STATES.created || state === STATES.error">
          <md-icon class="md-size-5x">{{icon}}</md-icon>
        </div>

        <div class="progress"
             v-else>
          <md-progress-bar md-mode="indeterminate"></md-progress-bar>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { SpinalPCVueDiscoverModel, pcvueOrganState } from "spinal-model-pcvue";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { Path, File } from "spinal-core-connectorjs_type";

import UploadComponent from "../components/upload.vue";
import { startMonitoring } from "../../utils/utils";

export default {
  name: "createPCVueNetworkPanel",
  components: { "upload-component": UploadComponent },
  data() {
    this.context;
    this.organ;
    this.graph;
    this.STATES = pcvueOrganState;

    return {
      network: {
        name: "",
        // listen: false,
        // saveTimeSeries: true,
        // interval: 300000,
      },
      message: "",
      state: this.STATES.initial,
    };
  },
  methods: {
    async opened({ graph, context, selectedNode }) {
      this.state = this.STATES.initial;
      this.context = SpinalGraphService.getRealNode(context.id.get());
      this.organ = await selectedNode.element.load();
      this.graph = graph;
      this.network.name = "";
    },

    closed() {},

    save(argFile) {
      // this.network.interval = this.network.interval || 300000;

      const file = new File(argFile.name, new Path(argFile), undefined);

      const spinalPCVueDiscoverModel = new SpinalPCVueDiscoverModel(
        this.graph,
        this.context,
        this.organ,
        this.network,
        file
      );

      const bindId = spinalPCVueDiscoverModel.state.bind(() => {
        this.state = spinalPCVueDiscoverModel.state.get();
        if (this.state === pcvueOrganState.created) {
          spinalPCVueDiscoverModel.state.unbind(bindId);
        }
      });

      spinalPCVueDiscoverModel.setUploadingState();
      spinalPCVueDiscoverModel.addToGraph();
    },
  },
  computed: {
    icon() {
      if (this.state === this.STATES.created) return "file_download_done";
      if (this.state === this.STATES.error) return "error";
    },
  },

  filters: {
    capitalize(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
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

