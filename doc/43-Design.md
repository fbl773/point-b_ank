# Patternize

## 1 Management Pages
**Synopsis**: We've got 3 pages Manage[Periods, Cultures, and Materials]. They 
are syntactically identical, and only differ in that they pull form different 
parts of the DB and hold different properties. They are presently 3 seperate 
and distinct js files, when they _could_ be patternized and generated. This 
Would constitute a significant refactor and is an opportunity to address 
issues like #40, #8, and even #36.

Additionally, There are a handful of Dialogs that appear. These too could be 
patternized.

### 1.1 The Inheritance Approach
We could create a superclass for managment pages with methods to 
* Fetch entities
* Facilitate Deletion
* Facilitate Editing
* Format Columns *(This could be a bummer.)

with this super class we then pass it attributes like
* Column Layout *(Tricky)
* API endpoint

This way would work somewhat well if the API calls are somewhat the same. 
They should be.

### 1.2 The Functional Approach 
We could create a component that takes functions (same as mentioned above) as 
arguments, and calls them to generate the page. 


### 1.3 Issues
* Is there a clean way to handle group relations (i.e. Periods
  contain Cultures)?


## 2 Dialogs
### 2.1  Management Items
### 2.1.1 Create <MANAGEMENT_ITEM>
### 2.1.1 Delete <MANAGEMENT_ITEM>
### 2.1.3 Edit <MANAGEMENT_ITEM>

## 3 Projectile Points #38
**Synopsis**: Projectile points are likely our most complicated dialog. They relate to multiple database entities and 
contain media (image). If we are going to do this, we should put some thought into it. To begin, lets break down the 
current dialog and our new DB spec for it

### 3.1 The Current Fields 
| Field         | Type        | Description                                 | Mongo Field     |
|---------------|-------------|---------------------------------------------|-----------------|
| Description   | `string`    |                                             | `description`   |
| Photo         | `string`    | Filepath                                    | `image`         |
| Length        | `number`    |                                             | TODO            |
| Width         | `number`    |                                             | TODO            |
| Height        | `number`    |                                             | TODO            |
| Location      | `string`    |                                             | TODO            | 
| Artifact Type | `string`    | Constrained values                          | `NULL`          |
| Period        | `object_id` | Reference to Periods Document               | TODO            |
| Culture       | `object_id` | Reference to Cultures Document, Constrained | `culture_id`    |
| Material      | `object_id` | Reference to Materials Document`            | `material_id`   |
| Base Shape    | `string`    | Constrained values                          | `base_shape`    |
| Blade Shape   | `string`    | Constrained values                          | `blade_shape`   |
| Hafting Shape | `string`    | Constrained values                          | `hafting_shape` |
| TODO          | `string`    | Constrained values                          | `cross_section` |
| TODO          | `string`    | name                                        | `NULL`          |

### 3.2 Prerequisites 
- [x] Add missing db fields `Length, Width, Height`
- [x] Add missing db field  `period_id` for cases where only period can be determined. ~meet
- [x] Add missing db field `location`

### 3.3 TODO
- [ ] Generate name from `_id` and perhaps `culture`
- [ ] Write a `PointCard.jsx` file similar to `SiteCard.jsx` for `ProjectileList.jsx` 
- [ ] Create a new issue. Maybe "Patternize Pass 2" for `<T>List.jsx`'s and Whatever we could call `Site.jsx` 
and `Catalogue.jsx`.
- [ ] Add missing form field `cross_section`
- [ ] Acquire Available Periods (Dependent on #38)
- [ ] Acquire Available Cultures  
- [ ] Acquire Available Materials 

### 3.4 Anticipated Element Parameters
* `cultures:[Culture]` - the list of all cultures
* `periods:[Period]` - The list of all periods

#### 3.4.1 Notes
* by passing the periods/cultures as parameters, we can save API calls by calling them on a `Site` page and passing 
them into any of the points being edited.
* `ProjectileList.jsx` is currently fetching all of the points. We could _skip_ making an API call at all to populate the
fields of a point modal and just pass it as an `entity` to the modal (Assuming it will inherit from `EditCreateModal`)
 
### 3.5 Anticipated Methods
* `point_name() -> string`
  * `synopsis:` uses the dialog's state to build a name from item_id and item-culture
  * `return:` the formatted name
