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
  <div class="upload_container">
    <div class="name">
      <md-field>
        <label>Network name</label>
        <md-input v-model="network.name"></md-input>
      </md-field>
    </div>

    <!-- <div class="monitor">
      <div class="section">
        <md-checkbox v-model="network.listen"
                     class="md-primary">Monitor this network</md-checkbox>
      </div>

      <div class="section"
           v-if="network.listen">
        <md-checkbox v-model="network.saveTimeSeries"
                     class="md-primary">Save timeSeries</md-checkbox>
      </div>

      <div class="section interval"
           v-if="network.listen">
        <md-field>
          <label>Interval Time / ms</label>
          <md-input type="number"
                    v-model="network.interval"></md-input>
        </md-field>
      </div>
    </div> -->

    <div class="upload"
         v-cloak
         @drop.prevent="addFile"
         @dragover.prevent>
      <div v-if="!file">
        <h3>Drag and drop xlsx file to upload</h3>
        <md-button class="md-primary"
                   @click="uploadFile">Or click here to upload file</md-button>
      </div>

      <div class="fileInfo"
           v-if="file">
        <h3>File uploaded</h3>
        <div style="color: #448aff">
          {{ file.name }} ({{ file.size | kb }} kb)
        </div>

        <div class="buttons">
          <md-button class="md-primary"
                     :disabled="disableNetwork"
                     @click="save">Create Network</md-button>

          <md-button class="md-accent"
                     :disabled="disableDelete"
                     @click="removeFile">Delete file</md-button>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  name: "uploadComponent",
  props: {
    network: {},
  },
  data() {
    return {
      file: undefined,
    };
  },
  methods: {
    save() {
      this.$emit("save", this.file);
    },

    addFile(e) {
      let droppedFiles = e.dataTransfer.files;
      if (!droppedFiles || !droppedFiles.length) return;

      this.file = droppedFiles[0];
      // [...droppedFiles].forEach((f) => {
      // 	this.file.push(f);
      // });
    },

    uploadFile() {
      let input = document.createElement("input");
      input.type = "file";
      input.accept =
        ".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";
      input.click();
      input.addEventListener(
        "change",
        async (event) => {
          this.file = event.target.files[0];
        },
        false
      );
    },

    removeFile() {
      // this.file = this.file.filter((f) => {
      // 	return f != file;
      // });
      this.file = undefined;
    },
  },
  computed: {
    disableNetwork() {
      return (
        this.network.name.trim().length === 0 ||
        (this.network.listen && !this.network.interval) ||
        typeof this.file === "undefined"
      );
    },
    disableDelete() {
      return typeof this.file === "undefined";
    },
  },
  filters: {
    kb(val) {
      return Math.floor(val / 1024);
    },
  },
};
</script>

<style scoped>
.upload_container {
  width: 95%;
  height: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload_container .name {
  width: 100%;
  height: 50px;
  margin-bottom: 20px;
}

.upload_container .monitor {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.upload_container .monitor .section {
  flex: 0 0 30%;
}

.upload_container .monitor .interval {
  flex: 0 0 30%;
}

.upload_container .upload {
  width: 100%;
  height: calc(100% - 180px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed grey;
}

.upload_container .upload .fileInfo {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload_container .upload .fileInfo .buttons {
  width: 100%;
  display: flex;
  margin-top: 20px;
  justify-content: center;
}
</style>

<style>
.upload_container .name .md-field,
.upload_container .monitor .section .md-field {
  min-height: unset;
}
</style>