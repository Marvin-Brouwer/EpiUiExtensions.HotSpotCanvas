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
    const imageUrl = new URL(props.model.imageUrl, props.siteHost);
    imageUrl.searchParams.append("w", props.model.canvasWidth.toString());
    imageUrl.searchParams.append("h", props.model.canvasHeight.toString());
    imageUrl.searchParams.append("mode", "crop");
    return imageUrl.toString();
  }

  return (
    <div
      className="hot-spot-canvas"
      style={{
        width: `${props.model.canvasWidth}px`,
        height: `${props.model.canvasHeight}px`,
      }}
    >
      <img
        src={createImageUrl(props)}
        width={props.model.canvasWidth}
        height={props.model.canvasHeight}
      />

      <ul>
        {props.model.hotSpots?.map((hotSpot) => (
          <li
            className="hot-spot-canvas-hot-spot"
            style={{
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
  );
}

export default HotSpotCanvas;
