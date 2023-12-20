using System.Net.Http;
using System.Web.Http;

using EPiServer.Web;

using EpiUiExtensions.CmsComponent.ServerModule;

namespace EpiUiExtensions.HotSpotCanvas.CmsComponent.ServerModule;

[RoutePrefix("EPiServer/Shell/{version}/ClientResources/epi-ui-extensions/hot-spot-canvas")]
public sealed class HotSpotCanvasServerComponentController(IMimeTypeResolver mimeTypeResolver) : EmbeddedComponentController(mimeTypeResolver)
{
    /// <inheritdoc />
    [HttpGet, Route("{*path}")]
    public override HttpResponseMessage Index(string version, string path) => base.Index(version, path);
}