using System;
using System.Collections.Generic;
using System.Linq;

using EPiServer;
using EPiServer.ContentApi.Core.Serialization;
using EPiServer.ContentApi.Core.Serialization.Models;
using EPiServer.Core;
using EPiServer.ServiceLocation;
using EPiServer.Web.Routing;

using EpiUiExtensions.HotSpotCanvas.CmsComponent.Models;
using EpiUiExtensions.HotSpotCanvas.CmsComponent.ViewModels;

using JetBrains.Annotations;

using Microsoft.Extensions.DependencyInjection;

namespace EpiUiExtensions.HotSpotCanvas.CmsComponent.Definitions;

[UsedImplicitly]
internal class HotSpotCanvasPropertyModelDescriptor : PropertyModel<HotSpotCanvasViewModel, HotSpotCanvasProperty>
{
    public HotSpotCanvasPropertyModelDescriptor(HotSpotCanvasProperty property) : base(property)
    {
        var urlResolver = ServiceLocator.Current.GetRequiredService<UrlResolver>();

        var model = property.ModelValue;
        if (model is null) return;

        Value = new HotSpotCanvasViewModel
        {
            CanvasWidth = model.CanvasWidth ?? HotSpotEditorConfigurationBuilder.DefaultConfiguration.CanvasWidth,
            CanvasHeight =
                model.CanvasHeight ?? HotSpotEditorConfigurationBuilder.DefaultConfiguration.CanvasHeight,

            ImageUrl = urlResolver.GetUrl(model.Image),

            HotSpots = MapHotspots(model, urlResolver).ToList(),
        };
    }

    private static IEnumerable<HotSpotViewModel> MapHotspots(HotSpotCanvasModel model, UrlResolver urlResolver)
    {
        var contentRepository = ServiceLocator.Current.GetRequiredService<IContentLoader>();
        var contentMapper = ServiceLocator.Current.GetRequiredService<IContentModelMapper>();

        foreach (var hotSpot in model.HotSpots)
        {
            if (hotSpot is null) continue;

            var content = contentRepository.Get<IContent>(hotSpot.ContentReference);
            if (content is null) continue;

            var contentUrl = new Uri(urlResolver.GetUrl(content), UriKind.RelativeOrAbsolute);
            var relativeContentUrl = contentUrl.IsAbsoluteUri
                ? contentUrl.PathAndQuery
                : contentUrl.ToString();

            yield return new HotSpotViewModel
            {
                ContentUrl = relativeContentUrl,
                Content = contentMapper.TransformContent(content, false, "*"),

                Coordinates = hotSpot.Coordinates
            };
        }
    }
}