import { getDefaultAxios } from "@/api/index.js";
/**
 * [u_land]地块信息
 * @param {*} _option
 */
async function ds(_option = {}) {
  const axios = getDefaultAxios();
  const option = {
    module: "dwbean",
    action: "001",
    //count: 200,
    res: "testsql_all",
    ds: {
      buffers: [],
      tables: [
        {
          alias: "f",
          orm: "",
          name: `(select distinct a.ydxz as ydxz,a.lx as lx,a.mj as mj,a.xmmc as name,'0' as type from u_ydyzdc as a union select distinct c.ydxz as ydxz,c.lx as lx,c.mj as mj,c.ydkmc as name,'1' as type from u_ydkgdk as c)`,
          updateflag: 1
        }
      ],
      cols: [
        { name: "name", raw: "f.name", keyflag: 1 },
        { name: "mj", raw: "f.mj" },
        { name: "lx", raw: "f.lx" },
        { name: "type", raw: "f.type" },
        { name: "ydxz", raw: "f.ydxz" }
      ],
      module: "testsql_all",
      where: "",
      wherejson: "",
      linkwhere: "",
      order: "type asc",
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

async function yd(_option = {}) {
  const axios = getDefaultAxios();
  const option = {
    module: "dwbean",
    action: "001",
    //count: 200,
    res: "testsql_all",
    ds: {
      buffers: [],
      tables: [
        {
          alias: "a",
          orm: "",
          name: `u_yddk`,
          updateflag: 1
        }
      ],
      cols: [
        { name: "ydkmc", raw: "a.ydkmc", keyflag: 1 },
        { name: "dkzl", raw: "a.dkzl" },
        { name: "mj", raw: "a.mj" },
        { name: "lx", raw: "a.lx" },
        { name: "ydxz", raw: "a.ydxz" },
        { name: "ssjd", raw: "a.ssjd" },
        { name: "yddm", raw: "a.yddm" },
        { name: "bz", raw: "a.bz" }
      ],
      module: "testsql_all",
      where: "",
      wherejson: "",
      linkwhere: "",
      order: "lx asc",
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
  ds,
  yd
};

export default api;
