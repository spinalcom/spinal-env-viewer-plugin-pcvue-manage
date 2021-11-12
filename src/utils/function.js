import dedent from "dedent";

export function defaultFunction() {
  return dedent`
  /**
   *   1 - Don't change the function name and parameters
   *   2 - This function must return a boolean
   *   3 - Change function content to match with your test
   *   4 - All your code must be inside the function
   */
   function linkFloorToDevice(floorName, deviceName) {
     const [floor] = floorName.match(/\d+$/g) || []; // return the number at the end of the name
     console.log("floor",floor)
     if(!floor) return false;

     const [deviceLevel] = deviceName.match(/\d+$/g) || [];
     console.log("deviceLevel",deviceLevel)
     if(!deviceLevel) return false;
     const [letter] = deviceName.match(/\w\d+$/g) || [];
     console.log("letter",letter);

     const value = (!!letter) && letter[0].toUpperCase() == 'S' ? '-' + deviceLevel : deviceLevel;
     console.log(value)
     return parseInt(floor) == parseInt(value);
   }
    `;
}
