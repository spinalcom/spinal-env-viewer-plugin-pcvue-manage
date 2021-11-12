import { SpinalContextApp, spinalContextMenuService } from "spinal-env-viewer-context-menu-service";
import { PCVUE_ORGAN_TYPE } from "spinal-model-pcvue";
import { SpinalBmsDevice, SpinalBmsNetwork } from "spinal-model-bmsnetwork";
import { getOrgan } from "../utils/utils";

import geographicService from "spinal-env-viewer-context-geographic-service";

const { spinalPanelManagerService } = require("spinal-env-viewer-panel-manager-service");


const SIDEBAR = "GraphManagerSideBar";

class LinkPcvueDevicesToFloor extends SpinalContextApp {
   constructor() {
      super(
         "Link Floor to PCVue Devices",
         "This button allows to Link Devices to Floor", {
            icon: "add_link",
            icon_type: "in",
            backgroundColor: "#FF0000",
            fontColor: "#FFFFFF"
         }
      );
   }

   isShown(option) {
      const constants = geographicService.constants;
      const type = option.selectedNode.type.get();
      const types = [constants.CONTEXT_TYPE, constants.BUILDING_TYPE, constants.FLOOR_TYPE];

      return Promise.resolve(types.indexOf(type));

      // if(type === SpinalBmsNetwork.nodeTypeName || type === SpinalBmsDevice.nodeTypeName) {
      //    const id = option.selectedNode.id.get();
      //    const contextId = option.context.id.get();
      //    const organ = await getOrgan(id,contextId);

      //    return organ && organ.type.get() === PCVUE_ORGAN_TYPE ? true : -1;
      // }

      // return -1;
   }

   action(option) {
      // const nodeId = option.selectedNode.id.get();
      // const contextId = option.context.id.get();
      
      spinalPanelManagerService.openPanel("linkPcvueDeviceToFloor", option)
   }
}


const linkPcvueDevicesToFloor = new LinkPcvueDevicesToFloor()
spinalContextMenuService.registerApp(SIDEBAR, linkPcvueDevicesToFloor, [3]);
export default linkPcvueDevicesToFloor;