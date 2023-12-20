using System;

namespace EpiUiExtensions.ImageHotSpots.CmsComponent.Definitions;

public interface IHotSpotEditorConfigurationBuilder
{
    IHotSpotEditorConfigurationBuilder UseDimensions(float width, float height, float? offset = null);
    IHotSpotEditorConfigurationBuilder UseMaximumHotSpots(short amount);
    IHotSpotEditorConfigurationBuilder UsePageTypes(params Type[] pageTypes);
    IHotSpotEditorConfigurationBuilder UseNoPageTypes();
    IHotSpotEditorConfigurationBuilder UseCatalogTypes(params Type[] catalogTypes);
    IHotSpotEditorConfigurationBuilder UseNoCatalogTypes();
    HotSpotEditorConfiguration Build();
}