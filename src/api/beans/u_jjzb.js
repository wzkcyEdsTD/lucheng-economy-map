import { getDefaultAxios } from "@/api/index.js";
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
      tables: [
        {
          alias: "a",
          orm: "name",
          name: "u_jjzb"
        }
      ],
      cols: [
        { name: "zblb", raw: "a.zblb", keyflag: 1 },
        { name: "zbz", raw: "a.zbz" },
        { name: "zbzlx", raw: "a.zbzlx" },
        { name: "year", raw: "a.year" },
        { name: "season", raw: "a.season" }
      ],
      module: "testsql_all",
      where: "",
      wherejson: "",
      linkwhere: "",
      order: "year asc, season asc",
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
