# 60 - sEARCH Extension for point b_ank

[_TOC_]

### Synopsis
The sEARCH project is a project run by the UofS Archaeology Department that aims to provide data, analysis, and
insights to the shishal nation as Archaeological excavations take place on their traditional land. It also serves
as a research tool for the Archaeologists conducting these excavations and as such must meet the needs of both communities.

This includes:
* CRUD functionality for new Entities such as:
    * Sites
    * Areas
    * Units
    * Levels

Using the paradigms outlined in `/backend/app.ts`, `/backend/routes/*.ts`, and `/backend/entities/*.ts` developers 
will be extending the existing API to meet these needs. stubs for the required entities/routes can be found in 
[New Entites and Routes](#The-New-Entities-and-Routes)

Your task is to write a document for developers that outlines the process of creating new entites with routes.
Using one of the entites defined below as your example.

## Background: Creating a New Entity with Routes
most of our routes are served via `backend/src/utilities/crud_factory.ts`. When you make new routes for
the API, be sure that you lean on these. Docs regarding how to use these for new entities should be created.
The general steps are this:
1. in `/entities`
    2. Create a new mongo entity with the required fields
    2. Create a Model for that entity
    3. create a schema between the two of them
    4. apply appropriate triggers
    5. Export a singleton reference to its Model
6. in `/routes`
    7. create a new router
    8. assign CRUD operations to it by calling it with the relevant types/arguments, and entity name
    9. Optionally, any media handlers (the calls to file_utils)
10. in `app.ts`
    11. import the router exported by your new file in `/routes`
    12. assign it an endpoint with `app.use`

Each phase of documentation should be added on its own branch, named after a related task
to [#60](https://github.com/fbl773/point-b_ank/issues/60) (i.e. the branch for stage one involving edits in `/entites`
could be named `N-entityStages`). On completion, these branches should be merged back into this branch, and on 
completion of all new route documentation, a pull request submitted into branch `53-validateProjectiles`.

# The New Entities and Routes
From this point on, consider everything you read as developer notes. All instructions are above

## Sites
Sites already exist but will need to be modified to relate to `units` and 
support borden#'s

### Schema (NEW)
| id | borden  | name |
|----|---------|------|
| 1  | DiRw-28 | ?    |
| 2  | DiRw-29 |      |
| 3  | DiRx-7  |      |
| 4  | DjRx-34 |      |

### Schema (Existing)
```ts
interface ISite {
  id:number
  name:string,
  description:string,
  catalogue_id: ForeignKey(Catalogue)
  region_id: ForeignKey(Region)
  //Added
  borden:string
}
```

### API
**Root**: `<HOST>/sites`

#### `GET <HOST>/sites` - gets all sites
* On success, returns `[ISite]`,200
* On failure, returns error message, 404

#### `GET <HOST>/sites/:id` - gets a single site by id
* On success, returns `ISite`, 200
* on failure, returns

#### `PUT <HOST>/sites/:id` - updates a single site by id
* body
  * an `ISite` with updated data

#### `POST <HOST>/sites` - creates a new site
* body
  * an `ISite` 

#### `DELETE <HOST>/sites/:id` - deletes a single site by id, and its related data
* returns success message, 200 on success
* returns error message, 404 on failure
* returns 500 on bad req

#### `GET <HOST>/sites/:id/points` - gets all projectile points related to this site
* returns `[ProjectilePoint]`,200 on success
* returns error message, 404 on failure 

#### `GET <HOST>/sites/:id/units` - gets all units related to this site
* returns `[IUnit]`, 200 on success
* returns error message, 404 on failure

## Units
* a `unit` is just a part of a site, each site is a grid, each grid-square is a unit.
* units have a naming convention following `<CompassDirX><Val><CompasDirY><Val>`
### Schema
| id   | name      | site_id |
|------|-----------|--------|
| 13   | N100SW0   | 1      |
| 14   | N100SW1   | 1      | 
| 15   | N100SW2   | 1      | 
| 16   | N100SW3   | 1      | 
| 17   | N100SW4   | 1      | 

```ts
interface IUnit {
    id:number,
    name:string
    site_id:ForeignKey(Site)
}
```

### API 

**Root**: `<HOST>/units`

#### `GET <HOST>/units` - gets all units
* On success, returns `[ISite]`,200
* On failure, returns error message, 404

#### `GET <HOST>/units/:id` - gets a single unit by id
* On success, returns `ISite`, 200
* on failure, returns

#### `PUT <HOST>/units/:id` - updates a single unit by id
* body
    * an `IUnit` with updated data

#### `PUT <HOST>/units/:id/level` - adds a level/levels to the DB, and relates it to the specified unit 
* body
    * an `ILevel` OR `[ILevel]`

#### `POST <HOST>/units` - creates a new unit
* body
    * an `IUnit`

#### `DELETE <HOST>/units/:id` - deletes a single unit by id, as well as its related data

#### `DELETE <HOST>/units/:id/levels/:level_id` - removes a level and all sublevels from the specifed unit

#### `GET <HOST>/units/:id/levels` - gets all levels related to this unit


## Levels
Levels are the _depth_ component of a Unit. Each level belongs to one unit, and represents the
z-axis. Level naming convention varies, but each level will have a `site` and possibly a `sub-level`

### Schema
| id | unit_id | parent_id | limit_upper | limit_lower | name | level_char  | level_int  |
|----|---------|-----------|-------------|-------------|------|-------------|------------|
| 1  |      13 |           | 0           | 0           |      | A           | 1          |
| 2  |      14 |           | 0           | 0           |      | A           | 1          |
| 3  |      15 |           | 0           | 0           |      | A           | 1          |
| 4  |      15 | 3         | 0           | 0           |      | B           | 1          |
| 5  |      15 |           | 85          | 15          |      | B           | 2          |

```ts
interface ILevel {
    id:number,
    unit_id:ForeignKey(Unit),
    parent_id:ForeignKey(Level),
    limit_upper:number,
    limit_lower:number,
    name:string,
    level_char:string,
    level_int:number
}
```

### API

**Root**: `<HOST>/levels`

#### `GET <HOST>/levels` - gets all levels
* On success, returns `[ISite]`,200
* On failure, returns error message, 404

#### `GET <HOST>/levels/:id` - gets a single level by id
* On success, returns `ISite`, 200
* on failure, returns

#### `PUT <HOST>/levels/:id` - updates a single level by id
* body
    * an `IUnit` with updated data

#### `PUT <HOST>/levels/:id/sub` -  creates and adds a sublevel to a level
* body
    * an `ILevel` 
* returns id of the newly created level, 200
* returns error message, 404 on failure

#### `PUT <HOST>/levels/:id/:parent_id` - adds an existing level as the parent of this level 
* returns success message on success, 200
* returns failure message on failure, 404 

#### `POST <HOST>/levels` - creates a new level
* body
    * an `IUnit`

#### `DELETE <HOST>/levels/:id` - deletes a single level by id, as well as its related data

#### `GET <HOST>/levels/:id/levels` - gets all levels related to this level
