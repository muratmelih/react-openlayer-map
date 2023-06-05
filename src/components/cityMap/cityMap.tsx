import React, { useEffect, useRef, useState } from "react";
import "./cityMap.scss";
import Map from "ol/Map.js";
import TileLayer from "ol/layer/Tile.js";
import WMTSSource from "ol/source/WMTS";
import View from "ol/View.js";
import WMTSTileGrid from "ol/tilegrid/WMTS.js";
import Projection from "ol/proj/Projection";
import { getTopLeft } from "ol/extent.js";
import { register } from "ol/proj/proj4.js";
import { fromLonLat } from "ol/proj";
import proj4 from "proj4";
import { createStringXY } from "ol/coordinate.js";
import { defaults as defaultControls } from "ol/control.js";
import MousePosition from "ol/control/MousePosition.js";
import wetlandsLayer from "../../map-layers/protected-areas-wetlands";
import LayerChangeCheckbox from "../layer-change-checkbox/layer-change-checkbox";
import loading from "/assets/loading.gif";

function CityMap() {
  const ref = useRef<HTMLDivElement>(null);
  const mousePosRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const BRTA_ATTRIBUTION = "NL Map";
  const [loaderClass, setLoaderClass] = useState('visible')

  proj4.defs(
    "EPSG:28992",
    "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs"
  );
  register(proj4);
  const rdProjection = new Projection({
    code: "EPSG:28992",
    extent: [-285401.92, 22598.08, 595401.92, 903401.92],
  });

  const resolutions = [
    3440.64, 1720.32, 860.16, 430.08, 215.04, 107.52, 53.76, 26.88, 13.44, 6.72,
    3.36, 1.68, 0.84, 0.42, 0.21,
  ];
  const matrixIds = new Array(15);
  for (var i = 0; i < 15; ++i) {
    matrixIds[i] = i;
  }

  useEffect(() => {
    if (ref.current && !mapRef.current) {
      wetlandsLayer.getSource()?.on(["featuresloadend"], function () {
        setLoaderClass('hidden');
      });
      const mousePositionControl = new MousePosition({
        coordinateFormat: createStringXY(4),
        projection: "EPSG:4326",
        className: "mouse-position-wrapper",
        target: mousePosRef.current as any,
      });
      mapRef.current = new Map({
        target: ref.current,
        controls: defaultControls().extend([mousePositionControl]),
        layers: [
          new TileLayer<any>({
            // @ts-ignore
            type: "base",
            title: `standaard WMTS`,
            opacity: 1,
            // @ts-ignore
            extent: rdProjection.extent,
            source: new WMTSSource({
              url: "https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0",
              crossOrigin: "Anonymous",
              layer: "standaard",
              matrixSet: "EPSG:28992",
              format: "image/png",
              attributions: BRTA_ATTRIBUTION,
              projection: rdProjection,
              tileGrid: new WMTSTileGrid({
                origin: getTopLeft(rdProjection.getExtent()),
                resolutions: resolutions,
                matrixIds: matrixIds,
              }),
              style: "default",
            }),
          }),
          wetlandsLayer,
        ],
        view: new View({
          center: fromLonLat([5.43, 52.18]),
          zoom: 7,
        }),
      });
    }
  }, [ref, mapRef]);

  const changeLayerVisibility = (value: boolean, layerClassName: string) => {
    const layer = mapRef.current
      ?.getLayers()
      .getArray()
      .find((layer) => layer.getClassName() === layerClassName);
    if (value) {
      layer?.setOpacity(1);
    } else {
      layer?.setOpacity(0);
    }
  };

  return (
    <>
      <div className={`loader ${loaderClass}`}>
        <img src={'/assets/loading.gif'} alt='map-loading'/>
      </div>
      <div ref={ref} className="city-map"></div>
      <div className="input-container">
        <LayerChangeCheckbox
          label={"Protected Areas - Wetlands"}
          layerClassName={"wetlands-layer"}
          changeLayerVisiblity={changeLayerVisibility}
        />
        <p>Mouse Coordinates:</p>
        <div ref={mousePosRef} className="mouse-position-wrapper"></div>
      </div>
    </>
  );
}

export default CityMap;
