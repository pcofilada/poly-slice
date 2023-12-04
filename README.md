# poly-slice

PolySlice is a lightweight npm package designed to simplify the process of cutting and splitting GeoJSON polygon using a provided linestring. It offers a straightforward way to perform geometric operations on your spatial data.

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=pcofilada_poly-slice&metric=alert_status)](https://sonarcloud.io/dashboard?id=pcofilada_poly-slice)
![ISC License](https://img.shields.io/static/v1.svg?label=📜%20License&message=ISC&color=informational)
![npm](https://img.shields.io/npm/v/poly-slice?color=brightgreen)
![npm bundle size](https://img.shields.io/bundlephobia/min/poly-slice)

## Installation

NPM

```bash
npm install poly-slice
```

Yarn

```bash
yarn add poly-slice
```

## Usage

```js
import polySlice from "poly-slice";

// Your GeoJSON polygon and linestring features
const polygon = /* your GeoJSON polygon feature */;
const linestring = /* your GeoJSON linestring feature */;

// Use PolySlice to cut the polygon
const slicedPolygons = polySlice(polygon, linestring);
```

## Contributing

Feel free to contribute by opening issues or submitting pull requests. Contributions are always welcome!

## License

This project is licensed under the ISC License - see the [LICENSE](https://github.com/pcofilada/poly-slice/blob/main/LICENSE) file for details.
