import { loadModules } from "esri-loader";
import {
  OPTION,
  WRT_config,
  FINEMODEL,
  LIGHTBAR,
  LYZS,
  LYHX,
  BUILD_POLYGON,
} from "@/components/common/Tmap";
const { server } = WRT_config;

export function createPicutureMap(context) {
  loadModules(["esri/layers/SceneLayer", "dojo/domReady!"], OPTION).then(
    ([SceneLayer]) => {
      const lightbar = new SceneLayer({
        url: LIGHTBAR,
        id: "lightbar",
      });
      context.map.add(lightbar);
      //精細三維
      const mx = new SceneLayer({
        url:
          "http://172.20.83.212/server/rest/services/Hosted/MAX_c100_5/SceneServer",
        id: "mx",
      });
      context.map.add(mx);
      const mx1 = new SceneLayer({
        url:
          "http://172.20.83.212/server/rest/services/Hosted/c600_1100_40_30/SceneServer",
        id: "mx1",
      });
      context.map.add(mx1);
    }
  );
}
export function createUnusedMap(context) {
  //引入依赖
  loadModules(["esri/layers/FeatureLayer", "dojo/domReady!"], OPTION).then(
    ([FeatureLayer]) => {
      const buildingsLayer1 = new FeatureLayer({
        url: LYHX + "/1",
        id: "buildingsLayer1",
        renderer: {
          type: "unique-value",
          defaultSymbol: {
            type: "polygon-3d",
            symbolLayers: [
              {
                type: "extrude",
                material: {
                  color: "rgb(60,179,113)",
                },
              },
            ],
          },
          visualVariables: [
            {
              type: "size",
              field: "e6",
              valueUnit: "meters",
            },
          ],
        },
        outFields: "*",
        definitionExpression: "XZL < 0.3",
      });
      const buildingsLayer2 = new FeatureLayer({
        url: LYHX + "/1",
        id: "buildingsLayer2",
        renderer: {
          type: "unique-value",
          defaultSymbol: {
            type: "polygon-3d",
            symbolLayers: [
              {
                type: "extrude",
                material: {
                  color: "rgb(255,215,0)",
                },
              },
            ],
          },
          visualVariables: [
            {
              type: "size",
              field: "e6",
              valueUnit: "meters",
            },
          ],
        },
        outFields: ["*"],
        definitionExpression:
          "(XZL >= 0.3 AND XZL < 0.99) or (XZL >= 0.99 and ID not in (57,58))",
      });
      const buildingsLayer3 = new FeatureLayer({
        url: LYHX + "/1",
        id: "buildingsLayer3",
        renderer: {
          type: "unique-value",
          defaultSymbol: {
            type: "polygon-3d",
            symbolLayers: [
              {
                type: "extrude",
                material: {
                  color: "rgb(255,99,71)",
                },
              },
            ],
          },
          visualVariables: [
            {
              type: "size",
              field: "e6",
              valueUnit: "meters",
            },
          ],
        },
        outFields: ["*"],
        definitionExpression: "XZL >= 0.99 and ID in (57,58)",
      });
      context.map.add(buildingsLayer1);
      context.map.add(buildingsLayer2);
      context.map.add(buildingsLayer3);

      const baseRenderer = {
        type: "unique-value",
        defaultSymbol: {
          type: "polygon-3d",
          symbolLayers: [
            {
              type: "extrude",
              // material: {
              // color: "rgba(162, 169, 183, 1)"
              // },
              // edges: {
              //   type: "solid",
              //   color: "#4d5b18",
              //   size: 1
              // }
            },
          ],
        },
        visualVariables: [
          {
            type: "size",
            field: "e3",
            valueUnit: "meters",
          },
          {
            type: "color",
            field: "e3",
            stops: [
              {
                value: 3,
                color: "#244572",
              },
              {
                value: 200,
                color: "#3668a5",
              },
            ],
          },
        ],
      };

      const baseBuildings1 = new FeatureLayer({
        url: BUILD_POLYGON + "/0",
        id: "baseBuildings1",
        renderer: baseRenderer,
        outFields: ["e3"],
      });

      const baseBuildings2 = new FeatureLayer({
        url: BUILD_POLYGON + "/1",
        id: "baseBuildings2",
        renderer: baseRenderer,
        outFields: ["e3"],
      });

      const baseBuildings3 = new FeatureLayer({
        url: BUILD_POLYGON + "/2",
        id: "baseBuildings3",
        renderer: baseRenderer,
        outFields: ["e3"],
      });
      context.map.add(baseBuildings1);
      context.map.add(baseBuildings2);
      context.map.add(baseBuildings3);
    }
  );
}
// 添加标注
export function addUnused(context) {
  loadModules(
    [
      "esri/tasks/QueryTask",
      "esri/tasks/support/Query",
      "esri/layers/GraphicsLayer",
      "esri/Graphic",
    ],
    OPTION
  ).then(([QueryTask, Query, GraphicsLayer, Graphic]) => {
    const queryTask = new QueryTask({
      url: LYZS + "/5",
    });
    const query = new Query();
    query.outFields = ["*"];
    query.where = "1=1";
    query.returnGeometry = true;
    queryTask.execute(query).then(response => {
      // 结果不为空，则叠加企业面
      if (response.features.length) {
        const graphicsLayerUnused = new GraphicsLayer({
          id: "graphicsLayerUnused",
        });
        context.map.add(graphicsLayerUnused);
        for (var i = 0; i < response.features.length; i++) {
          var item = response.features[i];
          // 点、柱高度
          const z = item.attributes.floor * 5 + 80;
          graphicsLayerUnused.add(
            new Graphic({
              geometry: {
                type: "point",
                x: item.geometry.x,
                y: item.geometry.y,
                z,
              },
              symbol: {
                type: "picture-marker",
                url: `${server}/icon/unusedIcon/v2/${item.attributes["固定id"]}.png`,
                width: "110px",
                yoffset: 6,
              },
            })
          );
        }
      }
    });
  });
}
export function addSymbol(context) {
  loadModules(
    [
      "esri/tasks/QueryTask",
      "esri/tasks/support/Query",
      "esri/layers/GraphicsLayer",
      "esri/Graphic",
    ],
    OPTION
  ).then(([QueryTask, Query, GraphicsLayer, Graphic]) => {
    const queryTask = new QueryTask({
      url: LYZS + "/5",
    });
    const query = new Query();
    query.outFields = ["*"];
    query.where = "1=1";
    query.returnGeometry = true;
    queryTask.execute(query).then(response => {
      // 结果不为空，则叠加企业面
      if (response.features.length) {
        const graphicsLayerPic = new GraphicsLayer({
          id: "graphicsLayerPic",
        });
        context.map.add(graphicsLayerPic);
        for (var i = 0; i < response.features.length; i++) {
          var item = response.features[i];
          // 点、柱高度
          let z = item.attributes.floor * 4 + 20;
          const yylName = item.attributes.NAME;
          context.yyl.map(item => {
            if (item === yylName) {
              z = z * 1.85 + 20;
            }
          });
          const point = {
            type: "point",
            x: item.geometry.x,
            y: item.geometry.y,
            z,
          };
          const markerSymbol = {
            type: "picture-marker",
            url: `${server}/icon/unusedIcon/locationyellow.png`,
            width: "40px",
            height: "40px",
          };
          const pointGraphic = new Graphic({
            geometry: point,
            symbol: markerSymbol,
          });
          graphicsLayerPic.add(pointGraphic);
          var unusedLevel = "normal";
          const textPoint = {
            type: "point",
            x: item.geometry.x,
            y: item.geometry.y,
            z: z + 50,
          };
          const textGraphic = new Graphic({
            geometry: textPoint,
            symbol: {
              type: "text",
              color: "#FFFFFF",
              haloColor: "black",
              haloSize: "1px",
              text: item.attributes.NAME,
              font: {
                size: 12,
                family: "Josefin Slab",
                weight: "bold",
              },
            },
          });
          graphicsLayerPic.add(textGraphic);
        }
      }
    });
  });
}
// export default {addSymbol,addUnused}
