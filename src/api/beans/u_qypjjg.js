import { getDefaultAxios } from "@/api/index.js";
/**
 * [u_qypjjg]规上规下企业评价结果
 * @param {*} _option
 */
async function ds(_option = {}) {
  const axios = getDefaultAxios();
  const option = {
    module: "dwbean",
    action: "001",
    count: 1000,
    res: "testsql_all",
    ds: {
      buffers: [],
      tables: [
        {
          alias: "a",
          orm: "",
          name: name || "u_qypjjg",
          updateflag: 1
        }
      ],
      cols: [
        { name: "id", raw: "a.id" },
        { name: "uuid", raw: "a.uuid", keyflag: 1 },
        { name: "name", raw: "a.name" },
        { name: "ssjd", raw: "a.ssjd" },
        { name: "hydm", raw: "a.hydm" },
        { name: "hy", raw: "a.hy" },
        { name: "dc", raw: "a.dc" },
        { name: "tag", raw: "a.tag" },
        { name: "bz", raw: "a.bz" },
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
