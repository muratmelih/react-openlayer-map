import GeoJSON from "ol/format/GeoJSON.js";
import VectorSource from "ol/source/Vector.js";
import { Vector as VectorLayer } from "ol/layer.js";
import { bbox as bboxStrategy } from "ol/loadingstrategy.js";

const wetlandsLayerSource = new VectorSource({
  format: new GeoJSON(),
  url: function (extent) {
    return (
      "https://service.pdok.nl/rvo/beschermdegebieden/wetlands/wfs/v1_0?" +
      "service=WFS&" +
      "request=GetFeature&" +
      "VERSION=2.0.0&" +
      "typeNames=beschermdegebieden:protectedsite&" +
      "outputFormat=application/json"
    );
  },
  strategy: bboxStrategy,
});

const wetlandsLayer = new VectorLayer({
  source: wetlandsLayerSource,
  className: "wetlands-layer",
  style: {
    "stroke-width": 0.75,
    "stroke-color": "white",
    "fill-color": "rgba(100,100,100,0.7)",
  },
});
export default wetlandsLayer;
