import {
  SpinalGraphService,
  SPINAL_RELATION_LST_PTR_TYPE,
} from "spinal-env-viewer-graph-service";
import { FLOOR_TYPE } from "spinal-env-viewer-context-geographic-service/build/constants";
import { SpinalBmsDevice } from "spinal-model-bmsnetwork";

export async function linkDevicesToFloorId(
  geographicContextId,
  geographicStartId,
  pcVueDevices,
  func,
  pcvueContextId,
  pcvueStartId
) {
  const floors = await getFloors(geographicContextId, geographicStartId);
  const devices =
    pcVueDevices && Array.isArray(pcVueDevices) && pcVueDevices.length > 0
      ? pcVueDevices
      : await getDevices(pcvueContextId, pcvueStartId);

  const map = getMap(floors, devices, func);
  const promises = Array.from(map.keys()).map((key) => {
    const ids = map.get(key);
    return createNodeLinks(key, ids);
  });

  return Promise.all(promises);
}

async function createNodeLinks(parentId, childrenIds) {
  try {
    const promises = childrenIds.map((childId) =>
      SpinalGraphService.addChild(
        parentId,
        childId,
        SpinalBmsDevice.relationName,
        SPINAL_RELATION_LST_PTR_TYPE
      )
    );

    return Promise.all(promises);
  } catch (error) {
    return false;
  }
}

function getFloors(geographicContextId, geographicStartId) {
  return findInContext(geographicContextId, geographicStartId, FLOOR_TYPE);
}

function getDevices(pcvueContextId, pcvueStartId) {
  return findInContext(
    pcvueContextId,
    pcvueStartId,
    SpinalBmsDevice.nodeTypeName
  );
}

function findInContext(contextId, startId, type) {
  return SpinalGraphService.findInContext(startId, contextId, (node) => {
    if (node.getType().get() === type) {
      SpinalGraphService._addNode(node);
      return true;
    }
    return false;
  })
    .then((result) => {
      return result.map((el) => el.get());
    })
    .catch((err) => {
      return [];
    });
}

function getMap(floors, devices, func) {
  const floorsCopy = Object.assign([], floors);
  const devicesCopy = Object.assign([], devices);
  const map = new Map();

  while (floorsCopy.length > 0 && devicesCopy.length > 0) {
    const floor = floorsCopy.shift();
    const indexes = getIndexes(floor.name, devicesCopy, func);

    const res = [];
    for (let idx of indexes) {
      const item = devicesCopy[idx];
      res.push(item.id);
    }
    map.set(floor.id, res);
  }

  return map;
}

function getIndexes(floorName, devices, callback) {
  return devices
    .map((el, idx) =>
      eval(`(${callback})(floorName, el.name)`) ? idx : undefined
    )
    .filter((el) => typeof el !== "undefined");
}
