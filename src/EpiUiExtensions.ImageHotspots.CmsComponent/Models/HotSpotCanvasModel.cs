using System.Collections.Generic;
using EPiServer.Core;

namespace EpiUiExtensions.ImageHotSpots.CmsComponent.Models;

public sealed class HotSpotCanvasModel
{
    public float? CanvasWidth { get; set; }
    public float? CanvasHeight { get; set; }

    /// <summary>
    /// The Image to show as canvas
    /// </summary>
    public ContentReference? Image { get; set; }

    /// <summary>
    /// The list of created hotspots
    /// </summary>
    public IList<HotSpotModel> HotSpots { get; set; }
}