# cm-pdsa-server

CM PDSA - Admin Panel Server

## Getting Started

#### Clone this repository

```bash
git clone ssh://git@bitbucket.criticalmass.com:7999/cip/cm-pdsa-server.git
```

## Branching Strategy

All development work should be done on your own branch.

1. Cut a `feature` or `bugfix` branch off of develop

2. Create a pull request to merge your feature back into develop.

3. Pull requests will be reviewed by two mentors, then merged back into develop.

## Server Info

Entry point for this application is `index.js`, as we are using ESM to provide ES6 compatibility.

Routes should be kept clean and all logic should reside in a controller.

Database connects to local `test` MongoDB via Mongoose, connection is opened upon server initialization. This will need to be changed for Production.

## Running

1. `npm i` to install all dependencies.
2. `npm start` to start server using `nodemon`.

## Models

---

### Metadata

---

#### PrimarySkillArea

This model is used to store the different Primary Skill Areas.

##### Fields

| Name   | Description                      | Type       | Required             |
| ------ | -------------------------------- | ---------- | -------------------- |
| name   | The name of the PrimarySkillArea | `String`   | `true`               |
| _\_id_ | Auto generated ObjectId          | `ObjectId` | _Created by MongoDb_ |

##### Example

To create a new `PrimarySkillArea` supply an object like:

```JSON
{
    name: "Leadership and Development "
}
```

#### SecondarySkillArea

This model is used to store the different Secondary Skill Areas. Each Secondary Skill belongs to a `PrimarySkillArea` and has a reference to its parent.

##### Fields

| Name                   | Description                                                                          | Type       | Required             |
| ---------------------- | ------------------------------------------------------------------------------------ | ---------- | -------------------- |
| name                   | The name of the SecondarySkillArea                                                   | `String`   | `true`               |
| parentPrimarySkillArea | An ObjectId that references the PrimarySkillArea this SecondarySkillArea belongs to. | `ObjectId` | `true`               |
| _\_id_                 | Auto generated ObjectId                                                              | `ObjectId` | _Created by MongoDb_ |

##### Example

To create a new `SecondarySkillArea` supply an object like:

```JSON
{
    name: "Teamwork",
    parentPrimarySkillArea: "5d1cdba46b1773f69004c8c9"
}
```

#### Institution

This model is used to store the different Institutions.

##### Fields

| Name   | Description                 | Type       | Required             |
| ------ | --------------------------- | ---------- | -------------------- |
| name   | The name of the Institution | `String`   | `true`               |
| _\_id_ | Auto generated ObjectId     | `ObjectId` | _Created by MongoDb_ |

##### Example

To create a new `Institution` supply an object like:

```JSON
{
    name: "University of Calgary"
}
```

#### Program

This model is used to store the different Program. Each Program belongs to a Institution and has a reference to its parent.

##### Fields

| Name        | Description                                                          | Type       | Required             |
| ----------- | -------------------------------------------------------------------- | ---------- | -------------------- |
| name        | The name of the Program                                              | `String`   | `true`               |
| institution | An ObjectId that references the institution this Program belongs to. | `ObjectId` | `true`               |
| _\_id_      | Auto generated ObjectId                                              | `ObjectId` | _Created by MongoDb_ |

##### Example

To create a new `Program` supply an object like:

```JSON
{
    name: "Certificate for Emerging Leaders ",
    institution: "6e3cdba46b1773f69114c8c9"
}
```

### PDSA Items

---

## Endpoints

---

### Metadata

---

#### Create

##### Description

This route is used to create a new metadata object, specified by the type parameter in the URL. Types can be one of the following `primary-skills`, `secondary-skills`, `programs` or `institutions`.

##### URL

`HTTP POST http://cm-pdsa-server/metadata/:type`

##### Parameters

| Parameter | Possible values                                               |
| --------- | ------------------------------------------------------------- |
| `:type`   | `primary-skills` `secondary-skills` `programs` `institutions` |

##### Body

The request body is the object you wish to create. Please see documentation for metadata models.

##### Response

| Status               | Code  | Response                                                                |
| -------------------- | ----- | ----------------------------------------------------------------------- |
| Created successfully | `201` | Server responds with the object created.                                |
| Invalid type         | `400` | Server responds with error message.                                     |
| Server error         | `500` | Server responds with the error message throw while creating the object. |

##### Examples

###### Creating a new primary skill

```Javascript
POST http://cm-pdsa-server/metadata/primary-skills

REQUEST.BODY:
{
    name: "Leadership and Development "
}
```

```Javascript
RESPONSE:
{
    "_id": "5d27b965360bcc6761543637",
    "name": "Leadership and Development",
    "__v": 0
}
```

###### Creating a new secondary skill

```Javascript
POST http://cm-pdsa-server/metadata/secondary-skills

REQUEST.BODY:
{
    name: "Teamwork",
    parentPrimarySkillArea: "5d27b965360bcc6761543637"
}
```

