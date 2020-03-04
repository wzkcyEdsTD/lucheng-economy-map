import { getDefaultAxios } from "@/api/index.js";
/**
 * [u_streetdata]街镇(园区)基本信息
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
          name: "u_streetdata"
        }
      ],
      cols: [
        { name: "id", raw: "a.id" },
        { name: "name", raw: "a.name", keyflag: 1 },
        { name: "year", raw: "a.year" },
        { name: "month", raw: "a.month" },
        { name: "gsgy", raw: "a.gsgy" },
        { name: "gsgy_rise", raw: "a.gsgy_rise" },
        { name: "xetz", raw: "a.xetz" },
        { name: "xetz_rate", raw: "a.xetz_rate" },
        { name: "xegytz", raw: "a.xegytz" },
        { name: "xegytz_rate", raw: "a.xegytz_rate" },
        { name: "xsylfw", raw: "a.xsylfw" },
        { name: "xsylfw_rise", raw: "a.xsylfw_rise" },
        { name: "xsplzc", raw: "a.xsplzc" },
        { name: "xsplzc_rise", raw: "a.xsplzc_rise" },
        { name: "xsxfp", raw: "a.xsxfp" },
        { name: "xsxfp_rise", raw: "a.xsxfp_rise" },
        { name: "pch", raw: "a.pch" }
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
