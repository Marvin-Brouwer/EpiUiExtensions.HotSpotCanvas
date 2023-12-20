import { HotSpotEditorSettings } from "../data/EditorSettings";

export function mapAllowedReferences(settings: HotSpotEditorSettings) {

	const pageReferenceTypes = settings.supportedPageTypes.map(v => `${v}.reference`);
	const catalogReferenceTYpes = settings.supportedCatalogTypes.map(v => `${v}.reference`);

	return [...pageReferenceTypes, ...catalogReferenceTYpes];
}