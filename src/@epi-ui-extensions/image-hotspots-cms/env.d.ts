/// <reference path="./node_modules/vite/types/importMeta.d.ts" />
/// <reference path="./node_modules/epi-ui-extensions/epifix.d.ts" />

declare module "*?raw"
{
    const content: string;
    export default content;
}