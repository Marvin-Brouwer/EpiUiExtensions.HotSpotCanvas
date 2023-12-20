using System.Collections.Generic;
using EPiServer.Core;
using Newtonsoft.Json;

namespace EpiUiExtensions.HotSpotCanvas.CmsComponent.Models;

public sealed class HotSpotCanvasModel
{
    public float? CanvasWidth { get; set; }
    public float? CanvasHeight { get; set; }

    /// <summary>
    /// The Image to show as canvas
    /// </summary>
    [JsonProperty("imageUrl")]
    public ContentReference? Image { get; set; }

    /// <summary>
    /// The list of created hotSpots
    /// </summary>
    public IList<HotSpotModel> HotSpots { get; set; }
}