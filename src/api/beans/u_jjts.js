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
          name:
            "(select a.name as name,a.ssjd as ssjd,a.jj as jj,'1' as type,'3'as fw,'专业市场' as param from u_zyscxxb as a  union select c.name as name,c.duty as duty,c.buildtype as buildtype,'2' as type,'1'as fw,'重大产业项目' as param  from u_zdcyxmb as c union select d.name as name,d.ssjd as ssjd,d.address as address,'4' as type,'2' as fw,'优质楼宇' as param from u_lyxx as d union select e.name as name,e.ssjd as ssjd,e.address as address,'5' as type,'4' as fw,'招商地块' as param from u_canvass as e )",
          updateflag: 1
        }
      ],
      cols: [
        { name: "name", raw: "f.name", keyflag: 1 },
        { name: "ssjd", raw: "f.ssjd" },
        { name: "jj", raw: "f.jj" },
        { name: "type", raw: "f.type" },
        { name: "fw", raw: "f.fw" },
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
async function TopCompany(_option = {}) {
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
          orm: "",
          name:"u_yzqyxx",
          updateflag: 1
        }
      ],
      cols: [
        { name: "uuid", raw: "a.uuid", keyflag: 1 },
        { name: "yzlx", raw: "a.yzlx" },
        { name: "xxqk1", raw: "a.xxqk1" },
        { name: "xxqk2", raw: "a.xxqk2" },
        { name: "qymc", raw: "a.qymc" }
      ],
      module: "testsql_all",
      where: "",
      wherejson: "",
      linkwhere: "",
      order: "",
      groupby: "xxqk1,xxqk2,yzlx,qymc,uuid",
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
  ds,TopCompany
};

export default api;
