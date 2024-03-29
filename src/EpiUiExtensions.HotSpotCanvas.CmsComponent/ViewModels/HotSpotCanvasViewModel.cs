﻿using System.Collections.Generic;

namespace EpiUiExtensions.HotSpotCanvas.CmsComponent.ViewModels;

public sealed class HotSpotCanvasViewModel
{
    public HotSpotCanvasDimensions CanvasDimensions { get; set; }

    /// <summary>
    /// Asset url for the <see cref="Models.HotSpotCanvasModel.Image"/>
    /// </summary>
    public string ImageUrl { get; set; }

    /// <summary>
    /// The list of created hotSpots
    /// </summary>
    public IReadOnlyList<HotSpotViewModel> HotSpots { get; set; }
}