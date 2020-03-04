import { getDefaultAxios } from "@/api/index.js";
/**
 * [u_lcgf]楼宇旅游
 * @param {*} _option
 */
async function ds(_option = {}) {
  const axios = getDefaultAxios();
  const option = {
    module: "dwbean",
    action: "001",
    count: 100,
    res: "testsql_all",
    ds: {
      buffers: [],
      tables: [
        {
          alias: "a",
          orm: "name",
          name: "u_lvyou"
        }
      ],
      cols: [
        { name: "name", raw: "a.name", keyflag: 1 },
        { name: "type", raw: "a.type" },
        { name: "jj", raw: "a.jj" }
      ],
      module: "testsql_all",
      where: "",
      wherejson: "",
      linkwhere: "",
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
