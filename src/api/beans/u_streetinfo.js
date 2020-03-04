import { getDefaultAxios } from "@/api/index.js";
/**
 * [u_streetinfo]街镇(园区)基本信息
 * @param {*} _option
 */
async function ds(_option = {}) {
  const axios = getDefaultAxios();
  const option = {
    module: "dwbean",
    action: "001",
    res: "testsql_all",
    count: 30,
    ds: {
      buffers: [],
      tables: [
        {
          alias: "a",
          orm: "name",
          name:
            "(select b.*,c.name as project,c.zydmj,c.zjztl,c.ztz,c.jgsj,c.nss,c.jj,c.image1,c.image2 from u_streetinfo as b left join u_zdxm as c on b.name = c.ssjd)"
        }
      ],
      cols: [
        { name: "id", raw: "a.id" },
        { name: "name", raw: "a.name", keyflag: 1 },
        { name: "area", raw: "a.area" },
        { name: "hjs", raw: "a.hjs" },
        { name: "census", raw: "a.census" },
        { name: "communities", raw: "a.communities" },
        { name: "companies", raw: "a.companies" },
        { name: "gsqys", raw: "a.gsqys" },
        { name: "intro", raw: "a.intro" },
        { name: "pointx", raw: "a.pointx" },
        { name: "pointy", raw: "a.pointy" },
        { name: "pch", raw: "a.pch" },
        { name: "project", raw: "a.project" },
        { name: "zydmj", raw: "a.zydmj" },
        { name: "zjztl", raw: "a.zjztl" },
        { name: "ztz", raw: "a.ztz" },
        { name: "jgsj", raw: "a.jgsj" },
        { name: "nss", raw: "a.nss" },
        { name: "jj", raw: "a.jj" },
        { name: "image1", raw: "a.image1" },
        { name: "image2", raw: "a.image2" }
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
