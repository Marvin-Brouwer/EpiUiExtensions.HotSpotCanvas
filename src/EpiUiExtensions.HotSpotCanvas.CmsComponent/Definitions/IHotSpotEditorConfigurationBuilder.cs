using System;

namespace EpiUiExtensions.HotSpotCanvas.CmsComponent.Definitions;

public interface IHotSpotEditorConfigurationBuilder
{
    IHotSpotEditorConfigurationBuilder UseDimensions(decimal width, decimal height, decimal? offset = null);
    IHotSpotEditorConfigurationBuilder UseMaximumHotSpots(short amount);
    IHotSpotEditorConfigurationBuilder UsePageTypes(params Type[] pageTypes);
    IHotSpotEditorConfigurationBuilder UseNoPageTypes();
    IHotSpotEditorConfigurationBuilder UseCatalogTypes(params Type[] catalogTypes);
    IHotSpotEditorConfigurationBuilder UseNoCatalogTypes();
    HotSpotEditorConfiguration Build();
}