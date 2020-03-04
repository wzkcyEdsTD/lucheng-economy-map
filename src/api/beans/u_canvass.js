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
          // name: "(select b.*,c.fgld,c.fgdh from u_canvass as b,u_zslxr as c where b.ssjd = c.dw)"
          name:"u_canvass"
        }
      ],
      cols: [
        { name: "id", raw: "a.id" },
        { name: "name", raw: "a.name", keyflag: 1 },
        { name: "ename", raw: "a.ename" },
        { name: "pid", raw: "a.pid" },
        { name: "x", raw: "a.x" },
        { name: "y", raw: "a.y" },
        { name: "image", raw: "a.image" },
        { name: "pch", raw: "a.pch" },
        // { name: "dw", raw: "a.dw" },
        // { name: "fgld", raw: "a.fgld" },
        // { name: "fgdh", raw: "a.fgdh" }
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

//招商地块面
async function zsdkm(_option = {}) {
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
          // name: "(select b.*,c.fgld,c.fgdh from u_canvass as b,u_zslxr as c where b.ssjd = c.dw)"
          name:"u_zsdkm"
        }
      ],
      cols: [
        { name: "id", raw: "a.id" },
        { name: "xmmc", raw: "a.xmmc", keyflag: 1 },
        { name: "ssjd", raw: "a.ssjd" },
        { name: "pid", raw: "a.pid" },
        { name: "x", raw: "a.x" },
        { name: "y", raw: "a.y" }
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
  ds,zsdkm
};

export default api;
