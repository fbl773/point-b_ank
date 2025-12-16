# 60 - sEARCH Extension for point b_ank

[[_TOC_]]

### Synopsis
The sEARCH project is a project run by the UofS Archaeology Department that aims to provide data, analysis, and
insights to the shishal nation as Archaeological excavations take place on their traditional land. It also serves
as a research tool for the Archaeologists conducting these excavations and as such must meet the needs of both communities.

This includes:
* CRUD functionality for new Entities such as:
    * Sites
    * Units
    * Levels

Using the paradigms outlined in `/backend/app.ts` and `/backend/routes` developers have
extended the existing API to meet these needs. Below are the stubs/pseudocode for the new
methods. Your task is to document the functionality, paramaters, and nuances of the added
calls. Each piece of documentation should be added on its own branch, named after a related
task to [#60](https://github.com/fbl773/point-b_ank/issues/60) (i.e. the branch for the
new `unit` routes could be named `N-UnitDocumentation`). These branches should be merged back
into this branch, and on completion of all new route documentation, a merge request submitted
into branch `53-validateProjectiles`.

# New Routes
From this point on, consider everything you read as developer notes. All instructions are above

## Sites
Sites already exist but will need to be modified to relate to `units` and 
support borden#'s

### Schema
| id | borden  | name |
|----|---------|------|
| 1  | DiRw-28 | ?    |
| 2  | DiRw-29 |      |
| 3  | DiRx-7  |      |
| 4  | DjRx-34 |      |



## Units
* a `unit` is just a part of a site, each site is a grid, each grid-square is a unit.
* units have a naming convention following `<COMPASS_DIR><ID_#>`
### Schema
| id   | name      | site_id |
|------|-----------|--------|
| 13   | N100SW0   | 1      |
| 14   | N100SW1   | 1      | 
| 15   | N100SW2   | 1      | 
| 16   | N100SW3   | 1      | 
| 17   | N100SW4   | 1      | 

## Levels
Levels are the _depth_ component of Archaeology. Each level belongs to one unit, and represents the
z-axis. Level naming convention varies, but each level will have a `site` and possibly a `sub-level`

### Schema
| id | unit_id | parent_id | limit_upper | limit_lower | name | level_char  | level_int |
|----|---------|-----------|-------------|-------------|------|-------------|-----------|
| 1  |      13 |           |           0 |           0 |      | A           | 1         |
| 2  |      14 |           |           0 |           0 |      | A           | 1         |
| 3  |      15 |           |           0 |           0 |      | A           | 1         |
| 4  |      15 | 3         |           0 |           0 |      | B           | 1         |
| 5  |      15 |           |           0 |           0 |      | B           | 2         |