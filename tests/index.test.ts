import { lineString, polygon } from "@turf/turf";
import polySlice from "../src";

describe("polySlice", () => {
  const poly = polygon([
    [
      [0, 5],
      [10, 15],
      [20, 5],
      [10, -5],
      [0, 5],
    ],
  ]);
  const line = lineString([
    [0, 10],
    [20, -10],
  ]);

  it("should throw an error if the polygon is invalid", () => {
    // @ts-expect-error testing wrong argument type
    expect(() => polySlice(null, line)).toThrow("Invalid polygon");
  });

  it("should throw an error if the line is invalid", () => {
    // @ts-expect-error testing wrong argument type
    expect(() => polySlice(poly, null)).toThrow("Invalid line");
  });

  it("should throw an error if the line doesn't intersect the polygon", () => {
    const outsideLine = lineString([
      [15.834884892350203, -2.890594495287729],
      [25.457996014639605, 6.6301897930659806],
    ]);
    expect(() => polySlice(poly, outsideLine)).toThrow(
      "Line must intersect with polygon"
    );
  });

  it("should return sliced polygons", () => {
    const result = polySlice(poly, line);

    expect(result).toHaveLength(2);
    expect(result[0].geometry.coordinates).toEqual([
      [
        [2.5, 7.5],
        [12.5, -2.500000000000001],
        [20, 5],
        [10, 15],
        [2.5, 7.5],
      ],
    ]);
    expect(result[1].geometry.coordinates).toEqual([
      [
        [0, 5],
        [10, -5],
        [12.5, -2.5],
        [2.5, 7.5],
        [0, 5],
      ],
    ]);
  });
});
