using System;
using System.Collections.Generic;
using System.Linq;

using EPiServer.Logging;
using EPiServer.ServiceLocation;
using EPiServer.Shell.ObjectEditing;
using EPiServer.Shell.ObjectEditing.EditorDescriptors;

using EpiUiExtensions.HotSpotCanvas.CmsComponent.Models;

using JetBrains.Annotations;

using Microsoft.Extensions.DependencyInjection;

namespace EpiUiExtensions.HotSpotCanvas.CmsComponent.Definitions;

/// <summary>
/// Editor property descriptor for Optimizely to render the CMS component
/// </summary>
[EditorDescriptorRegistration(TargetType = typeof(HotSpotCanvasModel), EditorDescriptorBehavior = EditorDescriptorBehavior.Default)]
[UsedImplicitly]
public sealed class HotSpotCanvasPropertyDescriptor : HotSpotEditorDescriptor;
        
/// <summary>
/// Editor property descriptor for Optimizely to render the CMS component
/// </summary>
[EditorDescriptor(EditorDescriptorType = typeof(HotSpotCanvasModel))]
public abstract class HotSpotEditorDescriptor : EditorDescriptor
{
    internal const string ConfigurationKey = "configuration";

    protected HotSpotEditorDescriptor()
    {
        if (!EditorConfiguration.ContainsKey(ConfigurationKey))
            EditorConfiguration[ConfigurationKey] = new Dictionary<string, HotSpotEditorConfiguration>();
    }

    protected virtual IHotSpotEditorConfigurationBuilder Configure(IHotSpotEditorConfigurationBuilder builder)
    {
        // Default does nothing
        return builder;
    }

    /// <inheritdoc />
    public override void ModifyMetadata(ExtendedMetadata metadata, IEnumerable<Attribute> attributes)
    {
        ClientEditingClass = "epi-ui-extensions/hot-spot-canvas/index";
        // ReSharper disable once ConditionalAccessQualifierIsNonNullableAccordingToAPIContract
        var attributeList = attributes?.ToList();
        base.ModifyMetadata(metadata, attributeList);

        var builder = new HotSpotEditorConfigurationBuilder();
        var configurations = (Dictionary<string, HotSpotEditorConfiguration>)EditorConfiguration[ConfigurationKey];

        var overrideAttribute = (EditorDescriptorAttribute?)attributeList?.FirstOrDefault(attribute => attribute is EditorDescriptorAttribute);
        if (overrideAttribute != null)
        {
            var selectedMetadata = (HotSpotEditorDescriptor)Activator.CreateInstance(overrideAttribute.EditorDescriptorType);
            configurations[metadata.PropertyName] = selectedMetadata.Configure(builder).Build();
        }
        else
        {
            // ReSharper disable once VirtualMemberCallInConstructor
            var configuration = Configure(builder).Build();
            configurations[metadata.PropertyName] = configuration;
        }

        if (!configurations[metadata.PropertyName].SupportedPageTypes.Any() &&
            !configurations[metadata.PropertyName].SupportedCatalogTypes.Any())
        {
            var logger = ServiceLocator.Current.GetRequiredService<LogManager>().GetLogger(nameof(HotSpotCanvasProperty));
            logger.Warning($"The property with name ${metadata.PropertyName} has no configured items to select");
        }
    }
}