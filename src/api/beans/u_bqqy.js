import { getDefaultAxios } from "@/api/index.js";
/**
 * [u_bqqy]百强企业
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
            alias: "f",
            orm: "",
            name: "(select a.name as name,a.ssjd as ssjd,a.jj as jj,'3' as type,'专业市场' as param from u_zyscxxb as a union select b.name as name,b.ssjd as ssjd,b.jj as jj,'0' as type,'产业平台' as param from u_cypt as b union select c.name as name,c.duty as duty,c.buildtype as buildtype,'1' as type,'重点项目' as param  from u_zdcyxmb as c union select d.name as name,d.ssjd as ssjd,d.address as address,'2' as type,'优质楼宇' as param from u_lyxx as d union select e.name as name,e.ename as ename,e.image as image,'4' as type,'招商地块' as param from u_canvass as e union select g.name as name,g.uuid as uuid,g.pm as pm,'5' as type,'市百强企业' as param from u_bqqy as g)",
            updateflag: 1
          }
        ],
        cols: [
          { name: "name", raw: "f.name", keyflag: 1 },
          { name: "ssjd", raw: "f.ssjd" },
          { name: "jj", raw: "f.jj" },
          { name: "type", raw: "f.type" },
          { name: "param", raw: "f.param" }
        ],
        module: "testsql_all",
        where: "",
        wherejson: "",
        linkwhere: "",
        order: "type",
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
