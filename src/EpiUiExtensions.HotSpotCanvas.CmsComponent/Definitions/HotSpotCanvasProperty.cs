using EPiServer.Framework.DataAnnotations;
using EPiServer.PlugIn;

using EpiUiExtensions.CmsComponent.PropertyBase;
using EpiUiExtensions.HotSpotCanvas.CmsComponent.Models;

namespace EpiUiExtensions.HotSpotCanvas.CmsComponent.Definitions;

/// <summary>
/// Editor property for Optimizely to store the CMS component data
/// </summary>
[EditorHint(nameof(HotSpotCanvasModel))]
[PropertyDefinitionTypePlugIn(DisplayName = "Hotspot canvas", DefaultEnabled = true)]
internal class HotSpotCanvasProperty : PropertyJsonBase<HotSpotCanvasModel>;