```Javascript
RESPONSE:
{
    "_id": "5d27b993360bcc6761543638",
    "name": "Teamwork",
    "parentPrimarySkillArea": "5d27b965360bcc6761543637",
    "__v": 0
}
```

#### Read

##### Description

These routes are used to find information about the metadata objects. You can query by `type`, `id`, `name` and by `parent-id`. Types can be one of the following `primary-skills`, `secondary-skills`, `programs` or `institutions`. Id must be a valid `ObjectId` for the metadata object being retrieved. Name matches to the name of the object being retrieved and parent-id must be a valid `ObjectId` of the parent object.

##### URLS

`HTTP GET http://cm-pdsa-server/metadata/:type` => Returns all metadata objects of specified type.

`HTTP GET http://cm-pdsa-server/metadata/:type/:id` => Returns the metadata object matching specified type and id.

`HTTP GET http://cm-pdsa-server/metadata/:type/name/:name` => Returns all metadata objects matching specified type and name (there should only be one object as names should be unique).

`HTTP GET http://cm-pdsa-server/metadata/:type/parent-id/:parentId` => Returns all metadata objects matching specified type and parent-id.

##### Parameters

| Parameter    | Possible values                                                           |
| ------------ | ------------------------------------------------------------------------- |
| `:type`      | `primary-skills` `secondary-skills` `programs` `institutions`             |
| `:id`        | Valid `ObjectId` for the metadata object to retrieve                      |
| `:name`      | The name of the object to retrieve                                        |
| `:parent-id` | The `ObjectId` of the parent object (`Institution` or `PrimarySkillArea`) |

##### Body

No request body should be supplied.

##### Response

| Status                                | Code  | Response                                                                                                                                                                                                                              |
| ------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Updated successfully                  | `200` | Server responds with the object requested when specified by `id`. Otherwise an object containing `docs` which is an array of all objects (Mongo documents) matching the request and `totalDocs` which is the count of docs in `docs`. |
| Invalid type                          | `400` | Server responds with error message.                                                                                                                                                                                                   |
| Server error (often invalid ObjectId) | `500` | Server responds with the error message throw while creating the object.                                                                                                                                                               |

##### Examples

###### Retrieving all Institutions

```Javascript
GET 'http://cm-pdsa-server/metadata/institutions'
```

```Javascript
RESPONSE:
{
    "docs": [
        {
            "_id": "5d28e2886778eb82b6ef13f1",
            "name": "University of Calgary",
            "__v": 0
        },
        {
            "_id": "5d28e2e76778eb82b6ef13f2",
            "name": "AWS",
            "__v": 0
        }
    ],
    "totalDocs": 2
}
```

###### Retrieving the 'University of Calgary' Institution by ID

```Javascript
GET 'http://cm-pdsa-server/metadata/institutions/5d28e2886778eb82b6ef13f1'
```

```Javascript
RESPONSE:
{
    "_id": "5d28e2886778eb82b6ef13f1",
    "name": "University of Calgary",
    "__v": 0
}
```

###### Retrieving the 'University of Calgary' Institution by name

```Javascript
GET 'http://cm-pdsa-server/metadata/institutions/name/University of Calgary'
```

```Javascript
RESPONSE:
{
    "docs": [
        {
            "_id": "5d28e2886778eb82b6ef13f1",
            "name": "University of Calgary",
            "__v": 0
        }
    ],
    "totalDocs": 1
}
```

###### Retrieving all programs offered by the 'University of Calgary'

```Javascript
GET 'http://cm-pdsa-server/metadata/programs/parent-id/5d28e2886778eb82b6ef13f1'
```

```Javascript
RESPONSE:
{
    "docs": [
        {
            "_id": "5d0bbce9a4e95add5f4f82e2",
            "name": "Computer Science",
            "institution": {
                "_id": "5d28e2886778eb82b6ef13f1",
                "name": "University of Calgary",
                "__v": 0
            },
            "__v": 0
        },
        {
            "_id": "5d0bbcfaa4e95add5f4f82e3",
            "name": "Bioscience",
            "institution": {
                "_id": "5d28e2886778eb82b6ef13f1",
                "name": "University of Calgary",
                "__v": 0
            },
            "__v": 0
        },
        {
            "_id": "5d1633e79b382b9e4d360da8",
            "name": "Certificate for Emerging Leaders",
            "institution": {
                "_id": "5d28e2886778eb82b6ef13f1",
                "name": "University of Calgary",
                "__v": 0
            },
            "__v": 0
        }
    ],
    "totalDocs": 3
}
```

###### Retrieving all SecondarySkillAreas under by the 'Learning and Development'

```Javascript
GET 'http://cm-pdsa-server/metadata/secondary-skills/parent-id/5d27b965360bcc6761543637'
```

```Javascript
RESPONSE:
{
    "docs": [
        {
            "_id": "5d28e5b66778eb82b6ef13f4",
            "name": "Teamwork",
            "parentPrimarySkillArea": {
                "_id": "5d27b965360bcc6761543637",
                "name": "Learning and Development",
                "__v": 0
            },
            "__v": 0
        }
    ],
    "totalDocs": 1
}
```

