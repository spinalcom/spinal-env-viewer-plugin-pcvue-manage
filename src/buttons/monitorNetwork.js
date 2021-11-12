import { SpinalContextApp, spinalContextMenuService } from "spinal-env-viewer-context-menu-service";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { SpinalBmsDevice, SpinalBmsNetwork } from "spinal-model-bmsnetwork";

const { spinalPanelManagerService } = require("spinal-env-viewer-panel-manager-service");

import { PCVUE_ORGAN_TYPE } from "spinal-model-pcvue";
import { getNetwork, getOrgan } from "../utils/utils";


const SIDEBAR = "GraphManagerSideBar";

class MonitorPcvueNetwork extends SpinalContextApp {
   constructor() {
      super(
         "monitor pcvue network",
         "This button allows to monitor pcvue network", {
            icon: "personal_video",
            icon_type: "in",
            backgroundColor: "#FF0000",
            fontColor: "#FFFFFF"
         }
      );
   }

   async isShown(option) {
      const id = option.selectedNode.id.get();
      const type = option.selectedNode.type.get();
      const contextId = option.context.id.get();
      
      if(type === PCVUE_ORGAN_TYPE) return true;

      if(type === SpinalBmsNetwork.nodeTypeName) {
         let network = SpinalGraphService.getRealNode(id);
         const networkId = network.getId().get();
         const organ = await getOrgan(networkId, contextId);
         return organ && organ.type.get() == PCVUE_ORGAN_TYPE  ? true : -1;
      }

      return -1;
   }

   action(option) {
      // const nodeId = option.selectedNode.id.get();
      // const contextId = option.context.id.get();
      
      spinalPanelManagerService.openPanel("monitorPCVuePanel", option);
   }
}


const monitorPcvueNetwork = new MonitorPcvueNetwork()
spinalContextMenuService.registerApp(SIDEBAR, monitorPcvueNetwork, [3]);
export default monitorPcvueNetwork;