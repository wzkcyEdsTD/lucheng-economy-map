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
          name:"u_choosestyle"
        }
      ],
      cols: [
        { name: "id", raw: "a.id" ,keyflag: 1},
        { name: "userName", raw: "a.userName"},
        { name: "userDepart", raw: "a.userDepart" },
        { name: "chooseStyle", raw: "a.chooseStyle" },
        { name: "mapStyle", raw: "a.mapStyle" }
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
