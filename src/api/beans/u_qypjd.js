import { getDefaultAxios } from "@/api/index.js";
/**
 * [u_qypjd]鹿城在册数据参评企业点
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
          orm: "",
          name: `(select b.* from u_qypjd as b inner join u_qyzc as c on b.uuid = c.uuid)`,
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
        { name: "mc", raw: "a.mc" },
        { name: "x", raw: "a.x" },
        { name: "y", raw: "a.y" },
        { name: "cy", raw: "a.cy" },
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
