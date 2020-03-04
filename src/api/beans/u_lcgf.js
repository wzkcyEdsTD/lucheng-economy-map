import { getDefaultAxios } from "@/api/index.js";
/**
 * [u_lcgf]楼宇公房
 * @param {*} _option
 */
async function ds(_option = {}) {
  const axios = getDefaultAxios();
  const option = {
    module: "dwbean",
    action: "001",
    count : 100,
    res: "testsql_all",
    ds: {
      buffers: [],
      tables: [
        {
          alias: "a",
          orm: "name",
          name: "u_lcgf"
        }
      ],
      cols: [
        { name: "dz", raw: "a.dz", keyflag: 1 },
        { name: "mj", raw: "a.mj" },
        { name: "qsdw", raw: "a.qsdw" },
        { name: "fwzt", raw: "a.fwzt" }
      ],
      module: "testsql_all",
      where: "",
      wherejson: "",
      linkwhere: "",
      order: "fwzt asc,mj desc",
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
