import { getDefaultAxios } from "@/api/index.js";
/**
 * [u_zsscxq]招商手册信息
 * @param {*} _option
 */
async function ds(_option = {}) {
  const axios = getDefaultAxios();
  const option = {
    module: "dwbean",
    action: "001",
    count: 200,
    res: "testsql_all",
    ds: {
      buffers: [],
      tables: [
        {
          alias: "f",
          orm: "",
          name: "(select xmmc ,xmyw ,ml ,mlyw ,nr,pid,fgld,fgdh,ksfzr,ksdh  from(select distinct b.xmmc,b.xmyw,b.ml,b.mlyw,b.nr,b.pid ,c.ssjd from u_zsscxq as b,u_canvass as c where b.pid = c.pid ) as a left join u_zslxr as d on a.ssjd = d.dw)",
          updateflag: 1
        }
      ],
      cols: [
        { name: "xmmc", raw: "f.xmmc", keyflag: 1 },
        { name: "xmyw", raw: "f.xmyw" },
        { name: "ml", raw: "f.ml" },
        { name: "mlyw", raw: "f.mlyw" },
        { name: "nr", raw: "f.nr" },
        { name: "pid", raw: "f.pid" },
        { name: "fgld", raw: "f.fgld" },
        { name: "fgdh", raw: "f.fgdh" },
        { name: "ksfzr", raw: "f.ksfzr" },
        { name: "ksdh", raw: "f.ksdh" }
      ],
      module: "testsql_all",
      where: "",
      wherejson: "",
      linkwhere: "",
      order: "ml asc",
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
