using System.Collections.Generic;

namespace EpiUiExtensions.ImageHotSpots.CmsComponent.Definitions;

public record struct HotSpotEditorConfiguration
{
    public float Offset { get; set; }
    public float CanvasWidth { get; set; }
    public float CanvasHeight { get; set; }
    public short MaxHotSpots { get; set; }

    public IEnumerable<string> SupportedPageTypes { get; set; }
    public IEnumerable<string> SupportedCatalogTypes { get; set; }
}