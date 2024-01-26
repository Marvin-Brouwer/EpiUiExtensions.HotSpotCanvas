using System;
using System.Collections.Generic;
using System.Linq;

using EPiServer;
using EPiServer.ContentApi.Core.Serialization;
using EPiServer.ContentApi.Core.Serialization.Models;
using EPiServer.Core;
using EPiServer.Logging;
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

        var canvasDimensions = CalculateDimensions(model);

        Value = new HotSpotCanvasViewModel
        {
            CanvasDimensions = canvasDimensions,

            ImageUrl = urlResolver.GetUrl(model.Image),

            HotSpots = MapHotspots(model, urlResolver, canvasDimensions).ToList(),
        };
    }

    private static IEnumerable<HotSpotViewModel> MapHotspots(
        HotSpotCanvasModel model, UrlResolver urlResolver,
        HotSpotCanvasDimensions canvasDimensions)
    {
        var contentRepository = ServiceLocator.Current.GetRequiredService<IContentLoader>();
        var contentMapper = ServiceLocator.Current.GetRequiredService<IContentModelMapper>();

        foreach (var hotSpot in model.HotSpots)
        {
            if (hotSpot is null) continue;

            var content = contentRepository.Get<IContent>(hotSpot.ContentReference);
            if (content is null) continue;
            var relativeContentUrl = ResolveUrl(urlResolver, content);
            var transformedContent = contentMapper.TransformContent(content, false, "*");

            yield return new HotSpotViewModel
            {
                ContentUrl = relativeContentUrl,
                Content = transformedContent,

                Coordinates = ConvertToPercentage(hotSpot.Coordinates, canvasDimensions)
            };
        }
    }

    private static HotSpotCoordinates ConvertToPercentage(HotSpotCoordinates hotSpotCoordinates, HotSpotCanvasDimensions canvasDimensions)
    {
        var xPercentageLeft = hotSpotCoordinates.X / canvasDimensions.DefaultWidth * 100M;
        var yPercentageDown = hotSpotCoordinates.Y / canvasDimensions.DefaultHeight * 100M;

        return new HotSpotCoordinates(
            Math.Round(xPercentageLeft, 5, MidpointRounding.AwayFromZero),
            Math.Round(yPercentageDown, 5, MidpointRounding.AwayFromZero)
        );
    }

    private static HotSpotCanvasDimensions CalculateDimensions(HotSpotCanvasModel model)
    {
        var defaultWidth = model.CanvasWidth ?? HotSpotEditorConfigurationBuilder.DefaultConfiguration.CanvasWidth;
        var defaultHeight = model.CanvasHeight ?? HotSpotEditorConfigurationBuilder.DefaultConfiguration.CanvasHeight;
        var aspectRatio = defaultWidth + defaultHeight == 0
            ? 1
            : Math.Round(defaultWidth / defaultHeight, 4, MidpointRounding.ToEven);

        return new HotSpotCanvasDimensions
        {
            DefaultWidth = defaultWidth,
            DefaultHeight = defaultHeight,
            AspectRatio = aspectRatio
        };
    }

    private static string? ResolveUrl(UrlResolver urlResolver, IContent? content)
    {
        try
        {
            var contentUrl = new Uri(urlResolver.GetUrl(content), UriKind.RelativeOrAbsolute);
            var relativeContentUrl = contentUrl.IsAbsoluteUri
                ? contentUrl.PathAndQuery
                : contentUrl.ToString();

            return relativeContentUrl;
        }
        catch (Exception ex)
        {
            ServiceLocator.Current
                .GetRequiredService<ILoggerFactory>()
                .Create(nameof(HotSpotCanvasPropertyModelDescriptor))
                .Log(Level.Error, "Failed to resolve url for Variant", ex);

            return null;
        }
    }
}