#### Update

##### Description

This route is used to update an existing metadata object, specified by the type and id parameter in the URL. Types can be one of the following `primary-skills`, `secondary-skills`, `programs` or `institutions`, and id must be a valid `ObjectId` for the metadata object being updated.

##### URLS

`HTTP PATCH http://cm-pdsa-server/metadata/:type/:id`
`HTTP PUT http://cm-pdsa-server/metadata/:type/:id`

Use `PATCH` when updating some fields but not all. Use `PUT` when updating the entire object.

##### Parameters

| Parameter | Possible values                                               |
| --------- | ------------------------------------------------------------- |
| `:type`   | `primary-skills` `secondary-skills` `programs` `institutions` |
| `:id`     | Valid `ObjectId` for the metadata object to update            |

##### Body

The request body is a JSON object containing the fields you wish to update and their new values. Please see documentation for metadata models, for possible fields to update.

##### Response

| Status                                | Code  | Response                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Updated successfully                  | `200` | Server responds an object containing number of objects matching the id: `n`, number of objects updated: `nModified`, if the request was completed successfully: `ok` and the number of sort key updated on PDSA items: `nSortKeysUpdated` (used to sort PDSA items via skill areas, if no SortKeys were updated this field is not present) |
| Invalid type                          | `400` | Server responds with error message.                                                                                                                                                                                                                                                                                                        |
| Server error (often invalid ObjectId) | `500` | Server responds with the error message throw while creating the object.                                                                                                                                                                                                                                                                    |

##### Examples

###### Updating the Leadership and Development PrimarySkillArea with a new name

```Javascript
PATCH 'http://cm-pdsa-server/metadata/primary-skills/5d27b965360bcc6761543637'

REQUEST.BODY:
{
    name: "Learning and Growth"
}
```

```Javascript
RESPONSE:
{
    "n": 1,
    "nModified": 1,
    "ok": 1,
    "nSortKeysUpdated": 3
}
```

###### Successfully updating the Teamwork SecondarySkillArea with a new parentPrimarySkillArea

```Javascript
PATCH 'http://cm-pdsa-server/metadata/secondary-skills/5d27b993360bcc6761543638'

REQUEST.BODY:
{
    parentPrimarySkillArea: "5d1e34439eda691c184246d4"
}
```

```Javascript
RESPONSE:
{
    "n": 1,
    "nModified": 1,
    "ok": 1,
    "nSortKeysUpdated": 3
}
```

###### Trying to update the Teamwork SecondarySkillArea with the same parentPrimarySkillArea

```Javascript
PATCH 'http://cm-pdsa-server/metadata/secondary-skills/5d27b993360bcc6761543638'

REQUEST.BODY:
{
    parentPrimarySkillArea: "5d1e34439eda691c184246d4"
}
```

```Javascript
RESPONSE:
{
    "n": 1,
    "nModified": 0,
    "ok": 1
}
```

#### Delete

##### Description

This route is used to force delete an existing metadata object, specified by the type and id parameter in the URL. Types can be one of the following `primary-skills`, `secondary-skills`, `programs` or `institutions`, and id must be a valid `ObjectId` for the metadata object being deleted.

**Please note:**

- The object will be completely deleted and cannot be recovered.
- If the object is a `PrimarySkillArea` or `Institution` and has children referencing it, those children will also be deleted. (Similar to a SQL cascade delete)
- If the object is a skill area and has other PDSAItems referencing it, those sort keys will be updated

##### URLS

`HTTP DELETE http://cm-pdsa-server/metadata/:type/:id`

##### Parameters

| Parameter | Possible values                                               |
| --------- | ------------------------------------------------------------- |
| `:type`   | `primary-skills` `secondary-skills` `programs` `institutions` |
| `:id`     | Valid `ObjectId` for the metadata object to delete            |

##### Body

No request body should be supplied.

##### Response

| Status                                | Code  | Response                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Deleted successfully                  | `200` | Server responds with an object containing `n`: the number of objects matching the id, `ok`: if the query executed ok, `deletedCount`: how many items matching _id_ were deleted, `nChildrenDeleted`: if type was _primary-skills_ or _institutions_ and there were children referencing the object we deleted, how many children were deleted also, `nSortKeysUpdated`: if the metadata object was a sill area and had sort keys referencing it, how many of those were updated. |
| Invalid type                          | `400` | Server responds with error message.                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Server error (often invalid ObjectId) | `500` | Server responds with the error message throw while creating the object.                                                                                                                                                                                                                                                                                                                                                                                                          |

##### Examples

###### Deleting the 'Learning and Growth' PrimarySkillArea

```Javascript
DELETE 'http://cm-pdsa-server/metadata/primary-skills/5d27b965360bcc6761543637'
```

```Javascript
RESPONSE:
{
    "n": 1,
    "ok": 1,
    "deletedCount": 1,
    "nChildrenDeleted": 1
}
```

### PDSA

---

#### Create

#### Read

#### Update

#### Delete

#### Batch Delete

#### Batch Update
