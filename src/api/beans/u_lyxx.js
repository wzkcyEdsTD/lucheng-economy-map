import { getDefaultAxios } from "@/api/index.js";
/**
 * [u_lyxx]楼宇信息
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
          name: "(select b.* ,c.gzzz,c.xm,c.lxfs from u_lyxx as b left join (select * from u_lylxr where gzzz = '招商员') as c  on b.gdid = c.gdid )"
        }
      ],
      cols: [
        { name: "name", raw: "a.name", keyflag: 1 },
        { name: "ssjd", raw: "a.ssjd" },
        { name: "yzdw", raw: "a.yzdw" },
        { name: "wygs", raw: "a.wygs" },
        { name: "cydw", raw: "a.cydw" },
        { name: "area", raw: "a.area" },
        { name: "rzqys", raw: "a.rzqys" },
        { name: "rzrate", raw: "a.rzrate" },
        { name: "ygs", raw: "a.ygs" },
        { name: "rent", raw: "a.rent" },
        { name: "wyrent", raw: "a.wyrent" },
        { name: "bz", raw: "a.bz" },
        { name: "gdid", raw: "a.gdid" },
        { name: "address", raw: "a.address" },
        { name: "xm", raw: "a.xm" },
        { name: "lxfs", raw: "a.lxfs" }
      ],
      module: "testsql_all",
      where: "",
      wherejson: "",
      linkwhere: "",
      order: "gdid asc",
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
