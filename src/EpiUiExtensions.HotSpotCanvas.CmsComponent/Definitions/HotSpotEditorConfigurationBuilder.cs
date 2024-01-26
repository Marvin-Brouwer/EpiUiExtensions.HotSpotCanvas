using System;
using System.Linq;
using Ardalis.GuardClauses;
using EPiServer.Commerce.Catalog.ContentTypes;
using EPiServer.Core;

namespace EpiUiExtensions.HotSpotCanvas.CmsComponent.Definitions;

internal sealed class HotSpotEditorConfigurationBuilder : IHotSpotEditorConfigurationBuilder
{
    public static HotSpotEditorConfiguration DefaultConfiguration =
        new HotSpotEditorConfigurationBuilder().Build();

    private HotSpotEditorConfiguration _configuration;

    private const decimal DefaultOffset = 10;

    public HotSpotEditorConfigurationBuilder()
    {
        _configuration = new HotSpotEditorConfiguration();

        UseDimensions(680, 380, DefaultOffset);
        UseMaximumHotSpots(7);
        UsePageTypes(typeof(PageData));
        UseCatalogTypes(typeof(ProductContent), typeof(VariationContent));
    }

    public IHotSpotEditorConfigurationBuilder UseDimensions(decimal width, decimal height, decimal? offset = null)
    {
        Guard.Against.NegativeOrZero(width, nameof(width));
        Guard.Against.NegativeOrZero(height, nameof(height));
        if (offset.HasValue) Guard.Against.AgainstExpression(
            (o) => o >= DefaultOffset, offset.Value,
            $"{nameof(offset)} cannot be less than ${DefaultOffset}");

        _configuration = _configuration with
        {
            CanvasWidth = width,
            CanvasHeight = height,
            Offset = offset ?? DefaultOffset,
        };

        return this;
    }

    public IHotSpotEditorConfigurationBuilder UseMaximumHotSpots(short amount)
    {
        Guard.Against.AgainstExpression(
            (a) => a >= 1, amount,
            $"{nameof(amount)} cannot be less than one");

        _configuration = _configuration with
        {
            MaxHotSpots = amount
        };

        return this;
    }

    public IHotSpotEditorConfigurationBuilder UsePageTypes(params Type[] pageTypes)
    {
        foreach (var pageType in pageTypes)
        {
            if (typeof(PageData) != pageType && !typeof(PageData).IsAssignableFrom(pageType))
                throw new NotSupportedException($"The pageTypes must inherit from {typeof(PageData).FullName}");
        }

        _configuration = _configuration with
        {
            SupportedPageTypes = pageTypes.Select(MapType)
        };

        return this;
    }

    public IHotSpotEditorConfigurationBuilder UseNoPageTypes()
    {
        _configuration = _configuration with
        {
            SupportedPageTypes = Array.Empty<string>()
        };

        return this;
    }

    public IHotSpotEditorConfigurationBuilder UseCatalogTypes(params Type[] catalogTypes)
    {
        foreach (var catalogType in catalogTypes)
        {
            if (typeof(ProductContent) == catalogType || typeof(ProductContent).IsAssignableFrom(catalogType)) continue;
            if (typeof(VariationContent) == catalogType || typeof(VariationContent).IsAssignableFrom(catalogType)) continue;

            throw new NotSupportedException(
                $"The catalogTypes must inherit from {typeof(ProductContent).FullName} or {typeof(VariationContent).FullName}");
        }

        _configuration = _configuration with
        {
            SupportedCatalogTypes = catalogTypes.Select(MapType)
        };

        return this;
    }

    public IHotSpotEditorConfigurationBuilder UseNoCatalogTypes()
    {
        _configuration = _configuration with
        {
            SupportedCatalogTypes = Array.Empty<string>()
        };

        return this;
    }

    public HotSpotEditorConfiguration Build() => _configuration;

    private static string MapType(Type type) => type.FullName!.ToLowerInvariant();
}