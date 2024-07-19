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
