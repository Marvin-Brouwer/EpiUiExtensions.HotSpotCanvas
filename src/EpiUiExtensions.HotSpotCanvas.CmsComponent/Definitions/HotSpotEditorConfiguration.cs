using System.Collections.Generic;

namespace EpiUiExtensions.HotSpotCanvas.CmsComponent.Definitions;

public record struct HotSpotEditorConfiguration
{
    public decimal Offset { get; set; }
    public decimal CanvasWidth { get; set; }
    public decimal CanvasHeight { get; set; }
    public short MaxHotSpots { get; set; }

    public IEnumerable<string> SupportedPageTypes { get; set; }
    public IEnumerable<string> SupportedCatalogTypes { get; set; }
}