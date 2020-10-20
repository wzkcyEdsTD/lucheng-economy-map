import {
  getDefaultAxios
} from "@/api/index.js";
/**
 * [u_jjzb]经济指标
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
      tables: [{
        alias: "a",
        orm: "name",
        name: "u_jjzb_new"
      }],
      cols: [{
          name: "id",
          raw: "a.id",
          keyflag: 1
        },
        {
          name: "year",
          raw: "a.year"
        },
        {
          name: "quarter",
          raw: "a.quarter"
        },
        {
          name: "value",
          raw: "a.value"
        },
        {
          name: "lb",
          raw: "a.lb"
        },
        {
          name: "lbdm",
          raw: "a.lbdm"
        },
        {
          name: "area_name",
          raw: "a.area_name"
        },
        {
          name: "area_code",
          raw: "a.area_code"
        }
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