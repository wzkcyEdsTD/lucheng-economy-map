import { getDefaultAxios } from "@/api/index.js";
/**
 * [u_qynb]鹿城企业年报，用地信息评价
 * @param {*} _option
 */
async function ds(_option = {}) {
  const axios = getDefaultAxios();
  const option = {
    module: "dwbean",
    action: "001",
    count: 30,
    res: "testsql_all",
    ds: {
      buffers: [],
      tables: [
        {
          alias: "a",
          orm: "",
          name: `u_qynb`,
          updateflag: 1
        }
      ],
      cols: [
        { name: "uuid", raw: "a.uuid", keyflag: 1 },
        { name: "name", raw: "a.name" },
        { name: "jly", raw: "a.jly" },
        { name: "fzze", raw: "a.fzze" },
        { name: "lrze", raw: "a.lrze" },
        { name: "nsre", raw: "a.nsre" },
        { name: "yyzk", raw: "a.yyzk" },
        { name: "xssr", raw: "a.xssr" },
        { name: "zyywsr", raw: "a.zyywsr" },
        { name: "zcze", raw: "a.zcze" },
        { name: "nbnd", raw: "a.nbnd" }
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
async function pjzb(_option = {}) {
  const axios = getDefaultAxios();
  const option = {
    module: "dwbean",
    action: "001",
    count: 30,
    res: "testsql_all",
    ds: {
      buffers: [],
      tables: [
        {
          alias: "a",
          orm: "",
          name: `u_ydpjb`,
          updateflag: 1
        }
      ],
      cols: [
        { name: "uuid", raw: "a.uuid", keyflag: 1 },
        { name: "name", raw: "a.name" },
        { name: "mjss", raw: "a.mjss" },
        { name: "dc", raw: "a.dc" }
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
async function pjzb_count(_option = {}) {
  const axios = getDefaultAxios();
  const option = {
    module: "dwbean",
    action: "001",
    count: 30,
    res: "testsql_all",
    ds: {
      buffers: [],
      tables: [
        {
          alias: "a",
          orm: "",
          name: `u_ydpjb`,
          updateflag: 1
        }
      ],
      cols: [
        { name: "lx", raw: "a.lx" },
        { name: "sumNum", raw: "count(lx)" }
      ],
      module: "testsql_all",
      where: "",
      wherejson: "",
      linkwhere: "",
      order: "",
      groupby: "a.lx",
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
async function pjzb_xyfx(_option = {}) {
  const axios = getDefaultAxios();
  const option = {
    module: "dwbean",
    action: "001",
    count: 30,
    res: "testsql_all",
    ds: {
      buffers: [],
      tables: [
        {
          alias: "a",
          orm: "",
          name: `(SELECT name,case when  CAST(mjss AS DECIMAL(9,4)) < 5.0 then '待提高'when (CAST(mjss AS DECIMAL(9,4)) >= 5.0  and CAST(mjss AS DECIMAL(9,4)) < 15.0) then '一般' when (CAST(mjss AS DECIMAL(9,4)) >= 15.0  and CAST(mjss AS DECIMAL(9,4)) < 30.0) then '良好' when (CAST(mjss AS DECIMAL(9,4)) >= 30.0  and CAST(mjss AS DECIMAL(9,4)) < 100.0)  then '优秀' when CAST(mjss AS DECIMAL(9,4)) >= 100.0 then '极优' end as kind from u_ydpjb )`,
          updateflag: 1
        }
      ],
      cols: [
        { name: "jia", raw: "count(a.name)" },
        { name: "kind", raw: "a.kind" }
      ],
      module: "testsql_all",
      where: "",
      wherejson: "",
      linkwhere: "",
      order: "",
      groupby: "a.kind",
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
async function pjzb_sspm(_option = {}) {
  const axios = getDefaultAxios();
  const option = {
    module: "dwbean",
    action: "001",
    count: 30,
    res: "testsql_all",
    ds: {
      buffers: [],
      tables: [
        {
          alias: "a",
          orm: "",
          name: `u_ydpjb`,
          updateflag: 1
        }
      ],
      cols: [
        { name: "ssjd", raw: "a.ssjd" },
        { name: "mjss", raw: "sum(CAST(mjss AS DECIMAL(9,4)))" },
        { name: "qysl", raw: "count(name)" }
      ],
      module: "testsql_all",
      where: "",
      wherejson: "",
      linkwhere: "",
      order: "mjss desc",
      groupby: "a.ssjd",
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
async function pjzb_hysl(_option = {}) {
  const axios = getDefaultAxios();
  const option = {
    module: "dwbean",
    action: "001",
    count: 30,
    res: "testsql_all",
    ds: {
      buffers: [],
      tables: [
        {
          alias: "a",
          orm: "",
          name: `u_ydpjb`,
          updateflag: 1
        }
      ],
      cols: [
        { name: "hylx", raw: "a.hylx" },
        { name: "sumNum", raw: "count(hylx)" }
      ],
      module: "testsql_all",
      where: "",
      wherejson: "",
      linkwhere: "",
      order: "",
      groupby: "a.hylx",
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
async function pjzb_pjjg(_option = {}) {
  const axios = getDefaultAxios();
  const option = {
    module: "dwbean",
    action: "001",
    count: 30,
    res: "testsql_all",
    ds: {
      buffers: [],
      tables: [
        {
          alias: "a",
          orm: "",
          name: `u_ydpjb`,
          updateflag: 1
        }
      ],
      cols: [
        { name: "ssjd", raw: "a.ssjd" },
        { name: "dc", raw: "a.dc" },
        { name: "sumNum", raw: "count(dc)" }
      ],
      module: "testsql_all",
      where: "",
      wherejson: "",
      linkwhere: "",
      order: "a.ssjd",
      groupby: "a.dc,a.ssjd",
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
async function ydxx({ uuid }) {
  const axios = getDefaultAxios();
  const option = {
    module: "dwbean",
    action: "001",
    count: 30,
    res: "testsql_all",
    ds: {
      buffers: [],
      tables: [
        {
          alias: "a",
          orm: "",
          name: `(select '0' as type,b.name as czqy,b.zyydarea as zydarear from u_ydpjb as b  where b.uuid = '${uuid}' union select '1' as type,c.czqy as czqy,c.zyydarea as zyydarea from u_qyczb as c where c.uuid = '${uuid}')`
        }
      ],
      cols: [
        { name: "type", raw: "a.type" },
        { name: "czqy", raw: "a.czqy" },
        { name: "zydarear", raw: "a.zydarear" }
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
      control: {}
    }
  };
  return await axios.post("/dw/ds", option);
}
const api = {
  ds,
  pjzb,
  pjzb_count,
  pjzb_xyfx,
  pjzb_sspm,
  pjzb_hysl,
  pjzb_pjjg,
  ydxx
};

export default api;
