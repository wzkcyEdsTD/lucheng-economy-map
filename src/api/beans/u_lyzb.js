import { getDefaultAxios } from "@/api/index.js";
/**
 * [u_canvass]招商项目
 * @param {*} _option
 */
async function ds(_option = {}) {
  const axios = getDefaultAxios();
  const option = {
    module: "dwbean",
    action: "001",
    res: "testsql_all",
    ds: {
      buffers: [],
      tables: [
        {
          alias: "a",
          orm: "name",
          name: "u_lyzb"
        }
      ],
      cols: [
        { name: "radius", raw: "a.radius" },
        { name: "sport", raw: "a.sport" },
        { name: "food", raw: "a.food" },
        { name: "hotel", raw: "a.hotel" },
        { name: "stop", raw: "a.stop" },
        { name: "parkcar", raw: "a.parkcar" },
        { name: "bank", raw: "a.bank" },
        { name: "mall", raw: "a.mall" },
        { name: "community", raw: "a.community" },
        { name: "building", raw: "a.building" },
        { name: "hospital", raw: "a.hospital" },
        { name: "school", raw: "a.school" },
        { name: "gas", raw: "a.gas" },
        { name: "park", raw: "a.park" }
      ],
      module: "testsql_all",
      where: "",
      wherejson: "",
      linkwhere: "",
      order: "",
      groupby: "",
      having: "",
      distinct: false,
      rowlimit: 0,
      childs: [],
      page: {},
      params: [],
      control: {},
      ..._option
    }
  };
  return await axios.post("/dw/ds", option);
}

const api = {
  ds
};

export default api;
