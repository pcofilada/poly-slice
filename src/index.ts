import {
  difference,
  featureCollection,
  lineIntersect,
  lineOffset,
  lineString,
  lineToPolygon,
  polygon,
} from "@turf/turf";
import {
  Feature,
  FeatureCollection,
  LineString,
  Point,
  Polygon,
  Position,
} from "geojson";

const findIntersections = (
  poly: Feature<Polygon>,
  line: Feature<LineString>
): FeatureCollection<Point> => {
  return lineIntersect(poly, line);
};

const constructLineOffsets = (
  line: Feature<LineString>
): Feature<LineString>[] => {
  const offsetWidth = 0.001;
  const offsetUnits = "kilometers";
  const startOffset = lineOffset(line, offsetWidth, { units: offsetUnits });
  const endOffset = lineOffset(line, -offsetWidth, { units: offsetUnits });

  return [startOffset, endOffset];
};

const constructCoordinates = (
  line: Feature<LineString>,
  lineOffsets: Feature<LineString>[],
  currentItem: number
): Position[] => {
  const coords = line.geometry.coordinates.map((c) => c);

  const reversed = lineOffsets[currentItem].geometry.coordinates
    .slice()
    .reverse()
    .map((c) => c);

  return [...coords, ...reversed, coords[0]];
};

const createNewPolygon = (coords: Position[]): Feature<Polygon> => {
  const newLinestring = lineString(coords);
  const newPolygon = lineToPolygon(newLinestring);

  return newPolygon as Feature<Polygon>;
};

const clipPolygon = (
  poly: Feature<Polygon>,
  newPolygon: Feature<Polygon>
): Feature<Polygon> => {
  return difference(featureCollection([poly, newPolygon])) as Feature<Polygon>;
};

const createNewGeometries = (
  clippedPolygon: Feature<Polygon>,
  lineOffsets: Feature<LineString>[],
  currentItem: number
): Position[][][] => {
  const selectedIndex = (currentItem + 1) % 2;
  const coords = clippedPolygon.geometry.coordinates;
  const geoms: Position[][][] = [];

  coords.forEach((coord) => {
    // @ts-ignore-next-line
    const newPolygon = polygon(coord);
    const intersection = lineIntersect(newPolygon, lineOffsets[selectedIndex]);

    if (intersection.features.length > 0) {
      geoms.push(newPolygon.geometry.coordinates);
    }
  });

  return geoms;
};

const createNewFeatures = (geometries: Position[][][]): Feature[] => {
  return geometries.map((geometry) => polygon(geometry));
};

const polySlice = (
  poly: Feature<Polygon>,
  line: Feature<LineString>
): Feature<Polygon>[] => {
  if (!poly || poly.type !== "Feature" || poly.geometry.type !== "Polygon") {
    throw new Error("Invalid polygon");
  }

  if (!line || line.type !== "Feature" || line.geometry.type !== "LineString") {
    throw new Error("Invalid linestring");
  }

  const intersectionPoints = findIntersections(poly, line);

  if (intersectionPoints.features.length === 0) {
    throw new Error("Line must intersect with polygon");
  }

  const slicedFeatures: Feature<Polygon>[] = [];
  const lineOffsets = constructLineOffsets(line);

  for (let i = 0; i <= 1; i++) {
    const coords = constructCoordinates(line, lineOffsets, i);
    const newPolygon = createNewPolygon(coords);
    const clippedPolygon = clipPolygon(poly, newPolygon);
    const newGeometries = createNewGeometries(clippedPolygon, lineOffsets, i);
    const newFeatures = createNewFeatures(newGeometries);

    slicedFeatures.push(...(newFeatures as Feature<Polygon>[]));
  }

  return slicedFeatures;
};

export default polySlice;
