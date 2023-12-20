using System.Net.Http;
using System.Web.Http;

using EPiServer.Web;

using EpiUiExtensions.CmsComponent.ServerModule;

namespace EpiUiExtensions.ImageHotSpots.CmsComponent.ServerModule;

[RoutePrefix("EPiServer/Shell/{version}/ClientResources/epi-ui-extensions/image-hotspots")]
public sealed class ImageHotSpotServerComponentController(IMimeTypeResolver mimeTypeResolver) : EmbeddedComponentController(mimeTypeResolver)
{
    /// <inheritdoc />
    [HttpGet, Route("{*path}")]
    public override HttpResponseMessage Index(string version, string path) => base.Index(version, path);
}