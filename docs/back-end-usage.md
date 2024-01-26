# Back end usage

> [!TODO]
> Write up some usage text
>
> - [ ] package install
> - [ ] configuration
> - [ ] variant url resolver necessary

## Configuration

> [!TODO]
> Write up some usage text

<!-- markdownlint-disable MD033 -->
<details>
  <summary>DefaultHotSpotCanvas.cs</summary>

```cs
using ExampleSite.Entities.Catalog;
using ExampleSite.Entities.Pages;

using EPiServer.Shell.ObjectEditing.EditorDescriptors;

using EpiUiExtensions.HotSpotCanvas.CmsComponent.Definitions;
using EpiUiExtensions.HotSpotCanvas.CmsComponent.Models;

using JetBrains.Annotations;

namespace ExampleSite.EditorDescriptors.HotSpotCanvas
{
    /// <summary>
    /// TODO Description
    /// </summary>
    [EditorDescriptorRegistration(TargetType = typeof(HotSpotCanvasModel), EditorDescriptorBehavior = EditorDescriptorBehavior.OverrideDefault)]
    [UsedImplicitly]
    public class DefaultHotSpotCanvas : HotSpotEditorDescriptor
    {
        /// <inheritdoc cref="HotSpotEditorDescriptor"/>
        protected override IHotSpotEditorConfigurationBuilder Configure(IHotSpotEditorConfigurationBuilder builder)
        {
            return base.Configure(builder)
                .UsePageTypes(typeof(PageContentBase))
                .UseCatalogTypes(typeof(ProductBase), typeof(VariationBase));
        }
    }
}
```

</details>

<!-- markdownlint-disable MD033 -->
<details>
  <summary>SmallHotSpotCanvas.cs</summary>

```cs
using EpiUiExtensions.HotSpotCanvas.CmsComponent.Definitions;

namespace ExampleSite.EditorDescriptors.HotSpotCanvas
{
    /// <summary>
    /// TODO Description
    /// </summary>
    public sealed class SmallHotSpotCanvas : DefaultHotSpotCanvas
    {
        /// <inheritdoc cref="HotSpotEditorDescriptor"/>
        protected override IHotSpotEditorConfigurationBuilder Configure(IHotSpotEditorConfigurationBuilder builder)
        {
            return base.Configure(builder)
                .UseDimensions(200, 100)
                // Only allow 3 because of size
                .UseMaximumHotSpots(3)
                .UseNoCatalogTypes();
        }
    }
}
```

</details>

<!-- markdownlint-disable MD033 -->
<details>
  <summary>WideHotSpotCanvas.cs</summary>

```cs
using EpiUiExtensions.HotSpotCanvas.CmsComponent.Definitions;

namespace ExampleSite.EditorDescriptors.HotSpotCanvas
{
    /// <summary>
    /// TODO Description
    /// </summary>
    public sealed class WideHotSpotCanvas : DefaultHotSpotCanvas
    {
        /// <inheritdoc cref="HotSpotEditorDescriptor"/>
        protected override IHotSpotEditorConfigurationBuilder Configure(IHotSpotEditorConfigurationBuilder builder)
        {
            return base.Configure(builder)
                .UseDimensions(800, 200);
        }
    }
}
```

</details>