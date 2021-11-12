import Vue from 'vue'
import { SpinalForgeExtention } from "spinal-env-viewer-panel-manager-service_spinalforgeextention";


import CreatePCVueNetworkPanel from "./createPCVueNetwork.vue";
import MonitorPCVuePanel from "./monitorPCVue.vue";

const panels = [{
       name : "createPCVueNetworkPanel",
       vueMountComponent: Vue.extend(CreatePCVueNetworkPanel),
       panel: {
          title: "Create PCVue Network",
          closeBehaviour: "hide",
       },
       style: {
          minWidth: '620px',
          height: "670px",
          left: "400px",
       },
    },

    {
      name : "monitorPCVuePanel",
      vueMountComponent: Vue.extend(MonitorPCVuePanel),
      panel: {
         title: "Monitor PCVue Network",
         closeBehaviour: "hide",
      },
      style: {
         minWidth: '620px',
         height: "670px",
         left: "400px",
      },
   }
 ];
 
 
 for (const element of panels) {
    const panelExtension = SpinalForgeExtention.createExtention(element);
    SpinalForgeExtention.registerExtention(element.name, panelExtension);
 }