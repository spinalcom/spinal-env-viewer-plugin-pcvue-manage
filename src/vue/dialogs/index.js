import Vue from "vue";

const { SpinalMountExtention } = require("spinal-env-viewer-panel-manager-service");

import LinkPcvueDeviceToFloor from "./linkDeviceToFloor.vue";

const dialogs = [
{
   name: "linkPcvueDeviceToFloor",
   vueMountComponent: Vue.extend(LinkPcvueDeviceToFloor),
   parentContainer: document.body
}
]


for (let index = 0; index < dialogs.length; index++) {
   SpinalMountExtention.mount(dialogs[index]);
}