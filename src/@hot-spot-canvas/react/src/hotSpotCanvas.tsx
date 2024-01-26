"use client";
import * as React from "react";
import { useState, useEffect } from "react";

export type Coordinate = {
  x: number;
  y: number;
};
export type HotSpotViewModel<T = any> = {
  contentUrl: string;
  coordinates: Coordinate;
  content: T;
};
export type HotSpotCanvasViewModel<T = any> = {
  canvasDimensions: {
    defaultWidth: number;
    defaultHeight: number;
    aspectRatio: number;
  };
  imageUrl: string;
  hotSpots: Array<HotSpotViewModel<T>>;
};
export type HotSpotCanvasProps<T = any> = {
  siteHost: string;
  canvasWidth?: number;
  canvasHeight?: number;
  canvasAltText?: string;
  model: HotSpotCanvasViewModel<T>;
};

function HotSpotCanvas(props: HotSpotCanvasProps) {
  const [canvasMetaData, setCanvasMetaData] = useState(() => ({
    width: props.model.canvasDimensions.defaultWidth,
    height: props.model.canvasDimensions.defaultHeight,
    imageWidth: props.model.canvasDimensions.defaultWidth,
    imageHeight: props.model.canvasDimensions.defaultHeight,
    url: undefined,
  }));

  useEffect(() => {
    const calculateWidth = () => {
      if (props.canvasWidth) return props.canvasWidth;
      if (props.canvasHeight)
        return props.canvasHeight / props.model.canvasDimensions.aspectRatio;
      return props.model.canvasDimensions.defaultWidth;
    };
    const calculateHeight = () => {
      if (props.canvasHeight) return props.canvasHeight;
      if (props.canvasWidth)
        return props.canvasWidth * props.model.canvasDimensions.aspectRatio;
      return props.model.canvasDimensions.defaultHeight;
    };
    const width = calculateWidth();
    const height = calculateHeight();
    if (height > width) {
      setCanvasMetaData({
        ...canvasMetaData,
        imageWidth: null,
      });
    } else {
      setCanvasMetaData({
        ...canvasMetaData,
        imageHeight: null,
      });
    }
    const createImageUrl = () => {
      if (!props?.model) return null;
      const imageUrl = new URL(props.model.imageUrl, props.siteHost);
      if (canvasMetaData.imageWidth) {
        imageUrl.searchParams.append("w", canvasMetaData.imageWidth.toString());
      }
      if (canvasMetaData.imageHeight) {
        imageUrl.searchParams.append(
          "h",
          canvasMetaData.imageHeight.toString()
        );
      }
      return imageUrl.toString();
    };
    setCanvasMetaData({
      ...canvasMetaData,
      width,
      height,
      url: createImageUrl(),
    });
  }, []);

  return (
    <>
      {!!props?.model ? (
        <>
          <div
            className="hot-spot-canvas"
            style={{
              margin: "10px",
              display: "flex",
              position: "relative",
              overflow: "visible",
              width: `${canvasMetaData.width}px`,
              height: `${canvasMetaData.height}px`,
            }}
          >
            <div
              style={{
                margin: "0",
                padding: "0",
                position: "relative",
                display: "flex",
                overflow: "hidden",
              }}
            >
              <img
                src={canvasMetaData.url}
                width={canvasMetaData.imageWidth}
                height={canvasMetaData.imageHeight}
                alt={props.canvasAltText}
                style={{
                  margin: "0",
                  padding: "0",
                  position: "absolute",
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            </div>

            <ul
              style={{
                display: "inline-flex",
                listStyle: "none",
                margin: "0",
                padding: "0",
                overflow: "visible",
              }}
            >
              {props.model.hotSpots?.map((hotSpot) => (
                <li
                  className="hot-spot-canvas-hot-spot"
                  style={{
                    display: "flex",
                    listStyle: "none",
                    margin: "0",
                    padding: "0",
                    overflow: "visible",
                    position: "absolute",
                    textDecoration: "none",
                    left: `${hotSpot.coordinates.x}%`,
                    top: `${hotSpot.coordinates.y}%`,
                  }}
                >
                  {hotSpot.content.contentType.includes("Page") ? (
                    <>
                      <>{props.slotPage}</>
                    </>
                  ) : null}

                  {hotSpot.content.contentType.includes("Product") ? (
                    <>
                      <>{props.slotProduct}</>
                    </>
                  ) : null}

                  {hotSpot.content.contentType.includes("Variation") ? (
                    <>
                      <>{props.slotVariant}</>
                    </>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : null}
    </>
  );
}

HotSpotCanvas.defaultProps = {
  canvasAltText: "A canvas containing hot-spots referencing pages and products",
};

export default HotSpotCanvas;
