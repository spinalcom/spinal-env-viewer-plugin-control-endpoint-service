<a name="SpinalControlEndpointService"></a>

## SpinalControlEndpointService
**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| CONTROL_POINT_TYPE | <code>string</code> | typeof control point node |
| CONTROL_GROUP_TYPE | <code>string</code> | typeof control point group node |
| CONTROL_GROUP_TO_CONTROLPOINTS | <code>string</code> | relation between control point group and control point |
| ROOM_TO_CONTROL_GROUP | <code>string</code> | Relation between room and control point group |


* [SpinalControlEndpointService](#SpinalControlEndpointService)
    * [.createContext(contextName)](#SpinalControlEndpointService+createContext) ⇒
    * [.getContexts()](#SpinalControlEndpointService+getContexts) ⇒
    * [.isControlPointContext(id)](#SpinalControlEndpointService+isControlPointContext) ⇒
    * [.createCategory(contextId, categoryName, iconName)](#SpinalControlEndpointService+createCategory) ⇒
    * [.getCategories(nodeId)](#SpinalControlEndpointService+getCategories) ⇒
    * [.createGroup(contextId, categoryId, groupName, groupColor)](#SpinalControlEndpointService+createGroup) ⇒
    * [.getGroups(nodeId)](#SpinalControlEndpointService+getGroups) ⇒
    * [.isControlPointGroup(id)](#SpinalControlEndpointService+isControlPointGroup) ⇒
    * [.createControlPointProfil(contextId, groupId, controlPointProfil)](#SpinalControlEndpointService+createControlPointProfil) ⇒
    * [.getControlPoint(groupId)](#SpinalControlEndpointService+getControlPoint) ⇒
    * [.getControlPointProfil(contextId, controlPointId)](#SpinalControlEndpointService+getControlPointProfil) ⇒
    * [.linkControlPointToRooms(nodeId, controlPointContextId, controlPointId)](#SpinalControlEndpointService+linkControlPointToRooms) ⇒
    * [.editControlPointProfil(contextId, controlPointId, values)](#SpinalControlEndpointService+editControlPointProfil) ⇒
    * [.getElementLinked(controlProfilId)](#SpinalControlEndpointService+getElementLinked) ⇒
    * [.getDataFormated(groupId)](#SpinalControlEndpointService+getDataFormated) ⇒
    * [.getReferencesLinked(nodeId, profilId)](#SpinalControlEndpointService+getReferencesLinked) ⇒
    * [.getEndpointsLinked(roomId, profilId)](#SpinalControlEndpointService+getEndpointsLinked) ⇒
    * [.getEndpointsNodeLinked(roomId, profilId)](#SpinalControlEndpointService+getEndpointsNodeLinked) ⇒
    * [.loadElementLinked(nodeId)](#SpinalControlEndpointService+loadElementLinked) ⇒

<a name="SpinalControlEndpointService+createContext"></a>

### spinalControlEndpointService.createContext(contextName) ⇒
This method creates a context of control Endpoint

**Kind**: instance method of [<code>SpinalControlEndpointService</code>](#SpinalControlEndpointService)  
**Returns**: Promise  

| Param | Type | Description |
| --- | --- | --- |
| contextName | <code>string</code> | The context of heatmap Name |

<a name="SpinalControlEndpointService+getContexts"></a>

### spinalControlEndpointService.getContexts() ⇒
retrieves and returns all contexts of control Endpoint

**Kind**: instance method of [<code>SpinalControlEndpointService</code>](#SpinalControlEndpointService)  
**Returns**: Promise  
<a name="SpinalControlEndpointService+isControlPointContext"></a>

### spinalControlEndpointService.isControlPointContext(id) ⇒
checks if the id passed in parameter is a context of control Endpoint

**Kind**: instance method of [<code>SpinalControlEndpointService</code>](#SpinalControlEndpointService)  
**Returns**: boolean  

| Param | Type |
| --- | --- |
| id | <code>string</code> | 

<a name="SpinalControlEndpointService+createCategory"></a>

### spinalControlEndpointService.createCategory(contextId, categoryName, iconName) ⇒
This method creates an endpoint control category

**Kind**: instance method of [<code>SpinalControlEndpointService</code>](#SpinalControlEndpointService)  
**Returns**: Promise  

| Param | Type |
| --- | --- |
| contextId | <code>string</code> | 
| categoryName | <code>string</code> | 
| iconName | <code>string</code> | 

<a name="SpinalControlEndpointService+getCategories"></a>

### spinalControlEndpointService.getCategories(nodeId) ⇒
get and return all categories in the context

**Kind**: instance method of [<code>SpinalControlEndpointService</code>](#SpinalControlEndpointService)  
**Returns**: Promise  

| Param | Type |
| --- | --- |
| nodeId | <code>string</code> | 

<a name="SpinalControlEndpointService+createGroup"></a>

### spinalControlEndpointService.createGroup(contextId, categoryId, groupName, groupColor) ⇒
This method creates an endpoint control group

**Kind**: instance method of [<code>SpinalControlEndpointService</code>](#SpinalControlEndpointService)  
**Returns**: Promise  

| Param | Type |
| --- | --- |
| contextId | <code>string</code> | 
| categoryId | <code>string</code> | 
| groupName | <code>string</code> | 
| groupColor | <code>string</code> | 

<a name="SpinalControlEndpointService+getGroups"></a>

### spinalControlEndpointService.getGroups(nodeId) ⇒
get and return all groups in the category

**Kind**: instance method of [<code>SpinalControlEndpointService</code>](#SpinalControlEndpointService)  
**Returns**: Promise  

| Param | Type |
| --- | --- |
| nodeId | <code>string</code> | 

<a name="SpinalControlEndpointService+isControlPointGroup"></a>

### spinalControlEndpointService.isControlPointGroup(id) ⇒
checks if the id passed in parameter is a group of control Endpoint

**Kind**: instance method of [<code>SpinalControlEndpointService</code>](#SpinalControlEndpointService)  
**Returns**: boolean  

| Param | Type |
| --- | --- |
| id | <code>string</code> | 

<a name="SpinalControlEndpointService+createControlPointProfil"></a>

### spinalControlEndpointService.createControlPointProfil(contextId, groupId, controlPointProfil) ⇒
creates and links a profil of control endpoint to the group selected in the context selected

**Kind**: instance method of [<code>SpinalControlEndpointService</code>](#SpinalControlEndpointService)  
**Returns**: Promise  

| Param | Type |
| --- | --- |
| contextId | <code>string</code> | 
| groupId | <code>string</code> | 
| controlPointProfil | <code>any</code> | 

<a name="SpinalControlEndpointService+getControlPoint"></a>

### spinalControlEndpointService.getControlPoint(groupId) ⇒
get All control endpoint node linked to group selected

**Kind**: instance method of [<code>SpinalControlEndpointService</code>](#SpinalControlEndpointService)  
**Returns**: Promise  

| Param | Type |
| --- | --- |
| groupId | <code>string</code> | 

<a name="SpinalControlEndpointService+getControlPointProfil"></a>

### spinalControlEndpointService.getControlPointProfil(contextId, controlPointId) ⇒
get All control endpoint profile  linked to control endpoint node

**Kind**: instance method of [<code>SpinalControlEndpointService</code>](#SpinalControlEndpointService)  
**Returns**: Promise  

| Param | Type |
| --- | --- |
| contextId | <code>string</code> | 
| controlPointId | <code>string</code> | 

<a name="SpinalControlEndpointService+linkControlPointToRooms"></a>

### spinalControlEndpointService.linkControlPointToRooms(nodeId, controlPointContextId, controlPointId) ⇒
link the control point to a node and create the bms endpoints according to the control point profiles

**Kind**: instance method of [<code>SpinalControlEndpointService</code>](#SpinalControlEndpointService)  
**Returns**: Promise  

| Param | Type |
| --- | --- |
| nodeId | <code>string</code> | 
| controlPointContextId | <code>string</code> | 
| controlPointId | <code>string</code> | 

<a name="SpinalControlEndpointService+editControlPointProfil"></a>

### spinalControlEndpointService.editControlPointProfil(contextId, controlPointId, values) ⇒
Edit the control point profile and update the bms endpoints associated according to the control point profiles

**Kind**: instance method of [<code>SpinalControlEndpointService</code>](#SpinalControlEndpointService)  
**Returns**: Promise  

| Param | Type |
| --- | --- |
| contextId | <code>string</code> | 
| controlPointId | <code>string</code> | 
| values | <code>Array</code> | 

<a name="SpinalControlEndpointService+getElementLinked"></a>

### spinalControlEndpointService.getElementLinked(controlProfilId) ⇒
get All node linked to the control point

**Kind**: instance method of [<code>SpinalControlEndpointService</code>](#SpinalControlEndpointService)  
**Returns**: Promise  

| Param | Type |
| --- | --- |
| controlProfilId | <code>string</code> | 

<a name="SpinalControlEndpointService+getDataFormated"></a>

### spinalControlEndpointService.getDataFormated(groupId) ⇒
For a selected group format the control point profiles and the rooms of this group

**Kind**: instance method of [<code>SpinalControlEndpointService</code>](#SpinalControlEndpointService)  
**Returns**: Promise  

| Param | Type |
| --- | --- |
| groupId | <code>string</code> | 

<a name="SpinalControlEndpointService+getReferencesLinked"></a>

### spinalControlEndpointService.getReferencesLinked(nodeId, profilId) ⇒
get and return the endpoint linked to nodeId and created according the profil selected

**Kind**: instance method of [<code>SpinalControlEndpointService</code>](#SpinalControlEndpointService)  
**Returns**: Promise  

| Param | Type |
| --- | --- |
| nodeId | <code>string</code> | 
| profilId | <code>string</code> | 

<a name="SpinalControlEndpointService+getEndpointsLinked"></a>

### spinalControlEndpointService.getEndpointsLinked(roomId, profilId) ⇒
get All endpoints linked to roomId and created according the profil selected

**Kind**: instance method of [<code>SpinalControlEndpointService</code>](#SpinalControlEndpointService)  
**Returns**: Promise  

| Param | Type | Description |
| --- | --- | --- |
| roomId | <code>string</code> | nodeId |
| profilId | <code>string</code> | controlEndpoint profil id |

<a name="SpinalControlEndpointService+getEndpointsNodeLinked"></a>

### spinalControlEndpointService.getEndpointsNodeLinked(roomId, profilId) ⇒
get All endpoints Nodes linked to roomId and created according the profil selected

**Kind**: instance method of [<code>SpinalControlEndpointService</code>](#SpinalControlEndpointService)  
**Returns**: Promise  

| Param | Type | Description |
| --- | --- | --- |
| roomId | <code>string</code> | nodeId |
| profilId | <code>string</code> | controlEndpoint profil id |

<a name="SpinalControlEndpointService+loadElementLinked"></a>

### spinalControlEndpointService.loadElementLinked(nodeId) ⇒
Get all node linked to the nodeId (control endpoint | id of group)

**Kind**: instance method of [<code>SpinalControlEndpointService</code>](#SpinalControlEndpointService)  
**Returns**: Promise  

| Param | Type | Description |
| --- | --- | --- |
| nodeId | <code>string</code> | controlPointId or groupId |

