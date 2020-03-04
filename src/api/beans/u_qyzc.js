import { getDefaultAxios } from "@/api/index.js";
/**
 * [u_qyzc]企业在册数据
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
          name:
            "(select b.*,c.qylb,c.blxx,c.sxxx,c.qtxx,c.hmd from u_qyzc as b left join u_gsxyb as c on b.uuid = c.uuid)",
          updateflag: 1
        }
      ],
      cols: [
        //  u_qyzc
        { name: "uuid", raw: "a.uuid", keyflag: 1 },
        { name: "name", raw: "a.name" },
        { name: "id", raw: "a.id" },
        { name: "fddbr", raw: "a.fddbr" },
        { name: "startdate", raw: "a.startdate" },
        { name: "djjg", raw: "a.djjg" },
        { name: "qylx", raw: "a.qylx" },
        { name: "zczj", raw: "a.zczj" },
        { name: "yjfw", raw: "a.yjfw" },
        { name: "enddate", raw: "a.enddate" },
        { name: "address", raw: "a.address" },
        { name: "hydm", raw: "a.hydm" },
        //  u_gsxyb
        { name: "qylb", raw: "a.qylb" },
        { name: "blxx", raw: "a.blxx" },
        { name: "sxxx", raw: "a.sxxx" },
        { name: "qtxx", raw: "a.qtxx" },
        { name: "hmd", raw: "a.hmd" },
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
