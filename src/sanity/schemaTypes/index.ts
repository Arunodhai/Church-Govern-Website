import { schemaDocumentTypes } from "./documents";
import { schemaObjectTypes } from "./objects";

export const schemaTypes = [...schemaObjectTypes, ...schemaDocumentTypes];
