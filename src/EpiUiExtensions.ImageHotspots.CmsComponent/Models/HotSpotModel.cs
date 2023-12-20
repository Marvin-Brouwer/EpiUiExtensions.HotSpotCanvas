using EPiServer.Core;

namespace EpiUiExtensions.ImageHotSpots.CmsComponent.Models;

/// <summary>
/// Hotspot container
/// </summary>
public sealed class HotSpotModel
{
    /// <summary>
    /// Position of the Hotspot relative to the canvas
    /// </summary>
    public HotSpotCoordinates Coordinates { get; set; }

    /// <summary>
    /// The associated Optimizely content
    /// </summary>
    public ContentReference? ContentReference { get; set; }
}