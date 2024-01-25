import * as React from "react";

export type HotSpotViewModel<T = any> = {
  contentUrl: string;
  coordinates: {
    x: number;
    y: number;
  };
  content: T;
};
export type HotSpotCanvasViewModel<T = any> = {
  canvasWidth: number;
  canvasHeight: number;
  imageUrl: string;
  hotSpots: Array<HotSpotViewModel<T>>;
};
export type HotSpotCanvasProps<T = any> = {
  siteHost: string;
  model: HotSpotCanvasViewModel<T>;
};

export function getContentUrl(siteHost: string, hotSpot: HotSpotViewModel) {
  return pathJoin([siteHost, hotSpot.contentUrl]);
}
export function pathJoin(parts: Array<string>, separator: string = "/") {
  var replace = new RegExp(separator + "{1,}", "g");
  return ("/" + parts.join(separator)).replace(replace, separator);
}
export function urlJoin(origin: string, parts: Array<string>) {
  const path = pathJoin(parts);
  const url = new URL(origin);
  url.pathname = path;
  return url;
}

function HotSpotCanvas(props: HotSpotCanvasProps) {
  function createImageUrl(props: HotSpotCanvasProps) {
    if (!props?.model) return null;
    const imageUrl = new URL(props.model.imageUrl, props.siteHost);
    imageUrl.searchParams.append("w", canvasWidth(props).toString());
    imageUrl.searchParams.append("h", canvasHeight(props).toString());
    imageUrl.searchParams.append("mode", "crop");
    return imageUrl.toString();
  }

  function canvasWidth(props: HotSpotCanvasProps) {
    return props?.model?.canvasWidth ?? 0;
  }

  function canvasHeight(props: HotSpotCanvasProps) {
    return props?.model?.canvasHeight ?? 0;
  }

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
              width: `${canvasWidth(props)}px`,
              height: `${canvasHeight(props)}px`,
            }}
          >
            <img
              src={createImageUrl(props)}
              width={canvasWidth(props)}
              height={canvasHeight(props)}
            />

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
                    left: `${hotSpot.coordinates.x}px`,
                    top: `${hotSpot.coordinates.y}px`,
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

export default HotSpotCanvas;
