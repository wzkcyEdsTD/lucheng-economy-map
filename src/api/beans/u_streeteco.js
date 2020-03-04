import {
  getDefaultAxios
} from "@/api/index.js";
/**
 * [u_streeteco]街镇(园区)经济数据情况表
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
        name: "u_streeteco"
      }],
      cols: [{
          name: "name",
          raw: "a.name",
          keyflag: 1
        },
        {
          name: "year",
          raw: "a.year"
        },
        {
          name: "month",
          raw: "a.month"
        },
        {
          name: "gsgy",
          raw: "a.gsgy"
        },
        {
          name: "xsplzc",
          raw: "a.xsplzc"
        },
        {
          name: "xsxfp",
          raw: "a.xsxfp"
        }
      ],
      module: "testsql_all",
      where: "",
      wherejson: "",
      linkwhere: "",
      order: "year desc, month desc, name desc",
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