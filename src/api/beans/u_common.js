import { getDefaultAxios } from "@/api/index.js";
/**
 * 综合查询
 * @param {*} _option
 */
async function ds(_option = {}) {
  const axios = getDefaultAxios();
  const option = {
    module: "dwbean",
    action: "001",
    res: "testsql_all",
    count: 100,
    ds: JSON.stringify({
      buffers: [],
      tables: [
        {
          alias: "a",
          orm: "",
          name:
            "(select b.name,b.uuid,'CYBJ' as url,'hyd' as id,'3' as rank from u_qyzc as b union select d.name,d.jj,'JJTS' as url,'zdxm' as id,'1' as rank from u_zdxm as d union select e.name,e.gdid,'JJTS' as url,'zdly' as id,'1' as rank from u_lyxx as e union select f.name,f.uuid,'JJTS' as url,'zysc' as id,'1' as rank from u_zyscxxb as f  union select h.xmmc,h.mj,'DKHX' as url,'yzdc' as id,'2' as rank from u_ydyzdc as h union select i.ydkmc,i.mj,'DKHX' as url,'kgdk' as id,'2' as rank from u_ydkgdk as i union select j.xmmc,j.ydmj,'ZSZY' as url,'zsdk' as id,'1' as rank from u_zsdkm as j union select h.name,h.jj,'CYBJ' as url,'bdpt' as id,'1' as rank from u_cypt as h )"
        }
      ],
      cols: [
        { name: "name", raw: "a.name", keyflag: 1 },
        { name: "uuid", raw: "a.uuid" },
        { name: "url", raw: "a.url" },
        { name: "id", raw: "a.id" },
        { name: "rank", raw: "a.rank" }
      ],
      module: "testsql_all",
      where: "",
      wherejson: "",
      linkwhere: "",
      order: "rank",
      groupby: "",
      having: "",
      distinct: false,
      rowlimit: 0,
      childs: [],
      page: {},
      params: [],
      control: {},
      ..._option
    })
  };
  return await axios.post("/dw/ds", option);
}
async function dmdz(_option = {}) {
  const axios = getDefaultAxios();
  const option = {
    module: "dwbean",
    action: "001",
    res: "testsql_all",
    count: 100,
    ds: JSON.stringify({
      buffers: [],
      tables: [
        {
          alias: "a",
          orm: "",
          name:
            "(select b.name,b.x,b.y,'0' as url,'4' as rank from u_lcpoi as b union select c.name,c.x,c.y,'0' as url,'5' as rank from u_lcaddress as c)"
        }
      ],
      cols: [
        { name: "name", raw: "a.name", keyflag: 1 },
        { name: "x", raw: "a.x" },
        { name: "y", raw: "a.y" },
        { name: "url", raw: "a.url" },
        { name: "rank", raw: "a.rank" }
      ],
      module: "testsql_all",
      where: "",
      wherejson: "",
      linkwhere: "",
      order: "rank",
      groupby: "",
      having: "",
      distinct: false,
      rowlimit: 0,
      childs: [],
      page: {},
      params: [],
      control: {},
      ..._option
    })
  };
  return await axios.post("/dw/ds", option);
}
async function CommonfromCanvass(_option = {}) {
  const axios = getDefaultAxios();
  const option = {
    module: "dwbean",
    action: "001",
    res: "testsql_all",
    count: 100,
    ds: JSON.stringify({
      buffers: [],
      tables: [
        {
          alias: "a",
          orm: "",
          name:
            "( select d.name,d.jj,'JJTS' as url,'zdxm' as id,'1' as rank from u_zdxm as d union select e.name,e.gdid,'JJTS' as url,'zdly' as id,'1' as rank from u_lyxx as e union select f.name,f.uuid,'JJTS' as url,'zysc' as id,'1' as rank from u_zyscxxb as f  union select h.xmmc,h.mj,'DKHX' as url,'yzdc' as id,'2' as rank from u_ydyzdc as h union select i.ydkmc,i.mj,'DKHX' as url,'kgdk' as id,'2' as rank from u_ydkgdk as i union select j.xmmc,j.ydmj,'ZSZY' as url,'zsdk' as id,'1' as rank from u_zsdkm as j union select h.name,h.jj,'CYBJ' as url,'bdpt' as id,'1' as rank from u_cypt as h )"
        }
      ],
      cols: [
        { name: "name", raw: "a.name", keyflag: 1 },
        { name: "jj", raw: "a.jj" },
        { name: "url", raw: "a.url" },
        { name: "id", raw: "a.id" },
        { name: "rank", raw: "a.rank" }
      ],
      module: "testsql_all",
      where: "",
      wherejson: "",
      linkwhere: "",
      order: "rank",
      groupby: "",
      having: "",
      distinct: false,
      rowlimit: 0,
      childs: [],
      page: {},
      params: [],
      control: {},
      ..._option
    })
  };
  return await axios.post("/dw/ds", option);
}
const api = {
  ds,
  dmdz,
  CommonfromCanvass
};

export default api;
