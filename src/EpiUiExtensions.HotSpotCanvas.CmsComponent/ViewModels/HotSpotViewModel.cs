using EpiUiExtensions.HotSpotCanvas.CmsComponent.Models;

namespace EpiUiExtensions.HotSpotCanvas.CmsComponent.ViewModels;

/// <summary>
/// HotSpot container
/// </summary>
public sealed class HotSpotViewModel
{
    /// <summary>
    /// Asset url for the <see cref="HotSpotModel.ContentReference"/>
    /// </summary>
    public string ContentUrl { get; set; }

    /// <summary>
    /// Optimizely serialized content for <see cref="HotSpotModel.ContentReference"/>
    /// </summary>
    public object Content { get; set; }

    /// <summary>
    /// Position of the Hotspot relative to the canvas
    /// </summary>
    public HotSpotCoordinates Coordinates { get; set; }
}